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

.controller('GravityBallCtrl', function($scope, $interval, $ionicHistory, $state) {
    var parent = this
    var canvas = document.getElementById('gravity-ball-canvas')
    var ctx = canvas.getContext('2d')

    var width = window.screen.availWidth
    var height = window.screen.availHeight

    canvas.width = window.screen.availWidth
    canvas.height = window.screen.availHeight

    var ballx, bally, holex, holey, ballvx, ballvy, r, hr
    var dt = 40

    this.started = false
    this.timer = 0
    this.timerText = ""

    this.start = function() {
        this.started = true;
        this.init()

        parent.interval = $interval(function(){
            parent.timer+=67
            parent.timerText = (parent.timer/1000).toFixed(3)
        }, 67)
    }

    this.draw = function() {
        ctx.clearRect(0,0,width,height)

        ctx.beginPath()
        ctx.arc(holex, holey, hr, 0, Math.PI*2)
        ctx.fillStyle = "black"
        ctx.fill()

        ctx.beginPath()
        ctx.arc(ballx, bally, r, 0, Math.PI*2)
        ctx.fillStyle = "red"
        ctx.fill()

    }

    this.init = function() {
        function distance(x1,x2,y1,y2) {
            return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2),2)
        }

        ballx = Math.random()*width
        bally = Math.random()*height
        ballvx = 0
        ballvy = 0
        r = width/20
        hr = r*2

        do {
            holex = Math.random()*width
            holey = Math.random()*height
        } while(distance(ballx, bally, holex, holey) < 2*(r+hr))

        this.draw()

        console.log('now wait for deviceready')
        document.addEventListener("deviceready", function() {
            parent.track()
        }, false);
    }

    this.track = function() {
        this.watchId = navigator.accelerometer.watchAcceleration(function(acceleration) {

            ballvx -= acceleration.x * dt/40
            ballvy += acceleration.y * dt/40

            ballx += ballvx * dt/40
            bally += ballvy * dt/40

            if(ballx + r < holex + hr && ballx - r > holex - hr && bally + r < holey + hr && bally - r > holey - hr)
                parent.finish()

            if(ballx + r > width) {
                ballx = width - r
                ballvx = -ballvx*(3/4)
            }
            if(ballx - r < 0) {
                ballx = r
                ballvx = -ballvx*(3/4)
            }
            if(bally + r > height) {
                bally = height - r
                ballvy = -ballvy*(3/4)
            }
            if(bally - r < 0) { // idk it works
                bally = r
                ballvy = -ballvy*(3/4)
            }

            parent.draw()

        }, function(){
            console.log('error')
        }, {
            frequency: 40
        })

        this.finish = function() {
            console.log(this.timer)
            navigator.accelerometer.clearWatch(parent.watchId)

            $ionicHistory.nextViewOptions({
                disableBack:true
            })

            $state.go('app.home')
        }
    }
})

.controller('ScreenflashCtrl', function($scope, $timeout, $interval, $location, $ionicHistory, $state) {
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
        console.log(score)

        $ionicHistory.nextViewOptions({
            disableBack:true
        })

        $state.go('app.home')
    }
})

.controller('ShoppingCtrl', function($scope, $http, $timeout, $ionicHistory, $state) {
    var parent = this
    this.started = false

    $scope.cards = []

    var width = window.screen.availWidth
    var height = window.screen.availHeight

    var yes = 0
    var no = 0

    $scope.addCard = function(card) {
        var newCard = card;
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
    }

    $scope.cardSwipedLeft = function(index) {
        console.log('Left swipe')
        no++
    }

    $scope.cardSwipedRight = function(index) {
        console.log('Right swipe')
        yes++
    }

    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
        console.log('Card removed');

        if($scope.cards.length === 0)
            parent.finish()
    }

    this.start = function() {
        this.started = true;

        var page = Math.floor(Math.random()*898 + 1)
        var bbUrl = 'https://api.remix.bestbuy.com/v1/products(regularPrice<100)?apiKey='
            + '4sthd3w5fj7fsax2qkm8vpy4&sort=bestSellingRank.asc'
            + '&show=image,name,regularPrice,bestSellingRank&pageSize=5&page=' + page + '&format=json'

        $http.get(bbUrl)
            .success(function(data, status, headers, config) {
                for(var i=0;i<data.products.length;i++)
                    $scope.addCard({name: data.products[i].name, image: data.products[i].image, price: data.products[i].regularPrice})

                $timeout(function(){}, 1000)
                    .then(function() {
                        var images = document.getElementsByClassName("shopping-image");
                        console.log(height/2 + "px")
                        for(i=0;i<images.length;i++) {
                            images[i].style.height = height/2 + "px"
                            images[i].style.width = width*(9/10) + "px"
                        }
                    })

            }).error(function(data, status, headers, config) {
                console.log('error')
            })
    }

    this.finish = function() {
        var score = yes
        console.log(score)

        $ionicHistory.nextViewOptions({
            disableBack:true
        })

        $state.go('app.home')
    }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
