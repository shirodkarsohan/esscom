/*var esscom = angular.module('esscom',['ngMaterial','ui.router','duScroll','ui.bootstrap','lr.upload']);*/
var esscom = angular.module('esscom',['ngMaterial' ,'ngMessages','ui.bootstrap','ui.router']);

esscom.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
    
    $stateProvider
    .state('home',{
        url:'/',
        templateUrl:'wall.html',
        controller:'HomeController'
    })
    .state('commercial',{
        url:'/commercial',
        abstract:true,
        templateUrl:'commercial_templates/commercial.html',
        controller: 'CommercialController',
        resolve:{
            rightPanelImage : function(){
                return "com_bgr";
            }
        }
    })
    .state('essential',{
        url:'/essential',
        abstract:true,
        templateUrl:'essential_templates/essential.html',
        controller: 'EssentialController',
        resolve:{
            rightPanelImage : function(){
                return "ess_bgr";
            }
        }
    })
    .state('essential.home',{
        url:'/home',
        templateUrl:'essential_templates/essential.home.html',
        controller:'EssHomeController',
        resolve:{
            leftPanelImage : function(){
                return "essential.home";
            }
        }
    })
    .state('essential.services',{
        url:'/services',
        templateUrl:'essential_templates/essential.services.html',
        controller:'EssServicesController',
        resolve:{
            leftPanelImage : function(){
                return "essential.services";
            }
        }
    })
    .state('essential.about',{
        url:'/about',
        templateUrl:'essential_templates/essential.about.html',
        controller:'EssAboutController',
        resolve:{
            leftPanelImage : function(){
                return "essential.about";
            }
        }
    })
    .state('essential.work',{
        url:'/work',
        templateUrl:'essential_templates/essential.work.html',
        controller:'EssWorkController',
        resolve:{
            leftPanelImage : function(){
                return "essential.work";
            }
        }
    })
    .state('commercial.home',{
        url:'/home',
        templateUrl:'commercial_templates/commercial.home.html',
        resolve:{
            leftPanelImage : function(){
                return "commercial.home";
            }
        },
        controller:'ComHomeController'
    })
    .state('commercial.about',{
        url:'/about',
        templateUrl:'commercial_templates/commercial.about.html',
        resolve:{
            leftPanelImage : function(){
                return "commercial.about";
            }
        },
        controller:'ComAboutController'
    })
    .state('commercial.fund',{
        url:'/work',
        templateUrl:'commercial_templates/commercial.work.html',
        resolve:{
            leftPanelImage : function(){
                return "commercial.fund";
            }
        },
        controller:'ComFundController'
    })
    .state('downloads',{
        url:'/downloads'   
    })
    .state('contact',{
        url:'/contact',
        templateUrl:'contact.html',
        resolve:{
            leftPanelImage : function(){
                return "contact";
            }
        },
        controller: 'ContactController'
    });
    /*$urlRouterProvider.when('', '/home');
    $urlRouterProvider.when('/', '');*/
    $urlRouterProvider.otherwise('/');
}]);

esscom.directive('applyPaddingTop',['$window','$state',function($window,$state){
    return {
        link:function($scope){
            //console.log("Inside resize dir");
            angular.element($window).bind('resize', function() {
                console.log("Applying padding");
                if( $window.innerWidth > 1280){
                    console.log("padding added");
                    angular.element("#pad").css("padding-top","50px");
                }
                else{
                    console.log("padding removed");
                    angular.element("#pad").removeClass("padding-top","0");
                }
                $scope.$apply();
            });
        }
    };
}]);
esscom.directive('resize',['$window','$state',function($window,$state){
    return {
        link:function($scope){
            //console.log("Inside resize dir");
            angular.element($window).bind('resize', function() {
                //console.log("Window resize");
                if( $window.innerWidth <= 1280){
                    //console.log("Returning ess background");
                    if( $state.name == 'essential')
                        angular.element("#view").addClass('essbackground');
                    else if( $state.name == 'commercial')
                        angular.element("#view").addClass('combackground');
                }else{
                    //console.log("removing ess background");
                    if( $state.name == 'essential')
                        angular.element("#view").removeClass('essbackground');
                    else if( $state.name == 'commercial')
                        angular.element("#view").removeClass('combackground');
                }
                $scope.$apply();
            })
        }
    };
}]);
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
        //console.log("In service....");
        //console.log(data);
        if( fd == null ){
            $http.post('/send', data)
            .success(function(response){
                //console.log(response);
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
                //console.log(response);
                $http.post('/send', data)
                .success(function(response){
                    //console.log(response);
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

        //console.log("In sendQuery with data...");
        //console.log(data);    


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
            
        }, function() {
            /*$scope.status = 'You decided to keep your debt.';*/
        });
    };
    
});

esscom.controller('HomeController',['$rootScope','$window',function($rootScope,$window){
    $rootScope.showPageLoad = false;
    $window.scrollTo(0,0);
    $rootScope.showSpinner = function(){
        $rootScope.showPageLoad = true;
    }
    $rootScope.hideSpinner = function(){
        $rootScope.showPageLoad = false;
    }
    $rootScope.$on('$viewContentLoaded', function(){
        //console.log("View content loaded");
        $rootScope.hideSpinner();
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        //console.log("State change start");
        $rootScope.showSpinner();
        
    });
}]);

esscom.controller('EssentialController',['$window','$scope','$state','rightPanelImage',function($window,$scope,$state,rightPanelImage){
    
    //console.log("In esential controller");
    $window.scrollTo(0,0);
    $scope.resolveBackColor = function(){
        //console.log("Resolving back color");
        if( $window.innerWidth <= 1280){
            //console.log("Width < 1280px");
            return 'essbackground';
        }
    }
    $scope.rightPanelImage = rightPanelImage+".gif";
    //console.log($scope.rightPanelImage);
    $scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams) {
        //console.log("State change success");
        $scope.leftPanelImage = toState.name+".gif";
        //console.log($scope.leftPanelImage);
    });
    $scope.addPadding = function(){
        
        if( $window.innerWidth > 1280){
            console.log("padding added");
            return {"padding-top":"50px"};
        }
        else{
            console.log("padding removed");
            return {"padding-top":"0px"};
        }
    }
    
}]);
esscom.controller('CommercialController',['$window','$scope','rightPanelImage',function($window,$scope,rightPanelImage){
    $scope.resolveBackColor = function(){
        //console.log("Resolving back color");
        if( $window.innerWidth <= 1280){
            //console.log("Width < 1280px");
            return 'combackground';
        }
    }
    
    $scope.rightPanelImage = rightPanelImage+".gif";
    //console.log($scope.rightPanelImage);
    $scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams) {
        //console.log("State change success");
        $scope.leftPanelImage = toState.name+".gif";
        //console.log($scope.leftPanelImage);
    });
    
}]);

esscom.controller('EssHomeController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    //console.log("EssHomeController");    
    $window.scrollTo(0, 0);
    
    
    $scope.leftPanelImage = leftPanelImage+".gif";
    console.log($scope.leftPanelImage+" loaded");
    
}]);
esscom.controller('EssAboutController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    ///console.log("EssAboutController");
    console.log("Scroll");
    $window.scrollTo(0, 0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
    console.log($scope.leftPanelImage+" loaded");
}]);
esscom.controller('EssServicesController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    //console.log("EssServicesController");
    
    $window.scrollTo(0,0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
    console.log($scope.leftPanelImage+" loaded");
}]);
esscom.controller('EssWorkController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    //console.log("EssWorkController");
  
    $window.scrollTo(0,0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
    console.log($scope.leftPanelImage+" loaded");
}]);

esscom.controller('ComHomeController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    //console.log("ComHomeController");
    $window.scrollTo(0,0);
    $scope.leftPanelImage = leftPanelImage+".gif";
    console.log($scope.leftPanelImage+" loaded");
    
}]);
esscom.controller('ComAboutController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    ///console.log("AboutController");

    $window.scrollTo(0,0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
    console.log($scope.leftPanelImage+" loaded");
}]);
esscom.controller('ComFundController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    //console.log("ServicesController");
  
    $window.scrollTo(0,0);
    $scope.leftPanelImage = leftPanelImage+".gif";
    console.log($scope.leftPanelImage+" loaded");
}]);

esscom.controller('ContactController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    ///console.log("EssAboutController");
 
    $window.scrollTo(0,0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
    console.log($scope.leftPanelImage+" loaded");
    
    $scope.resolveBackColor = function(){
        //console.log("Resolving back color");
        if( $window.innerWidth <= 1280){
            //console.log("Width < 1280px");
            return 'contact-background';
        }
    }
    
    
}]);

esscom.controller('NavbarController', ['$scope','$window',function($scope,$window){
    $scope.isNavCollapsed = true;
    $scope.resolveCollapse = function(){
        if( $window.innerWidth <= 768){
            //console.log("Width < 1280px");
            $scope.isNavCollapsed = !$scope.isNavCollapsed;
            return $scope.isNavCollapsed;
        }
        else{
            console.log("Returning true");
            $scope.isNavCollapsed = true;
            return $scope.isNavCollapsed;
        }
    }
}]);