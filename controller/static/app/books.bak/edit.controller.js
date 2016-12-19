(function(){
    'use strict';

    angular
        .module('shipyard.books')
        .controller('BooksEditController', BooksEditController);

    BooksEditController.$inject = ['book','roles', '$http', '$state'];
    function BooksEditController(book, roles, $http, $state) {
        var vm = this;
        vm.book = book;
        vm.editBook = editBook;
        vm.request = {};
        vm.password = null;
        vm.bookname = book.bookname;
        vm.bookauthor = book.bookauthor;
        vm.bookdesc = book.bookdesc;
        vm.request = null;
        vm.roles = roles;
        vm.userRoles = book.roles;
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

        function editBook() {
            if (!isValid()) {
                return;
            }
            vm.request = {
                bookname: book.bookname,
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

