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

.controller('ScreenflashCtrl', function($scope, $timeout) {
    this.started = false
    this.going = false
    this.buttonText = "Wait"
    this.flashesLeft = 5
    this.flashing = false

    this.start = function() {
        this.started = true;

        this.wait()
    }

    this.wait = function() {
        $timeout(function(){}, 1000)
            .then(function() {
                this.flashing = true
            })
    }
})
.controller('BasicMathCtrl',function($scope, $timeout){
  this.started = false
  this.answers = []
  this.problem = ""
  this.animate = false
  this.start = function(){
    this.started = true;
    this.displayProblem()
  }
  this.displayProblem = function(){
      var problemType = Math.floor(Math.random()*4)
      console.log("problemType",problemType)
      problemType = 2
      switch(problemType){
        case 0:
          var a = Math.ceil(Math.random()*19);
          var b = Math.ceil(Math.random()*21);
          var c = a+b;
          var arr = [c];
          this.generateWrongAnswers(arr,2*c)
          this.answers = arr
          this.problem = a + " + " + b + " = ?"
          this.correctAnswer = c
        case 1:
          var a = Math.ceil(Math.random()*19);
          var b = Math.ceil(Math.random()*21);
          var c = a+b;
          var arr = [b];
          console.log("correct answer:", b)
          this.generateWrongAnswers(arr,2*b)
          this.answers = arr
          this.problem = c + " - " + a + " = ?"
          this.correctAnswer = b
        case 2:
          var a = Math.ceil(Math.random()*14);
          var b = Math.ceil(Math.random()*12);
          var c = a * b;
          console.log("correctAnswer:", c)
          var arr = [c]
          console.log(this.started)
          this.generateWrongAnswers(arr,2*c)
          this.answers = arr
          this.problem = a + " * " + b + " = ?"
          this.correctAnswer = c          
        case 3:
      } 
  }
  this.checkResponse = function(answer){
    this.clickedAnswer = answer
    this.animate = true
    $timeout(function(){},1000).then(function(){
      this.displayProblem()
    })
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

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
