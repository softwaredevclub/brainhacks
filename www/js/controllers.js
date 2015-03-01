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
            console.log('too soon')
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
        $location.path('app/home')
    }
})

.controller('StrooptestCtrl', function($scope, $stateParams) {
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

      if (this.numberPlays > 5){
        this.d2 = new Date()
        this.endTime = this.d2.getTime()
        console.log("startTime",this.startTime)
        console.log("endTime",this.endTime)
        this.resultTime = (this.endTime - this.startTime)/1000 + 2*this.numberLoss
        alert('The game is over. Time was: ' + this.resultTime + " seconds" + " with losses: " + this.numberLoss)


      }
      else {
        this.start()
      }

    }



})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
