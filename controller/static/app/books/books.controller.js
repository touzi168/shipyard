(function(){
	'use strict';

	angular
		.module('shipyard.books')
		.controller('BooksController', BooksController);

	BooksController.$inject = ['books', 'roles', 'BooksService', '$state', '$timeout'];
	function BooksController(books, roles, BooksService, $state, $timeout) {
            var vm = this;
            vm.books = books;
            vm.refresh = refresh;
            vm.selectedBook = null;
            vm.removeBook = removeBook;
            vm.showRemoveBookDialog = showRemoveBookDialog;

            function showRemoveBookDialog(book) {
                vm.selectedBook = book;
                $('#remove-modal').modal('show');
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
            
	}
})();
