(function(){
	'use strict';

	angular
    	    .module('shipyard.books')
            .factory('BooksService', BooksService);

	BooksService.$inject = ['$http'];
        function BooksService($http) {
            return {
                list: function() {
                    var promise = $http
                        .get('/api/books')
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                roles: function() {
                    var promise = $http
                        .get('/api/roles')
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                role: function(name) {
                    var promise = $http
                        .get('/api/roles/'+name)
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                statuses: function() {
                    var promise = $http
                        .get('/api/statuses')
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                status: function(name) {
                    var promise = $http
                        .get('/api/statuses/'+name)
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                accounts: function() {
                    var promise = $http
                        .get('/api/accounts')
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                getBook: function(bookname) {
                    var promise = $http
                        .get('/api/books/' + bookname)
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                removeBook: function(book) {
                    var promise = $http
                        .delete('/api/books/'+book.bookname)
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                returnBook: function(book) {
                    var request = {
                        bookname: book.bookname,
                        bookauthor: book.bookauthor,
                        bookdesc: book.bookdesc,
                        bookstatus: ['available'],
                        bookower: null
                    }
                    var promise = $http
                        .post('/api/books', request)
                        .success(function(data, status, headers, config) {
                            $state.transitionTo('dashboard.books');
                        })
                        .error(function(data, status, headers, config) {
                            vm.error = data;
                        });
                    return promise;
                },
                borrowBook: function(book, username) {
                    var request = {
                        bookname: book.bookname,
                        bookauthor: book.bookauthor,
                        bookdesc: book.bookdesc,
                        bookstatus: ['lended'],
                        bookower: [username]
                    }
                    var promise = $http
                        .post('/api/books', request)
                        .success(function(data, status, headers, config) {
                            $state.transitionTo('dashboard.books');
                        })
                        .error(function(data, status, headers, config) {
                            vm.error = data;
                        });
                    return promise;
                },
            } 
        } 
})();
