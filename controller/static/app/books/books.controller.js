(function(){
	'use strict';

	angular
		.module('shipyard.books')
		.controller('BooksController', BooksController);

	BooksController.$inject = ['books', 'roles', 'BooksService', 'AuthService', '$state', '$timeout'];
	function BooksController(books, roles, BooksService, AuthService, $state, $timeout) {
            var vm = this;
            vm.books = books;
            vm.refresh = refresh;
            vm.selectedBook = null;
            vm.removeBook = removeBook;
            vm.showRemoveBookDialog = showRemoveBookDialog;
            vm.returnBook = returnBook;
            vm.showReturnBookDialog = showReturnBookDialog;
            vm.borrowBook = borrowBook;
            vm.showBorrowBookDialog = showBorrowBookDialog;
            vm.username = AuthService.getUsername();
            vm.userrole = AuthService.getRole(vm.username);

            function showRemoveBookDialog(book) {
                vm.selectedBook = book;
                $('#remove-modal').modal('show');
            }

            function showReturnBookDialog(book) {
                if (book.bookower != vm.username) {
                    return ;
                }
                vm.selectedBook = book;
                $('#return-modal').modal('show');
            }

            function showBorrowBookDialog(book) {
                vm.selectedBook = book;
                $('#borrow-modal').modal('show');
            }

            function refresh() {
                BooksService.list()
                    .then(function(data) {
                        vm.books = data; 
                    }, function(data) {
                        vm.error = data;
                    });
                vm.error = "";
            }

            function removeBook() {
                BooksService.removeBook(vm.selectedBook)
                    .then(function(data) {
                        vm.refresh();
                    }, function(data) {
                        vm.error = data;
                    });
            }

            function borrowBook() {
                BooksService.borrowBook(vm.selectedBook, vm.username)
                    .then(function(data) {
                        vm.refresh();
                    }, function(data) {
                        vm.error = data;
                    });
            }
            
            function returnBook() {
                BooksService.returnBook(vm.selectedBook)
                    .then(function(data) {
                        vm.refresh();
                    }, function(data) {
                        vm.error = data;
                    });
            }
            
	}
})();
