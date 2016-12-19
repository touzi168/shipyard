(function(){
    'use strict';

    angular
        .module('shipyard.books')
        .controller('BooksAddController', BooksAddController);

    BooksAddController.$inject = ['roles', '$http', '$state'];
    function BooksAddController(roles, $http, $state) {
        var vm = this;
        vm.request = {};
        vm.addBook = addBook;
        vm.bookname = "";
        vm.bookauthor = "";
        vm.bookdesc = "";
        vm.roleName = "user";
        vm.request = null;
        vm.roles = roles;
        vm.userRoles = null;
        vm.roleOptions = roles;
        vm.roleConfig = {
            create: false,
            valueField: 'role_name',
            labelField: 'description',
            delimiter: ',',
            placeholder: 'Select Roles',
            onInitialize: function(selectize){
            },
        };

        function isValid() {
            return $('.ui.form').form('validate form');
        }

        function addBook() {
            if (!isValid()) {
                return;
            }
            vm.request = {
                bookname: vm.bookname,
                bookauthor: vm.bookauthor,
                bookdesc: vm.bookdesc,
            }
            $http
                .post('/api/books', vm.request)
                .success(function(data, status, headers, config) {
                    $state.transitionTo('dashboard.books');
                })
            .error(function(data, status, headers, config) {
                vm.error = data;
            });
        }
    }
})();

