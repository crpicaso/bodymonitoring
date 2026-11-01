/**
 * Interactive Weight Monitor - Synced Database
 * Automatisch synchronisierte Gewichtsdaten fuer alle Computer (Dropbox)
 * Letzte Aktualisierung: 30.10.2026, 06:44:12
 */
const DATA_UPDATED_AT = "2026-10-30T05:44:12.672Z";
const BASELINE_WEIGHT_DATA = [
    {
        "row": 2,
        "date": "28.09.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 93.7,
        "diffDay": 0,
        "diffWeek": 0,
        "meals": {
            "lunch": true
        },
        "mobility": {
            "velo": true
        },
        "diff1kg": 0
    },
    {
        "row": 3,
        "date": "28.09.2026",
        "timeOfDay": "Abend",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 93.1,
        "diffDay": -0.6,
        "diffWeek": null,
        "meals": {
            "lunch": true
        },
        "mobility": {
            "velo": true
        },
        "diff1kg": -0.6
    },
    {
        "row": 4,
        "date": "29.09.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 92.4,
        "diffDay": -0.7,
        "diffWeek": null,
        "meals": {
            "lunch": true,
            "dinner": true
        },
        "mobility": {
            "velo": true
        },
        "diff1kg": -1.3
    },
    {
        "row": 5,
        "date": "29.09.2026",
        "timeOfDay": "Abend",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 91.25,
        "diffDay": -1.15,
        "diffWeek": null,
        "meals": {
            "lunch": true,
            "dinner": true
        },
        "mobility": {
            "velo": true
        },
        "diff1kg": -2.45
    },
    {
        "row": 6,
        "date": "30.09.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 92,
        "diffDay": 0.75,
        "diffWeek": null,
        "meals": {
            "lunch": true,
            "dinner": true
        },
        "mobility": {
            "velo": true
        },
        "diff1kg": -1.7
    },
    {
        "row": 7,
        "date": "30.09.2026",
        "timeOfDay": "Abend",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 92.3,
        "diffDay": 0.3,
        "diffWeek": null,
        "meals": {
            "lunch": true,
            "dinner": true
        },
        "mobility": {
            "velo": true
        },
        "diff1kg": -1.4
    },
    {
        "row": 8,
        "date": "01.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 91.55,
        "diffDay": -0.75,
        "diffWeek": null,
        "meals": {
            "lunch": true,
            "dinner": true
        },
        "mobility": {
            "velo": true
        },
        "diff1kg": -2.15
    },
    {
        "row": 9,
        "date": "01.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 90.9,
        "diffDay": -0.65,
        "diffWeek": null,
        "meals": {
            "lunch": true,
            "dinner": true
        },
        "mobility": {
            "velo": true
        },
        "diff1kg": -2.8
    },
    {
        "row": 10,
        "date": "02.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 91.05,
        "diffDay": 0.15,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true
        },
        "mobility": {
            "velo": true
        },
        "diff1kg": -2.65
    },
    {
        "row": 11,
        "date": "02.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 90.4,
        "diffDay": -0.65,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true
        },
        "mobility": {
            "ov": false,
            "velo": true
        },
        "diff1kg": -3.3
    },
    {
        "row": 12,
        "date": "03.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 90.15,
        "diffDay": -0.25,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": false,
            "snackEvening": false
        },
        "mobility": {
            "ov": false,
            "velo": false,
            "away": true
        },
        "diff1kg": -3.55
    },
    {
        "row": 13,
        "date": "03.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": false,
            "snackEvening": false
        },
        "mobility": {
            "away": true
        },
        "diff1kg": null
    },
    {
        "row": 14,
        "date": "04.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "away": true
        },
        "diff1kg": null
    },
    {
        "row": 15,
        "date": "04.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 1",
        "targetA": 93.7,
        "targetC": 93.7,
        "targetB": 93.7,
        "actual": 90.45,
        "diffDay": 0.3,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": false,
            "velo": false,
            "home": true
        },
        "diff1kg": -3.25
    },
    {
        "row": 16,
        "date": "05.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 91.6,
        "diffDay": 1.15,
        "diffWeek": -2.1,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": false,
            "velo": true,
            "home": false,
            "away": false
        },
        "diff1kg": -1.1
    },
    {
        "row": 17,
        "date": "05.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 91.4,
        "diffDay": -0.2,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": false,
            "velo": true,
            "home": false,
            "away": false
        },
        "diff1kg": -1.3
    },
    {
        "row": 18,
        "date": "06.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 90.95,
        "diffDay": -0.45,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": false,
            "velo": true,
            "home": false,
            "away": false
        },
        "diff1kg": -1.75
    },
    {
        "row": 19,
        "date": "06.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 90.6,
        "diffDay": -0.35,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true,
            "velo": false,
            "home": false,
            "away": false
        },
        "diff1kg": -2.1
    },
    {
        "row": 20,
        "date": "07.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 90.75,
        "diffDay": 0.15,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": false,
            "velo": false,
            "home": true,
            "away": false
        },
        "diff1kg": -1.95
    },
    {
        "row": 21,
        "date": "07.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 90.7,
        "diffDay": -0.05,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": -2
    },
    {
        "row": 22,
        "date": "08.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 89.6,
        "diffDay": -1.1,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "home": true
        },
        "diff1kg": -3.1
    },
    {
        "row": 23,
        "date": "08.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 24,
        "date": "09.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 89.6,
        "diffDay": 0,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "home": true
        },
        "diff1kg": -3.1
    },
    {
        "row": 25,
        "date": "09.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 90.2,
        "diffDay": 0.6,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "home": true
        },
        "diff1kg": -2.5
    },
    {
        "row": 26,
        "date": "10.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 90.3,
        "diffDay": 0.1,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": false,
            "velo": false,
            "home": true,
            "away": false
        },
        "diff1kg": -2.4
    },
    {
        "row": 27,
        "date": "10.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 28,
        "date": "11.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": 91.2,
        "diffDay": 0.9,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": false,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": -1.5
    },
    {
        "row": 29,
        "date": "11.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 2",
        "targetA": 92.7,
        "targetC": 93.2,
        "targetB": 92.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": false,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 30,
        "date": "12.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": 89.8,
        "diffDay": -1.4,
        "diffWeek": -1.8,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": -1.9
    },
    {
        "row": 31,
        "date": "12.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": 90.25,
        "diffDay": 0.45,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": -1.45
    },
    {
        "row": 32,
        "date": "13.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": 90.25,
        "diffDay": 0,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": false,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": -1.45
    },
    {
        "row": 33,
        "date": "13.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": false,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 34,
        "date": "14.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": 90.5,
        "diffDay": 0.25,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": -1.2
    },
    {
        "row": 35,
        "date": "14.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 36,
        "date": "15.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": 90.6,
        "diffDay": 0.1,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -1.1
    },
    {
        "row": 37,
        "date": "15.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": null
    },
    {
        "row": 38,
        "date": "16.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": 90.55,
        "diffDay": -0.05,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -1.15
    },
    {
        "row": 39,
        "date": "16.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": 90.4,
        "diffDay": -0.15,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -1.3
    },
    {
        "row": 40,
        "date": "17.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": 89.9,
        "diffDay": -0.5,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -1.8
    },
    {
        "row": 41,
        "date": "17.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 42,
        "date": "18.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": true,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 43,
        "date": "18.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 3",
        "targetA": 91.7,
        "targetC": 92.7,
        "targetB": 92.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": true,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "away": true
        },
        "diff1kg": null
    },
    {
        "row": 44,
        "date": "19.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": 90.05,
        "diffDay": 0.15,
        "diffWeek": 0.25,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -0.65
    },
    {
        "row": 45,
        "date": "19.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": 90.6,
        "diffDay": 0.55,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -0.1
    },
    {
        "row": 46,
        "date": "20.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": 90.3,
        "diffDay": -0.3,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -0.4
    },
    {
        "row": 47,
        "date": "20.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": null
    },
    {
        "row": 48,
        "date": "21.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": 90.55,
        "diffDay": 0.25,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -0.15
    },
    {
        "row": 49,
        "date": "21.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": 90.5,
        "diffDay": -0.05,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -0.2
    },
    {
        "row": 50,
        "date": "22.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": 89.95,
        "diffDay": -0.55,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -0.75
    },
    {
        "row": 51,
        "date": "22.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": 89.55,
        "diffDay": -0.4,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": false,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": -1.15
    },
    {
        "row": 52,
        "date": "23.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": 89.7,
        "diffDay": 0.15,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "away": true
        },
        "diff1kg": -1
    },
    {
        "row": 53,
        "date": "23.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 54,
        "date": "24.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 55,
        "date": "24.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": true,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "away": true
        },
        "diff1kg": null
    },
    {
        "row": 56,
        "date": "25.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 57,
        "date": "25.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 4",
        "targetA": 90.7,
        "targetC": 92.2,
        "targetB": 91.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": true,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "home": true
        },
        "diff1kg": null
    },
    {
        "row": 58,
        "date": "26.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": 90.3,
        "diffDay": 0.6,
        "diffWeek": 0.25,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": 0.6
    },
    {
        "row": 59,
        "date": "26.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": 90.9,
        "diffDay": 0.6,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": 1.2
    },
    {
        "row": 60,
        "date": "27.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": 90.9,
        "diffDay": 0,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": 1.2
    },
    {
        "row": 61,
        "date": "27.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": 90.15,
        "diffDay": -0.75,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": false
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": 0.45
    },
    {
        "row": 62,
        "date": "28.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": 90.2,
        "diffDay": 0.05,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": 0.5
    },
    {
        "row": 63,
        "date": "28.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": 90.2,
        "diffDay": 0,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": 0.5
    },
    {
        "row": 64,
        "date": "29.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": 90.1,
        "diffDay": -0.1,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": 0.4
    },
    {
        "row": 65,
        "date": "29.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": true,
            "snackAfternoon": true,
            "dinner": true,
            "snackEvening": true
        },
        "mobility": {
            "ov": true
        },
        "diff1kg": null
    },
    {
        "row": 66,
        "date": "30.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": 89.7,
        "diffDay": -0.4,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": 0,
        "mobility": {
            "ov": true
        }
    },
    {
        "row": 67,
        "date": "30.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 68,
        "date": "31.10.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 69,
        "date": "31.10.2026",
        "timeOfDay": "Abend",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 70,
        "date": "01.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 71,
        "date": "01.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 5",
        "targetA": 89.7,
        "targetC": 91.7,
        "targetB": 90.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 72,
        "date": "02.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 73,
        "date": "02.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 74,
        "date": "03.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 75,
        "date": "03.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 76,
        "date": "04.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 77,
        "date": "04.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 78,
        "date": "05.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 79,
        "date": "05.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 80,
        "date": "06.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 81,
        "date": "06.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 82,
        "date": "07.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 83,
        "date": "07.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 84,
        "date": "08.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 85,
        "date": "08.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 6",
        "targetA": 88.7,
        "targetC": 91.2,
        "targetB": 89.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 86,
        "date": "09.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 87,
        "date": "09.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 88,
        "date": "10.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 89,
        "date": "10.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 90,
        "date": "11.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 91,
        "date": "11.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 92,
        "date": "12.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 93,
        "date": "12.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 94,
        "date": "13.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 95,
        "date": "13.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 96,
        "date": "14.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 97,
        "date": "14.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 98,
        "date": "15.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 99,
        "date": "15.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 7",
        "targetA": 87.7,
        "targetC": 90.7,
        "targetB": 89.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 100,
        "date": "16.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 101,
        "date": "16.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 102,
        "date": "17.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 103,
        "date": "17.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 104,
        "date": "18.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 105,
        "date": "18.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 106,
        "date": "19.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 107,
        "date": "19.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 108,
        "date": "20.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 109,
        "date": "20.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 110,
        "date": "21.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 111,
        "date": "21.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 112,
        "date": "22.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 113,
        "date": "22.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 8",
        "targetA": 86.7,
        "targetC": 90.2,
        "targetB": 88.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 114,
        "date": "23.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 115,
        "date": "23.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 116,
        "date": "24.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 117,
        "date": "24.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 118,
        "date": "25.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 119,
        "date": "25.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 120,
        "date": "26.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 121,
        "date": "26.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 122,
        "date": "27.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 123,
        "date": "27.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 124,
        "date": "28.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 125,
        "date": "28.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 126,
        "date": "29.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 127,
        "date": "29.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 9",
        "targetA": 85.7,
        "targetC": 89.7,
        "targetB": 87.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 128,
        "date": "30.11.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 129,
        "date": "30.11.2026",
        "timeOfDay": "Abend",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 130,
        "date": "01.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 131,
        "date": "01.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 132,
        "date": "02.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 133,
        "date": "02.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 134,
        "date": "03.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 135,
        "date": "03.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 136,
        "date": "04.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 137,
        "date": "04.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 138,
        "date": "05.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 139,
        "date": "05.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 140,
        "date": "06.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 141,
        "date": "06.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 10",
        "targetA": 84.7,
        "targetC": 89.2,
        "targetB": 86.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 142,
        "date": "07.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 143,
        "date": "07.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 144,
        "date": "08.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 145,
        "date": "08.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 146,
        "date": "09.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 147,
        "date": "09.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 148,
        "date": "10.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 149,
        "date": "10.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 150,
        "date": "11.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 151,
        "date": "11.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 152,
        "date": "12.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 153,
        "date": "12.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 154,
        "date": "13.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 155,
        "date": "13.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 11",
        "targetA": 83.7,
        "targetC": 88.7,
        "targetB": 86.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 156,
        "date": "14.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 157,
        "date": "14.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 158,
        "date": "15.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 159,
        "date": "15.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 160,
        "date": "16.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 161,
        "date": "16.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 162,
        "date": "17.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 163,
        "date": "17.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 164,
        "date": "18.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 165,
        "date": "18.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 166,
        "date": "19.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 167,
        "date": "19.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 168,
        "date": "20.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 169,
        "date": "20.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 12",
        "targetA": 82.7,
        "targetC": 88.2,
        "targetB": 85.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 170,
        "date": "21.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 171,
        "date": "21.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 172,
        "date": "22.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 173,
        "date": "22.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 174,
        "date": "23.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 175,
        "date": "23.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 176,
        "date": "24.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 177,
        "date": "24.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 178,
        "date": "25.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 179,
        "date": "25.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 180,
        "date": "26.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 181,
        "date": "26.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 182,
        "date": "27.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 183,
        "date": "27.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 13",
        "targetA": 81.7,
        "targetC": 87.7,
        "targetB": 84.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 184,
        "date": "28.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 185,
        "date": "28.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 186,
        "date": "29.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 187,
        "date": "29.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 188,
        "date": "30.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 189,
        "date": "30.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 190,
        "date": "31.12.2026",
        "timeOfDay": "Morgen",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 191,
        "date": "31.12.2026",
        "timeOfDay": "Abend",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 192,
        "date": "01.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 193,
        "date": "01.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 194,
        "date": "02.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 195,
        "date": "02.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 196,
        "date": "03.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 197,
        "date": "03.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 14",
        "targetA": 80.7,
        "targetC": 87.2,
        "targetB": 83.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 198,
        "date": "04.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 199,
        "date": "04.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 200,
        "date": "05.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 201,
        "date": "05.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 202,
        "date": "06.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 203,
        "date": "06.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 204,
        "date": "07.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 205,
        "date": "07.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 206,
        "date": "08.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 207,
        "date": "08.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 208,
        "date": "09.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 209,
        "date": "09.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 210,
        "date": "10.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 211,
        "date": "10.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 15",
        "targetA": 79.7,
        "targetC": 86.7,
        "targetB": 83.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 212,
        "date": "11.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 213,
        "date": "11.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 214,
        "date": "12.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 215,
        "date": "12.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 216,
        "date": "13.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 217,
        "date": "13.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 218,
        "date": "14.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 219,
        "date": "14.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 220,
        "date": "15.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 221,
        "date": "15.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 222,
        "date": "16.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 223,
        "date": "16.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 224,
        "date": "17.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 225,
        "date": "17.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 16",
        "targetA": 78.7,
        "targetC": 86.2,
        "targetB": 82.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 226,
        "date": "18.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 227,
        "date": "18.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 228,
        "date": "19.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 229,
        "date": "19.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 230,
        "date": "20.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 231,
        "date": "20.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 232,
        "date": "21.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 233,
        "date": "21.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 234,
        "date": "22.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 235,
        "date": "22.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 236,
        "date": "23.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 237,
        "date": "23.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 238,
        "date": "24.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 239,
        "date": "24.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 17",
        "targetA": 77.7,
        "targetC": 85.7,
        "targetB": 81.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 240,
        "date": "25.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 241,
        "date": "25.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 242,
        "date": "26.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 243,
        "date": "26.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 244,
        "date": "27.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 245,
        "date": "27.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 246,
        "date": "28.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 247,
        "date": "28.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 248,
        "date": "29.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 249,
        "date": "29.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 250,
        "date": "30.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 251,
        "date": "30.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 252,
        "date": "31.01.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 253,
        "date": "31.01.2027",
        "timeOfDay": "Abend",
        "week": "Woche 18",
        "targetA": 76.7,
        "targetC": 85.2,
        "targetB": 80.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 254,
        "date": "01.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 255,
        "date": "01.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 256,
        "date": "02.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 257,
        "date": "02.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 258,
        "date": "03.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 259,
        "date": "03.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 260,
        "date": "04.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 261,
        "date": "04.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 262,
        "date": "05.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 263,
        "date": "05.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 264,
        "date": "06.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 265,
        "date": "06.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 266,
        "date": "07.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 267,
        "date": "07.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 19",
        "targetA": 75.7,
        "targetC": 84.7,
        "targetB": 80.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 268,
        "date": "08.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 269,
        "date": "08.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 270,
        "date": "09.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 271,
        "date": "09.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 272,
        "date": "10.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 273,
        "date": "10.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 274,
        "date": "11.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 275,
        "date": "11.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 276,
        "date": "12.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 277,
        "date": "12.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 278,
        "date": "13.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 279,
        "date": "13.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 280,
        "date": "14.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 281,
        "date": "14.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 20",
        "targetA": 74.7,
        "targetC": 84.2,
        "targetB": 79.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 282,
        "date": "15.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 283,
        "date": "15.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 284,
        "date": "16.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 285,
        "date": "16.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 286,
        "date": "17.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 287,
        "date": "17.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 288,
        "date": "18.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 289,
        "date": "18.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 290,
        "date": "19.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 291,
        "date": "19.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 292,
        "date": "20.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 293,
        "date": "20.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 294,
        "date": "21.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 295,
        "date": "21.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 21",
        "targetA": 73.7,
        "targetC": 83.7,
        "targetB": 78.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 296,
        "date": "22.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 297,
        "date": "22.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 298,
        "date": "23.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 299,
        "date": "23.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 300,
        "date": "24.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 301,
        "date": "24.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 302,
        "date": "25.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 303,
        "date": "25.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 304,
        "date": "26.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 305,
        "date": "26.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 306,
        "date": "27.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 307,
        "date": "27.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 308,
        "date": "28.02.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 309,
        "date": "28.02.2027",
        "timeOfDay": "Abend",
        "week": "Woche 22",
        "targetA": 72.7,
        "targetC": 83.2,
        "targetB": 77.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 310,
        "date": "01.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 311,
        "date": "01.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 312,
        "date": "02.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 313,
        "date": "02.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 314,
        "date": "03.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 315,
        "date": "03.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 316,
        "date": "04.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 317,
        "date": "04.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 318,
        "date": "05.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 319,
        "date": "05.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 320,
        "date": "06.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 321,
        "date": "06.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 322,
        "date": "07.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 323,
        "date": "07.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 23",
        "targetA": 71.7,
        "targetC": 82.7,
        "targetB": 77.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 324,
        "date": "08.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 325,
        "date": "08.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 326,
        "date": "09.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 327,
        "date": "09.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 328,
        "date": "10.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 329,
        "date": "10.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 330,
        "date": "11.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 331,
        "date": "11.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 332,
        "date": "12.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 333,
        "date": "12.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 334,
        "date": "13.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 335,
        "date": "13.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 336,
        "date": "14.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 337,
        "date": "14.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 24",
        "targetA": 70.7,
        "targetC": 82.2,
        "targetB": 76.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 338,
        "date": "15.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 339,
        "date": "15.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 340,
        "date": "16.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 341,
        "date": "16.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 342,
        "date": "17.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 343,
        "date": "17.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 344,
        "date": "18.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 345,
        "date": "18.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 346,
        "date": "19.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 347,
        "date": "19.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 348,
        "date": "20.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 349,
        "date": "20.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 350,
        "date": "21.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 351,
        "date": "21.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 25",
        "targetA": 69.7,
        "targetC": 81.7,
        "targetB": 75.7,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 352,
        "date": "22.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 353,
        "date": "22.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 354,
        "date": "23.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 355,
        "date": "23.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 356,
        "date": "24.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 357,
        "date": "24.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 358,
        "date": "25.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 359,
        "date": "25.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 360,
        "date": "26.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 361,
        "date": "26.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 362,
        "date": "27.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 363,
        "date": "27.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 364,
        "date": "28.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 365,
        "date": "28.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 26",
        "targetA": 68.7,
        "targetC": 81.2,
        "targetB": 74.95,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 366,
        "date": "29.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 367,
        "date": "29.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 368,
        "date": "30.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 369,
        "date": "30.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 370,
        "date": "31.03.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 371,
        "date": "31.03.2027",
        "timeOfDay": "Abend",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 372,
        "date": "01.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 373,
        "date": "01.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 374,
        "date": "02.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 375,
        "date": "02.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 376,
        "date": "03.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 377,
        "date": "03.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 378,
        "date": "04.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 379,
        "date": "04.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 27",
        "targetA": 67.7,
        "targetC": 80.7,
        "targetB": 74.2,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 380,
        "date": "05.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 381,
        "date": "05.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 382,
        "date": "06.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 383,
        "date": "06.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 384,
        "date": "07.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 385,
        "date": "07.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 386,
        "date": "08.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 387,
        "date": "08.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 388,
        "date": "09.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 389,
        "date": "09.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 390,
        "date": "10.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 391,
        "date": "10.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 392,
        "date": "11.04.2027",
        "timeOfDay": "Morgen",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    },
    {
        "row": 393,
        "date": "11.04.2027",
        "timeOfDay": "Abend",
        "week": "Woche 28",
        "targetA": 66.7,
        "targetC": 80.2,
        "targetB": 73.45,
        "actual": null,
        "diffDay": null,
        "diffWeek": null,
        "meals": {
            "breakfast": false,
            "snackMorning": false,
            "lunch": false,
            "snackAfternoon": false,
            "dinner": false,
            "snackEvening": false
        },
        "diff1kg": null
    }
];

if (typeof module !== 'undefined') module.exports = { BASELINE_WEIGHT_DATA, DATA_UPDATED_AT };
