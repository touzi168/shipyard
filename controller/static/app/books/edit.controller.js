(function(){
    'use strict';

    angular
        .module('shipyard.books')
        .controller('BooksEditController', BooksEditController);

    BooksEditController.$inject = ['book','roles', 'statuses', 'accounts', '$http', '$state'];
    function BooksEditController(book, roles, statuses, accounts, $http, $state) {
        var vm = this;
        vm.book = book;
        vm.editBook = editBook;
        vm.request = {};
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

	vm.statuses = statuses;
	vm.bookStatuses = book.bookstatus;
	vm.statusOptions = statuses;
	vm.statusConfig = {
            create: false,
            valueField: 'status',
            labelField: 'description',
            delimiter: ',',
            placeholder: '选择状态',
            onInitialize: function(selectize){
            },
	};

	vm.accounts = accounts;
	vm.bookOwers = book.bookower;
	vm.owerOptions = accounts;
	vm.owerConfig = {
            create: false,
            valueField: 'username',
            labelField: 'username',
            placeholder: '选择借阅人',
            onInitialize: function(selectize){
            },
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
		bookstatus: vm.bookStatuses,
		bookower: vm.bookOwers
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

