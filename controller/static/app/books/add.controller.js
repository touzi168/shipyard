(function(){
    'use strict';

    angular
        .module('shipyard.books')
        .controller('BooksAddController', BooksAddController);

    BooksAddController.$inject = ['roles', 'statuses', 'accounts', '$http', '$state'];
    function BooksAddController(roles, statuses, accounts, $http, $state) {
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
            placeholder: '选择角色',
            onInitialize: function(selectize){
            },
        };

	vm.statuses = statuses;
	vm.bookStatuses = null;
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
	vm.bookOwers = null;
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

        function addBook() {
            if (!isValid()) {
                return;
            }
            vm.request = {
                bookname: vm.bookname,
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

