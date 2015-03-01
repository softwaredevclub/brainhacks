angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicHistory, $state, $rootScope) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $rootScope.finishTest = function(test, score) {
      var myScore = {score: score, test: test, cal: $rootScope.calibrating};
      $rootScope.myScores.group(myScore);
      console.log($rootScope.calibrating)
      console.log($rootScope)

      if($rootScope.calibrating) {
          if($rootScope.calTests.length > 1) {
              console.log($rootScope.calTests)
              $rootScope.calTests = $rootScope.calTests.splice(1)
              console.log($rootScope.calTests)
              $state.go($rootScope.calTests[0])
          } else {
              $rootScope.myScores.map(function(score){
                  console.log(score)
              })
              
              $state.go('app.home')
          }
      } else {
          $ionicHistory.nextViewOptions({
              disableBack:true
          })

          $state.go('app.home')
      }
  }

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

  $rootScope.myID = localStorage.getItem('myID');
  if(!$rootScope.myID){ localStorage.setItem('myID', $rootScope.myID = "id" + Gun.text.random()) }

  $rootScope.gun = Gun('https://gunjs.herokuapp.com/gun');
  window.scores = $rootScope.myScores = $rootScope.gun.load("brainhacks/" + $rootScope.myID + "/scores").group();

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

.controller('HomeCtrl', function($scope, $state, $rootScope) {
    this.calibrate = function() {
        console.log('hi')
        $rootScope.calibrating = true
        $rootScope.calTests = ['app.screenflash', 'app.strooptest', 'app.shopping', 'app.gravityball']
        $state.go($rootScope.calTests[0])
    }
})

.controller('GravityBallCtrl', function($scope, $interval, $ionicHistory, $state, $rootScope) {
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

            $rootScope.finishTest('gravityball', this.timer)
        }
    }
})

.controller('ScreenflashCtrl', function($scope, $timeout, $interval, $location, $ionicHistory, $state, $rootScope) {
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

        $rootScope.finishTest('screenflash', score)
    }
})
.controller('BasicMathCtrl',function($scope, $timeout){
  var parent = this
  this.started = false
  $scope.answers = [0,0,0,0,0]
  for(var i = 0;i< 5;i++){
    $scope.answers[i] = {"number":0}
  }
  this.problem = ""
  this.animate = false
  this.clicked = 0
  this.iteration = 0
  this.start = function(){
    this.started = true;
    this.displayProblem()
  }
  this.displayProblem = function(){
      var arr = []
      var problemType = Math.floor(Math.random()*4)
      console.log("problemType",problemType)
      problemType = 2
      switch(problemType){
        case 0:
          var a = Math.ceil(Math.random()*19);
          var b = Math.ceil(Math.random()*21);
          var c = a+b;
          arr = [c];
          this.generateWrongAnswers(arr,2*c)
          this.problem = a + " + " + b + " = ?"
          this.correctAnswer = c
        case 1:
          var a = Math.ceil(Math.random()*19);
          var b = Math.ceil(Math.random()*21);
          var c = a+b;
          arr = [b];
          console.log("correct answer:", b)
          this.generateWrongAnswers(arr,2*b)
          this.problem = c + " - " + a + " = ?"
          this.correctAnswer = b
          break
        case 2:
          var a = Math.ceil(Math.random()*14);
          var b = Math.ceil(Math.random()*12);
          var c = a * b;
          console.log("correctAnswer:", c)
          arr = [c]
          console.log(this.started)
          this.generateWrongAnswers(arr,2*c)
          this.problem = a + " * " + b + " = ?"
          this.correctAnswer = c         
          break 
        case 3:
          var a = Math.ceil(Math.random()*14);
          var b = Math.ceil(Math.random()*12);
          var c = a * b;
          console.log("correctAnswer:", b)
          arr = [b]
          console.log(this.started)
          this.generateWrongAnswers(arr,2*b)
          this.problem = c + " asdfads " + a + " = ?"
          this.correctAnswer = b
          break
      }
      for(var i = 0;i< arr.length;i++){
        $scope.answers[i].number = arr[i]
      }
      console.log("iteration", this.iteration)

  }
  this.checkResponse = function(answer){
      this.clicked = answer
      this.iteration++
      $timeout(function(){
        parent.clicked= 0
        parent.displayProblem()
      }, 1000)
        // $scope.answers =[]
        // $scope.answers.push({"number":3,"animation":"","index":0})
      

  }
  this.generateWrongAnswers= function(arr, max) {
    while(arr.length < 5){
      var randomnumber=Math.ceil(Math.random()*max)
      var found=false;
      for(var i=0;i<arr.length;i++){
        if(arr[i]==randomnumber){found=true;break}
      }
      if(!found)arr[arr.length]=randomnumber;
    }
    arr.sort(function(a,b){return a-b;});
  }
})

.controller('ShoppingCtrl', function($scope, $http, $timeout, $ionicHistory, $state, $rootScope) {
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

        $rootScope.finishTest('shopping', score)
    }
})

.controller('StrooptestCtrl', function($scope, $stateParams, $rootScope) {
    this.started=false;
    this.colorArray = ['red','blue', 'green', 'yellow','purple', 'orange']
    this.color1 = 'black'
    this.word = 'defaultValue'
    this.numberPlays = 1
    this.startTime = 0
    this.endTime = 0
    this.numberLoss = 0



    this.selColors = function() {
      this.color1 = this.colorArray[parseInt(Math.random()*this.colorArray.length)]
      this.word = this.colorArray[parseInt(Math.random()*this.colorArray.length)]
      while (this.color1 == this.word){
        this.word = this.colorArray[parseInt(Math.random()*this.colorArray.length)]
        console.log("Color selection collision")
      }

    }

    this.start = function() {
        if (this.numberPlays == 1){
          this.d1 = new Date()
          this.startTime = this.d1.getTime()
        }
        this.started = true
        this.selColors()
        this.fillButton()

    }

    this.fillButton = function() {
          this.randieColor = this.colorArray[parseInt(Math.random()*this.colorArray.length)]
          while (this.randieColor == this.color1 ||
            this.randieColor == this.word){
                this.randieColor = this.colorArray[parseInt(Math.random()*this.colorArray.length)]
            }
          this.array = [this.color1, this.word, this.randieColor]
          var shuffle = function(o){ //v1.0
              for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
              return o;
          };
          shuffle(this.array)

    }

    this.clicked = function(clickedString){
      console.log(clickedString)
      this.numberPlays++
      if(clickedString == this.color1){
        this.numberWins++
        console.log('win')
      }
      else {
        console.log('loss')
        this.numberLoss++
        }

      if (this.numberPlays > 5) {
          this.finish()
      }
      else {
        this.start()
      }

    }

    this.finish = function() {
        this.d2 = new Date()
        this.endTime = this.d2.getTime()
        var score = (this.endTime - this.startTime)/1000 + 2*this.numberLoss

        $rootScope.finishTest('stroop', score)
    }

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
