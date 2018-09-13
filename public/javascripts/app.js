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
    /*.state('downloads',{
        url:'/downloads'   ,
        templateUrl:'downloads.html'
    })*/
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
            console.log('On client controller....');
            console.log(data);
            $http.post('/send', data)
            .then(function(response){
                //console.log(response);
                cb(response);
                return;
            },function(response){
                console.log('Something went wrong!');
                console.log(response);
            });
        }
        else{
            $http.post('/upload',fd,{
                transformRequest:angular.identity,
                headers:{'Content-Type':undefined}
            })
            .then(function(response){
                //console.log(response);
                $http.post('/send', data)
                .then(function(response){
                    //console.log(response);
                    cb(response);
                    return;
                },function(response){
                    console.log('Something went wrong!');
                    console.log(response);
                });
            },function(response){
                console.log('Something went wrong!');
                console.log(response);
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

esscom.controller('QueryController',function($scope,$mdToast,$mdDialog,$state,QueryService){
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
            .position('top right')
            .hideDelay(3000)
        );
    }
    
    $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
        sendQuery(function(response){
            console.log(response);
            $state.reload();
            if(response.data == "success"){
                alert('Thank you for your query. We will get back to you soon!');
            }
            else{
                alert('Query not sent');
            }
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
        $rootScope.hideSpinner();
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.showSpinner();
        $rootScope.disableDownload = false;
        if( toState.name.substr(0,toState.name.indexOf(".")) == "essential"){
            $rootScope.profile = "Essential_Profile_2016.pdf";
            $rootScope.profileName = "Essential";
        }
        else if( toState.name.substr(0,toState.name.indexOf(".")) == "commercial"){
            $rootScope.profile = "Commercial_Profile_2016.pdf"; 
            $rootScope.profileName = "Commercial";
        }
        else
            $rootScope.disableDownload = true;
    });
}]);

esscom.controller('EssentialController',['$window','$scope','$state','rightPanelImage',function($window,$scope,$state,rightPanelImage){
    
    $window.scrollTo(0,0);
    $scope.resolveBackColor = function(){
        if( $window.innerWidth <= 1280){
            return 'essbackground';
        }
    }
    $scope.rightPanelImage = rightPanelImage+".gif";
    $scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams) {
        $scope.leftPanelImage = toState.name+".gif";
    });
    $scope.addPadding = function(){
        
        if( $window.innerWidth > 1280){
            return {"padding-top":"50px"};
        }
        else{
            return {"padding-top":"0px"};
        }
    }
    
}]);
esscom.controller('CommercialController',['$window','$scope','rightPanelImage',function($window,$scope,rightPanelImage){
    /*$scope.download = function(file){
        console.log("Trying to download "+file);
        $http.get('/download?file='+file).success(function(response){
            console.log("Download "+response);
            
        });
    };*/
    
    $scope.resolveBackColor = function(){
        if( $window.innerWidth <= 1280){
            return 'combackground';
        }
    };
    
    $scope.rightPanelImage = rightPanelImage+".gif";
    $scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams) {
        $scope.leftPanelImage = toState.name+".gif";
    });
    
}]);

esscom.controller('EssHomeController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){  
    $window.scrollTo(0, 0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
    
}]);
esscom.controller('EssAboutController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    $window.scrollTo(0, 0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
}]);
esscom.controller('EssServicesController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    $window.scrollTo(0,0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
}]);
esscom.controller('EssWorkController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    $window.scrollTo(0,0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
}]);

esscom.controller('ComHomeController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    $window.scrollTo(0,0);
    $scope.leftPanelImage = leftPanelImage+".gif";
    
}]);
esscom.controller('ComAboutController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    $window.scrollTo(0,0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
}]);
esscom.controller('ComFundController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    $window.scrollTo(0,0);
    $scope.leftPanelImage = leftPanelImage+".gif";
}]);

esscom.controller('ContactController',['leftPanelImage','$scope','$window',function(leftPanelImage,$scope,$window){
    $window.scrollTo(0,0);
    
    $scope.leftPanelImage = leftPanelImage+".gif";
    
    $scope.resolveBackColor = function(){
        if( $window.innerWidth <= 1280){
            return 'contact-background';
        }
    }
}]);

esscom.controller('NavbarController', ['$scope','$window','$rootScope',function($scope,$window,$rootScope){
    $scope.isNavCollapsed = true;
    /*$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ 
        console.log(toState);
        console.log(".....State change start....");
        if( toState.name.substr(0,toState.name.indexOf(".")) == "essential")
            $scope.profile = "Essential_Profile_2016.pdf";
        else if( toState.name.substr(0,toState.name.indexOf(".")) == "commercial")
            $scope.profile = "Commercial_Profile_2016.pdf"; 
        else
            $scope.disableDownload = true;
        
        console.log("After state change start:"+$scope.disableDownload);
    });*/
    $scope.resolveCollapse = function(){
        if( $window.innerWidth <= 768){
            $scope.isNavCollapsed = !$scope.isNavCollapsed;
            return $scope.isNavCollapsed;
        }
        else{
            $scope.isNavCollapsed = true;
            return $scope.isNavCollapsed;
        }
    }
}]);

esscom.controller('FooterController',['$scope',function($scope){
	$scope.date = new Date();
	$scope.date = $scope.date.getFullYear();
}]);