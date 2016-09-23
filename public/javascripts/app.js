var esscom = angular.module('esscom',['ngMaterial','ui.router','duScroll','ui.bootstrap']);

esscom.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('home',{
        url:'/',
        templateUrl:'wall.html'
    })
    .state('commercial',{
        url:'/commercial',
        templateUrl:'commercial.html'
    })
    .state('essential',{
        url:'/essential',
        templateUrl:'essential.html'
    })
    .state('essential.services',{
        url:'/services',
        templateUrl:'services.html'
    });
    /*$urlRouterProvider.when('', '/home');
    $urlRouterProvider.when('/', '');*/
    $urlRouterProvider.otherwise('/');
}]);

esscom.value('duScrollOffset', 50);

esscom.controller('AccordionController',function($scope){
    $scope.oneAtATime = true;
    $scope.open = [false,false,false,false,false,false];
    
    $scope.toggle = function(i){
        $scope.open[i] = !$scope.open[i];
    }
    console.log($scope.open);
});