(function(){
	'use strict';

	angular
		.module('shipyard.signup')
		.controller('SignupController', SignupController);

    SignupController.$inject = ['AuthService', '$state'];
	function SignupController(AuthService, $state) {
            var vm = this;
            vm.error = "";
            vm.username = "";
            vm.password = "";
            vm.signup = signup;

            function isValid() {
                return $('.ui.form').form('validate form');
            }

            function signup() {
                if (!isValid()) {
                    return;
                }
                vm.error = "";
                AuthService.signup({
                    username: vm.username, 
                    password: vm.password
                }).then(function(response) {
                    $state.transitionTo('dashboard.login');
                }, function(response) {
                    vm.error = response.data;
                });
            }
        }
})();

