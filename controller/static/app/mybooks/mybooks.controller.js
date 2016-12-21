(function(){
	'use strict';

	angular
		.module('shipyard.mybooks')
		.controller('MyBooksController', MyBooksController);

	MyBooksController.$inject = ['mybooks', 'roles', 'MyBooksService', 'AuthService', '$state', '$timeout'];
	function MyBooksController(mybooks, roles, MyBooksService, AuthService, $state, $timeout) {
            var vm = this;
            vm.refresh = refresh;
            vm.selectedMyBook = null;
            vm.removeMyBook = removeMyBook;
            vm.showRemoveMyBookDialog = showRemoveMyBookDialog;
            vm.returnMyBook = returnMyBook;
            vm.showReturnMyBookDialog = showReturnMyBookDialog;
            vm.borrowMyBook = borrowMyBook;
            vm.showBorrowMyBookDialog = showBorrowMyBookDialog;
            vm.username = AuthService.getUsername();
            vm.userrole = AuthService.getRole(vm.username);
            vm.mybooks = mybookFilter(mybooks, vm.username);

            function showRemoveMyBookDialog(mybook) {
                vm.selectedMyBook = mybook;
                $('#remove-modal').modal('show');
            }

            function showReturnMyBookDialog(mybook) {
                vm.selectedMyBook = mybook;
                $('#return-modal').modal('show');
            }

            function showBorrowMyBookDialog(mybook) {
                if (mybook.bookower != vm.username) {
                    return ;
                }
                vm.selectedMyBook = mybook;
                $('#borrow-modal').modal('show');
            }

            function mybookFilter(mybooks, username) {
                var j = 0;
                var books = new Array();
                for (var i = 0; i < mybooks.length; i++) {
                    var book = mybooks[i];
                    if (book.bookower == null) {
                        continue;
                    }
                    if (book.bookower.length < 0) {
                        continue;
                    }
                    if (book.bookower[0] != username) {
                        continue;
                    }
                    books[j++] = book;
                }
                return books;
            }

            function refresh() {
                MyBooksService.list()
                    .then(function(data) {
                        vm.mybooks = mybookFilter(data, vm.username); 
                    }, function(data) {
                        vm.error = data;
                    });
                vm.error = "";
            }

            function removeMyBook() {
                MyBooksService.removeMyBook(vm.selectedMyBook)
                    .then(function(data) {
                        vm.refresh();
                    }, function(data) {
                        vm.error = data;
                    });
            }

            function borrowMyBook() {
                MyBooksService.borrowMyBook(vm.selectedMyBook, vm.username)
                    .then(function(data) {
                        vm.refresh();
                    }, function(data) {
                        vm.error = data;
                    });
            }
            
            function returnMyBook() {
                MyBooksService.returnMyBook(vm.selectedMyBook)
                    .then(function(data) {
                        vm.refresh();
                    }, function(data) {
                        vm.error = data;
                    });
            }
            
	}
})();
