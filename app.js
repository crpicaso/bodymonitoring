/**
 * Interactive Weight Monitor - Main Application Logic
 * Integrates baseline data from Weight Overview V01.xlsx with reactive UI,
 * Chart.js visualization, inline editing, and localStorage persistence.
 */

// Application State
let appData = [];
let chartInstance = null;
let currentWeekFilter = 'all';
let currentStatusFilter = 'all';
let currentChartTimeFilter = 'all'; // 'all', 'morning', 'evening'
let currentSubstepMode = 'both'; // 'both', '05', '075'
let isQuickZoomActive = true; // Default: Schnell-Zoom auf eingetragene KG
let currentGoalZoom = null; // '1.0', '0.75', '0.5', or null
let activeSeries = {
  actual: true,
  avg: true,
  targetC: true,
  targetA: true,
  targetB: true
};

const STORAGE_KEY = 'interactive_weight_monitor_v01';
const GOAL_WEIGHT = 80.0;
const START_WEIGHT = 93.7;
const KG_TO_LB_FACTOR = 2.20462262185;

// IndexedDB Configuration for resilient persistent cross-session storage
const DB_NAME = 'WeightMonitorDB';
const DB_VERSION = 1;
const DB_STORE = 'weight_records';

let saveDebounceTimer = null;

/**
 * Helper: German Day of Week in Short Form (MO, DI, MI, DO, FR, SA, SO)
 */
function getGermanWeekday(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('.').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return '';
  const d = new Date(parts[2], parts[1] - 1, parts[0]);
  const days = ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'];
  return days[d.getDay()] || '';
}

function isWeekendDay(dateStr) {
  if (!dateStr) return false;
  const parts = dateStr.split('.').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return false;
  const d = new Date(parts[2], parts[1] - 1, parts[0]);
  const day = d.getDay();
  return day === 0 || day === 6;
}

/**
 * Open or create the IndexedDB persistent database
 */
function openDatabase() {
  return new Promise((resolve) => {
    if (!('indexedDB' in window)) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => {
      console.warn('IndexedDB could not be opened:', e);
      resolve(null);
    };
  });
}

/**
 * Save data asynchronously to IndexedDB
 */
async function saveToIndexedDB(data) {
  try {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(DB_STORE, 'readwrite');
    const store = tx.objectStore(DB_STORE);
    store.put(data, 'appData');
    store.put(new Date().toISOString(), 'lastSaved');
  } catch (err) {
    console.warn('saveToIndexedDB error:', err);
  }
}

/**
 * Read data asynchronously from IndexedDB
 */
async function loadFromIndexedDB() {
  try {
    const db = await openDatabase();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const store = tx.objectStore(DB_STORE);
      const req = store.get('appData');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('loadFromIndexedDB error:', err);
    return null;
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Register Chart.js Zoom Plugin if loaded
  if (typeof Chart !== 'undefined') {
    if (typeof ChartZoom !== 'undefined') {
      Chart.register(ChartZoom);
    } else if (window['chartjs-plugin-zoom']) {
      Chart.register(window['chartjs-plugin-zoom']);
    }
  }
  loadData();
  setupEventListeners();
  setupUnloadHandlers();
  renderAll();
});

/**
 * Load data synchronously from localStorage and asynchronously sync with IndexedDB
 */
// Cross-Computer Dropbox Synchronization State
let isSyncServerConnected = false;
let syncServerPort = 8080;
let hasUnsavedChangesForDataJs = false;
let fsFileHandle = null;

/**
 * Intelligently merge two datasets (local storage and baseline data.js)
 * Ensures that no entries are lost when switching between computers.
 */
function mergeDatasets(localList, baselineList) {
  if (!Array.isArray(baselineList) || baselineList.length === 0) return localList || [];
  if (!Array.isArray(localList) || localList.length === 0) return JSON.parse(JSON.stringify(baselineList));

  const localTime = localStorage.getItem(STORAGE_KEY + '_timestamp') || '1970-01-01';
  const baseTime = (typeof DATA_UPDATED_AT !== 'undefined' ? DATA_UPDATED_AT : '1970-01-01');
  const localIsNewer = new Date(localTime) >= new Date(baseTime);

  const mergedMap = new Map();

  // 1. If local data is newer (user made edits in this browser):
  if (localIsNewer) {
    // Seed with baseline structure for all rows
    baselineList.forEach(r => {
      mergedMap.set(`${r.date}_${r.timeOfDay}`, JSON.parse(JSON.stringify(r)));
    });

    // Local state is the source of truth for all user-editable fields
    localList.forEach(localRow => {
      const key = `${localRow.date}_${localRow.timeOfDay}`;
      const targetRow = mergedMap.get(key);
      if (targetRow) {
        targetRow.actual = localRow.actual;
        if (localRow.meals) targetRow.meals = { ...localRow.meals };
        if (localRow.mobility) targetRow.mobility = { ...localRow.mobility };
      } else {
        mergedMap.set(key, JSON.parse(JSON.stringify(localRow)));
      }
    });

    return Array.from(mergedMap.values());
  }

  // 2. Otherwise baseline (data.js) is newer (synced from Dropbox/another machine):
  baselineList.forEach(r => {
    mergedMap.set(`${r.date}_${r.timeOfDay}`, JSON.parse(JSON.stringify(r)));
  });

  localList.forEach(localRow => {
    const key = `${localRow.date}_${localRow.timeOfDay}`;
    const baseRow = mergedMap.get(key);
    if (!baseRow) {
      mergedMap.set(key, JSON.parse(JSON.stringify(localRow)));
      return;
    }
    if (baseRow.actual === null && localRow.actual !== null) {
      baseRow.actual = localRow.actual;
    }
    if (localRow.meals) {
      if (!baseRow.meals) baseRow.meals = {};
      ['breakfast', 'snackMorning', 'lunch', 'snackAfternoon', 'dinner', 'snackEvening'].forEach(k => {
        if (baseRow.meals[k] === undefined && localRow.meals[k] !== undefined) {
          baseRow.meals[k] = localRow.meals[k];
        }
      });
    }
    if (localRow.mobility) {
      if (!baseRow.mobility) baseRow.mobility = {};
      ['ov', 'velo', 'home', 'away'].forEach(k => {
        if (baseRow.mobility[k] === undefined && localRow.mobility[k] !== undefined) {
          baseRow.mobility[k] = localRow.mobility[k];
        }
      });
    }
  });

  return Array.from(mergedMap.values());
}

/**
 * Load data synchronously from localStorage and data.js, and asynchronously sync with IndexedDB
 */
function loadData() {
  let localData = null;

  // 1. Try primary localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localData = parsed;
      }
    }
  } catch (e) {
    console.warn('Primary localStorage read error:', e);
  }

  // 2. Try backup localStorage
  if (!localData) {
    try {
      const backup = localStorage.getItem(STORAGE_KEY + '_backup');
      if (backup) {
        const parsed = JSON.parse(backup);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localData = parsed;
        }
      }
    } catch (e) {
      console.warn('Backup localStorage read error:', e);
    }
  }

  const baselineData = (typeof BASELINE_WEIGHT_DATA !== 'undefined' && Array.isArray(BASELINE_WEIGHT_DATA))
    ? BASELINE_WEIGHT_DATA
    : [];

  // Intelligently merge localStorage and data.js
  if (localData && baselineData.length > 0) {
    appData = mergeDatasets(localData, baselineData);
  } else if (localData) {
    appData = localData;
  } else {
    appData = JSON.parse(JSON.stringify(baselineData));
  }

  // Immediately persist merged state to localStorage so both sources stay unified
  try {
    const jsonStr = JSON.stringify(appData);
    localStorage.setItem(STORAGE_KEY, jsonStr);
    localStorage.setItem(STORAGE_KEY + '_backup', jsonStr);
  } catch (e) {}

  // Recalculate all metrics immediately
  recalculateAllFormulas();

  // Asynchronously verify with IndexedDB in background
  initIndexedDBAndSync();

  // Check sync status with data.js and local server
  checkDropboxSyncStatus();
}

/**
 * Initialize IndexedDB and sync with in-memory / localStorage
 */
async function initIndexedDBAndSync() {
  try {
    const idbData = await loadFromIndexedDB();
    if (idbData && Array.isArray(idbData) && idbData.length > 0) {
      let changed = false;

      // Intelligently merge idbData and appData so no weight or meal is EVER lost
      appData = appData.map(r => {
        const idbRow = idbData.find(s => s.date === r.date && s.timeOfDay === r.timeOfDay);
        if (!idbRow) return r;

        // If memory row has no actual weight, but idb has one:
        if ((r.actual === null || r.actual === undefined) && idbRow.actual !== null && idbRow.actual !== undefined) {
          r.actual = idbRow.actual;
          changed = true;
        }

        // Merge meals: if either has a meal checked, keep it checked!
        if (idbRow.meals) {
          if (!r.meals) {
            r.meals = { ...idbRow.meals };
            changed = true;
          } else {
            ['breakfast', 'snackMorning', 'lunch', 'snackAfternoon', 'dinner', 'snackEvening'].forEach(k => {
              if (idbRow.meals[k] && !r.meals[k]) {
                r.meals[k] = true;
                changed = true;
              }
            });
          }
        }

        // Merge mobility: if either has mobility checked, keep it checked!
        if (idbRow.mobility) {
          if (!r.mobility) {
            r.mobility = { ...idbRow.mobility };
            changed = true;
          } else {
            ['ov', 'velo', 'home', 'away'].forEach(k => {
              if (idbRow.mobility[k] && !r.mobility[k]) {
                r.mobility[k] = true;
                changed = true;
              }
            });
          }
        }
        return r;
      });

      if (changed) {
        recalculateAllFormulas();
        try {
          const jsonStr = JSON.stringify(appData);
          localStorage.setItem(STORAGE_KEY, jsonStr);
          localStorage.setItem(STORAGE_KEY + '_backup', jsonStr);
        } catch (e) {}
        renderAll();
        showToast('Mahlzeiten & Messwerte erfolgreich synchronisiert', 'info');
      }

      // Always persist unified dataset to IndexedDB
      saveToIndexedDB(appData);
    } else {
      // First time init: seed IndexedDB
      saveToIndexedDB(appData);
    }
  } catch (err) {
    console.warn('IndexedDB sync error:', err);
  }
}

/**
 * Save current state permanently to localStorage and IndexedDB
 */
function saveData(updateBadge = true) {
  // Always ensure metrics and differences are up to date before saving
  recalculateAllFormulas();

  try {
    const jsonStr = JSON.stringify(appData);
    localStorage.setItem(STORAGE_KEY, jsonStr);
    localStorage.setItem(STORAGE_KEY + '_backup', jsonStr);
    localStorage.setItem(STORAGE_KEY + '_timestamp', new Date().toISOString());
  } catch (e) {
    console.error('localStorage save error:', e);
  }

  // Asynchronously save to IndexedDB
  saveToIndexedDB(appData);

  // If local sync server or file handle is connected, auto-save to data.js silently!
  if (isSyncServerConnected) {
    saveToDataJs(true);
  } else if (fsFileHandle) {
    saveToDataJs(true);
  } else {
    evaluateDataJsFreshness();
  }

  if (updateBadge) {
    updateSaveBadge(true);
  }
}

/**
 * Check if the background sync server is active (via localhost or start_sync.bat)
 */
async function checkDropboxSyncStatus() {
  const testUrls = [];
  if (window.location.protocol.startsWith('http')) {
    testUrls.push('/api/status');
  }
  testUrls.push('http://127.0.0.1:8080/api/status');
  testUrls.push('http://127.0.0.1:8081/api/status');

  for (const url of testUrls) {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 1200);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(tid);
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'connected') {
          isSyncServerConnected = true;
          if (json.port) syncServerPort = json.port;
          updateDropboxSyncBadge('synced', 'Sync-Server aktiv (Auto-Save)');
          const saveBtn = document.getElementById('saveToDataJsBtn');
          if (saveBtn) saveBtn.classList.remove('pulse-attention');
          return;
        }
      }
    } catch (e) {
      // not connected on this url
    }
  }

  isSyncServerConnected = false;
  evaluateDataJsFreshness();
}

/**
 * Check if the local appData has entries that BASELINE_WEIGHT_DATA lacks
 */
function evaluateDataJsFreshness() {
  if (isSyncServerConnected) return;

  const baseline = (typeof BASELINE_WEIGHT_DATA !== 'undefined' && Array.isArray(BASELINE_WEIGHT_DATA))
    ? BASELINE_WEIGHT_DATA
    : [];

  let hasNewer = false;
  for (const row of appData) {
    const baseRow = baseline.find(b => b.date === row.date && b.timeOfDay === row.timeOfDay);
    if (!baseRow) {
      if (row.actual !== null || (row.meals && Object.values(row.meals).some(Boolean)) || (row.mobility && Object.values(row.mobility).some(Boolean))) {
        hasNewer = true;
        break;
      }
    } else {
      if (row.actual !== null && baseRow.actual === null) {
        hasNewer = true;
        break;
      }
      if (row.actual !== null && baseRow.actual !== null && row.actual !== baseRow.actual) {
        hasNewer = true;
        break;
      }
      if (row.meals) {
        for (const k of ['breakfast', 'snackMorning', 'lunch', 'snackAfternoon', 'dinner', 'snackEvening']) {
          if (row.meals[k] && (!baseRow.meals || !baseRow.meals[k])) {
            hasNewer = true;
            break;
          }
        }
      }
      if (row.mobility) {
        for (const k of ['ov', 'velo', 'home', 'away']) {
          if (row.mobility[k] && (!baseRow.mobility || !baseRow.mobility[k])) {
            hasNewer = true;
            break;
          }
        }
      }
    }
    if (hasNewer) break;
  }

  if (hasNewer) {
    hasUnsavedChangesForDataJs = true;
    updateDropboxSyncBadge('unsaved', 'Dropbox: data.js sichern');
    const saveBtn = document.getElementById('saveToDataJsBtn');
    if (saveBtn) saveBtn.classList.remove('pulse-attention');
  } else {
    hasUnsavedChangesForDataJs = false;
    updateDropboxSyncBadge('synced', 'data.js synchron');
    const saveBtn = document.getElementById('saveToDataJsBtn');
    if (saveBtn) saveBtn.classList.remove('pulse-attention');
  }
}

/**
 * Update the visual Dropbox Sync badge
 */
function updateDropboxSyncBadge(status, text) {
  const badge = document.getElementById('dropboxSyncBadge');
  const badgeText = document.getElementById('dropboxSyncText');
  if (!badge || !badgeText) return;

  badge.classList.remove('synced', 'unsaved');
  if (status === 'synced') {
    badge.classList.add('synced');
  } else if (status === 'unsaved') {
    badge.classList.add('unsaved');
  }

  badgeText.textContent = text;
}

/**
 * Generate formatted data.js JavaScript file content
 */
function generateDataJsContent(dataArray, timestamp = new Date().toISOString()) {
  const jsonStr = JSON.stringify(dataArray, null, 4);
  return `/**
 * Interactive Weight Monitor - Synced Database
 * Automatisch synchronisierte Gewichtsdaten fuer alle Computer (Dropbox)
 * Letzte Aktualisierung: ${new Date(timestamp).toLocaleString('de-CH')}
 */
const DATA_UPDATED_AT = ${JSON.stringify(timestamp)};
const BASELINE_WEIGHT_DATA = ${jsonStr};

if (typeof module !== 'undefined') module.exports = { BASELINE_WEIGHT_DATA, DATA_UPDATED_AT };
`;
}

/**
 * Save current state to data.js on disk (for cross-computer Dropbox sync)
 */
async function saveToDataJs(silent = false) {
  const timestamp = new Date().toISOString();
  const fileContent = generateDataJsContent(appData, timestamp);

  // 1. Try local sync server if running
  if (isSyncServerConnected || window.location.protocol.startsWith('http')) {
    const targetUrl = window.location.protocol.startsWith('http')
      ? '/api/save'
      : `http://127.0.0.1:${syncServerPort}/api/save`;

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fileContent, timestamp })
      });
      if (res.ok) {
        isSyncServerConnected = true;
        hasUnsavedChangesForDataJs = false;
        updateDropboxSyncBadge('synced', 'Sync-Server aktiv (data.js gesichert)');
        const saveBtn = document.getElementById('saveToDataJsBtn');
        if (saveBtn) saveBtn.classList.remove('pulse-attention');
        if (!silent) {
          showToast('✓ data.js erfolgreich aktualisiert! Dropbox synchronisiert jetzt mit deinen anderen Computern.', 'success');
        }
        return true;
      }
    } catch (e) {
      // server failed, proceed to fallback
    }
  }

  // 2. Try File System Access API (Chromium / Edge / Chrome on Windows)
  if (window.showSaveFilePicker || fsFileHandle) {
    try {
      if (!fsFileHandle && window.showSaveFilePicker) {
        fsFileHandle = await window.showSaveFilePicker({
          suggestedName: 'data.js',
          types: [{
            description: 'JavaScript Daten-Datei (data.js)',
            accept: { 'text/javascript': ['.js'] }
          }]
        });
      }
      if (fsFileHandle) {
        const writable = await fsFileHandle.createWritable();
        await writable.write(fileContent);
        await writable.close();
        hasUnsavedChangesForDataJs = false;
        updateDropboxSyncBadge('synced', 'data.js gespeichert');
        const saveBtn = document.getElementById('saveToDataJsBtn');
        if (saveBtn) saveBtn.classList.remove('pulse-attention');
        if (!silent) {
          showToast('data.js erfolgreich direkt im Dropbox-Ordner aktualisiert!', 'success');
        }
        return true;
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return false;
      }
      console.warn('File System Access API failed, using download fallback:', err);
    }
  }

  // 3. Fallback: Direct Download of data.js
  try {
    const blob = new Blob([fileContent], { type: 'text/javascript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    hasUnsavedChangesForDataJs = false;
    updateDropboxSyncBadge('synced', 'data.js heruntergeladen');
    const saveBtn = document.getElementById('saveToDataJsBtn');
    if (saveBtn) saveBtn.classList.remove('pulse-attention');

    if (!silent) {
      showToast('✓ data.js heruntergeladen. Speichere/ueberschreibe sie im Dropbox-Ordner "Interactive Weight Monitor", damit andere Computer synchron sind.', 'success');
    }
    return true;
  } catch (err) {
    showToast('Fehler beim Speichern von data.js: ' + err.message, 'danger');
    return false;
  }
}

/**
 * Update the visual auto-save badge in the header
 */
function updateSaveBadge(justSaved = false) {
  const badge = document.getElementById('storageStatusBadge');
  const text = document.getElementById('storageStatusText');
  if (!badge || !text) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  if (justSaved) {
    badge.classList.add('saved');
    text.textContent = `✓ Gesichert (${timeStr})`;
    setTimeout(() => {
      badge.classList.remove('saved');
      text.textContent = `Auto-Save aktiv`;
    }, 2500);
  } else {
    text.textContent = `Auto-Save aktiv`;
  }
}

/**
 * Flush any currently focused active inline input before window unloads
 */
function flushCurrentEdit() {
  const active = document.activeElement;
  if (active && active.classList.contains('weight-input-inline')) {
    const val = active.value.trim();
    const rowIdx = parseInt(active.getAttribute('data-row-idx'), 10);
    if (!isNaN(rowIdx) && appData[rowIdx]) {
      const parsed = parseFloat(val);
      if (val === '' || parsed === 0 || (!isNaN(parsed) && parsed <= 0)) {
        appData[rowIdx].actual = null;
      } else if (!isNaN(parsed) && parsed > 30 && parsed < 300) {
        appData[rowIdx].actual = Math.round(parsed * 100) / 100;
      }
      recalculateAllFormulas();
      saveData(true);
    }
  }
}

function setupUnloadHandlers() {
  window.addEventListener('beforeunload', flushCurrentEdit);
  window.addEventListener('pagehide', flushCurrentEdit);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushCurrentEdit();
  });
}

/**
 * Recalculate daily differences and weekly differences
 * Matches exact Excel formulas:
 * Col H (Differenz zum Vortag): IF(OR(G_n="", G_{n-1}=""), 0, G_n - G_{n-1})
 * Col I (Wöchentliche Differenz): At week start comparing to previous week start
 */
function recalculateAllFormulas() {
  let prevActual = null;
  let weekStartWeights = {}; // weekIndex -> weight

  // Consolidate daily meals across all rows for each date
  const dateMealsMap = {};
  appData.forEach(row => {
    if (row.meals && Object.values(row.meals).some(Boolean)) {
      if (!dateMealsMap[row.date]) {
        dateMealsMap[row.date] = { ...row.meals };
      } else {
        ['breakfast', 'snackMorning', 'lunch', 'snackAfternoon', 'dinner', 'snackEvening'].forEach(k => {
          if (row.meals[k]) dateMealsMap[row.date][k] = true;
        });
      }
    }
  });

  appData.forEach((row, index) => {
    // Determine week number
    const weekNumMatch = row.week.match(/\d+/);
    const weekNum = weekNumMatch ? parseInt(weekNumMatch[0], 10) : 1;

    // Recalculate target curves according to user rule:
    // A: 1.0 kg (Hellgrün)
    // B: 0.75 kg (Mittelgrün)
    // C: 0.50 kg (Dunkelgrün)
    row.targetA = Math.round((START_WEIGHT - (weekNum - 1) * 1.00) * 100) / 100;
    row.targetB = Math.round((START_WEIGHT - (weekNum - 1) * 0.75) * 100) / 100;
    row.targetC = Math.round((START_WEIGHT - (weekNum - 1) * 0.50) * 100) / 100;

    // Ensure meals object exists with all 6 flags (Morgens, Snack Vm, Mittag, Snack Nm, Abend, Snack Abend)
    if (dateMealsMap[row.date]) {
      row.meals = { ...dateMealsMap[row.date] };
    } else if (!row.meals) {
      row.meals = {
        breakfast: false,
        snackMorning: false,
        lunch: false,
        snackAfternoon: false,
        dinner: false,
        snackEvening: false
      };
    } else {
      if (row.meals.breakfast === undefined) row.meals.breakfast = false;
      if (row.meals.snackMorning === undefined) row.meals.snackMorning = false;
      if (row.meals.lunch === undefined) row.meals.lunch = false;
      if (row.meals.snackAfternoon === undefined) row.meals.snackAfternoon = false;
      if (row.meals.dinner === undefined) row.meals.dinner = false;
      if (row.meals.snackEvening === undefined) row.meals.snackEvening = false;
    }

    // Daily Difference (Diff zum vorherigen Eintrag) & Diff zu 1kg-Schritt (Ziel A: 1.0 kg/Wo)
    if (row.actual !== null && row.actual !== undefined && row.actual !== '') {
      const val = parseFloat(row.actual);
      if (!isNaN(val) && val > 0) {
        row.actual = val;
        row.diff1kg = (row.targetA !== null && row.targetA !== undefined) ? Math.round((val - row.targetA) * 100) / 100 : null;

        if (prevActual !== null) {
          row.diffDay = Math.round((val - prevActual) * 100) / 100;
        } else {
          row.diffDay = 0;
        }
        prevActual = val;

        // Track week start actual if first in this week
        if (weekStartWeights[weekNum] === undefined) {
          weekStartWeights[weekNum] = val;
        }
      } else {
        row.actual = null;
        row.diff1kg = null;
        row.diffDay = null;
      }
    } else {
      row.actual = null;
      row.diff1kg = null;
      row.diffDay = null;
    }
  });

  // Calculate weekly differences at the first entry of each week
  // Col I in Excel: IF(OR(G_curr="", G_prevWeek=""), 0, G_curr - G_prevWeek)
  appData.forEach((row, index) => {
    // Check if this is the start of a week (row 2, 16, 30, ...)
    if (index % 14 === 0) {
      const weekNumMatch = row.week.match(/\d+/);
      const weekNum = weekNumMatch ? parseInt(weekNumMatch[0], 10) : 1;

      if (weekNum === 1) {
        row.diffWeek = row.actual !== null ? 0 : null;
      } else {
        const prevWeekWeight = weekStartWeights[weekNum - 1];
        const currWeekWeight = weekStartWeights[weekNum];

        if (prevWeekWeight !== undefined && currWeekWeight !== undefined) {
          row.diffWeek = Math.round((currWeekWeight - prevWeekWeight) * 100) / 100;
        } else {
          row.diffWeek = null;
        }
      }
    } else {
      row.diffWeek = null;
    }
  });
}

/**
 * Render all UI components
 */
function renderAll() {
  recalculateAllFormulas();
  renderKPIs();
  renderProgress();
  renderChart();
  renderWeekPills();
  renderTable();
  if (typeof refreshInlineQuickAddUI === 'function') {
    refreshInlineQuickAddUI();
  }
}

/**
 * Render Header & KPI Cards
 */
function renderKPIs() {
  const filledRows = appData.filter(r => r.actual !== null);
  const latestEntry = filledRows.length > 0 ? filledRows[filledRows.length - 1] : null;
  const currentWeight = latestEntry ? latestEntry.actual : START_WEIGHT;

  // Total change from start
  const totalChange = Math.round((currentWeight - START_WEIGHT) * 100) / 100;
  
  // Remaining to Goal (80 kg)
  const remaining = Math.max(0, Math.round((currentWeight - GOAL_WEIGHT) * 100) / 100);

  // Latest Day diff
  const latestDiff = latestEntry && latestEntry.diffDay !== null ? latestEntry.diffDay : 0;

  // Update DOM
  document.getElementById('kpiCurrentWeight').textContent = currentWeight.toFixed(2);
  
  const totalChangeEl = document.getElementById('kpiTotalChange');
  const totalSign = totalChange > 0 ? '+' : '';
  totalChangeEl.textContent = `${totalSign}${totalChange.toFixed(2)} kg`;
  
  const totalBadgeEl = document.getElementById('kpiTotalBadge');
  if (totalChange <= 0) {
    totalBadgeEl.className = 'kpi-badge badge-success';
    totalBadgeEl.innerHTML = `<span>↓</span> ${Math.abs(totalChange).toFixed(2)} kg verloren`;
  } else {
    totalBadgeEl.className = 'kpi-badge badge-danger';
    totalBadgeEl.innerHTML = `<span>↑</span> +${totalChange.toFixed(2)} kg`;
  }

  // Goal remaining
  document.getElementById('kpiRemaining').textContent = remaining.toFixed(2);
  
  // Target B pace status (0.75 kg / Woche)
  const currentTargetB = latestEntry ? latestEntry.targetB : START_WEIGHT;
  const targetDiff = Math.round((currentWeight - currentTargetB) * 100) / 100;
  const targetBadge = document.getElementById('kpiTargetBadge');
  if (targetDiff <= 0) {
    targetBadge.className = 'kpi-badge badge-success';
    targetBadge.innerHTML = `<span>✓</span> Vor Plan (${Math.abs(targetDiff).toFixed(2)} kg Vorsprung)`;
  } else {
    targetBadge.className = 'kpi-badge badge-warning';
    targetBadge.innerHTML = `<span>!</span> +${targetDiff.toFixed(2)} kg über Ziel B`;
  }

  // Morning vs Evening Fluctuation Insight (if component exists)
  const flucEl = document.getElementById('kpiFluctuation');
  const flucMetaEl = document.getElementById('kpiFlucMeta');
  if (flucEl) {
    const morningEntries = filledRows.filter(r => r.timeOfDay === 'Morgen');
    const eveningEntries = filledRows.filter(r => r.timeOfDay === 'Abend');
    
    if (morningEntries.length > 0 && eveningEntries.length > 0) {
      const avgMorning = morningEntries.reduce((acc, r) => acc + r.actual, 0) / morningEntries.length;
      const avgEvening = eveningEntries.reduce((acc, r) => acc + r.actual, 0) / eveningEntries.length;
      const fluc = Math.round((avgEvening - avgMorning) * 100) / 100;
      const flucSign = fluc >= 0 ? '+' : '';
      flucEl.textContent = `${flucSign}${fluc.toFixed(2)} kg`;
      if (flucMetaEl) flucMetaEl.textContent = `Morgen: ${avgMorning.toFixed(1)} kg | Abend: ${avgEvening.toFixed(1)} kg`;
    } else {
      flucEl.textContent = `± 0.00 kg`;
      if (flucMetaEl) flucMetaEl.textContent = `Warte auf mehr Daten`;
    }
  }

  // Latest entry meta
  if (latestEntry) {
    document.getElementById('kpiCurrentMeta').textContent = `${latestEntry.date} (${latestEntry.timeOfDay})`;
  }

  // 1 kg Prognose (Ziel A) Differenz für das heutige / aktuellste Gewicht
  const now = new Date();
  const dStr = String(now.getDate()).padStart(2, '0');
  const mStr = String(now.getMonth() + 1).padStart(2, '0');
  const yStr = now.getFullYear();
  const todayDateStr = `${dStr}.${mStr}.${yStr}`;

  // Find today's entry with actual weight, or fallback to latestEntry
  const todayEntry = appData.find(r => r.date === todayDateStr && r.actual !== null) || latestEntry;
  const todayWeight = todayEntry ? todayEntry.actual : currentWeight;
  const todayTargetA = todayEntry ? todayEntry.targetA : START_WEIGHT;
  const diff1kg = Math.round((todayWeight - todayTargetA) * 100) / 100;

  const diff1kgValueEl = document.getElementById('kpiDiff1kgValue');
  const diff1kgBadgeEl = document.getElementById('kpiDiff1kgBadge');
  const diff1kgMetaEl = document.getElementById('kpiDiff1kgMeta');
  const diff1kgCardEl = document.getElementById('kpiDiff1kgCard');
  const diff1kgIconEl = document.getElementById('kpiDiff1kgIcon');

  if (diff1kgValueEl) {
    const diffSign = diff1kg > 0 ? '+' : '';
    diff1kgValueEl.textContent = `${diffSign}${diff1kg.toFixed(2)}`;
  }

  if (diff1kgBadgeEl) {
    if (diff1kg <= 0) {
      diff1kgBadgeEl.className = 'kpi-badge badge-success';
      diff1kgBadgeEl.innerHTML = `<span>↓</span> ${Math.abs(diff1kg).toFixed(2)} kg vor 1kg-Plan`;
      if (diff1kgCardEl) diff1kgCardEl.style.setProperty('--card-accent', '#10b981');
      if (diff1kgIconEl) {
        diff1kgIconEl.style.background = 'rgba(16, 185, 129, 0.15)';
        diff1kgIconEl.style.color = '#10b981';
      }
    } else {
      diff1kgBadgeEl.className = 'kpi-badge badge-danger';
      diff1kgBadgeEl.innerHTML = `<span>↑</span> +${diff1kg.toFixed(2)} kg über 1kg-Plan`;
      if (diff1kgCardEl) diff1kgCardEl.style.setProperty('--card-accent', '#ef4444');
      if (diff1kgIconEl) {
        diff1kgIconEl.style.background = 'rgba(239, 68, 68, 0.15)';
        diff1kgIconEl.style.color = '#ef4444';
      }
    }
  }

  if (diff1kgMetaEl) {
    const dateLabel = todayEntry ? `${todayEntry.date} (${todayEntry.timeOfDay})` : 'Keine Messung';
    diff1kgMetaEl.textContent = `Soll A: ${todayTargetA.toFixed(2)} kg • Ist: ${todayWeight.toFixed(2)} kg (${dateLabel})`;
  }

  if (typeof refreshInlineQuickAddUI === 'function') {
    refreshInlineQuickAddUI();
  }
}

const updateHeaderStats = renderKPIs;

/**
 * ==============================================================================
 * Inline Schnelleingabe Controller (Direkte Gewichtseingabe ohne Popup)
 * ==============================================================================
 */
let inlineQuickSlot = 'Morgen';
let inlineQuickDate = null;

function getInlineQuickTargetDate() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const todayStr = `${d}.${m}.${y}`;
  const todayExists = appData.some(r => r.date === todayStr);
  if (todayExists) return todayStr;

  // Fallback: Naechste offene Messung oder letzter verfuegbarer Eintrag
  const firstEmpty = appData.find(r => r.actual === null);
  return firstEmpty ? firstEmpty.date : (appData[appData.length - 1]?.date || todayStr);
}

function getAutoDetectedSlot(targetDate) {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const todayStr = `${d}.${m}.${y}`;

  // Vor 14:00 Uhr = Morgen, ab 14:00 Uhr = Abend
  if (!targetDate || targetDate === todayStr) {
    return now.getHours() >= 14 ? 'Abend' : 'Morgen';
  }

  // Fallback fuer abweichende Tage: naechsten offenen Slot ermitteln
  const morningRow = appData.find(r => r.date === targetDate && r.timeOfDay === 'Morgen');
  const eveningRow = appData.find(r => r.date === targetDate && r.timeOfDay === 'Abend');
  if (morningRow && morningRow.actual === null) return 'Morgen';
  if (eveningRow && eveningRow.actual === null) return 'Abend';

  return now.getHours() >= 14 ? 'Abend' : 'Morgen';
}

function refreshInlineQuickAddUI() {
  const input = document.getElementById('inlineQuickWeightInput');
  const dateLabel = document.getElementById('quickSlotDateLabel');
  if (!input) return;

  const targetDate = getInlineQuickTargetDate();
  inlineQuickDate = targetDate;
  inlineQuickSlot = getAutoDetectedSlot(targetDate);

  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
  const isToday = targetDate === todayStr;

  if (dateLabel) {
    dateLabel.textContent = isToday ? 'Heute' : targetDate;
    dateLabel.title = `Automatisch als ${inlineQuickSlot} erkannt (vor 14 Uhr: Morgen, ab 14 Uhr: Abend)`;
  }

  const targetRow = appData.find(r => r.date === targetDate && r.timeOfDay === inlineQuickSlot);

  // Wert nur synchronisieren, wenn das Feld nicht gerade vom Benutzer aktiv getippt wird
  if (document.activeElement !== input) {
    if (targetRow && targetRow.actual !== null && targetRow.actual !== undefined) {
      input.value = Number(targetRow.actual).toFixed(2);
    } else {
      input.value = '';
      input.placeholder = '0.00';
    }
  }
}

function handleInlineQuickSave() {
  const input = document.getElementById('inlineQuickWeightInput');
  if (!input) return;

  const targetDate = inlineQuickDate || getInlineQuickTargetDate();
  const slot = getAutoDetectedSlot(targetDate);
  inlineQuickSlot = slot;

  const targetRow = appData.find(r => r.date === targetDate && r.timeOfDay === slot);
  if (!targetRow) {
    showToast(`Datum ${targetDate} (${slot}) nicht im Plan gefunden`, 'warning');
    return;
  }

  const rawVal = input.value.trim();
  const parsed = parseFloat(rawVal);

  // 0 oder 0.0 oder leer: Loeschen!
  if (rawVal === '' || parsed === 0 || (!isNaN(parsed) && parsed <= 0)) {
    targetRow.actual = null;
    input.value = '';
    recalculateAllFormulas();
    saveData(true);
    renderAll();
    showToast(`✓ Gewicht gelöscht (0 kg, ${slot})`, 'info');
    return;
  }

  if (isNaN(parsed) || parsed < 30 || parsed > 300) {
    showToast('Bitte ein realistisches Gewicht eingeben (z. B. 90.30 oder 0 zum Löschen)', 'warning');
    return;
  }

  const rounded = Math.round(parsed * 100) / 100;
  targetRow.actual = rounded;
  input.value = rounded.toFixed(2);

  recalculateAllFormulas();
  saveData(true);
  renderAll();
  showToast(`✓ ${rounded.toFixed(2)} kg gespeichert (${slot})`, 'success');
}

function initInlineQuickAdd() {
  const input = document.getElementById('inlineQuickWeightInput');
  const saveBtn = document.getElementById('inlineQuickSaveBtn');
  const openModalBtn = document.getElementById('openFullModalBtn');

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleInlineQuickSave();
        input.blur();
      }
    });
    input.addEventListener('focus', () => {
      input.select();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleInlineQuickSave();
    });
  }

  if (openModalBtn) {
    openModalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickAddModal();
    });
  }

  const mobileFab = document.getElementById('mobileQuickAddFab');
  if (mobileFab) {
    mobileFab.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickAddModal();
    });
  }

  refreshInlineQuickAddUI();
}

/**
 * Render 80kg Goal Progress Bar & Intermediate Substeps (0.5 kg & 0.75 kg)
 */
function renderProgress() {
  const filledRows = appData.filter(r => r.actual !== null);
  const latestEntry = filledRows.length > 0 ? filledRows[filledRows.length - 1] : null;
  const currentWeight = latestEntry ? latestEntry.actual : START_WEIGHT;

  const totalToLose = START_WEIGHT - GOAL_WEIGHT; // 13.7 kg
  const lostSoFar = Math.max(0, START_WEIGHT - currentWeight);
  const remainingToGoal = Math.max(0, currentWeight - GOAL_WEIGHT);
  const pct = Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100));

  const progressBar = document.getElementById('goalProgressBar');
  const progressPctText = document.getElementById('goalProgressPct');
  const progressLostText = document.getElementById('goalProgressLost');
  const progressRemText = document.getElementById('goalProgressRem');

  if (progressBar) progressBar.style.width = `${pct.toFixed(1)}%`;
  if (progressPctText) progressPctText.innerHTML = `${pct.toFixed(1)}% <span class="pct-kg-sub">(${lostSoFar.toFixed(2)} kg von ${totalToLose.toFixed(1)} kg)</span>`;
  if (progressLostText) progressLostText.textContent = `${lostSoFar.toFixed(2)} kg verloren (${pct.toFixed(1)}%)`;
  if (progressRemText) progressRemText.textContent = `Noch ${remainingToGoal.toFixed(2)} kg (${(100 - pct).toFixed(1)}% verbleibend)`;

  // Render 0.5kg and 0.75kg Nebenschritte
  renderSubSteps(currentWeight);
  syncInlineConverter(currentWeight);
}

/**
 * Synchronize Header Inline Weight Converter (kg ⇄ lb)
 */
function syncInlineConverter(weight) {
  const inlineKg = document.getElementById('inlineConvKg');
  const inlineLb = document.getElementById('inlineConvLb');
  if (!inlineKg || !inlineLb) return;
  // If user is actively typing, don't overwrite
  if (document.activeElement === inlineKg || document.activeElement === inlineLb) return;
  const targetW = (weight !== undefined && weight !== null && !isNaN(weight) && Number(weight) > 0) ? Number(weight) : 92.0;
  inlineKg.value = targetW.toFixed(2);
  inlineLb.value = (Math.round((targetW * KG_TO_LB_FACTOR) * 100) / 100).toFixed(2);
}

/**
 * Render Intermediate Progress Substeps (0.5kg and 0.75kg) pointing to Goal 80kg
 */
function renderSubSteps(currentWeight) {
  const gridContainer = document.getElementById('substepsDisplayGrid');
  if (!gridContainer) return;

  const totalToLose = Math.round((START_WEIGHT - GOAL_WEIGHT) * 100) / 100; // 13.70 kg
  const remainingToGoal = Math.max(0, Math.round((currentWeight - GOAL_WEIGHT) * 100) / 100);
  const lostSoFar = Math.max(0, Math.round((START_WEIGHT - currentWeight) * 100) / 100);
  const pctToGoal = Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 1000) / 10));

  // 1. Generate 0.5 kg steps down to GOAL_WEIGHT (80.0 kg)
  const steps05 = [];
  let k = 1;
  while (true) {
    const rawTarget = Math.round((START_WEIGHT - k * 0.50) * 100) / 100;
    const isGoal = rawTarget <= GOAL_WEIGHT;
    const targetW = isGoal ? GOAL_WEIGHT : rawTarget;
    const lostTotal = Math.round((START_WEIGHT - targetW) * 100) / 100;
    const isAchieved = currentWeight <= targetW;

    let fullDateStr = '';
    let weekStr = '';

    if (isAchieved) {
      const achievedRow = appData.find(r => r.actual !== null && r.actual !== '' && Number(r.actual) <= targetW);
      if (achievedRow) {
        fullDateStr = achievedRow.date;
        weekStr = achievedRow.week;
      }
    } else {
      const plannedRow = appData.find(r => r.targetC <= targetW);
      if (plannedRow) {
        fullDateStr = plannedRow.date;
        weekStr = plannedRow.week;
      } else if (isGoal) {
        fullDateStr = '11.04.2027';
        weekStr = 'Woche 28';
      }
    }

    if (!fullDateStr) {
      const startDate = new Date(2026, 8, 28);
      const estDate = new Date(startDate.getTime() + (k * 7) * 24 * 60 * 60 * 1000);
      const dd = String(estDate.getDate()).padStart(2, '0');
      const mm = String(estDate.getMonth() + 1).padStart(2, '0');
      const yyyy = estDate.getFullYear();
      fullDateStr = `${dd}.${mm}.${yyyy}`;
      weekStr = `Woche ${k + 1}`;
    }

    steps05.push({
      index: k,
      stepSize: 0.50,
      targetWeight: targetW,
      lostTotal: lostTotal,
      isAchieved: isAchieved,
      isGoal: isGoal,
      fullDateStr: fullDateStr,
      weekStr: weekStr,
      type: '05'
    });
    if (isGoal) break;
    k++;
  }

  // 2. Generate 0.75 kg steps down to GOAL_WEIGHT (80.0 kg)
  const steps075 = [];
  let m = 1;
  while (true) {
    const rawTarget = Math.round((START_WEIGHT - m * 0.75) * 100) / 100;
    const isGoal = rawTarget <= GOAL_WEIGHT;
    const targetW = isGoal ? GOAL_WEIGHT : rawTarget;
    const lostTotal = Math.round((START_WEIGHT - targetW) * 100) / 100;
    const isAchieved = currentWeight <= targetW;

    let fullDateStr = '';
    let weekStr = '';

    if (isAchieved) {
      const achievedRow = appData.find(r => r.actual !== null && r.actual !== '' && Number(r.actual) <= targetW);
      if (achievedRow) {
        fullDateStr = achievedRow.date;
        weekStr = achievedRow.week;
      }
    } else {
      const plannedRow = appData.find(r => r.targetB <= targetW);
      if (plannedRow) {
        fullDateStr = plannedRow.date;
        weekStr = plannedRow.week;
      } else if (isGoal) {
        fullDateStr = '08.02.2027';
        weekStr = 'Woche 20';
      }
    }

    if (!fullDateStr) {
      const startDate = new Date(2026, 8, 28);
      const estDate = new Date(startDate.getTime() + (m * 7) * 24 * 60 * 60 * 1000);
      const dd = String(estDate.getDate()).padStart(2, '0');
      const mm = String(estDate.getMonth() + 1).padStart(2, '0');
      const yyyy = estDate.getFullYear();
      fullDateStr = `${dd}.${mm}.${yyyy}`;
      weekStr = `Woche ${m + 1}`;
    }

    steps075.push({
      index: m,
      stepSize: 0.75,
      targetWeight: targetW,
      lostTotal: lostTotal,
      isAchieved: isAchieved,
      isGoal: isGoal,
      fullDateStr: fullDateStr,
      weekStr: weekStr,
      type: '075'
    });
    if (isGoal) break;
    m++;
  }

  // 3. Generate 1.00 kg steps down to GOAL_WEIGHT (80.0 kg)
  const steps10 = [];
  let p = 1;
  while (true) {
    const rawTarget = Math.round((START_WEIGHT - p * 1.00) * 100) / 100;
    const isGoal = rawTarget <= GOAL_WEIGHT;
    const targetW = isGoal ? GOAL_WEIGHT : rawTarget;
    const lostTotal = Math.round((START_WEIGHT - targetW) * 100) / 100;
    const isAchieved = currentWeight <= targetW;

    let fullDateStr = '';
    let weekStr = '';

    if (isAchieved) {
      const achievedRow = appData.find(r => r.actual !== null && r.actual !== '' && Number(r.actual) <= targetW);
      if (achievedRow) {
        fullDateStr = achievedRow.date;
        weekStr = achievedRow.week;
      }
    } else {
      const plannedRow = appData.find(r => r.targetA <= targetW);
      if (plannedRow) {
        fullDateStr = plannedRow.date;
        weekStr = plannedRow.week;
      } else if (isGoal) {
        fullDateStr = '04.01.2027';
        weekStr = 'Woche 15';
      }
    }

    if (!fullDateStr) {
      const startDate = new Date(2026, 8, 28);
      const estDate = new Date(startDate.getTime() + (p * 7) * 24 * 60 * 60 * 1000);
      const dd = String(estDate.getDate()).padStart(2, '0');
      const mm = String(estDate.getMonth() + 1).padStart(2, '0');
      const yyyy = estDate.getFullYear();
      fullDateStr = `${dd}.${mm}.${yyyy}`;
      weekStr = `Woche ${p + 1}`;
    }

    steps10.push({
      index: p,
      stepSize: 1.00,
      targetWeight: targetW,
      lostTotal: lostTotal,
      isAchieved: isAchieved,
      isGoal: isGoal,
      fullDateStr: fullDateStr,
      weekStr: weekStr,
      type: '10'
    });
    if (isGoal) break;
    p++;
  }

  // 1. Calculate Scenario Progress & Exact Dates when 80.00 kg is achieved
  const goalDate10 = steps10[steps10.length - 1].fullDateStr || '04.01.2027'; // Week 15
  const goalDate075 = steps075[steps075.length - 1].fullDateStr || '08.02.2027'; // Week 20
  const goalDate05 = steps05[steps05.length - 1].fullDateStr || '11.04.2027'; // Week 28

  // Timeline Scale: 28 Weeks Journey to 80 kg
  // - Start (Woche 1 / 28.09.2026): 0%
  // - Szenario A erreicht 80 kg (Woche 15 / 04.01.2027): 53.6%
  // - Szenario B erreicht 80 kg ★ (Woche 20 / 08.02.2027): 71.4%
  // - Szenario C erreicht 80 kg (Woche 28 / 11.04.2027): 100.0%
  const pctReachA = 53.6; // Week 15 / 28
  const pctReachB = 71.4; // Week 20 / 28
  const pctReachC = 100.0; // Week 28 / 28

  // Helper to determine active spotlight
  const isAllMode = currentSubstepMode === 'both' || currentSubstepMode === 'all';
  const isModeA = isAllMode || currentSubstepMode === 'A' || currentSubstepMode === '10';
  const isModeB = isAllMode || currentSubstepMode === 'B' || currentSubstepMode === '075';
  const isModeC = isAllMode || currentSubstepMode === 'C' || currentSubstepMode === '05';

  const spotlightClass = (active) => {
    if (isAllMode) return '';
    return active ? 'highlight' : 'dimmed';
  };

  // Render ONE Single Unified Merged Bar Component
  gridContainer.innerHTML = '';

  const mergedCard = document.createElement('div');
  mergedCard.className = 'merged-scenario-card';

  mergedCard.innerHTML = `
    <!-- Top Stats Row: Aktuell vs. Hauptziel -->
    <div class="merged-stats-bar">
      <div class="stat-pill">
        <span class="stat-pill-label">Startgewicht:</span>
        <span class="stat-pill-val">${START_WEIGHT.toFixed(2)} kg</span>
        <span class="stat-pill-sub">28.09.2026</span>
      </div>

      <div class="stat-pill">
        <span class="stat-pill-label">Ist-Stand:</span>
        <span class="stat-pill-val" style="color: var(--accent-cyan);">${currentWeight.toFixed(2)} kg</span>
        <span class="stat-pill-sub highlight">-${lostSoFar.toFixed(2)} kg verloren (${pctToGoal.toFixed(1)}%)</span>
      </div>

      <div class="stat-pill">
        <span class="stat-pill-label">Hauptziel:</span>
        <span class="stat-pill-val" style="color: var(--accent-amber);">80.00 kg</span>
        <span class="stat-pill-sub">noch ${remainingToGoal.toFixed(2)} kg</span>
      </div>
    </div>

    <!-- The Single Unified Bar Track -->
    <div class="merged-track-container">
      <!-- Milestone Flags: Wann erreichen Szenario A, B und C die 80 kg? -->
      <div class="merged-milestone-flags">
        <!-- Marker A: 80 kg am 04.01.2027 (Woche 15) -->
        <div class="milestone-flag flag-a ${spotlightClass(isModeA)}" style="left: ${pctReachA}%;" title="Szenario A (1.00 kg/Wo): Erreicht 80.00 kg am ${goalDate10} (Woche 15)">
          <div class="flag-content">
            <span class="flag-scenario">A: 1.0 kg/Wo</span>
            <span class="flag-reach-title">80 kg: <strong>${goalDate10}</strong></span>
            <span class="flag-sub">Woche 15 (in ~14 Wo.)</span>
          </div>
          <div class="flag-stem stem-a"></div>
        </div>

        <!-- Marker B: 80 kg am 08.02.2027 (Woche 20) -->
        <div class="milestone-flag flag-b ${spotlightClass(isModeB)}" style="left: ${pctReachB}%;" title="Szenario B (Hauptziel, 0.75 kg/Wo): Erreicht 80.00 kg am ${goalDate075} (Woche 20)">
          <div class="flag-content">
            <span class="flag-scenario">B: 0.75 kg/Wo</span>
            <span class="flag-reach-title">80 kg: <strong>${goalDate075}</strong></span>
            <span class="flag-sub">Woche 20 (in ~19 Wo.)</span>
          </div>
          <div class="flag-stem stem-b"></div>
        </div>

        <!-- Marker C: 80 kg am 11.04.2027 (Woche 28) -->
        <div class="milestone-flag flag-c ${spotlightClass(isModeC)}" style="left: ${pctReachC}%;" title="Szenario C (0.50 kg/Wo): Erreicht 80.00 kg am ${goalDate05} (Woche 28)">
          <div class="flag-content">
            <span class="flag-scenario">C: 0.5 kg/Wo</span>
            <span class="flag-reach-title">80 kg: <strong>${goalDate05}</strong></span>
            <span class="flag-sub">Woche 28 (in ~27 Wo.)</span>
          </div>
          <div class="flag-stem stem-c"></div>
        </div>
      </div>

      <!-- Single Merged Bar Track (0% bis Woche 28 Ziel) -->
      <div class="merged-track-bar">
        <!-- Colored Journey Zones on track -->
        <div class="track-zone zone-a" style="left: 0; width: ${pctReachA}%;" title="Strecke bis Szenario A Ziel (04.01.2027)"></div>
        <div class="track-zone zone-b" style="left: ${pctReachA}%; width: ${(pctReachB - pctReachA).toFixed(1)}%;" title="Strecke bis Szenario B Ziel (08.02.2027)"></div>
        <div class="track-zone zone-c" style="left: ${pctReachB}%; width: ${(pctReachC - pctReachB).toFixed(1)}%;" title="Strecke bis Szenario C Ziel (11.04.2027)"></div>

        <!-- Vertical Pin Lines for 80 kg Target Dates -->
        <div class="track-pin pin-a" style="left: ${pctReachA}%;" title="Ziel A: 04.01.2027"></div>
        <div class="track-pin pin-b" style="left: ${pctReachB}%;" title="Ziel B: 08.02.2027"></div>
        <div class="track-pin pin-c" style="left: ${pctReachC}%;" title="Ziel C: 11.04.2027"></div>

        <!-- Current Progress Actual Fill -->
        <div class="merged-actual-fill" style="width: ${pctToGoal}%;" title="Aktueller Fortschritt: ${lostSoFar.toFixed(2)} kg (${pctToGoal.toFixed(1)}% des 80 kg Gesamtziels)">
          <span class="actual-pulse-dot"></span>
          ${pctToGoal >= 9 ? `<span class="actual-label">Ist: ${pctToGoal.toFixed(1)}% (${currentWeight.toFixed(2)} kg)</span>` : ''}
        </div>
      </div>

      <!-- Track Base Ticks: Start to Goal Timeline -->
      <div class="merged-track-ticks">
        <span class="tick-label tick-start">Start: 28.09.2026 (${START_WEIGHT.toFixed(2)} kg)</span>
        <span class="tick-label tick-end">Ziel: 80.00 kg (C: 11.04.2027)</span>
      </div>
    </div>
  `;

  gridContainer.appendChild(mergedCard);
}

/**
 * Render Interactive Chart.js Graph
 */
function renderChart() {
  const ctx = document.getElementById('weightChart').getContext('2d');

  // Filter data based on view
  let filteredData = [...appData];

  // If time of day filter is set
  if (currentChartTimeFilter === 'morning') {
    filteredData = filteredData.filter(r => r.timeOfDay === 'Morgen');
  } else if (currentChartTimeFilter === 'evening') {
    filteredData = filteredData.filter(r => r.timeOfDay === 'Abend');
  }

  // Create labels
  const labels = filteredData.map(r => {
    const timeIcon = r.timeOfDay === 'Morgen' ? '☼' : '☽';
    return `${r.date.substring(0, 5)} ${timeIcon}`;
  });

  // Total points and max label index
  const totalPoints = filteredData.length;
  const maxLabelIndex = Math.max(totalPoints - 1, 0);

  // Determine x-axis bounds for Schnell-Zoom (default)
  let xMinOption = undefined;
  let xMaxOption = undefined;

  if (isQuickZoomActive) {
    const filledIndices = [];
    filteredData.forEach((r, idx) => {
      if (r.actual !== null && r.actual !== undefined && !isNaN(r.actual)) {
        filledIndices.push(idx);
      }
    });

    if (filledIndices.length > 0) {
      const firstIdx = filledIndices[0];
      const lastIdx = filledIndices[filledIndices.length - 1];
      const minRange = 7;
      const padRight = 3;
      xMinOption = Math.max(0, firstIdx - 1);
      xMaxOption = Math.min(maxLabelIndex, Math.max(xMinOption + minRange, lastIdx + padRight));
    }
  }

  // 80 kg Goal Indices for A, B, and C
  // Scenario A (1.00 kg/Wo): reaches 80.0 kg at 04.01.2027 (Woche 15)
  // Scenario B (0.75 kg/Wo): reaches 80.0 kg at 08.02.2027 (Woche 20)
  // Scenario C (0.50 kg/Wo): reaches 80.0 kg at 11.04.2027 (Woche 28)
  let goalIndexA = filteredData.findIndex(r => r.date === '04.01.2027');
  if (goalIndexA === -1) goalIndexA = filteredData.findIndex(r => r.targetA <= 80.0);

  let goalIndexB = filteredData.findIndex(r => r.date === '08.02.2027');
  if (goalIndexB === -1) goalIndexB = filteredData.findIndex(r => r.targetB <= 80.0);

  let goalIndexC = filteredData.findIndex(r => r.date === '11.04.2027');
  if (goalIndexC === -1) {
    for (let i = filteredData.length - 1; i >= 0; i--) {
      if (filteredData[i].targetC <= 80.25) {
        goalIndexC = i;
        break;
      }
    }
  }
  if (goalIndexC === -1) goalIndexC = filteredData.length - 1;

  // Extract series
  const actualData = filteredData.map(r => r.actual);
  const targetCData = filteredData.map(r => r.targetC);
  const targetAData = filteredData.map(r => r.targetA);
  const targetBData = filteredData.map(r => r.targetB);

  // Compute rolling average of actual measurements (3-point window) & summary statistics
  const filledActualRows = [];
  filteredData.forEach((r, idx) => {
    if (r.actual !== null && r.actual !== undefined && !isNaN(r.actual)) {
      filledActualRows.push({ idx, actual: r.actual, date: r.date, timeOfDay: r.timeOfDay });
    }
  });

  const avgData = filteredData.map((r, idx) => {
    if (r.actual === null || r.actual === undefined || isNaN(r.actual)) {
      return null;
    }
    const filledPos = filledActualRows.findIndex(item => item.idx === idx);
    if (filledPos === -1) return null;
    const windowStart = Math.max(0, filledPos - 2);
    const windowItems = filledActualRows.slice(windowStart, filledPos + 1);
    const sum = windowItems.reduce((acc, curr) => acc + curr.actual, 0);
    return Math.round((sum / windowItems.length) * 100) / 100;
  });

  // Calculate statistics: average loss per measurement, daily average loss, average weight, total loss
  let chartStats = {
    measurementsCount: filledActualRows.length,
    avgLossPerMeasurement: 0,
    avgLossPerDay: 0,
    elapsedDays: 0,
    avgOverallWeight: 0,
    totalLoss: 0,
    firstWeight: 0,
    latestWeight: 0
  };

  let avgOverallWeight = null;

  if (filledActualRows.length > 0) {
    const sumWeights = filledActualRows.reduce((acc, curr) => acc + curr.actual, 0);
    avgOverallWeight = Math.round((sumWeights / filledActualRows.length) * 100) / 100;

    const firstWeight = filledActualRows[0].actual;
    const latestWeight = filledActualRows[filledActualRows.length - 1].actual;
    const totalLoss = Math.round((firstWeight - latestWeight) * 100) / 100;
    const measurementIntervals = Math.max(1, filledActualRows.length - 1);
    const avgLossPerMeasurement = Math.round((totalLoss / measurementIntervals) * 100) / 100;

    // Calculate days elapsed between first and latest measurement
    let elapsedDays = 0;
    let avgLossPerDay = 0;
    if (filledActualRows.length > 1) {
      const getDayOffset = (item) => {
        const parts = item.date.split('.').map(Number);
        const dObj = new Date(parts[2], parts[1] - 1, parts[0]);
        const timeOffset = item.timeOfDay === 'Abend' ? 0.5 : 0.0;
        return (dObj.getTime() / (1000 * 60 * 60 * 24)) + timeOffset;
      };

      const firstOffset = getDayOffset(filledActualRows[0]);
      const latestOffset = getDayOffset(filledActualRows[filledActualRows.length - 1]);
      const diffDays = Math.max(0.5, Math.round((latestOffset - firstOffset) * 10) / 10);
      elapsedDays = diffDays;
      avgLossPerDay = Math.round((totalLoss / diffDays) * 100) / 100;
    }

    chartStats = {
      measurementsCount: filledActualRows.length,
      avgLossPerMeasurement,
      avgLossPerDay,
      elapsedDays,
      avgOverallWeight,
      totalLoss,
      firstWeight,
      latestWeight
    };
  }

  // Set exact 80.0 kg target value at the goal milestones
  if (goalIndexA !== -1) {
    targetAData[goalIndexA] = 80.0;
    if (filteredData[goalIndexA + 1]?.date === filteredData[goalIndexA]?.date) {
      targetAData[goalIndexA + 1] = 80.0;
    }
  }
  if (goalIndexB !== -1) {
    targetBData[goalIndexB] = 80.0;
    if (filteredData[goalIndexB + 1]?.date === filteredData[goalIndexB]?.date) {
      targetBData[goalIndexB + 1] = 80.0;
    }
  }
  if (goalIndexC !== -1) {
    targetCData[goalIndexC] = 80.0;
    if (filteredData[goalIndexC + 1]?.date === filteredData[goalIndexC]?.date) {
      targetCData[goalIndexC + 1] = 80.0;
    }
  }

  // Point colors for actual: Morgen = Cyan, Abend = Sky Blue
  const pointBgColors = filteredData.map(r => r.timeOfDay === 'Morgen' ? '#06b6d4' : '#38bdf8');

  // Determine y-axis bounds:
  // In Schnell-Zoom mode: exactly 5 kg range from 95 kg down to 90 kg (1 kg steps)
  // Dynamically slides down if future recorded weights drop below 90 kg
  let yMin = 65;
  let yMax = 95;
  let yStepSize = 5;

  if (isQuickZoomActive) {
    yMin = 90;
    yMax = 95;
    yStepSize = 1;

    const filledActuals = filteredData
      .map(r => r.actual)
      .filter(val => val !== null && val !== undefined && !isNaN(val));

    if (filledActuals.length > 0) {
      const minActual = Math.min(...filledActuals);
      if (minActual < 90) {
        yMin = Math.floor(minActual);
        yMax = yMin + 5;
      }
    }
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Custom Chart styling
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';
  const textColor = isLight ? '#64748b' : '#94a3b8';

  const datasets = [];

  // Actual Weight Dataset
  if (activeSeries.actual) {
    datasets.push({
      id: 'actual',
      label: 'Aktuelles Gewicht',
      data: actualData,
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      borderWidth: 3,
      pointRadius: (ctx) => {
        const val = ctx.raw;
        return val !== null ? 6 : 0;
      },
      pointHoverRadius: 8,
      pointBackgroundColor: pointBgColors,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      tension: 0.25,
      spanGaps: true,
      fill: true
    });
  }

  // Average Weight Dataset (Ø Gleitender Durchschnitt / Trend)
  if (activeSeries.avg) {
    datasets.push({
      id: 'avg',
      label: 'Ø Durchschnitt',
      data: avgData,
      borderColor: '#38bdf8',
      backgroundColor: 'transparent',
      borderWidth: 2.2,
      borderDash: [5, 4],
      pointRadius: (ctx) => (ctx.raw !== null ? 4.5 : 0),
      pointHoverRadius: 7,
      pointBackgroundColor: '#38bdf8',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 1.5,
      tension: 0.3,
      spanGaps: true,
      fill: false
    });
  }

  // Target A Dataset (1.0 kg/Woche - Hellgrün, lange Striche) with 80 kg marker
  if (activeSeries.targetA) {
    datasets.push({
      id: 'targetA',
      label: 'Ziel A (1.0 kg/Woche)',
      data: targetAData,
      borderColor: '#4ade80',
      borderWidth: 2.2,
      borderDash: [12, 5],
      pointRadius: (ctx) => (ctx.dataIndex === goalIndexA ? 7 : 0),
      pointHoverRadius: (ctx) => (ctx.dataIndex === goalIndexA ? 10 : 0),
      pointBackgroundColor: '#4ade80',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2.5,
      tension: 0.2,
      fill: false
    });
  }

  // Target B Dataset (Featured: 0.75 kg/Woche - Mittelgrün, mittellange Striche) with 80 kg marker
  if (activeSeries.targetB) {
    datasets.push({
      id: 'targetB',
      label: 'Ziel B (0.75 kg/Woche)',
      data: targetBData,
      borderColor: '#22c55e',
      borderWidth: 2.5,
      borderDash: [6, 4],
      pointRadius: (ctx) => (ctx.dataIndex === goalIndexB ? 7 : 0),
      pointHoverRadius: (ctx) => (ctx.dataIndex === goalIndexB ? 10 : 0),
      pointBackgroundColor: '#22c55e',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2.5,
      tension: 0.2,
      fill: false
    });
  }

  // Target C Dataset (0.5 kg/Woche - Dunkelgrün, kurze Striche) with 80 kg marker
  if (activeSeries.targetC) {
    datasets.push({
      id: 'targetC',
      label: 'Ziel C (0.5 kg/Woche)',
      data: targetCData,
      borderColor: '#15803d',
      borderWidth: 2.2,
      borderDash: [2.5, 3],
      pointRadius: (ctx) => (ctx.dataIndex === goalIndexC ? 7 : 0),
      pointHoverRadius: (ctx) => (ctx.dataIndex === goalIndexC ? 10 : 0),
      pointBackgroundColor: '#15803d',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2.5,
      tension: 0.2,
      fill: false
    });
  }

  // Custom Chart.js Plugin for 80 kg Guideline and Markers on Lines A, B, and C
  const target80MarkersPlugin = {
    id: 'target80MarkersPlugin',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea, scales: { x, y } } = chart;
      if (!chartArea) return;

      // 1. Draw horizontal 80.0 kg guideline if 80 is within visible y-range
      const y80 = y.getPixelForValue(80);
      if (y80 >= chartArea.top && y80 <= chartArea.bottom) {
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = isLight ? 'rgba(74, 222, 128, 0.45)' : 'rgba(74, 222, 128, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.moveTo(chartArea.left, y80);
        ctx.lineTo(chartArea.right, y80);
        ctx.stroke();

        // 80.0 kg Ziel badge on right edge
        const labelText = '80.0 kg Ziel';
        ctx.font = '600 10px JetBrains Mono, monospace';
        const textWidth = ctx.measureText(labelText).width;
        const badgeW = textWidth + 12;
        const badgeH = 18;
        const badgeX = chartArea.right - badgeW - 6;
        const badgeY = y80 - badgeH / 2;

        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
        } else {
          ctx.rect(badgeX, badgeY, badgeW, badgeH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isLight ? '#166534' : '#4ade80';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, badgeX + badgeW / 2, y80);
        ctx.restore();
      }

      // 2. Draw horizontal Ø Durchschnitt guideline if avg series is active and visible
      if (activeSeries.avg && avgOverallWeight !== null) {
        const yAvg = y.getPixelForValue(avgOverallWeight);
        if (yAvg >= chartArea.top && yAvg <= chartArea.bottom) {
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = isLight ? 'rgba(56, 189, 248, 0.65)' : 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 1.3;
          ctx.moveTo(chartArea.left, yAvg);
          ctx.lineTo(chartArea.right, yAvg);
          ctx.stroke();

          // Badge on left side so it never collides with 80 kg target badge on the right
          const labelText = `Ø ${avgOverallWeight.toFixed(2)} kg Schnitt`;
          ctx.font = '600 10px JetBrains Mono, monospace';
          const textWidth = ctx.measureText(labelText).width;
          const badgeW = textWidth + 12;
          const badgeH = 18;
          const badgeX = chartArea.left + 8;
          const badgeY = yAvg - badgeH / 2;

          ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
          } else {
            ctx.rect(badgeX, badgeY, badgeW, badgeH);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(labelText, badgeX + badgeW / 2, yAvg);
          ctx.restore();
        }
      }

      // 3. Draw badges above the 80 kg markers for each active dataset
      const markerConfigs = [
        { id: 'targetA', index: goalIndexA, label: 'A: 80 kg', bg: '#4ade80', textColor: '#0f172a', halo: 'rgba(74, 222, 128, 0.25)' },
        { id: 'targetB', index: goalIndexB, label: 'B: 80 kg ★', bg: '#22c55e', textColor: '#ffffff', halo: 'rgba(34, 197, 94, 0.25)' },
        { id: 'targetC', index: goalIndexC, label: 'C: 80 kg', bg: '#15803d', textColor: '#ffffff', halo: 'rgba(21, 128, 61, 0.35)' }
      ];

      markerConfigs.forEach(m => {
        if (m.index === -1) return;
        const dsIndex = chart.data.datasets.findIndex(d => d.id === m.id);
        if (dsIndex === -1) return;
        const meta = chart.getDatasetMeta(dsIndex);
        if (!meta || meta.hidden || !meta.data[m.index]) return;

        const pt = meta.data[m.index];
        // Only draw if point is inside visible chart area
        if (pt.x >= chartArea.left - 5 && pt.x <= chartArea.right + 5 &&
            pt.y >= chartArea.top - 10 && pt.y <= chartArea.bottom + 10) {

          // Outer halo around point
          ctx.save();
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 11, 0, Math.PI * 2);
          ctx.fillStyle = m.halo;
          ctx.fill();

          // Pill badge above the point
          ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          const tw = ctx.measureText(m.label).width;
          const pw = tw + 14;
          const ph = 18;
          const px = pt.x - pw / 2;
          const py = pt.y - 23;

          // Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetY = 2;

          ctx.fillStyle = m.bg;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(px, py, pw, ph, 9);
          } else {
            ctx.rect(px, py, pw, ph);
          }
          ctx.fill();

          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;

          // Downward pointer notch
          ctx.fillStyle = m.bg;
          ctx.beginPath();
          ctx.moveTo(pt.x - 3, py + ph);
          ctx.lineTo(pt.x + 3, py + ph);
          ctx.lineTo(pt.x, py + ph + 3);
          ctx.closePath();
          ctx.fill();

          // Label text
          ctx.fillStyle = m.textColor || '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.label, pt.x, py + ph / 2);
          ctx.restore();
        }
      });

      // 4. Draw RED difference line between today's/latest actual weight and Target A (1.0 kg/Woche Prognose)
      let todayEntryIndex = -1;
      const now = new Date();
      const dStr = String(now.getDate()).padStart(2, '0');
      const mStr = String(now.getMonth() + 1).padStart(2, '0');
      const yStr = now.getFullYear();
      const todayDateStr = `${dStr}.${mStr}.${yStr}`;

      // Search filteredData for today's entry with actual weight
      for (let i = filteredData.length - 1; i >= 0; i--) {
        if (filteredData[i].date === todayDateStr && filteredData[i].actual !== null && filteredData[i].actual !== undefined) {
          todayEntryIndex = i;
          break;
        }
      }
      // If no measurement exists for today, use the latest filled measurement in filteredData
      if (todayEntryIndex === -1 && filledActualRows.length > 0) {
        todayEntryIndex = filledActualRows[filledActualRows.length - 1].idx;
      }

      if (todayEntryIndex !== -1 && filteredData[todayEntryIndex]) {
        const row = filteredData[todayEntryIndex];
        const actualVal = row.actual;
        const targetAVal = row.targetA;

        if (actualVal !== null && actualVal !== undefined && targetAVal !== null && targetAVal !== undefined) {
          const xPos = x.getPixelForValue(todayEntryIndex);
          const yActual = y.getPixelForValue(actualVal);
          const yTargetA = y.getPixelForValue(targetAVal);

          // Draw only if within horizontal chartArea bounds
          if (xPos >= chartArea.left - 5 && xPos <= chartArea.right + 5) {
            ctx.save();

            // Vertical line bounds (clamped to chartArea for safety when zoomed)
            const yTop = Math.max(chartArea.top, Math.min(yActual, yTargetA));
            const yBottom = Math.min(chartArea.bottom, Math.max(yActual, yTargetA));

            // Subtle, elegant dashed red difference line
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
            ctx.lineWidth = 1.6;
            ctx.moveTo(xPos, yTop);
            ctx.lineTo(xPos, yBottom);
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash for dots & badge

            // Small, discreet anchor dots at endpoints
            // At actual weight
            if (yActual >= chartArea.top - 5 && yActual <= chartArea.bottom + 5) {
              ctx.beginPath();
              ctx.arc(xPos, yActual, 3.5, 0, Math.PI * 2);
              ctx.fillStyle = '#ef4444';
              ctx.fill();
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }

            // At target A point
            if (yTargetA >= chartArea.top - 5 && yTargetA <= chartArea.bottom + 5) {
              ctx.beginPath();
              ctx.arc(xPos, yTargetA, 3.5, 0, Math.PI * 2);
              ctx.fillStyle = '#ef4444';
              ctx.fill();
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }

            // Difference badge in red attached to line
            const diff = Math.round((actualVal - targetAVal) * 100) / 100;
            const diffSign = diff > 0 ? '+' : '';
            const badgeLabel = `Δ ${diffSign}${diff.toFixed(2)} kg`;

            ctx.font = 'bold 9.5px JetBrains Mono, monospace';
            const tw = ctx.measureText(badgeLabel).width;
            const bw = tw + 12;
            const bh = 18;

            // Position badge to the right of line, or left if too close to right margin
            let bx = xPos + 7;
            if (bx + bw > chartArea.right - 6) {
              bx = xPos - bw - 7;
            }

            // Vertical center of the difference line
            let by = ((yActual + yTargetA) / 2) - bh / 2;
            by = Math.max(chartArea.top + 4, Math.min(chartArea.bottom - bh - 4, by));

            // Leader tick from line to badge
            ctx.beginPath();
            ctx.setLineDash([2, 2]);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
            ctx.lineWidth = 1;
            ctx.moveTo(xPos, by + bh / 2);
            ctx.lineTo(bx > xPos ? bx : bx + bw, by + bh / 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Badge box
            ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.94)';
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(bx, by, bw, bh, 4);
            } else {
              ctx.rect(bx, by, bw, bh);
            }
            ctx.fill();
            ctx.stroke();

            // Badge text
            ctx.fillStyle = isLight ? '#dc2626' : '#f87171';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(badgeLabel, bx + bw / 2, by + bh / 2);

            ctx.restore();
          }
        }
      }
    }
  };

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    plugins: [target80MarkersPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#f1f5f9',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              const val = context.parsed.y;
              if (val === null || val === undefined) return null;
              let suffix = '';
              const dsId = context.dataset.id;
              if (Math.abs(val - 80.0) < 0.05) {
                if (dsId === 'targetA' && context.dataIndex === goalIndexA) {
                  suffix = ' (★ 80.0 kg Hauptziel)';
                } else if (dsId === 'targetB' && context.dataIndex === goalIndexB) {
                  suffix = ' (★ 80.0 kg Hauptziel)';
                } else if (dsId === 'targetC' && context.dataIndex === goalIndexC) {
                  suffix = ' (★ 80.0 kg Hauptziel)';
                }
              }
              if (dsId === 'actual') {
                const r = filteredData[context.dataIndex];
                if (r && r.targetA !== null && r.targetA !== undefined) {
                  const d = Math.round((val - r.targetA) * 100) / 100;
                  const s = d > 0 ? '+' : '';
                  suffix += ` [Diff zu Ziel A: ${s}${d.toFixed(2)} kg]`;
                }
              }
              return ` ${context.dataset.label}: ${val.toFixed(2)} kg${suffix}`;
            }
          }
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            threshold: 0,
            modifierKey: null,
            onPan: function({ chart }) {
              updateResetZoomBtn(chart);
            },
            onPanComplete: function({ chart }) {
              updateResetZoomBtn(chart);
            }
          },
          zoom: {
            wheel: {
              enabled: false
            },
            pinch: {
              enabled: false
            },
            mode: 'x',
            onZoom: function({ chart }) {
              updateResetZoomBtn(chart);
            },
            onZoomComplete: function({ chart }) {
              updateResetZoomBtn(chart);
            }
          },
          limits: {
            x: { min: 0, max: maxLabelIndex }
          }
        }
      },
      scales: {
        x: {
          min: xMinOption,
          max: xMaxOption,
          grid: {
            color: gridColor,
            drawBorder: false
          },
          ticks: {
            color: textColor,
            font: { family: 'inherit', size: 11 },
            maxTicksLimit: 20
          }
        },
        y: {
          min: yMin,
          max: yMax,
          grid: {
            color: gridColor,
            drawBorder: false
          },
          ticks: {
            color: textColor,
            font: { family: 'JetBrains Mono', size: 11 },
            stepSize: yStepSize,
            callback: (val) => `${val} kg`
          }
        }
      }
    }
  });

  updateResetZoomBtn(chartInstance);
  renderChartAvgStats(chartStats);
}

/**
 * Render Average & Loss-per-Measurement Statistics Ribbon
 */
function renderChartAvgStats(stats) {
  const container = document.getElementById('chartAvgStatsBar');
  if (!container) return;

  if (!stats || stats.measurementsCount === 0) {
    container.innerHTML = `
      <div class="chart-stat-chip">
        <div class="chart-stat-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="chart-stat-info">
          <span class="chart-stat-label">Durchschnitts-Statistik</span>
          <span class="chart-stat-sub">Noch keine Messungen erfasst</span>
        </div>
      </div>
    `;
    return;
  }

  const {
    avgLossPerDay,
    elapsedDays,
    avgLossPerMeasurement,
    avgOverallWeight,
    totalLoss,
    measurementsCount,
    firstWeight,
    latestWeight
  } = stats;

  const lossPerDaySign = avgLossPerDay > 0 ? '-' : (avgLossPerDay < 0 ? '+' : '');
  const absLossPerDay = Math.abs(avgLossPerDay).toFixed(2);
  const lossPerDayColorClass = avgLossPerDay >= 0 ? 'highlight-emerald' : 'highlight-amber';

  const lossSign = avgLossPerMeasurement > 0 ? '-' : (avgLossPerMeasurement < 0 ? '+' : '');
  const absLoss = Math.abs(avgLossPerMeasurement).toFixed(2);
  const lossColorClass = avgLossPerMeasurement >= 0 ? 'highlight-emerald' : 'highlight-amber';

  const totalLossSign = totalLoss > 0 ? '-' : (totalLoss < 0 ? '+' : '');
  const absTotalLoss = Math.abs(totalLoss).toFixed(2);

  // 5. Differenz zur 1.0 kg Prognose (Ziel A)
  const now = new Date();
  const dStr = String(now.getDate()).padStart(2, '0');
  const mStr = String(now.getMonth() + 1).padStart(2, '0');
  const yStr = now.getFullYear();
  const todayDateStr = `${dStr}.${mStr}.${yStr}`;
  const todayRow = appData.find(r => r.date === todayDateStr && r.actual !== null);
  const refRow = todayRow || (appData.filter(r => r.actual !== null).slice(-1)[0]);
  let diff1kgVal = null;
  let diff1kgSub = '';
  let diff1kgColorStyle = 'color: #f87171;';
  if (refRow && refRow.actual !== null && refRow.targetA !== null) {
    diff1kgVal = Math.round((refRow.actual - refRow.targetA) * 100) / 100;
    diff1kgSub = diff1kgVal <= 0 ? `${Math.abs(diff1kgVal).toFixed(2)} kg vor Ziel A (rot im Chart)` : `+${diff1kgVal.toFixed(2)} kg über Ziel A (rot im Chart)`;
    diff1kgColorStyle = diff1kgVal <= 0 ? 'color: #34d399;' : 'color: #f87171;';
  }

  container.innerHTML = `
    <!-- 1. Ø Täglicher Gewichtsverlust -->
    <div class="chart-stat-chip" title="Durchschnittlicher Gewichtsverlust pro Tag über ${elapsedDays} erfasste Tage">
      <div class="chart-stat-icon" style="color: #34d399;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <path d="M12 14v4"></path>
          <path d="M10 16l2 2 2-2"></path>
        </svg>
      </div>
      <div class="chart-stat-info">
        <span class="chart-stat-label">Ø Verlust / Tag</span>
        <div class="chart-stat-value ${lossPerDayColorClass}">
          ${lossPerDaySign}${absLossPerDay} <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted);">kg / Tag</span>
        </div>
        <span class="chart-stat-sub">Ø Schnitt über ${elapsedDays} Tage</span>
      </div>
    </div>

    <!-- 2. Ø Gewichtsverlust pro Messung -->
    <div class="chart-stat-chip" title="Durchschnittlicher Gewichtsverlust zwischen den ${measurementsCount} erfassten Messungen">
      <div class="chart-stat-icon" style="color: #38bdf8;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 18l-9.5-9.5-5 5L1 6"></path>
          <path d="M17 18h6v-6"></path>
        </svg>
      </div>
      <div class="chart-stat-info">
        <span class="chart-stat-label">Ø Verlust / Messung</span>
        <div class="chart-stat-value ${lossColorClass}">
          ${lossSign}${absLoss} <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted);">kg / Messung</span>
        </div>
        <span class="chart-stat-sub">Ø Tempo über ${measurementsCount > 1 ? measurementsCount - 1 : 1} Schritte</span>
      </div>
    </div>

    <!-- 3. Ø Gemessenes Gewicht -->
    <div class="chart-stat-chip" title="Arithmetisches Mittel aller bisherigen ${measurementsCount} Messungen">
      <div class="chart-stat-icon" style="color: #22d3ee;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v5l3 3"></path>
        </svg>
      </div>
      <div class="chart-stat-info">
        <span class="chart-stat-label">Ø Gewicht bisher</span>
        <div class="chart-stat-value highlight-cyan">
          ${avgOverallWeight.toFixed(2)} <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted);">kg</span>
        </div>
        <span class="chart-stat-sub">Schnitt aller ${measurementsCount} Messungen</span>
      </div>
    </div>

    <!-- 4. Gesamtabnahme bisher -->
    <div class="chart-stat-chip" title="Veränderung vom ersten Eintrag (${firstWeight.toFixed(2)} kg) bis zum letzten (${latestWeight.toFixed(2)} kg)">
      <div class="chart-stat-icon" style="color: #06b6d4;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      </div>
      <div class="chart-stat-info">
        <span class="chart-stat-label">Gesamtabnahme</span>
        <div class="chart-stat-value highlight-cyan">
          ${totalLossSign}${absTotalLoss} <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted);">kg</span>
        </div>
        <span class="chart-stat-sub">${firstWeight.toFixed(2)} → ${latestWeight.toFixed(2)} kg</span>
      </div>
    </div>

    <!-- 5. Diff. zur 1kg Prognose (Ziel A) -->
    <div class="chart-stat-chip" title="Differenz zwischen heutigem Ist-Gewicht und der 1.0 kg/Woche Prognose (Ziel A) – im Diagramm rot markiert">
      <div class="chart-stat-icon" style="color: #ef4444; background: rgba(239, 68, 68, 0.12);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="3" x2="12" y2="21"/>
          <polyline points="8 7 12 3 16 7"/>
          <polyline points="8 17 12 21 16 17"/>
        </svg>
      </div>
      <div class="chart-stat-info">
        <span class="chart-stat-label">Diff. zu 1 kg Ziel</span>
        <div class="chart-stat-value" style="${diff1kgColorStyle}">
          ${diff1kgVal !== null ? `${diff1kgVal > 0 ? '+' : ''}${diff1kgVal.toFixed(2)}` : '--'} <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted);">kg</span>
        </div>
        <span class="chart-stat-sub">${diff1kgSub || 'Ziel A Differenz'}</span>
      </div>
    </div>
  `;
}

/**
 * Helper: Find entered weight indices in chart
 */
function getEnteredWeightIndices() {
  const fd = getFilteredChartData();
  const indices = [];
  fd.forEach((r, idx) => {
    if (r.actual !== null && r.actual !== undefined && !isNaN(r.actual)) {
      indices.push(idx);
    }
  });
  return indices;
}

/**
 * Helper: Get current filtered dataset
 */
function getFilteredChartData() {
  let fd = [...appData];
  if (currentChartTimeFilter === 'morning') {
    fd = fd.filter(r => r.timeOfDay === 'Morgen');
  } else if (currentChartTimeFilter === 'evening') {
    fd = fd.filter(r => r.timeOfDay === 'Abend');
  }
  return fd;
}

/**
 * Helper: Find 80 kg goal indices for Scenarios A, B, and C
 */
function getGoalIndices() {
  const fd = getFilteredChartData();
  let goalA = fd.findIndex(r => r.date === '04.01.2027');
  if (goalA === -1) goalA = fd.findIndex(r => r.targetA <= 80.0);

  let goalB = fd.findIndex(r => r.date === '08.02.2027');
  if (goalB === -1) goalB = fd.findIndex(r => r.targetB <= 80.0);

  let goalC = fd.findIndex(r => r.date === '11.04.2027');
  if (goalC === -1) {
    for (let i = fd.length - 1; i >= 0; i--) {
      if (fd[i].targetC <= 80.25) {
        goalC = i;
        break;
      }
    }
  }
  if (goalC === -1) goalC = Math.max(0, fd.length - 1);
  return { goalA, goalB, goalC, maxIdx: Math.max(0, fd.length - 1) };
}

/**
 * Calculate the next zoom span smoothly without huge jarring jumps
 */
function getNextZoomSpan(currentSpan, direction, maxIdx) {
  if (direction === 'out') {
    if (currentSpan <= 6) return Math.min(maxIdx, currentSpan + 1);
    if (currentSpan <= 12) return Math.min(maxIdx, currentSpan + 2);
    if (currentSpan <= 22) return Math.min(maxIdx, currentSpan + 3);
    if (currentSpan <= 36) return Math.min(maxIdx, currentSpan + 5);
    return Math.min(maxIdx, Math.round(currentSpan * 1.18));
  } else {
    // direction === 'in'
    if (currentSpan <= 7) return Math.max(4, currentSpan - 1);
    if (currentSpan <= 13) return Math.max(4, currentSpan - 2);
    if (currentSpan <= 24) return Math.max(4, currentSpan - 3);
    if (currentSpan <= 38) return Math.max(4, currentSpan - 5);
    return Math.max(4, Math.round(currentSpan * 0.84));
  }
}

/**
 * Smooth dynamic Y-axis bounds based on visible active data
 */
function getIdealYAxisBounds(minIdx, maxIdx) {
  if (!chartInstance || !chartInstance.data || !chartInstance.data.datasets) {
    return { min: 65, max: 95, stepSize: 5 };
  }

  let lowestVal = 95;
  chartInstance.data.datasets.forEach(ds => {
    if (!ds.data || !activeSeries[ds.id]) return;
    for (let i = minIdx; i <= maxIdx && i < ds.data.length; i++) {
      const v = ds.data[i];
      if (v !== null && v !== undefined && !isNaN(v)) {
        if (v < lowestVal) lowestVal = v;
      }
    }
  });

  let targetMin = 65;
  let stepSize = 5;

  if (lowestVal >= 90.0) {
    targetMin = 90;
    stepSize = 1;
  } else if (lowestVal >= 87.0) {
    targetMin = 87;
    stepSize = 1;
  } else if (lowestVal >= 84.0) {
    targetMin = 84;
    stepSize = 2;
  } else if (lowestVal >= 80.0) {
    targetMin = 79;
    stepSize = 2;
  } else if (lowestVal >= 75.0) {
    targetMin = 75;
    stepSize = 5;
  } else {
    targetMin = 65;
    stepSize = 5;
  }

  return { min: targetMin, max: 95, stepSize };
}

/**
 * Zoom in on chart (+ button) - smooth & focused on entered kg
 */
function zoomInChart() {
  if (!chartInstance) return;
  const xScale = chartInstance.scales && chartInstance.scales.x;
  if (!xScale) return;
  const yScale = chartInstance.scales && chartInstance.scales.y;

  const totalLabels = chartInstance.data && chartInstance.data.labels ? chartInstance.data.labels.length : 28;
  const maxIdx = Math.max(0, totalLabels - 1);
  const currentMin = (xScale.min !== undefined && xScale.min !== null) ? xScale.min : 0;
  const currentMax = (xScale.max !== undefined && xScale.max !== null) ? xScale.max : maxIdx;
  const currentSpan = Math.max(1, currentMax - currentMin);

  if (currentSpan <= 4) {
    showToast('Maximaler Zoom erreicht (4 Messpunkte)', 'info');
    return;
  }

  const newSpan = getNextZoomSpan(currentSpan, 'in', maxIdx);
  const filledIndices = getEnteredWeightIndices();

  let newMin = 0;
  let newMax = maxIdx;

  if (filledIndices.length > 0) {
    const firstIdx = filledIndices[0];
    const lastIdx = filledIndices[filledIndices.length - 1];

    if (newSpan >= (lastIdx - firstIdx + 2)) {
      newMin = Math.max(0, firstIdx - 1);
      newMax = Math.min(maxIdx, newMin + newSpan);
      if (newMax === maxIdx) {
        newMin = Math.max(0, newMax - newSpan);
      }
    } else {
      newMax = Math.min(maxIdx, lastIdx + 1);
      newMin = Math.max(0, newMax - newSpan);
      if (newMin < 0) {
        newMin = 0;
        newMax = Math.min(maxIdx, newMin + newSpan);
      }
    }
  } else {
    const center = (currentMin + currentMax) / 2;
    newMin = Math.max(0, Math.round(center - newSpan / 2));
    newMax = Math.min(maxIdx, newMin + newSpan);
    if (newMax === maxIdx) {
      newMin = Math.max(0, newMax - newSpan);
    }
    if (newMin === 0) {
      newMax = Math.min(maxIdx, newSpan);
    }
  }

  currentGoalZoom = null;
  isQuickZoomActive = (newSpan <= 14);

  if (yScale) {
    const yBounds = getIdealYAxisBounds(newMin, newMax);
    yScale.options.min = yBounds.min;
    yScale.options.max = yBounds.max;
    if (yScale.options.ticks) yScale.options.ticks.stepSize = yBounds.stepSize;
  }

  xScale.options.min = newMin;
  xScale.options.max = newMax;
  chartInstance.update('none');
  updateResetZoomBtn(chartInstance);
}

/**
 * Zoom out on chart (- button) - smooth & keeps context anchored
 */
function zoomOutChart() {
  if (!chartInstance) return;
  const xScale = chartInstance.scales && chartInstance.scales.x;
  if (!xScale) return;
  const yScale = chartInstance.scales && chartInstance.scales.y;

  const totalLabels = chartInstance.data && chartInstance.data.labels ? chartInstance.data.labels.length : 28;
  const maxIdx = Math.max(0, totalLabels - 1);
  const currentMin = (xScale.min !== undefined && xScale.min !== null) ? xScale.min : 0;
  const currentMax = (xScale.max !== undefined && xScale.max !== null) ? xScale.max : maxIdx;
  const currentSpan = Math.max(1, currentMax - currentMin);

  if (currentMin <= 0 && currentMax >= maxIdx) {
    showToast('Gesamtübersicht (28 Wochen) erreicht', 'info');
    return;
  }

  const newSpan = getNextZoomSpan(currentSpan, 'out', maxIdx);
  let newMin = 0;
  let newMax = maxIdx;

  if (newSpan >= maxIdx) {
    newMin = 0;
    newMax = maxIdx;
    isQuickZoomActive = false;
  } else {
    const filledIndices = getEnteredWeightIndices();
    if (filledIndices.length > 0) {
      const firstIdx = filledIndices[0];
      const lastIdx = filledIndices[filledIndices.length - 1];

      if (newSpan >= (lastIdx - firstIdx + 2)) {
        newMin = Math.max(0, firstIdx - 1);
        newMax = Math.min(maxIdx, newMin + newSpan);
        if (newMax === maxIdx) {
          newMin = Math.max(0, newMax - newSpan);
        }
      } else {
        newMax = Math.min(maxIdx, lastIdx + 1);
        newMin = Math.max(0, newMax - newSpan);
        if (newMin < 0) {
          newMin = 0;
          newMax = Math.min(maxIdx, newMin + newSpan);
        }
      }
    } else {
      const center = (currentMin + currentMax) / 2;
      newMin = Math.max(0, Math.round(center - newSpan / 2));
      newMax = Math.min(maxIdx, newMin + newSpan);
      if (newMin === 0) {
        newMax = Math.min(maxIdx, newSpan);
      }
      if (newMax === maxIdx) {
        newMin = Math.max(0, newMax - newSpan);
      }
    }
    isQuickZoomActive = (newSpan <= 14);
  }

  currentGoalZoom = null;

  if (yScale) {
    const yBounds = getIdealYAxisBounds(newMin, newMax);
    yScale.options.min = yBounds.min;
    yScale.options.max = yBounds.max;
    if (yScale.options.ticks) yScale.options.ticks.stepSize = yBounds.stepSize;
  }

  xScale.options.min = newMin;
  xScale.options.max = newMax;
  chartInstance.update('none');
  updateResetZoomBtn(chartInstance);
}

/**
 * Zoom to 80 kg goal for Scenario A (1.0 kg/Wo), B (0.75 kg/Wo), or C (0.5 kg/Wo)
 */
function zoomTo80kg(goal) {
  if (!chartInstance) return;
  const xScale = chartInstance.scales && chartInstance.scales.x;
  const yScale = chartInstance.scales && chartInstance.scales.y;
  if (!xScale) return;

  const { goalA, goalB, goalC, maxIdx } = getGoalIndices();

  let targetMax = maxIdx;
  let targetLabel = '';

  if (goal === '1.0') {
    targetMax = Math.min(maxIdx, goalA + 1);
    targetLabel = '1.0 kg/Woche (Woche 15 • 04.01.2027)';
  } else if (goal === '0.75') {
    targetMax = Math.min(maxIdx, goalB + 1);
    targetLabel = '0.75 kg/Woche (Woche 20 • 08.02.2027)';
  } else if (goal === '0.5') {
    targetMax = Math.min(maxIdx, goalC);
    targetLabel = '0.5 kg/Woche (Woche 28 • 11.04.2027)';
  }

  currentGoalZoom = goal;
  isQuickZoomActive = false;

  xScale.options.min = 0;
  xScale.options.max = targetMax;

  if (yScale) {
    yScale.options.min = 79;
    yScale.options.max = 95;
    if (yScale.options.ticks) {
      yScale.options.ticks.stepSize = 2;
    }
  }

  chartInstance.update('none');
  updateResetZoomBtn(chartInstance);
  showToast(`Zoom: 80 kg Ziel bei ${targetLabel}`, 'info');
}

/**
 * Quick Zoom to entered weights
 */
function applyQuickZoom() {
  currentGoalZoom = null;
  isQuickZoomActive = true;
  renderChart();
  updateResetZoomBtn(chartInstance);
  showToast('Fokus: Eingetragene kg (5 kg Skala)', 'info');
}

/**
 * Reset Chart Zoom to the full 28-week view
 */
function resetChartZoom() {
  currentGoalZoom = null;
  isQuickZoomActive = false;
  renderChart();
  updateResetZoomBtn(chartInstance);
  showToast('Gesamtübersicht (28 Wochen) aktiviert', 'info');
}

/**
 * Update active state of all zoom buttons
 */
function updateResetZoomBtn(chart) {
  const quickBtn = document.getElementById('quickZoomBtn');
  const resetBtn = document.getElementById('resetZoomBtn');
  const goal10Btn = document.getElementById('zoomGoal10Btn');
  const goal075Btn = document.getElementById('zoomGoal075Btn');
  const goal05Btn = document.getElementById('zoomGoal05Btn');

  const activeChart = chart || chartInstance;
  if (!activeChart || !activeChart.scales || !activeChart.scales.x) {
    if (quickBtn) quickBtn.classList.toggle('active', isQuickZoomActive && !currentGoalZoom);
    if (resetBtn) resetBtn.classList.toggle('active', !isQuickZoomActive && !currentGoalZoom);
    if (goal10Btn) goal10Btn.classList.toggle('active', currentGoalZoom === '1.0');
    if (goal075Btn) goal075Btn.classList.toggle('active', currentGoalZoom === '0.75');
    if (goal05Btn) goal05Btn.classList.toggle('active', currentGoalZoom === '0.5');
    return;
  }

  const xScale = activeChart.scales.x;
  const totalLabels = activeChart.data && activeChart.data.labels ? activeChart.data.labels.length : 28;
  const maxIdx = Math.max(0, totalLabels - 1);
  const curMin = xScale.min !== undefined ? xScale.min : 0;
  const curMax = xScale.max !== undefined ? xScale.max : maxIdx;

  const isFull = (curMin <= 0.5 && curMax >= maxIdx - 0.5);

  const { goalA, goalB, goalC } = getGoalIndices();
  const isGoalA = (currentGoalZoom === '1.0' || (curMin <= 0.5 && Math.abs(curMax - goalA) <= 1 && curMax < goalB - 1));
  const isGoalB = (currentGoalZoom === '0.75' || (curMin <= 0.5 && Math.abs(curMax - goalB) <= 1 && curMax < goalC - 1));
  const isGoalC = (currentGoalZoom === '0.5' || (currentGoalZoom === '0.5' && isFull));

  const isQuick = isQuickZoomActive && !isFull && !isGoalA && !isGoalB && !isGoalC;

  if (quickBtn) quickBtn.classList.toggle('active', isQuick);
  if (resetBtn) resetBtn.classList.toggle('active', isFull && !isGoalC && !currentGoalZoom);
  if (goal10Btn) goal10Btn.classList.toggle('active', isGoalA);
  if (goal075Btn) goal075Btn.classList.toggle('active', isGoalB);
  if (goal05Btn) goal05Btn.classList.toggle('active', isGoalC);
}

/**
 * Render Week selector pills (Woche 1, Woche 2, ... Woche 28)
 */
function renderWeekPills() {
  const container = document.getElementById('weekPillsContainer');
  container.innerHTML = '';

  // "Alle Wochen" pill
  const allPill = document.createElement('button');
  allPill.className = `week-pill ${currentWeekFilter === 'all' ? 'active' : ''}`;
  allPill.textContent = 'Alle Wochen (1-28)';
  allPill.addEventListener('click', () => {
    flushCurrentEdit();
    currentWeekFilter = 'all';
    try { localStorage.setItem('iwm_week_filter', 'all'); } catch(e){}
    renderWeekPills();
    renderTable();
  });
  container.appendChild(allPill);

  // Distinct weeks
  for (let w = 1; w <= 28; w++) {
    const weekName = `Woche ${w}`;
    const weekRows = appData.filter(r => r.week === weekName);
    const hasData = weekRows.some(r => r.actual !== null);

    const pill = document.createElement('button');
    pill.className = `week-pill ${currentWeekFilter === weekName ? 'active' : ''} ${hasData ? 'has-data' : ''}`;
    pill.innerHTML = `${hasData ? '● ' : ''}W${w}`;
    pill.title = weekName;
    pill.addEventListener('click', () => {
      flushCurrentEdit();
      currentWeekFilter = weekName;
      try { localStorage.setItem('iwm_week_filter', weekName); } catch(e){}
      renderWeekPills();
      renderTable();
    });
    container.appendChild(pill);
  }
}

/**
 * Update difference tags and row styling in-place without rebuilding the table DOM
 */
function updateRowDiffDisplay(tr, row) {
  if (!tr) return;
  const tdDiff1kg = tr.querySelector('.cell-diff-1kg');
  const tdDiffDay = tr.querySelector('.cell-diff-day') || (tr.children && tr.children[9]);
  const tdDiffWeek = tr.querySelector('.cell-diff-week') || (tr.children && tr.children[10]);

  if (tdDiff1kg) {
    if (row.actual !== null && row.actual !== undefined && row.diff1kg !== null && row.diff1kg !== undefined) {
      const sign = row.diff1kg > 0 ? '+' : '';
      let tagClass = 'diff-zero';
      let titleText = `Exakt im 1kg-Plan (${row.targetA ? row.targetA.toFixed(2) : ''} kg)`;
      if (row.diff1kg < 0) {
        tagClass = 'diff-loss';
        titleText = `${Math.abs(row.diff1kg).toFixed(2)} kg vor 1kg-Plan (Ist: ${row.actual.toFixed(2)} kg, Soll A: ${row.targetA.toFixed(2)} kg)`;
      } else if (row.diff1kg > 0) {
        tagClass = 'diff-gain';
        titleText = `+${row.diff1kg.toFixed(2)} kg über 1kg-Plan (Ist: ${row.actual.toFixed(2)} kg, Soll A: ${row.targetA.toFixed(2)} kg)`;
      }
      tdDiff1kg.innerHTML = `<span class="diff-tag ${tagClass}" title="${titleText}">${sign}${row.diff1kg.toFixed(2)} kg</span>`;
    } else {
      tdDiff1kg.innerHTML = `<span style="color: var(--text-dim);">-</span>`;
    }
  }

  if (tdDiffDay) {
    if (row.diffDay !== null && row.diffDay !== undefined) {
      const sign = row.diffDay > 0 ? '+' : '';
      let tagClass = 'diff-zero';
      if (row.diffDay < 0) tagClass = 'diff-loss';
      else if (row.diffDay > 0) tagClass = 'diff-gain';
      tdDiffDay.innerHTML = `<span class="diff-tag ${tagClass}">${sign}${row.diffDay.toFixed(2)} kg</span>`;
    } else {
      tdDiffDay.innerHTML = `<span style="color: var(--text-dim);">-</span>`;
    }
  }

  if (tdDiffWeek) {
    if (row.diffWeek !== null && row.diffWeek !== undefined) {
      const sign = row.diffWeek > 0 ? '+' : '';
      tdDiffWeek.innerHTML = `<span class="diff-weekly-badge">${sign}${row.diffWeek.toFixed(2)} kg</span>`;
    } else {
      tdDiffWeek.innerHTML = `<span style="color: var(--text-dim);">-</span>`;
    }
  }

  tr.classList.toggle('row-filled', row.actual !== null);
}

/**
 * Render Interactive 28-Week Table with Inline Editing
 */
function renderTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  // All-time best (lowest) recorded actual weight across all entries
  const filledActuals = appData
    .filter(r => r.actual !== null && r.actual !== undefined && !isNaN(r.actual) && Number(r.actual) > 0);
  let bestMinWeight = null;
  let bestEntry = null;
  if (filledActuals.length > 0) {
    bestMinWeight = Math.min(...filledActuals.map(r => Number(r.actual)));
    bestMinWeight = Math.round(bestMinWeight * 100) / 100;
    bestEntry = filledActuals.find(r => Math.round(Number(r.actual) * 100) / 100 === bestMinWeight);
  }

  // Update Bestwert badge in table toolbar
  const tableBestBadge = document.getElementById('tableBestWeightBadge');
  const tableBestVal = document.getElementById('tableBestWeightVal');
  if (tableBestBadge && tableBestVal) {
    if (bestMinWeight !== null && bestEntry) {
      tableBestBadge.style.display = 'inline-flex';
      tableBestVal.textContent = `${bestMinWeight.toFixed(2)} kg`;
      tableBestBadge.title = `🏆 Allzeit-Tiefstwert: ${bestMinWeight.toFixed(2)} kg (${bestEntry.date} ${bestEntry.timeOfDay} • ${bestEntry.week}) – Klicken zum Hervorheben`;
    } else {
      tableBestBadge.style.display = 'none';
    }
  }

  const searchInputEl = document.getElementById('tableSearchInput');
  const searchVal = searchInputEl ? searchInputEl.value.trim().toLowerCase() : '';

  let rowsToDisplay = appData.filter(row => {
    // Week filter
    if (currentWeekFilter !== 'all' && row.week !== currentWeekFilter) {
      return false;
    }

    // Status filter
    if (currentStatusFilter === 'filled' && row.actual === null) return false;
    if (currentStatusFilter === 'empty' && row.actual !== null) return false;
    if (currentStatusFilter === 'meals') {
      const hasMeal = row.meals && Object.values(row.meals).some(v => v === true);
      if (!hasMeal) return false;
    }
    if (currentStatusFilter === 'mobility') {
      const hasMobility = row.mobility && (row.mobility.ov || row.mobility.velo || row.mobility.home || row.mobility.away);
      if (!hasMobility) return false;
    }

    // Search query
    if (searchVal) {
      const matchDay = getGermanWeekday(row.date).toLowerCase().includes(searchVal);
      const matchDate = row.date.toLowerCase().includes(searchVal);
      const matchWeek = row.week.toLowerCase().includes(searchVal);
      const matchTime = row.timeOfDay.toLowerCase().includes(searchVal);
      if (!matchDay && !matchDate && !matchWeek && !matchTime) return false;
    }

    return true;
  });

  let currentRenderedWeek = null;

  rowsToDisplay.forEach((row) => {
    // If transitioning into a new week and not in single-row search, show a sleek week header
    if (row.week !== currentRenderedWeek && currentWeekFilter === 'all' && !searchVal) {
      currentRenderedWeek = row.week;
      const weekRows = appData.filter(r => r.week === currentRenderedWeek);
      const weekFilled = weekRows.filter(r => r.actual !== null);
      
      const dividerTr = document.createElement('tr');
      dividerTr.className = 'week-divider-row';
      
      let weekNetText = '';
      if (weekFilled.length >= 2) {
        const firstW = weekFilled[0].actual;
        const lastW = weekFilled[weekFilled.length - 1].actual;
        const diff = Math.round((lastW - firstW) * 100) / 100;
        const sign = diff > 0 ? '+' : '';
        weekNetText = ` | Wöchentliche Bilanz: <span class="${diff <= 0 ? 'diff-loss' : 'diff-gain'}">${sign}${diff.toFixed(2)} kg</span>`;
      }

      dividerTr.innerHTML = `
        <td colspan="13">
          <strong>${currentRenderedWeek}</strong> (Ziel B: ${weekRows[0].targetB.toFixed(2)} kg)${weekNetText}
        </td>
      `;
      tbody.appendChild(dividerTr);
    }

    const isBestWeight = (row.actual !== null && bestMinWeight !== null && Math.round(Number(row.actual) * 100) / 100 === bestMinWeight);

    const tr = document.createElement('tr');
    if (row.actual !== null) tr.classList.add('row-filled');
    if (isBestWeight) tr.classList.add('row-best-weight');

    // 0. Wochentag (MO, DI, MI, DO, FR, SA, SO) ganz links neben Datum
    const tdDay = document.createElement('td');
    const dayStr = getGermanWeekday(row.date);
    const isWknd = isWeekendDay(row.date);
    tdDay.innerHTML = `<span class="weekday-badge ${isWknd ? 'weekend' : ''}">${dayStr}</span>`;

    // Date
    const tdDate = document.createElement('td');
    tdDate.style.fontWeight = '600';
    tdDate.textContent = row.date;

    // Tageszeit (Schiefergrau #94a3b8 für Sonne & Mond in der Übersicht)
    const tdTime = document.createElement('td');
    const timeStr = String(row.timeOfDay || '').trim().toLowerCase();
    const isMorning = timeStr === 'morgen' || timeStr === 'morning';
    const sunIcon = `<svg class="lineart-icon icon-sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="stroke: #94a3b8 !important; color: #94a3b8 !important; display: block;"><circle cx="12" cy="12" r="4" fill="none" stroke="#94a3b8" style="stroke: #94a3b8 !important;"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    const moonIcon = `<svg class="lineart-icon icon-moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="stroke: #94a3b8 !important; color: #94a3b8 !important; display: block;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="#94a3b8" style="stroke: #94a3b8 !important;"/></svg>`;

    tdTime.innerHTML = `
      <span class="time-tag ${isMorning ? 'morning' : 'evening'}" style="color: #94a3b8 !important; background: var(--bg-elevated) !important; border: 1px solid var(--border-subtle) !important;" title="${row.timeOfDay}" aria-label="${row.timeOfDay}">
        ${isMorning ? sunIcon : moonIcon}
      </span>
    `;

    // Woche
    const tdWeek = document.createElement('td');
    tdWeek.textContent = row.week;
    tdWeek.style.color = 'var(--text-muted)';

    // Targets A (1.0 kg), B (0.75 kg), C (0.5 kg)
    const tdTargetA = document.createElement('td');
    tdTargetA.textContent = row.targetA !== null ? `${row.targetA.toFixed(2)} kg` : '-';
    tdTargetA.style.fontFamily = 'var(--font-mono)';
    tdTargetA.style.color = 'var(--color-target-a)';

    const tdTargetB = document.createElement('td');
    tdTargetB.textContent = row.targetB !== null ? `${row.targetB.toFixed(2)} kg` : '-';
    tdTargetB.style.fontFamily = 'var(--font-mono)';
    tdTargetB.style.fontWeight = '700';
    tdTargetB.style.color = 'var(--color-target-b)';

    const tdTargetC = document.createElement('td');
    tdTargetC.textContent = row.targetC !== null ? `${row.targetC.toFixed(2)} kg` : '-';
    tdTargetC.style.fontFamily = 'var(--font-mono)';
    tdTargetC.style.color = 'var(--color-target-c)';

    // Aktuelles Gewicht (Inline Editable with live instant auto-save)
    const tdActual = document.createElement('td');
    tdActual.className = 'cell-weight-editable';

    const cellWrapper = document.createElement('div');
    cellWrapper.className = 'weight-cell-wrapper';

    const inputActual = document.createElement('input');
    inputActual.type = 'number';
    inputActual.step = '0.05';
    inputActual.min = '0';
    inputActual.max = '200';
    inputActual.placeholder = '-';
    inputActual.className = `weight-input-inline ${row.actual !== null ? 'has-value' : ''} ${isBestWeight ? 'is-best-weight' : ''}`;
    inputActual.value = row.actual !== null ? row.actual : '';
    if (isBestWeight) {
      inputActual.title = `🏆 Allzeit-Tiefstwert / Bestes Gewicht: ${row.actual.toFixed(2)} kg (${row.date} ${row.timeOfDay})`;
    }
    
    // Store original index for direct access
    const originalIndex = appData.indexOf(row);
    inputActual.setAttribute('data-row-idx', originalIndex);

    // Subtle inline delete button (×) when weight exists
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'weight-inline-clear-btn';
    clearBtn.title = `Gewicht für ${row.date} (${row.timeOfDay}) löschen (0 kg)`;
    clearBtn.innerHTML = '×';
    clearBtn.tabIndex = -1;
    if (row.actual === null) {
      clearBtn.style.display = 'none';
    }

    cellWrapper.appendChild(inputActual);
    cellWrapper.appendChild(clearBtn);

    // Click on inline clear button (×) deletes weight immediately
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      row.actual = null;
      inputActual.value = '';
      inputActual.classList.remove('has-value', 'is-best-weight');
      clearBtn.style.display = 'none';
      recalculateAllFormulas();
      saveData(true);
      updateHeaderStats();
      renderGoalProgress();
      renderChart();
      renderTable();
      showToast(`Gewicht für ${row.date} (${row.timeOfDay}) gelöscht`, 'info');
    });

    // Live typing input: saves within 150ms to memory, localStorage, IndexedDB and sync server
    inputActual.addEventListener('input', (e) => {
      const newVal = e.target.value.trim();
      const parsed = parseFloat(newVal);
      if (newVal === '' || parsed === 0) {
        row.actual = null;
        inputActual.classList.remove('has-value', 'is-best-weight');
        clearBtn.style.display = 'none';
      } else if (!isNaN(parsed) && parsed > 30 && parsed < 300) {
        row.actual = Math.round(parsed * 100) / 100;
        inputActual.classList.add('has-value');
        clearBtn.style.display = 'inline-flex';
      }
      recalculateAllFormulas();
      clearTimeout(saveDebounceTimer);
      saveDebounceTimer = setTimeout(() => {
        saveData(true);
        updateHeaderStats();
        renderGoalProgress();
        updateRowDiffDisplay(tr, row);
      }, 150);
    });

    const commitAndRerender = () => {
      const newVal = inputActual.value.trim();
      const parsed = parseFloat(newVal);
      if (newVal === '' || parsed === 0 || (!isNaN(parsed) && parsed <= 0)) {
        row.actual = null;
        inputActual.value = '';
        inputActual.classList.remove('has-value', 'is-best-weight');
        clearBtn.style.display = 'none';
        recalculateAllFormulas();
        saveData(true);
        updateHeaderStats();
        renderGoalProgress();
        renderChart();
        renderTable();
        showToast(`Gewicht gelöscht (${row.date} ${row.timeOfDay})`, 'info');
        return;
      } else if (!isNaN(parsed) && parsed > 30 && parsed < 300) {
        row.actual = Math.round(parsed * 100) / 100;
        inputActual.classList.add('has-value');
      } else {
        showToast('Ungültiges Gewicht (Tipp: 0 oder leer zum Löschen)', 'warning');
        inputActual.value = row.actual !== null ? row.actual : '';
        return;
      }
      recalculateAllFormulas();
      saveData(true);
      updateHeaderStats();
      renderGoalProgress();
      renderChart();
      renderTable();
      showToast(`Gewicht gespeichert: ${row.actual} kg (${row.date} ${row.timeOfDay})`, 'success');
    };

    inputActual.addEventListener('change', commitAndRerender);

    inputActual.addEventListener('focus', () => {
      inputActual.dataset.focusVal = inputActual.value;
      inputActual.select();
    });

    inputActual.addEventListener('blur', () => {
      if (inputActual.dataset.focusVal !== inputActual.value) {
        commitAndRerender();
      }
    });

    inputActual.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        inputActual.blur();
      } else if (e.key === 'Escape') {
        inputActual.value = row.actual !== null ? row.actual : '';
        inputActual.blur();
      }
    });

    tdActual.appendChild(cellWrapper);

    // Mahlzeiten & Snacks (Ultra-kompakte Micro-Toggles: M · Sv · Mi · Sn · A)
    const tdMeals = document.createElement('td');
    tdMeals.className = 'cell-meals';

    const mealsGroup = document.createElement('div');
    mealsGroup.className = 'meal-check-group';

    const mealDefs = [
      { key: 'breakfast', code: 'M', full: 'Morgens gegessen' },
      { key: 'snackMorning', code: 'Sv', full: 'Snacks Vormittag' },
      { key: 'lunch', code: 'Mi', full: 'Mittag gegessen' },
      { key: 'snackAfternoon', code: 'Sn', full: 'Snack Nachmittag' },
      { key: 'dinner', code: 'A', full: 'Abend gegessen' },
      { key: 'snackEvening', code: 'Sa', full: 'Snack Abend' }
    ];

    mealDefs.forEach(meal => {
      const isChecked = !!(row.meals && row.meals[meal.key]);
      const label = document.createElement('label');
      label.className = `meal-mini-pill ${isChecked ? 'checked' : ''}`;
      label.title = `${meal.full} (${row.date}) – Klicken zum Umschalten`;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = isChecked;

      const text = document.createElement('span');
      text.textContent = meal.code;

      label.appendChild(cb);
      label.appendChild(text);

      label.setAttribute('data-date', row.date);
      label.setAttribute('data-meal', meal.key);

      const toggleMeal = (checked) => {
        // Flush any active weight text input first
        flushCurrentEdit();

        label.classList.toggle('checked', checked);
        cb.checked = checked;

        // Update all rows for this date (Morgen & Abend share daily meals)
        appData.forEach(r => {
          if (r.date === row.date) {
            if (!r.meals) r.meals = {};
            r.meals[meal.key] = checked;
          }
        });

        // Sync other rendered DOM chips for this date if present
        document.querySelectorAll(`.meal-mini-pill[data-date="${row.date}"][data-meal="${meal.key}"]`).forEach(otherLabel => {
          otherLabel.classList.toggle('checked', checked);
          const otherCb = otherLabel.querySelector('input');
          if (otherCb) otherCb.checked = checked;
        });

        saveData(true);
        if (typeof updateAvgStatsBar === 'function') updateAvgStatsBar();
        showToast(`${meal.full}: ${checked ? '✓ Erfasst' : 'Abgewählt'} (${row.date})`, 'info');
      };

      label.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMeal(!cb.checked);
      });

      cb.addEventListener('change', (e) => {
        toggleMeal(e.target.checked);
      });

      mealsGroup.appendChild(label);
    });

    tdMeals.appendChild(mealsGroup);

    // Mobilität / Arbeitsweg (Ultra-kompakte Micro-Toggles: ÖV · V)
    const tdMobility = document.createElement('td');
    tdMobility.className = 'cell-mobility';

    const mobilityGroup = document.createElement('div');
    mobilityGroup.className = 'meal-check-group mobility-check-group';

    const mobilityDefs = [
      { key: 'ov', code: 'ÖV', full: 'Öffentlicher Verkehr (ÖV)' },
      { key: 'velo', code: 'V', full: 'Velo / Fahrrad (V)' },
      { key: 'home', code: 'H', full: 'Zu Hause / Homeoffice (H)' },
      { key: 'away', code: 'A', full: 'Auswärts (A)' }
    ];

    mobilityDefs.forEach(mob => {
      const isChecked = !!(row.mobility && row.mobility[mob.key]);
      const label = document.createElement('label');
      label.className = `meal-mini-pill mobility-mini-pill pill-${mob.key} ${isChecked ? 'checked' : ''}`;
      label.title = `${mob.full} (${row.date} ${row.timeOfDay}) – Klicken zum Umschalten`;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = isChecked;

      const text = document.createElement('span');
      text.textContent = mob.code;

      label.appendChild(cb);
      label.appendChild(text);

      label.setAttribute('data-date', row.date);
      label.setAttribute('data-time', row.timeOfDay);
      label.setAttribute('data-mobility', mob.key);

      const toggleMobility = (checked) => {
        flushCurrentEdit();

        label.classList.toggle('checked', checked);
        cb.checked = checked;

        // Update mobility strictly for this specific row (Morgen / Abend separate)
        if (!row.mobility) row.mobility = {};
        row.mobility[mob.key] = checked;

        saveData(true);
        if (typeof updateAvgStatsBar === 'function') updateAvgStatsBar();
        showToast(`${mob.full}: ${checked ? '✓ Aktiviert' : 'Abgewählt'} (${row.date} ${row.timeOfDay})`, 'info');
      };

      label.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobility(!cb.checked);
      });

      cb.addEventListener('change', (e) => {
        toggleMobility(e.target.checked);
      });

      mobilityGroup.appendChild(label);
    });

    tdMobility.appendChild(mobilityGroup);

    // Differenz zum 1kg-Schritt (Ziel A: 1.0 kg/Woche)
    const tdDiff1kg = document.createElement('td');
    tdDiff1kg.className = 'cell-diff-1kg';
    if (row.actual !== null && row.actual !== undefined && row.diff1kg !== null && row.diff1kg !== undefined) {
      const sign = row.diff1kg > 0 ? '+' : '';
      let tagClass = 'diff-zero';
      let titleText = `Exakt im 1kg-Plan (${row.targetA ? row.targetA.toFixed(2) : ''} kg)`;
      if (row.diff1kg < 0) {
        tagClass = 'diff-loss';
        titleText = `${Math.abs(row.diff1kg).toFixed(2)} kg vor 1kg-Plan (Ist: ${row.actual.toFixed(2)} kg, Soll A: ${row.targetA.toFixed(2)} kg)`;
      } else if (row.diff1kg > 0) {
        tagClass = 'diff-gain';
        titleText = `+${row.diff1kg.toFixed(2)} kg über 1kg-Plan (Ist: ${row.actual.toFixed(2)} kg, Soll A: ${row.targetA.toFixed(2)} kg)`;
      }
      tdDiff1kg.innerHTML = `<span class="diff-tag ${tagClass}" title="${titleText}">${sign}${row.diff1kg.toFixed(2)} kg</span>`;
    } else {
      tdDiff1kg.innerHTML = `<span style="color: var(--text-dim);">-</span>`;
    }

    // Differenz zum Vortag
    const tdDiffDay = document.createElement('td');
    tdDiffDay.className = 'cell-diff-day';
    if (row.diffDay !== null && row.diffDay !== undefined) {
      const sign = row.diffDay > 0 ? '+' : '';
      let tagClass = 'diff-zero';
      if (row.diffDay < 0) tagClass = 'diff-loss';
      else if (row.diffDay > 0) tagClass = 'diff-gain';

      tdDiffDay.innerHTML = `<span class="diff-tag ${tagClass}">${sign}${row.diffDay.toFixed(2)} kg</span>`;
    } else {
      tdDiffDay.innerHTML = `<span style="color: var(--text-dim);">-</span>`;
    }

    // Wöchentliche Differenz
    const tdDiffWeek = document.createElement('td');
    tdDiffWeek.className = 'cell-diff-week';
    if (row.diffWeek !== null && row.diffWeek !== undefined) {
      const sign = row.diffWeek > 0 ? '+' : '';
      tdDiffWeek.innerHTML = `<span class="diff-weekly-badge">${sign}${row.diffWeek.toFixed(2)} kg</span>`;
    } else {
      tdDiffWeek.innerHTML = `<span style="color: var(--text-dim);">-</span>`;
    }

    // Append cells: Day, Date, Time, Week, A (1.0), B (0.75), C (0.5), Actual, Diff1kg, DiffDay, DiffWeek, Meals, Mobility
    tr.appendChild(tdDay);
    tr.appendChild(tdDate);
    tr.appendChild(tdTime);
    tr.appendChild(tdWeek);
    tr.appendChild(tdTargetA);
    tr.appendChild(tdTargetB);
    tr.appendChild(tdTargetC);
    tr.appendChild(tdActual);
    tr.appendChild(tdDiff1kg);
    tr.appendChild(tdDiffDay);
    tr.appendChild(tdDiffWeek);
    tr.appendChild(tdMeals);
    tr.appendChild(tdMobility);

    tbody.appendChild(tr);
  });

  document.getElementById('tableCountNotice').textContent = `${rowsToDisplay.length} Einträge angezeigt`;
}


/**
 * Setup All Event Listeners
 */
function setupEventListeners() {
  // Theme initialization
  const savedTheme = localStorage.getItem('weight_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('weight_theme', next);
      renderChart();
    });
  }

  // Inline Schnelleingabe in KPI Card (Direkteingabe ohne Popup)
  initInlineQuickAdd();

  // Modal controls (wird nur noch bei Klick auf "+ Mahlzeiten" geöffnet)
  const modal = document.getElementById('quickAddModal');
  const closeModalBtn = document.getElementById('closeQuickAddBtn');
  const cancelModalBtn = document.getElementById('cancelQuickAddBtn');

  [closeModalBtn, cancelModalBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', () => modal?.classList.remove('open'));
  });

  // Stepper input buttons in modal
  const weightInput = document.getElementById('modalWeightInput');
  if (weightInput) {
    weightInput.addEventListener('input', updateModalWeightLbsHint);
  }
  document.querySelectorAll('.stepper-btn[data-delta]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const delta = parseFloat(e.target.getAttribute('data-delta'));
      let current = parseFloat(weightInput.value);
      if (isNaN(current) || current <= 0) current = 92.0;
      current = Math.round((current + delta) * 100) / 100;
      weightInput.value = current.toFixed(2);
      weightInput.dataset.hadWeight = 'true';
      updateModalWeightLbsHint();
    });
  });

  const stepperZeroBtn = document.getElementById('stepperZeroBtn');
  if (stepperZeroBtn) {
    stepperZeroBtn.addEventListener('click', () => {
      if (weightInput) {
        weightInput.value = '0';
        weightInput.dataset.hadWeight = 'true';
        updateModalWeightLbsHint();
        showToast('Gewicht auf 0 kg gesetzt. Klicke auf „Eintrag speichern“, um den Wert zu löschen.', 'info');
      }
    });
  }

  // Direct Inline Unit Converter (kg ⇄ lb) in Header (Direct typing, no popup)
  const inlineKg = document.getElementById('inlineConvKg');
  const inlineLb = document.getElementById('inlineConvLb');

  if (inlineKg && inlineLb) {
    inlineKg.addEventListener('input', () => {
      const val = parseFloat(inlineKg.value);
      if (!isNaN(val) && val >= 0) {
        const numLb = Math.round((val * KG_TO_LB_FACTOR) * 100) / 100;
        inlineLb.value = numLb.toFixed(2);
      } else {
        inlineLb.value = '';
      }
    });

    inlineLb.addEventListener('input', () => {
      const val = parseFloat(inlineLb.value);
      if (!isNaN(val) && val >= 0) {
        const numKg = Math.round((val / KG_TO_LB_FACTOR) * 100) / 100;
        inlineKg.value = numKg.toFixed(2);
      } else {
        inlineKg.value = '';
      }
    });
  }

  // Unit Converter Modal Open / Close (Fallback if elements present)
  const unitConvBtn = document.getElementById('unitConverterBtn');
  const toolbarConvBtn = document.getElementById('toolbarConverterBtn');
  const modalOpenConvBtn = document.getElementById('modalOpenConverterBtn');
  const convModal = document.getElementById('unitConverterModal');
  const closeConvBtn = document.getElementById('closeConverterBtn');

  if (unitConvBtn) {
    unitConvBtn.addEventListener('click', () => openUnitConverterModal());
  }
  if (toolbarConvBtn) {
    toolbarConvBtn.addEventListener('click', () => openUnitConverterModal());
  }
  if (modalOpenConvBtn) {
    modalOpenConvBtn.addEventListener('click', () => {
      const wVal = parseFloat(document.getElementById('modalWeightInput')?.value);
      openUnitConverterModal(!isNaN(wVal) && wVal > 0 ? wVal : null);
    });
  }
  if (closeConvBtn && convModal) {
    closeConvBtn.addEventListener('click', closeUnitConverterModal);
  }
  if (convModal) {
    convModal.addEventListener('click', (e) => {
      if (e.target === convModal) closeUnitConverterModal();
    });
  }

  // Unit Converter Input Listeners (Bidirectional live conversion)
  const convKgInput = document.getElementById('convKgInput');
  const convLbInput = document.getElementById('convLbInput');
  const convStoneText = document.getElementById('converterStoneText');

  if (convKgInput && convLbInput) {
    convKgInput.addEventListener('input', () => {
      const val = parseFloat(convKgInput.value);
      if (!isNaN(val) && val >= 0) {
        const numLb = Math.round((val * KG_TO_LB_FACTOR) * 100) / 100;
        convLbInput.value = numLb.toFixed(2);
        if (convStoneText) {
          const stones = Math.floor((val * KG_TO_LB_FACTOR) / 14);
          const remLb = Math.round(((val * KG_TO_LB_FACTOR) % 14) * 10) / 10;
          convStoneText.textContent = `${stones} st ${remLb} lb`;
        }
      } else {
        convLbInput.value = '';
        if (convStoneText) convStoneText.textContent = '--';
      }
    });

    convLbInput.addEventListener('input', () => {
      const val = parseFloat(convLbInput.value);
      if (!isNaN(val) && val >= 0) {
        const numKg = Math.round((val / KG_TO_LB_FACTOR) * 100) / 100;
        convKgInput.value = numKg.toFixed(2);
        if (convStoneText) {
          const stones = Math.floor(val / 14);
          const remLb = Math.round((val % 14) * 10) / 10;
          convStoneText.textContent = `${stones} st ${remLb} lb`;
        }
      } else {
        convKgInput.value = '';
        if (convStoneText) convStoneText.textContent = '--';
      }
    });
  }

  const convSwapFocusBtn = document.getElementById('convSwapFocusBtn');
  if (convSwapFocusBtn && convKgInput && convLbInput) {
    convSwapFocusBtn.addEventListener('click', () => {
      if (document.activeElement === convKgInput) {
        convLbInput.focus();
        convLbInput.select();
      } else {
        convKgInput.focus();
        convKgInput.select();
      }
    });
  }

  // Presets and Benchmark chips
  document.querySelectorAll('.conv-preset-btn, .conv-benchmark-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const kgVal = parseFloat(btn.getAttribute('data-kg'));
      if (!isNaN(kgVal)) {
        setConverterKg(kgVal);
        convKgInput?.focus();
      }
    });
  });

  // Copy values button
  const convCopyBtn = document.getElementById('convCopyBtn');
  if (convCopyBtn) {
    convCopyBtn.addEventListener('click', () => {
      const kg = convKgInput?.value || '0';
      const lb = convLbInput?.value || '0';
      const str = `${kg} kg = ${lb} lb`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(str).then(() => {
          showToast(`Kopiert: ${str}`, 'success');
        }).catch(() => {
          showToast(`Kopiert: ${str}`, 'info');
        });
      } else {
        showToast(`${str}`, 'info');
      }
    });
  }

  // Apply to Quick Add button
  const convApplyBtn = document.getElementById('convApplyToQuickAddBtn');
  if (convApplyBtn) {
    convApplyBtn.addEventListener('click', () => {
      const kgVal = parseFloat(convKgInput?.value);
      if (!isNaN(kgVal) && kgVal > 0) {
        closeUnitConverterModal();
        const inlineInput = document.getElementById('inlineQuickWeightInput');
        if (inlineInput) {
          inlineInput.value = kgVal.toFixed(2);
          inlineInput.focus();
          inlineInput.select();
        }
        showToast(`${kgVal.toFixed(2)} kg in Schnelleingabe übernommen!`, 'success');
      } else {
        showToast('Bitte zuerst ein gültiges Gewicht eingeben!', 'warning');
      }
    });
  }

  // Escape key closes converter modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const convM = document.getElementById('unitConverterModal');
      if (convM && convM.classList.contains('open')) {
        closeUnitConverterModal();
      }
    }
  });

  // Modal Save
  const saveQuickAddBtn = document.getElementById('saveQuickAddBtn');
  if (saveQuickAddBtn) {
    saveQuickAddBtn.addEventListener('click', handleQuickAddSave);
  }

  // Table Search Input
  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      flushCurrentEdit();
      renderTable();
    });
  }

  // Status Filter Select
  const statusFilter = document.getElementById('tableStatusFilter');
  if (statusFilter) {
    try {
      const savedStatus = localStorage.getItem('iwm_status_filter');
      if (savedStatus) {
        currentStatusFilter = savedStatus;
        statusFilter.value = savedStatus;
      }
    } catch(e){}

    statusFilter.addEventListener('change', (e) => {
      flushCurrentEdit();
      currentStatusFilter = e.target.value;
      try { localStorage.setItem('iwm_status_filter', currentStatusFilter); } catch(e){}
      renderTable();
    });
  }

  // Click on Bestwert badge in table header to scroll to the best weight row
  const tableBestBadge = document.getElementById('tableBestWeightBadge');
  if (tableBestBadge) {
    tableBestBadge.addEventListener('click', () => {
      const filled = appData.filter(r => r.actual !== null && r.actual !== undefined && !isNaN(r.actual) && Number(r.actual) > 0);
      if (filled.length === 0) return;
      const minW = Math.min(...filled.map(r => Number(r.actual)));
      const minRounded = Math.round(minW * 100) / 100;
      const minEntry = filled.find(r => Math.round(Number(r.actual) * 100) / 100 === minRounded);
      if (minEntry) {
        if (currentWeekFilter !== 'all' && currentWeekFilter !== minEntry.week) {
          currentWeekFilter = 'all';
          try { localStorage.setItem('iwm_week_filter', 'all'); } catch(e){}
          renderWeekPills();
          renderTable();
        }
        setTimeout(() => {
          const rowEl = document.querySelector('.row-best-weight');
          if (rowEl) {
            rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            rowEl.classList.add('best-row-ping');
            setTimeout(() => rowEl.classList.remove('best-row-ping'), 1600);
          }
        }, 60);
      }
    });
  }

  // Chart Time Filter Pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      currentChartTimeFilter = e.target.getAttribute('data-time');
      renderChart();
    });
  });

  // Zoom In / Zoom Out (+ / -) Buttons
  const zoomInBtn = document.getElementById('zoomInBtn');
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', zoomInChart);
  }

  const zoomOutBtn = document.getElementById('zoomOutBtn');
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', zoomOutChart);
  }

  // Quick Zoom (Eingetragene kg) & Gesamtübersicht Buttons
  const quickZoomBtn = document.getElementById('quickZoomBtn');
  if (quickZoomBtn) {
    quickZoomBtn.addEventListener('click', applyQuickZoom);
  }

  const resetZoomBtn = document.getElementById('resetZoomBtn');
  if (resetZoomBtn) {
    resetZoomBtn.addEventListener('click', resetChartZoom);
  }

  // 80 kg Goal Zoom Buttons (1.0 kg, 0.75 kg, 0.5 kg)
  const goal10Btn = document.getElementById('zoomGoal10Btn');
  if (goal10Btn) {
    goal10Btn.addEventListener('click', () => zoomTo80kg('1.0'));
  }

  const goal075Btn = document.getElementById('zoomGoal075Btn');
  if (goal075Btn) {
    goal075Btn.addEventListener('click', () => zoomTo80kg('0.75'));
  }

  const goal05Btn = document.getElementById('zoomGoal05Btn');
  if (goal05Btn) {
    goal05Btn.addEventListener('click', () => zoomTo80kg('0.5'));
  }

  // Double-click on chart canvas to toggle zoom
  const chartCanvas = document.getElementById('weightChart');
  if (chartCanvas) {
    chartCanvas.addEventListener('dblclick', () => {
      if (isQuickZoomActive) {
        resetChartZoom();
      } else {
        applyQuickZoom();
      }
    });
  }

  // Substep Mode Tabs (Alle Etappen / 0.5kg / 0.75kg)
  document.querySelectorAll('.substep-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.substep-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSubstepMode = btn.getAttribute('data-submode');
      renderProgress();
    });
  });

  // Chart Series Toggles
  document.querySelectorAll('.toggle-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const seriesKey = chip.getAttribute('data-series');
      activeSeries[seriesKey] = !activeSeries[seriesKey];
      chip.classList.toggle('active', activeSeries[seriesKey]);
      renderChart();
    });
  });

  // Reset Data to Baseline (Original Excel)
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Möchtest du wirklich auf die originalen Daten aus Weight Overview V01.xlsx zurücksetzen? Alle neu eingegebenen Werte werden überschrieben.')) {
        localStorage.removeItem(STORAGE_KEY);
        loadData();
        renderAll();
        showToast('Erfolgreich auf originale Excel-Daten zurückgesetzt!', 'info');
      }
    });
  }

  // Modal date & time change handlers to synchronize weight
  const modalDateSelect = document.getElementById('modalDateSelect');
  if (modalDateSelect) {
    modalDateSelect.addEventListener('change', () => syncModalWeight(true));
  }
  const morningRadio = document.getElementById('modalRadioMorning');
  if (morningRadio) {
    morningRadio.addEventListener('change', () => syncModalWeight(false));
  }
  const eveningRadio = document.getElementById('modalRadioEvening');
  if (eveningRadio) {
    eveningRadio.addEventListener('change', () => syncModalWeight(false));
  }

  // Modal meal & mobility checkbox & chip click handling
  ['modalCbBreakfast', 'modalCbSnackMorning', 'modalCbLunch', 'modalCbSnackAfternoon', 'modalCbDinner', 'modalCbSnackEvening', 'modalCbOv', 'modalCbVelo', 'modalCbHome', 'modalCbAway'].forEach(id => {
    const cb = document.getElementById(id);
    if (cb) {
      const chip = cb.closest('.modal-meal-chip') || cb.closest('.meal-chip');
      if (chip) {
        chip.addEventListener('click', (e) => {
          if (e.target !== cb) {
            e.preventDefault();
            cb.checked = !cb.checked;
            chip.classList.toggle('checked', cb.checked);
          }
        });
      }
      cb.addEventListener('change', (e) => {
        if (chip) chip.classList.toggle('checked', e.target.checked);
      });
    }
  });

  // Backup and Restore Buttons
  const backupJsonBtn = document.getElementById('backupJsonBtn');
  if (backupJsonBtn) {
    backupJsonBtn.addEventListener('click', exportToJson);
  }

  // Dropbox Sync / data.js Save Buttons
  const saveToDataJsBtn = document.getElementById('saveToDataJsBtn');
  if (saveToDataJsBtn) {
    saveToDataJsBtn.addEventListener('click', async () => {
      flushCurrentEdit();
      saveData(true);
      await saveToDataJs(false);
    });
  }

  const toolbarSaveDataJsBtn = document.getElementById('toolbarSaveDataJsBtn');
  if (toolbarSaveDataJsBtn) {
    toolbarSaveDataJsBtn.addEventListener('click', async () => {
      flushCurrentEdit();
      saveData(true);
      const success = await saveToDataJs(false);
      if (success) {
        toolbarSaveDataJsBtn.classList.add('btn-success');
        setTimeout(() => toolbarSaveDataJsBtn.classList.remove('btn-success'), 2000);
      }
    });
  }

  const restoreJsonBtn = document.getElementById('restoreJsonBtn');
  const restoreJsonInput = document.getElementById('restoreJsonInput');
  if (restoreJsonBtn && restoreJsonInput) {
    restoreJsonBtn.addEventListener('click', () => {
      restoreJsonInput.click();
    });
    restoreJsonInput.addEventListener('change', handleRestoreJson);
  }

  // Export to CSV
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportToCSV);
  }

  // Export to Excel (.xlsx via SheetJS)
  const exportXlsxBtn = document.getElementById('exportXlsxBtn');
  if (exportXlsxBtn) {
    exportXlsxBtn.addEventListener('click', exportToExcel);
  }
}

/**
 * Populate the date select dropdown with all dates from the 28-week plan
 */
function populateModalDateSelect() {
  const dateSelect = document.getElementById('modalDateSelect');
  if (!dateSelect) return;

  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const todayStr = `${d}.${m}.${y}`;

  const uniqueDates = [...new Set(appData.map(r => r.date))];

  dateSelect.innerHTML = '';
  uniqueDates.forEach(date => {
    const opt = document.createElement('option');
    opt.value = date;
    let label = date;
    if (date === todayStr) {
      label += ' ★ (Heute)';
    }
    const sampleRow = appData.find(r => r.date === date);
    if (sampleRow) {
      label += ` [${sampleRow.week}]`;
    }
    opt.textContent = label;
    dateSelect.appendChild(opt);
  });
}

/**
 * Synchronize weight input in modal with existing recorded value for selected slot
 * @param {boolean} syncMeals Whether to also reload meal checkboxes (true on date change or open)
 */
/**
 * Update live lbs subtitle hint in quickAddModal
 */
function updateModalWeightLbsHint() {
  const weightInput = document.getElementById('modalWeightInput');
  const hintEl = document.getElementById('modalWeightLbsHint');
  const valEl = document.getElementById('modalWeightLbsVal');
  if (!weightInput || !hintEl || !valEl) return;
  const val = parseFloat(weightInput.value);
  if (!isNaN(val) && val > 0) {
    const lbs = (val * KG_TO_LB_FACTOR).toFixed(2);
    valEl.textContent = lbs;
    hintEl.style.display = 'inline-block';
  } else {
    hintEl.style.display = 'none';
  }
}

function syncModalWeight(syncMeals = true) {
  const dateSelect = document.getElementById('modalDateSelect');
  const morningRadio = document.getElementById('modalRadioMorning');
  const weightInput = document.getElementById('modalWeightInput');
  if (!dateSelect || !morningRadio || !weightInput) return;

  const selectedDate = dateSelect.value;
  const isMorning = morningRadio.checked;
  const timeVal = isMorning ? 'Morgen' : 'Abend';

  const existingRow = appData.find(r => r.date === selectedDate && r.timeOfDay === timeVal);
  if (existingRow && existingRow.actual !== null && existingRow.actual !== undefined) {
    weightInput.value = existingRow.actual.toFixed(2);
    weightInput.dataset.hadWeight = 'true';
  } else {
    // Leave empty so user is not forced or tricked into saving a fake weight
    weightInput.dataset.hadWeight = 'false';
    const filled = appData.filter(r => r.actual !== null && r.actual !== undefined);
    const lastFilled = filled.length > 0 ? filled[filled.length - 1] : null;
    weightInput.placeholder = lastFilled ? `${lastFilled.actual.toFixed(2)} (Vorschlag, 0 = löschen)` : `${START_WEIGHT.toFixed(2)} (0 = löschen)`;
    weightInput.value = '';
  }
  updateModalWeightLbsHint();

  // Only sync modal meal checkboxes if syncMeals is true (e.g. on opening modal or on date change)
  if (syncMeals) {
    const dateRows = appData.filter(r => r.date === selectedDate);
    const existingMeals = (dateRows.find(r => r.meals && Object.values(r.meals).some(Boolean)) || dateRows[0] || {}).meals || {};
    const mealMappings = [
      { id: 'modalCbBreakfast', chip: 'modalChipBreakfast', key: 'breakfast' },
      { id: 'modalCbSnackMorning', chip: 'modalChipSnackMorning', key: 'snackMorning' },
      { id: 'modalCbLunch', chip: 'modalChipLunch', key: 'lunch' },
      { id: 'modalCbSnackAfternoon', chip: 'modalChipSnackAfternoon', key: 'snackAfternoon' },
      { id: 'modalCbDinner', chip: 'modalChipDinner', key: 'dinner' },
      { id: 'modalCbSnackEvening', chip: 'modalChipSnackEvening', key: 'snackEvening' }
    ];

    mealMappings.forEach(m => {
      const cb = document.getElementById(m.id);
      const chip = document.getElementById(m.chip);
      const checked = !!existingMeals[m.key];
      if (cb) cb.checked = checked;
      if (chip) chip.classList.toggle('checked', checked);
    });
  }

  // Always sync modal mobility checkboxes for this specific slot (Morgen/Abend separate)
  const existingMobility = (existingRow && existingRow.mobility) ? existingRow.mobility : {};
  const mobMappings = [
    { id: 'modalCbOv', chip: 'modalChipOv', key: 'ov' },
    { id: 'modalCbVelo', chip: 'modalChipVelo', key: 'velo' },
    { id: 'modalCbHome', chip: 'modalChipHome', key: 'home' },
    { id: 'modalCbAway', chip: 'modalChipAway', key: 'away' }
  ];
  mobMappings.forEach(m => {
    const cb = document.getElementById(m.id);
    const chip = document.getElementById(m.chip);
    const checked = !!existingMobility[m.key];
    if (cb) cb.checked = checked;
    if (chip) chip.classList.toggle('checked', checked);
  });
}

/**
 * Open Quick Add Modal with intelligently selected today's slot
 */
function openQuickAddModal() {
  const modal = document.getElementById('quickAddModal');
  const dateSelect = document.getElementById('modalDateSelect');
  const morningRadio = document.getElementById('modalRadioMorning');
  const eveningRadio = document.getElementById('modalRadioEvening');

  populateModalDateSelect();

  // Determine current real-world date
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const todayStr = `${d}.${m}.${y}`;

  // Check if today exists in the plan
  const todayExists = appData.some(r => r.date === todayStr);
  const targetDate = todayExists ? todayStr : (appData.find(r => r.actual === null)?.date || appData[0].date);

  dateSelect.value = targetDate;

  // Determine time of day based on current hour & slot availability
  const isEvening = now.getHours() >= 14;
  const morningRow = appData.find(r => r.date === targetDate && r.timeOfDay === 'Morgen');
  const eveningRow = appData.find(r => r.date === targetDate && r.timeOfDay === 'Abend');

  if (isEvening && (!eveningRow || eveningRow.actual === null)) {
    eveningRadio.checked = true;
  } else if (!isEvening && (!morningRow || morningRow.actual === null)) {
    morningRadio.checked = true;
  } else if (eveningRow && eveningRow.actual === null) {
    eveningRadio.checked = true;
  } else {
    morningRadio.checked = true;
  }

  // Pre-fill weight and meals
  syncModalWeight(true);

  modal.classList.add('open');
}

/**
 * Handle Save in Quick Add Modal
 */
function handleQuickAddSave() {
  const dateSelect = document.getElementById('modalDateSelect');
  const dateVal = dateSelect.value.trim();
  const isMorning = document.getElementById('modalRadioMorning').checked;
  const timeVal = isMorning ? 'Morgen' : 'Abend';
  const weightInput = document.getElementById('modalWeightInput');
  const weightStr = weightInput.value.trim();

  // Find matching row in appData
  let targetRow = appData.find(r => r.date === dateVal && r.timeOfDay === timeVal);
  if (!targetRow) {
    showToast('Datum im 28-Wochen-Plan nicht gefunden', 'warning');
    return;
  }

  let weightUpdated = false;
  let weightWasDeleted = false;

  if (weightStr !== '') {
    const weightVal = parseFloat(weightStr);
    // 0 or 0.0 or <= 0: Delete / clear entry!
    if (!isNaN(weightVal) && weightVal <= 0) {
      targetRow.actual = null;
      weightUpdated = true;
      weightWasDeleted = true;
    } else if (isNaN(weightVal) || weightVal < 30 || weightVal > 300) {
      showToast('Bitte ein realistisches Gewicht eingeben (oder 0 zum Löschen)!', 'danger');
      return;
    } else {
      targetRow.actual = Math.round(weightVal * 100) / 100;
      weightUpdated = true;
    }
  } else {
    // If input was deliberately cleared for an existing entry:
    if (weightInput.dataset.hadWeight === 'true') {
      targetRow.actual = null;
      weightUpdated = true;
      weightWasDeleted = true;
    }
  }

  // Save meals to targetRow and sync across all rows of that date
  const newMeals = {
    breakfast: !!document.getElementById('modalCbBreakfast')?.checked,
    snackMorning: !!document.getElementById('modalCbSnackMorning')?.checked,
    lunch: !!document.getElementById('modalCbLunch')?.checked,
    snackAfternoon: !!document.getElementById('modalCbSnackAfternoon')?.checked,
    dinner: !!document.getElementById('modalCbDinner')?.checked,
    snackEvening: !!document.getElementById('modalCbSnackEvening')?.checked
  };

  appData.forEach(r => {
    if (r.date === dateVal) {
      r.meals = { ...newMeals };
    }
  });

  // Save mobility specifically to this slot (Morgen / Abend separate)
  if (!targetRow.mobility) targetRow.mobility = {};
  targetRow.mobility.ov = !!document.getElementById('modalCbOv')?.checked;
  targetRow.mobility.velo = !!document.getElementById('modalCbVelo')?.checked;
  targetRow.mobility.home = !!document.getElementById('modalCbHome')?.checked;
  targetRow.mobility.away = !!document.getElementById('modalCbAway')?.checked;

  recalculateAllFormulas();
  saveData(true);
  renderAll();
  document.getElementById('quickAddModal').classList.remove('open');

  const mealCount = Object.values(newMeals).filter(Boolean).length;
  const mobList = [];
  if (targetRow.mobility.ov) mobList.push('ÖV');
  if (targetRow.mobility.velo) mobList.push('Velo');
  if (targetRow.mobility.home) mobList.push('Zu Hause (H)');
  if (targetRow.mobility.away) mobList.push('Auswärts (A)');
  const mobText = mobList.length > 0 ? ` [${mobList.join(' + ')}]` : '';

  if (weightWasDeleted) {
    showToast(`✓ Gewicht für ${targetRow.date} (${targetRow.timeOfDay}) gelöscht (0 kg)${mobText}`, 'info');
  } else if (weightUpdated && mealCount > 0) {
    showToast(`✓ Gewicht (${targetRow.actual} kg), ${mealCount} Mahlz.${mobText} am ${targetRow.date} gesichert`, 'success');
  } else if (weightUpdated) {
    showToast(`✓ Gewicht ${targetRow.actual} kg${mobText} am ${targetRow.date} (${targetRow.timeOfDay}) gesichert`, 'success');
  } else {
    showToast(`✓ Eintrag für ${dateVal} (${targetRow.timeOfDay})${mobText} gesichert`, 'success');
  }
}

/**
 * ==============================================================================
 * Weight Unit Converter (kg ⇄ lb) Controller
 * ==============================================================================
 */

function openUnitConverterModal(initialKg = null) {
  const modal = document.getElementById('unitConverterModal');
  const kgInput = document.getElementById('convKgInput');
  const lbInput = document.getElementById('convLbInput');
  if (!modal || !kgInput || !lbInput) return;

  // Find latest recorded weight or fallback to 92.00
  const filled = appData.filter(r => r.actual !== null && r.actual !== undefined && !isNaN(r.actual));
  const latestWeight = filled.length > 0 ? filled[filled.length - 1].actual : 92.0;

  // Update current weight preset button label
  const presetCurrentVal = document.getElementById('convPresetCurrentVal');
  const presetCurrentBtn = document.getElementById('convPresetCurrentBtn');
  if (presetCurrentVal) presetCurrentVal.textContent = `${latestWeight.toFixed(2)} kg`;
  if (presetCurrentBtn) presetCurrentBtn.setAttribute('data-kg', latestWeight);

  // Set initial value
  let kgVal = initialKg !== null && !isNaN(initialKg) && initialKg > 0 ? initialKg : latestWeight;
  setConverterKg(kgVal);

  modal.classList.add('open');
  setTimeout(() => kgInput.focus(), 80);
}

function closeUnitConverterModal() {
  const modal = document.getElementById('unitConverterModal');
  if (modal) modal.classList.remove('open');
}

function setConverterKg(kg) {
  const kgInput = document.getElementById('convKgInput');
  const lbInput = document.getElementById('convLbInput');
  const stoneText = document.getElementById('converterStoneText');
  if (!kgInput || !lbInput) return;

  if (kg === null || kg === undefined || isNaN(kg) || kg <= 0) {
    kgInput.value = '';
    lbInput.value = '';
    if (stoneText) stoneText.textContent = '--';
    return;
  }

  const numKg = Math.round(Number(kg) * 100) / 100;
  const numLb = Math.round((numKg * KG_TO_LB_FACTOR) * 100) / 100;
  kgInput.value = numKg.toFixed(2);
  lbInput.value = numLb.toFixed(2);

  if (stoneText) {
    const totalLb = numKg * KG_TO_LB_FACTOR;
    const stones = Math.floor(totalLb / 14);
    const remLb = Math.round((totalLb % 14) * 10) / 10;
    stoneText.textContent = `${stones} st ${remLb} lb`;
  }
}

function setConverterLb(lb) {
  const kgInput = document.getElementById('convKgInput');
  const lbInput = document.getElementById('convLbInput');
  const stoneText = document.getElementById('converterStoneText');
  if (!kgInput || !lbInput) return;

  if (lb === null || lb === undefined || isNaN(lb) || lb <= 0) {
    kgInput.value = '';
    lbInput.value = '';
    if (stoneText) stoneText.textContent = '--';
    return;
  }

  const numLb = Math.round(Number(lb) * 100) / 100;
  const numKg = Math.round((numLb / KG_TO_LB_FACTOR) * 100) / 100;
  kgInput.value = numKg.toFixed(2);
  lbInput.value = numLb.toFixed(2);

  if (stoneText) {
    const stones = Math.floor(numLb / 14);
    const remLb = Math.round((numLb % 14) * 10) / 10;
    stoneText.textContent = `${stones} st ${remLb} lb`;
  }
}

/**
 * Export full state as JSON backup file
 */
function exportToJson() {
  const jsonStr = JSON.stringify(appData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Weight_Overview_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Sicherungsdatei (.json) erfolgreich heruntergeladen!', 'success');
}

/**
 * Import and restore state from JSON backup file
 */
function handleRestoreJson(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data) && data.length > 0 && data[0].week) {
        appData = data;
        recalculateAllFormulas();
        saveData(true);
        renderAll();
        showToast('Sicherung erfolgreich wiederhergestellt!', 'success');
      } else {
        showToast('Ungültiges Sicherungsformat', 'danger');
      }
    } catch (err) {
      showToast('Fehler beim Lesen der Sicherungsdatei', 'danger');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

/**
 * Toast Notification Utility
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast badge-${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Export current data to CSV
 */
function exportToCSV() {
  const headers = ['Tag', 'Datum', 'Tageszeit', 'Woche', 'A (1.0 kg)', 'B (0.75 kg)', 'C (0.5 kg)', 'Aktuelles Gewicht', 'Diff. 1kg Schritt', 'Morgens gegessen', 'Snacks Vormittag', 'Mittag gegessen', 'Snack Nachmittag', 'Abend gegessen', 'Snack Abend', 'ÖV', 'Velo', 'Zu Hause (H)', 'Auswärts (A)', 'Differenz zum Vortag', 'Wöchentliche Differenz'];
  
  const csvRows = [headers.join(';')];
  appData.forEach(r => {
    const row = [
      getGermanWeekday(r.date),
      r.date,
      r.timeOfDay,
      r.week,
      r.targetA !== null ? r.targetA : '',
      r.targetB !== null ? r.targetB : '',
      r.targetC !== null ? r.targetC : '',
      r.actual !== null ? r.actual : '',
      r.diff1kg !== null ? r.diff1kg : '',
      r.meals && r.meals.breakfast ? 'Ja' : 'Nein',
      r.meals && r.meals.snackMorning ? 'Ja' : 'Nein',
      r.meals && r.meals.lunch ? 'Ja' : 'Nein',
      r.meals && r.meals.snackAfternoon ? 'Ja' : 'Nein',
      r.meals && r.meals.dinner ? 'Ja' : 'Nein',
      r.meals && r.meals.snackEvening ? 'Ja' : 'Nein',
      r.mobility && r.mobility.ov ? 'Ja' : 'Nein',
      r.mobility && r.mobility.velo ? 'Ja' : 'Nein',
      r.mobility && r.mobility.home ? 'Ja' : 'Nein',
      r.mobility && r.mobility.away ? 'Ja' : 'Nein',
      r.diffDay !== null ? r.diffDay : '',
      r.diffWeek !== null ? r.diffWeek : ''
    ];
    csvRows.push(row.join(';'));
  });

  const blob = new Blob(['\ufeff' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Weight_Overview_Export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV erfolgreich exportiert!', 'success');
}

/**
 * Export to Excel (.xlsx) using SheetJS
 */
function exportToExcel() {
  if (typeof XLSX === 'undefined') {
    exportToCSV();
    return;
  }

  const dataForSheet = appData.map(r => ({
    'Datum': r.date,
    'Tageszeit': r.timeOfDay,
    'Woche': r.week,
    'A (1.0 kg)': r.targetA,
    'B (0.75 kg)': r.targetB,
    'C (0.5 kg)': r.targetC,
    'Aktuelles Gewicht': r.actual,
    'Diff. 1kg Schritt': r.diff1kg !== null ? r.diff1kg : '',
    'Morgens gegessen': r.meals && r.meals.breakfast ? 'Ja' : 'Nein',
    'Snacks Vormittag': r.meals && r.meals.snackMorning ? 'Ja' : 'Nein',
    'Mittag gegessen': r.meals && r.meals.lunch ? 'Ja' : 'Nein',
    'Snack Nachmittag': r.meals && r.meals.snackAfternoon ? 'Ja' : 'Nein',
    'Abend gegessen': r.meals && r.meals.dinner ? 'Ja' : 'Nein',
    'Snack Abend': r.meals && r.meals.snackEvening ? 'Ja' : 'Nein',
    'ÖV': r.mobility && r.mobility.ov ? 'Ja' : 'Nein',
    'Velo': r.mobility && r.mobility.velo ? 'Ja' : 'Nein',
    'Zu Hause (H)': r.mobility && r.mobility.home ? 'Ja' : 'Nein',
    'Auswärts (A)': r.mobility && r.mobility.away ? 'Ja' : 'Nein',
    'Differenz zum Vortag': r.diffDay,
    'Wöchentliche Differenz': r.diffWeek
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Weight Overview');

  XLSX.writeFile(workbook, `Weight_Overview_V01_Updated_${new Date().toISOString().slice(0, 10)}.xlsx`);
  showToast('Excel Datei (.xlsx) erfolgreich exportiert!', 'success');
}
