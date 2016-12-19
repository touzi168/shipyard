(function(){
	'use strict';

	angular
		.module('shipyard.books')
		.config(getRoutes);

	getRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

	function getRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('dashboard.books', {
			    url: '^/books',
			    templateUrl: 'app/books/books.html',
                            controller: 'BooksController',
                            controllerAs: 'vm',
                            authenticate: true,
                            resolve: {
                                books: ['BooksService', '$state', '$stateParams', function (BooksService, $state, $stateParams) {
                                    return BooksService.list().then(null, function(errorData) {	                            
                                        $state.go('error');
                                    }); 
                                }],
                                roles: ['BooksService', '$state', '$stateParams', function (BooksService, $state, $stateParams) {
                                    return BooksService.roles().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }]
                            }
			})
                        .state('dashboard.addBook', {
                            url: '^/books/add',
                            templateUrl: 'app/books/add.html',
                            controller: 'BooksAddController',
                            controllerAs: 'vm',
                            authenticate: true,
                            resolve: {
                                roles: ['BooksService', '$state', '$stateParams', function (BooksService, $state, $stateParams) {
                                    return BooksService.roles().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }] 
                            }
                        })
                        .state('dashboard.editBook', {
                            url: '^/books/edit/{bookname}',
                            templateUrl: 'app/books/edit.html',
                            controller: 'BooksEditController',
                            controllerAs: 'vm',
                            authenticate: true,
                            resolve: {
                                book: ['BooksService', '$state', '$stateParams', function (BooksService, $state, $stateParams) {
                                    return BooksService.getBook($stateParams.bookname).then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }],
                                roles: ['BooksService', '$state', '$stateParams', function (BooksService, $state, $stateParams) {
                                    return BooksService.roles().then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }] 
                            }
                        });
	}
})();
