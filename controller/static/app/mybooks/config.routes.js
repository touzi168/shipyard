(function(){
	'use strict';

	angular
		.module('shipyard.mybooks')
		.config(getRoutes);

	getRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

	function getRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('dashboard.mybooks', {
			    url: '^/mybooks',
			    templateUrl: 'app/mybooks/mybooks.html',
                            controller: 'MyBooksController',
                            controllerAs: 'vm',
                            authenticate: true,
                            resolve: {
                                mybooks: ['MyBooksService', '$state', '$stateParams', function (MyBooksService, $state, $stateParams) {
                                    return MyBooksService.list().then(null, function(errorData) {	                            
                                        $state.go('error');
                                    }); 
                                }],
                                roles: ['MyBooksService', '$state', '$stateParams', function (MyBooksService, $state, $stateParams) {
                                    return MyBooksService.roles().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }] 
                            }
			})
                        .state('dashboard.addMyBook', {
                            url: '^/mybooks/add',
                            templateUrl: 'app/mybooks/add.html',
                            controller: 'MyBooksAddController',
                            controllerAs: 'vm',
                            authenticate: true,
                            resolve: {
                                roles: ['MyBooksService', '$state', '$stateParams', function (MyBooksService, $state, $stateParams) {
                                    return MyBooksService.roles().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }],
                                statuses: ['MyBooksService', '$state', '$stateParams', function (MyBooksService, $state, $stateParams) {
                                    return MyBooksService.statuses().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }],
                                accounts: ['MyBooksService', '$state', '$stateParams', function (MyBooksService, $state, $stateParams) {
                                    return MyBooksService.accounts().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }] 
                            }
                        })
                        .state('dashboard.editMyBook', {
                            url: '^/mybooks/edit/{bookname}',
                            templateUrl: 'app/mybooks/edit.html',
                            controller: 'MyBooksEditController',
                            controllerAs: 'vm',
                            authenticate: true,
                            resolve: {
                                mybook: ['MyBooksService', '$state', '$stateParams', function (MyBooksService, $state, $stateParams) {
                                    return MyBooksService.getMyBook($stateParams.bookname).then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }],
                                roles: ['MyBooksService', '$state', '$stateParams', function (MyBooksService, $state, $stateParams) {
                                    return MyBooksService.roles().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }],
                                statuses: ['MyBooksService', '$state', '$stateParams', function (MyBooksService, $state, $stateParams) {
                                    return MyBooksService.statuses().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }],
                                accounts: ['MyBooksService', '$state', '$stateParams', function (MyBooksService, $state, $stateParams) {
                                    return MyBooksService.accounts().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }] 
                            }
                        });
	}
})();
