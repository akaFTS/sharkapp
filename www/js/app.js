var app = angular.module('sharkapp', ['ionic', 'sharkapp.controllers']);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

app.config(function($stateProvider, $urlRouterProvider) {

    //login e introdução
    $stateProvider.state('intro', {
        url: '/intro',
        templateUrl: 'templates/intro.html',
        controller: 'IntroCtrl'
    });

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    });

    $stateProvider.state('app.dash', {
        url: '/dash',
        views: {
            'menuContent': {
                templateUrl: 'templates/dash.html'
            }
        }
    });

    $stateProvider.state('app.topics', {
        url: '/topics',
        views: {
            'menuContent': {
                templateUrl: 'templates/topics.html'
            }
        }
    });

    $stateProvider.state('app.exers', {
        url: '/exers',
        views: {
            'menuContent': {
                templateUrl: 'templates/exers.html',
                controller: 'PlaylistsCtrl'
            }
        }
    });

    $stateProvider.state('app.forum', {
        url: '/forum',
        views: {
            'menuContent': {
                templateUrl: 'templates/forum.html',
                controller: 'PlaylistsCtrl'
            }
        }
    });

    $stateProvider.state('app.stats', {
        url: '/stats',
        views: {
            'menuContent': {
                templateUrl: 'templates/stats.html',
                controller: 'PlaylistsCtrl'
            }
        }
    });

    $stateProvider.state('app.community', {
        url: '/community',
        views: {
            'menuContent': {
                templateUrl: 'templates/community.html',
                controller: 'PlaylistsCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/dash');
});
