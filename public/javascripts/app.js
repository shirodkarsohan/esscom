var esscom = angular.module('esscom',['ngMaterial','ui.router','duScroll','ui.bootstrap','lr.upload']);

esscom.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
    
    $stateProvider
    .state('home',{
        url:'/',
        templateUrl:'wall.html'
    })
    .state('commercial',{
        url:'/commercial',
        abstract:true,
        templateUrl:'commercial_templates/commercial.html'
    })
    .state('essential',{
        url:'/essential',
        abstract:true,
        templateUrl:'essential_templates/essential.html'
    })
    .state('essential.home',{
        url:'/home'
        ,templateUrl:'essential_templates/essential.home.html'
    })
    .state('essential.services',{
        url:'/services',
        templateUrl:'essential_templates/essential.services.html'
    })
    .state('essential.about',{
        url:'/about',
        templateUrl:'essential_templates/essential.about.html'
    })
    .state('essential.work',{
        url:'/work',
        templateUrl:'essential_templates/essential.work.html'
    })
    .state('commercial.home',{
        url:'/home',
        templateUrl:'commercial_templates/commercial.home.html'
    })
    .state('commercial.about',{
        url:'/about',
        templateUrl:'commercial_templates/commercial.about.html'
    })
    .state('commercial.work',{
        url:'/work',
        templateUrl:'commercial_templates/commercial.work.html'
    })
    .state('downloads',{
        url:'/downloads'   
    })
    .state('contact',{
        url:'/contact',
        templateUrl:'contact.html'
    });
    /*$urlRouterProvider.when('', '/home');
    $urlRouterProvider.when('/', '');*/
    $urlRouterProvider.otherwise('/');
}]);

esscom.value('duScrollOffset', 50);

esscom.controller('AccordionController',function($scope){
    $scope.oneAtATime = true;
    $scope.open = [false,false,false,false,false,false,false,false,false,false];
    
    $scope.toggle = function(i){
        $scope.open[i] = !$scope.open[i];
    
        for( var k = 0 ; k < $scope.open.length; k++){
            if( i == k )
                continue;
            else{
                $scope.open[k] = false;
            }
        }
    }
    
    
});

esscom.controller('QueryController',function($scope,$http){
    $scope.sendQuery = function(){
        var fd = new FormData();
        fd.append('file',$scope.file);
        var data = {
            'name' : $scope.name,
            'phone' : $scope.phone,
            'email' : $scope.email,
            'business' : $scope.business,
            'query' : $scope.query,
            'file' : fd
        };
        console.log("In sendQuery with data...");
        console.log(data);
        
        $http.post('/send',data).success(function(response){
            console.log(response);
        });
        
        /*$http.get('/send?name='+$scope.name+"&phone="+$scope.phone).success(function(response){
            console.log(response);
        })*/
    }
});