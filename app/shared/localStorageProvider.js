(function() {
	"use strict";

	angular
		.module('noteapp')
		.provider('localStorageProvider', localStorageProvider);

	// TODO: Find a better way to save ls_prefix for get and set function without expose it to the outside.
	var closured_ls_prefix;
	localStorageProvider.$inject = ['ls_prefix'];

	// Bake the provider. This provider expose get and set methods to access local storage.
	function localStorageProvider(ls_prefix) {
		closured_ls_prefix = ls_prefix;
		/* jshint validthis:true */
		this.$get = function() {
			return {
				'get': get,
				'set': set
			};
		};
	}

	// Read the local storage with the provided key.
	// Store values as "jsonified" strings.
	function get(key) {
		var json = localStorage[closured_ls_prefix + key];
		
		if (typeof json === 'string') {
			return angular.fromJson(json);
		}
	}

	// Write the local storage at the provided key with the provided value.
	// Convert value into "jsonified" string.
	function set(key, value) {
		if (typeof key === 'undefined') {
			return;
		}

		localStorage.setItem(closured_ls_prefix + key, value);
	}
})();
