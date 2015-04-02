var userSettings = {
    extensionHasJustUpdated: false,
    localStorageMustBeCleared: false,
    userGender: 'men',
    userMaxHr: 190,
    userRestHr: 65,
    userFTP: null,
    userHrrZones: [{
        fromHrr: 30,
        toHrr: 50,
    }, {
        fromHrr: 50,
        toHrr: 60,
    }, {
        fromHrr: 60,
        toHrr: 70,
    }, {
        fromHrr: 70,
        toHrr: 80,
    }, {
        fromHrr: 80,
        toHrr: 90,
    }, {
        fromHrr: 90,
        toHrr: 110
    }],
    zones: {
        speed: [{
            from: 0,
            to: 10
        }, {
            from: 10,
            to: 25
        }, {
            from: 25,
            to: 30
        }, {
            from: 30,
            to: 35
        }, {
            from: 35,
            to: 39
        }, {
            from: 39,
            to: 42
        }, {
            from: 42,
            to: 50
        }, {
            from: 50,
            to: 75
        }],
        pace: [{
            from: 120,
            to: 150
        }, {
            from: 150,
            to: 180
        }, {
            from: 180,
            to: 220
        }, {
            from: 220,
            to: 250
        }, {
            from: 250,
            to: 290
        }, {
            from: 290,
            to: 500
        }, {
            from: 500,
            to: 570
        }, {
            from: 570,
            to: 650
        }, {
            from: 650,
            to: 700
        }],
        power: [{
            from: 0,
            to: 200
        }, {
            from: 200,
            to: 300
        }, {
            from: 300,
            to: 350
        }, {
            from: 350,
            to: 400
        }, {
            from: 400,
            to: 450
        }, {
            from: 450,
            to: 550
        }],
        cyclingCadence: [{
            from: 0,
            to: 50
        }, {
            from: 50,
            to: 70
        }, {
            from: 70,
            to: 80
        }, {
            from: 80,
            to: 90
        }, {
            from: 90,
            to: 100
        }, {
            from: 100,
            to: 110
        }, {
            from: 110,
            to: 125
        }],
        runningCadence: [{
            from: 80,
            to: 90
        }, {
            from: 90,
            to: 100
        }, {
            from: 100,
            to: 110
        }, {
            from: 110,
            to: 130
        }],
        grade: [{
            from: -20,
            to: -10
        }, {
            from: -10,
            to: -5
        }, {
            from: -5,
            to: 0
        }, {
            from: 0,
            to: 5
        }, {
            from: 5,
            to: 10
        }, {
            from: 10,
            to: 15
        }, {
            from: 15,
            to: 20
        }]
    },
    remoteLinks: true,
    feedAutoScroll: true,
    defaultLeaderboardFilter: 'overall',
    activateRunningGradeAdjustedPace: true,
    activateRunningHeartRate: true,
    activityGoogleMapType: 'terrain',
    hidePremiumFeatures: true,
    displaySegmentRankPercentage: true,
    displayNearbySegments: true,
    displayMotivationScore: true,
    displayActivityRatio: true,
    displayAdvancedPowerData: true,
    displayAdvancedSpeedData: true,
    displayAdvancedHrData: true,
    displayCadenceData: true,
    displayAdvancedGradeData: true,
    displayBikeOdoInActivity: true,
    enableBothLegsCadence: false,
    feedHideChallenges: false,
    feedHideCreatedRoutes: false,
    highLightStravaPlusFeature: false // For heartrate related data.
};
