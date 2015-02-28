angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('GravityBallCtrl', function($scope) {
    var parent = this
    var canvas = document.getElementById('gravity-ball-canvas')
    var ctx = canvas.getContext('2d')

    var width = window.screen.availWidth
    var height = window.screen.availHeight

    canvas.width = window.screen.availWidth
    canvas.height = window.screen.availHeight

    var ballx, bally, holex, holey, ballvx, ballvy

    this.started = false

    this.start = function() {
        this.started = true;
        this.init()
    }

    this.draw = function() {
        ctx.beginPath()
        ctx.arc(ballx, bally, width/20, 0, Math.PI*2)
        ctx.fillStyle = "red"
        ctx.fill()

        ctx.beginPath()
        ctx.arc(holex, holey, width/20, 0, Math.PI*2)
        ctx.fillStyle = "black"
        ctx.fill()
    }

    this.init = function() {
        ballx = Math.random()*width
        bally = Math.random()*height
        ballvx = 0
        ballvy = 0

        holex = Math.random()*width
        holey = Math.random()*height

        this.draw()

        console.log('now wait for deviceready')
        document.addEventListener("deviceready", function() {
            parent.track()
        }, false);
    }

    this.track = function() {
        navigator.accelerometer.watchAcceleration(function(acceleration) {
            console.log(acceleration)

            ballx -= acceleration.x
            bally += acceleration.y

            parent.draw()

        }, function(){
            console.log('error')
        }, {
            frequency: 100
        })
    }
})

.controller('ScreenflashCtrl', function($scope, $timeout, $interval, $location) {
    var parent = this

    this.started = false
    this.going = false

    this.buttonText = "Wait"
    this.timerText = "Wait for flash"

    this.flashesLeft = 4
    this.flashing = false
    this.time = 0
    this.scores = []

    this.start = function() {
        this.started = true;

        this.wait()
    }

    this.wait = function() {
        $timeout(function(){}, Math.random() * 5000 + 1000)
            .then(function() {
                parent.flashing = true
                parent.buttonText = "Click Me"
                parent.going = true
                parent.flashesLeft--

                parent.interval = $interval(function(){
                    parent.time+=67
                    parent.timerText = (parent.time/1000).toFixed(3)
                }, 67)
            })
    }

    this.updateTime = function() {}

    this.clicked = function() {
        if(!this.going) {
            alert("Wait until the screen flashes to click")
            return
        }

        $interval.cancel(this.interval)
        this.going = false
        this.flashing = false
        this.buttonText = "Wait"

        this.scores.push(this.time)
        this.time = 0

        if(this.flashesLeft > 0)
            this.wait()
        else
            this.finish()
    }

    this.finish = function() {
        var score = 0
        for(var i=0;i<this.scores.length;i++)
            score += this.scores[i]

        $location.path('app/home')
    }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
