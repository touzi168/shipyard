(function(){
	'use strict';

	angular
    	    .module('shipyard.mybooks')
            .factory('MyBooksService', MyBooksService);

	MyBooksService.$inject = ['$http'];
        function MyBooksService($http) {
            return {
                list: function(username) {
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
                getMyBook: function(bookname) {
                    var promise = $http
                        .get('/api/books/' + bookname)
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                removeMyBook: function(mybook) {
                    var promise = $http
                        .delete('/api/books/'+mybook.bookname)
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                returnMyBook: function(mybook) {
                    var request = {
                        bookname: mybook.bookname,
                        bookauthor: mybook.bookauthor,
                        bookdesc: mybook.bookdesc,
                        bookstatus: ['available'],
                        bookower: null
                    }
                    var promise = $http
                        .post('/api/books', request)
                        .success(function(data, status, headers, config) {
                            $state.transitionTo('dashboard.mybooks');
                        })
                        .error(function(data, status, headers, config) {
                            vm.error = data;
                        });
                    return promise;
                },
                borrowMyBook: function(mybook, username) {
                    var request = {
                        bookname: mybook.bookname,
                        bookauthor: mybook.bookauthor,
                        bookdesc: mybook.bookdesc,
                        bookstatus: ['lended'],
                        bookower: [username]
                    }
                    var promise = $http
                        .post('/api/books', request)
                        .success(function(data, status, headers, config) {
                            $state.transitionTo('dashboard.mybooks');
                        })
                        .error(function(data, status, headers, config) {
                            vm.error = data;
                        });
                    return promise;
                },
            } 
        } 
})();
