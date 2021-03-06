(function(){
    'use strict';

    angular
        .module('shipyard.accounts')
        .controller('AccountsEditController', AccountsEditController);

    AccountsEditController.$inject = ['account','roles', '$http', '$state'];
    function AccountsEditController(account, roles, $http, $state) {
        var vm = this;
        vm.account = account;
        vm.editAccount = editAccount;
        vm.request = {};
        vm.password = null;
        vm.email = account.email;
        vm.request = null;
        vm.roles = roles;
        vm.userRoles = account.roles;
        vm.roleOptions = vm.roles;
        vm.roleConfig = {
            create: false,
            valueField: 'role_name',
            labelField: 'description',
            delimiter: ',',
            items: vm.userRoles,
            placeholder: 'Select Roles'
        };

        function isValid() {
            return $('.ui.form').form('validate form');
        }

        function editAccount() {
            if (!isValid()) {
                return;
            }
            vm.request = {
                username: account.username,
                password: vm.password,
                email: vm.email,
                roles: vm.userRoles
            }
            $http
                .post('/api/accounts', vm.request)
                .success(function(data, status, headers, config) {
                    $state.transitionTo('dashboard.accounts');
                })
            .error(function(data, status, headers, config) {
                vm.error = data;
            });
        }
    }
})();

