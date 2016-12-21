(function(){
    'use strict';

    angular
        .module('shipyard', [
                'shipyard.books',
                'shipyard.mybooks',
                'shipyard.accounts',
                'shipyard.core',
                'shipyard.services',
                'shipyard.layout',
                'shipyard.help',
                'shipyard.login',
                'shipyard.events',
                'shipyard.filters',
                'angular-jwt',
                'base64',
                'selectize',
                'ui.router'
        ]);

})();
