(function(){
	'use strict';

	angular
		.module('shipyard.login')
		.controller('SignupController', SignupController);

    SignupController.$inject = ['AuthService', '$state'];
	function SignupController(AuthService, $state) {
            var vm = this;
            vm.error = "";
            vm.username = "";
            vm.password = "";
            vm.confirm = "";
            vm.email = "";
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
                    password: vm.password,
                    confirm: vm.confirm, 
                    email: vm.email
                }).then(function(response) {
                    $state.transitionTo('dashboard.books');
                }, function(response) {
                    vm.error = response.data;
                });
            }
        }
})();

