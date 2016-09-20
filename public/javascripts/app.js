var esscom = angular.module('esscom',['ngMaterial','ui.router','duScroll']);

esscom.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('home',{
        url:'/',
        templateUrl:'wall.html'
    })
    .state('home.commercial',{
        url:'commercial',
        templateUrl:'commercial.html'
    })
    .state('home.essential',{
        url:'essential',
        templateUrl:'essential.html'
    })
    .state('home.essential.services',{
        url:'/services',
        templateUrl:'services.html'
    });
    /*$urlRouterProvider.when('', '/home');
    $urlRouterProvider.when('/', '');*/
    $urlRouterProvider.otherwise('/');
}]);

esscom.value('duScrollOffset', 50);