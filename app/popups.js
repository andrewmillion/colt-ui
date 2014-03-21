'use strict';

var app = angular.module("popups", [
	'ui.router', 
	'angular-google-analytics'
	]);

// app.config(function(AnalyticsProvider) {
// 	AnalyticsProvider.setAccount('UA-40699654-4');
// 	AnalyticsProvider.trackPages(true);
// });

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/welcome-screen");
	$stateProvider
	.state('welcome-screen', {
		url: "/welcome-screen",
		templateUrl: "popups/welcome-screen.html",
		pageName: "Welcome Screen",
		controller: "WelcomeController"
	})
	.state('purchase-dialog', {
		url: "/purchase-dialog",
		templateUrl: "popups/purchase-dialog.html",
		pageName: "Purchase COLT",
		controller: "PurchaseController"
	})
	.state('update-dialog', {
		url: "/update-dialog",
		templateUrl: "popups/update-dialog.html",
		pageName: "Update COLT",
		controller: "UpdateController"
	})
	.state('close-save-dialog', {
		url: "/close-save-dialog",
		templateUrl: "popups/close-save-dialog.html",
		pageName: "Close COLT",
		controller: "CloseSaveController"
	})
});

app.run(function($rootScope, Analytics) {
	$rootScope.$on('$stateChangeSuccess', function(event, toState){ 
		$rootScope.pageName = toState.pageName;
		$rootScope.pageIndex = toState.pageIndex;
		// Analytics.trackPage(toState.url + ".html");
		
		$rootScope.onResize();
		$(".popup-window").bind("resize", function() {
			console.log("on resize");
			$rootScope.onResize();
		});
	});
	$(document).bind("resize", function() {
		console.log("on resize");
		$rootScope.onResize();
	});

	$rootScope.onResize = function() {
		var win = $(".popup-window");
		if(win.size() > 0){
			$scope.callToOwnerWindow("resize", win.width()+5, win.height());
		}
	}

	$rootScope.callToOwnerWindow = function(command, arg) {
		if(window.hasOwnProperty("popup")){
			if(window.popup.hasOwnProperty(command)){
				window.popup[command](arg);
			}else{
				console.log("'" + command + "' command not found");
			}
		}else{
			console.log("popup property not found");
		}
		// if(sessionStorage.hasOwnProperty("popup")){
		// 	if(sessionStorage.popup.hasOwnProperty(command)){
		// 		sessionStorage.popup[command](arg);
		// 	}
		// }
	}
});

app.controller("WelcomeController", function($scope, $rootScope, $window) {
	console.log("welcome screen");

	$scope.rescentProjects = [
	{name:"My Rescent Project"},
	{name:"Index"}
	];

	$scope.openLink = function(url) {
		$window.open(url);
	}

	$scope.newProject = function() {
		//@todo:
	}

	$scope.openDemoProjects = function(){

	}

	$scope.openRescentProject = function(index) {
		console.log("open rescent project: "+ index);
	}

	$scope.openProject = function() {
		console.log("open project");
	}
});



app.controller("PurchaseController", function($scope, $rootScope, $window) {
	console.log("purchase colt dialog");

	$scope.serialNumber = '';

	$scope.enterSerialNumber = function() {
		$scope.callToOwnerWindow("enterSerialNumber", $scope.serialNumber);
	}
	$scope.buy = function() {
		$scope.callToOwnerWindow("buy");
	}
	$scope.demo = function() {
		$scope.callToOwnerWindow("demo");
	}
});

app.controller("UpdateController", function($scope, $rootScope, $window) {
	console.log("update colt dialog");
});

app.controller("CloseSaveController", function($scope, $rootScope, $window) {
	console.log("close/save colt dialog");	

	$scope.dontSave = function() {
		$scope.callToOwnerWindow("dontSave");
	}
	$scope.save = function() {
		$scope.callToOwnerWindow("dontSave");
	}
	$scope.cancel = function() {
		$scope.callToOwnerWindow("cancel");
	}
});

