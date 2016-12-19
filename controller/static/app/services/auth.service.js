(function(){
    'use strict';

    angular
        .module('shipyard.services')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', '$state'];
    function AuthService($http, $state) {
        return {
            login: function(credentials) {
                return $http
                    .post('/auth/login', credentials)
                    .success(function(data, status, headers, config) {
                        localStorage.setItem('X-Access-Token', credentials.username + ':' + data.auth_token);
                        localStorage.setItem('X-Access-Role', data.role);
                    })
                    .error(function(data, status, headers, config) {
                        localStorage.removeItem('X-Access-Token');
                        localStorage.removeItem('X-Access-Role');
                    })
                    .then(function(response) {
                        return response.data;
                    });
            },
            signup: function(credentials) {
                return $http
                    .post('/auth/signup', credentials)
                    .success(function(data, status, headers, config) {
                        localStorage.setItem('X-Access-Token', credentials.username + ':' + data.auth_token);
                        localStorage.setItem('X-Access-Role', data.role);
                    })
                    .error(function(data, status, headers, config) {
                        localStorage.removeItem('X-Access-Token');
                        localStorage.removeItem('X-Access-Role');
                    })
                    .then(function(response) {
                        return response.data;
                    });
            },
            logout: function() {
                localStorage.removeItem('X-Access-Token');
		localStorage.removeItem('X-Access-Role');
            },
            isLoggedIn: function() {
                return localStorage.getItem('X-Access-Token') != null;
            },
            getUsername: function() {
                var token = localStorage.getItem('X-Access-Token');
                if(token == null) {
                    return "";
                }
                return token.split(':')[0];
            },
            getRole: function() {
                var role = localStorage.getItem('X-Access-Role');
                if(role == null) {
                    return "user";
                }
                return role;
            }
        };
    }
})();

