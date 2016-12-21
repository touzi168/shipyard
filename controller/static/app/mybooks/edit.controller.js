(function(){
    'use strict';

    angular
        .module('shipyard.mybooks')
        .controller('MyBooksEditController', MyBooksEditController);

    MyBooksEditController.$inject = ['mybook','roles', 'statuses', 'accounts', '$http', '$state'];
    function MyBooksEditController(mybook, roles, statuses, accounts, $http, $state) {
        var vm = this;
        vm.mybook = mybook;
        vm.editMyBook = editMyBook;
        vm.request = {};
	vm.bookname = mybook.bookname;
        vm.bookauthor = mybook.bookauthor;
        vm.bookdesc = mybook.bookdesc;
        vm.request = null;
        vm.roles = roles;

        vm.userRoles = mybook.roles;
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
	vm.mybookStatuses = mybook.bookstatus;
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
	vm.bookOwers = mybook.bookower;
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

        function editMyBook() {
            if (!isValid()) {
                return;
            }
            vm.request = {
                bookname: mybook.bookname,
                bookauthor: vm.bookauthor,
                bookdesc: vm.bookdesc,
		bookstatus: vm.bookStatuses,
		bookower: vm.bookOwers
            }
            $http
                .post('/api/mybooks', vm.request)
                .success(function(data, status, headers, config) {
                    $state.transitionTo('dashboard.mybooks');
                })
            .error(function(data, status, headers, config) {
                vm.error = data;
            });
        }
    }
})();

