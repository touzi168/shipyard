(function(){
	'use strict';

	angular
		.module('shipyard.signup')
		.config(getRoutes);

	getRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

	function getRoutes($stateProvider, $urlRouterProvider) {
	    $stateProvider
		.state('signup', {
				url: '/signup',
	            templateUrl: 'app/signup/signup.html',
	            controller: 'SignupController',
	            controllerAs: 'vm',
                authenticate: false
		});
	}
})();
