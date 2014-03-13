'use strict';

var app = angular.module("COLT", [
	'colt.directives', 
	'log.view.directive',
	'log.visualizer.directive', 
	'ui.router', 
	'pasvaz.bindonce',
	'angular-google-analytics'
	]);

app.config(function(AnalyticsProvider) {
	AnalyticsProvider.setAccount('UA-40699654-4');
	AnalyticsProvider.trackPages(true);
});

app.run(function($rootScope, $http, Analytics) {

	$rootScope.$on('$stateChangeSuccess', function(event, toState){ 
		$rootScope.pageName = toState.pageName;
		$rootScope.pageIndex = toState.pageIndex;
		Analytics.trackPage(toState.url + ".html");
	});


	$http.get('_autogenerated.colt',
		{transformResponse:function(data) {
			var x2js = new X2JS();
			var json = x2js.xml_str2json( data );
			return json;
		}
	})
	.then(function(res) {
		var model = $rootScope.model = res.data.xml;
		model.build['use-custom-output-path'] = model.build['use-custom-output-path'] === "true";
		model.live.live['live-html-edit'] = model.live.live['live-html-edit'] === "true";
		model.live.live.paused = model.live.live.paused === "true";
		model.live.live['disable-in-minified'] = model.live.live['disable-in-minified'] === "true";
		model.live.live['enable-debuger'] = model.live.live['enable-debuger'] === "true";
		model.build['use-real-time-transformation'] = model.build['use-real-time-transformation'] === "true";
		model.build.precompile['coffee-script'] = model.build.precompile['coffee-script'] === "true";
		model.build.precompile['type-script'] = model.build.precompile['type-script'] === "true";
		model.build.precompile['use-less'] = model.build.precompile['use-less'] === "true";
		model.build.precompile['use-sass'] = model.build.precompile['use-sass'] === "true";
		model.build['offline-cms']['integrate-mercury'] = model.build['offline-cms']['integrate-mercury'] === "true";
		model.build['offline-cms']['run-mercury'] = model.build['offline-cms']['run-mercury'] === "true";
		model.build.security['use-inspectable'] = model.build.security['use-inspectable'] === "true";
		model.live.settings['disconnect'] = model.live.settings['disconnect'] === "true";
		model.live.settings['clear-log'] = model.live.settings['clear-log'] === "true";
		console.log(model);
	});

	// nodeApp.loadProject("./test-project.colt").then(function(data) {
	// 	console.log("PROJECT:");
	// 	console.log(data);			
	// });
});

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/settings");
	$stateProvider
	.state('settings', {
		url: "/settings",
		templateUrl: "partials/settings.html",
		pageName: "Project Settings",
		pageIndex: 0
	})
	.state('build', {
		url: "/build",
		templateUrl: "partials/build.html",
		pageName: "Production Build",
		pageIndex: 1
	})
	.state('log', {
		url: "/log",
		templateUrl: "partials/log.html",
		pageName: "Log",
		pageIndex: 2
	});
})
