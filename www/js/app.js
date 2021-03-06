// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'ionic.contrib.ui.tinderCards','ngAnimate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.directive('noScroll', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            $element.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    }
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.transition('android');
  $ionicConfigProvider.views.maxCache(0);
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html"
      }
    }
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.screenflash', {
      url: "/test/screenflash",
      views: {
          'menuContent': {
              templateUrl: "templates/tests/screenflash.html"
          }
      }
  })

  .state('app.history', {
      url: "/history",
      views: {
          'menuContent': {
              templateUrl: "templates/history.html"
          }
      }
  })

  .state('app.basicmath',{
    url: "/test/basicmath",
    views:{
      'menuContent':{
        templateUrl:"templates/tests/basicmath.html"
      }
    }
  })

  .state('app.strooptest', {
      url: "/test/strooptest",
      views: {
          'menuContent': {
              templateUrl: "templates/tests/strooptest.html"
            }
      }
  })

  .state('app.stats', {
      url: "/stats",
      views: {
          'menuContent': {
              templateUrl: "templates/stats.html"
          }
      }
  })

  .state('app.gravityball', {
      url: "/test/gravityball",
      views: {
          'menuContent': {
              templateUrl: "templates/tests/gravityball.html"
          }
      }
  })

  .state('app.shopping', {
      url: "/test/shopping",
      views: {
          'menuContent': {
              templateUrl: "templates/tests/shopping.html"
          }
      }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
        controller: "BrowseCtrl"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
