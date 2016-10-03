/*var esscom = angular.module('esscom',['ngMaterial','ui.router','duScroll','ui.bootstrap','lr.upload']);*/
var esscom = angular.module('esscom',['ngMaterial' ,'ngMessages','ui.bootstrap','ui.router']);

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
esscom.directive('fileInput',['$parse',function($parse){
    return{
        restrict: 'A',
        link: function(scope, elm, attrs){
            elm.bind('change',function(){
                $parse(attrs.fileInput)
                .assign(scope,elm[0].files)
                scope.$apply();
            });
        }
    }
}]);
esscom.service('QueryService',['$http',function($http){
    this.sendQuery = function(data,fd,cb){ 
        console.log("In service....");
        console.log(data);
        if( fd == null ){
            $http.post('/send', data)
            .success(function(response){
                console.log(response);
                cb(response);
                return;
            });
        }
        else{
            $http.post('/upload',fd,{
                transformRequest:angular.identity,
                headers:{'Content-Type':undefined}
            })
            .success(function(response){
                console.log(response);
                $http.post('/send', data)
                .success(function(response){
                    console.log(response);
                    cb(response);
                    return;
                });
            });
        }
    }
}]);

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

esscom.controller('QueryController',function($scope,$mdDialog,$mdToast,QueryService){
    var fd = null;
    $scope.fileFlag = true;
    $scope.progressDisable = true;
    
    $scope.filesChanged = function(elm){
        $scope.files = elm.files;
        $scope.$apply();
        $scope.fileFlag = false;
    }
    $scope.upload = function(){
        fd = new FormData();
        angular.forEach($scope.files,function(file){
            fd.append('file',file);
        });
    }
    var sendQuery = function(cb){   
        
        $scope.validForm = true;
        
        var data = {
            'name' : $scope.name,
            'phone' : $scope.phone,
            'email' : $scope.email,
            'business' : $scope.business,
            'query' : $scope.query
        };

        console.log("In sendQuery with data...");
        console.log(data);    


        QueryService.sendQuery(data,fd,function(response){
            cb(response);
            return;
        });           
    }

    var showSimpleToast = function(text){
        
        $mdToast.show(
            $mdToast.simple()
            .textContent(text)
            .parent(document.querySelectorAll('#toaster'))
            .position('bottom left')
            .hideDelay(3000)
        );
    }
    
    $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Send query to EssCom?')
              .ariaLabel('Query confirmation')
              .targetEvent(ev)
              .ok('Please do it!')
              .cancel('Go Back');

        $mdDialog.show(confirm).then(function() {
            $scope.progressDisable = false;
            sendQuery(function(response){
                if(response == "sent"){
                    $scope.progressDisable = true;
                    showSimpleToast("Query Sent");
                }
                else{
                    $scope.progressDisable = true;
                    showSimpleToast("Error");
                }
            });
            $scope.status = 'You decided to get rid of your debt.';
        }, function() {
            $scope.status = 'You decided to keep your debt.';
        });
    };
    
});