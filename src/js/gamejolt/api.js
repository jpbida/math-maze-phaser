'use strict';
/* global window, XMLHttpRequest */
var Promise = require('promise');
var url = require('url');
var md5 = require('js-md5');

var settings = require('./settings.js');

var API = {
	init: function() {
		return this.getUser();
	},
	user: null,
	sendRequest: function(uri) {
		console.log('uri', uri);
		return new Promise(function(resolve, reject) {
			var signature = md5(uri + settings.privateKey);
			uri += '&signature=' + signature;
			
			var request = new XMLHttpRequest();
			request.open('GET', uri, true);
			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					var data = JSON.parse(request.responseText);
					resolve(data);
				} else {
					reject();
				}
			};
			request.send();
		});
	},
	getUser: function() {
		return new Promise(function(resolve, reject) {
			if (API.user === null) {
				var urlParts = url.parse(window.location.href, true);
				var params = urlParts.query;

				
				API.user = {
					username: params.gjapi_username || '',
					token: params.gjapi_token || '',
					guest: typeof(params.gjapi_username) === 'undefined' || typeof(params.gjapi_token) === 'undefined'
				};
			
				return API.sendRequest('http://gamejolt.com/api/game/v1/users/auth/?game_id=' + settings.gameId + '&username=' + API.user.username + '&user_token=' + API.user.token + '&format=json')
					.then(function() {
						resolve(API.user);
					})
					.catch(function() {
						API.user = null;
						reject();
					});
			} else {
				resolve(API.user);
			}
		});
	},
	setData: function(key, data) {
		var uri = 'http://gamejolt.com/api/game/v1/data-store/set/?game_id=' + settings.gameId + '&key=' + key + '&data=' + data + '&format=json';

		return API.sendRequest(uri);
	},
	getData: function(key) {
		var uri = 'http://gamejolt.com/api/game/v1/data-store/?game_id=' + settings.gameId + '&key=' + key + '&format=json';

		return API.sendRequest(uri);
	},
	setUserData: function(key, data) {
		return API.getUser()
			.then(function() {
				var uri = 'http://gamejolt.com/api/game/v1/data-store/set/?game_id=' + settings.gameId + '&username=' + API.user.username + '&user_token=' + API.user.token + '&key=' + key + '&data=' + data + '&format=json';
				
				return API.sendRequest(uri);
			});
	},
	getUserData: function(key) {
		return API.getUser()
			.then(function() {
				var uri = 'http://gamejolt.com/api/game/v1/data-store/?game_id=' + settings.gameId + '&username=' + API.user.username + '&user_token=' + API.user.token + '&key=' + key + '&format=json';
				
				return API.sendRequest(uri);
			});
	},
	setTrophies: function() {
		// TODO: implement 
	},
	getTrophies: function() {
		// TODO: implement 
	},
	setUserScore: function(score, value, tableId) {
		return API.getUser()
			.then(function() {
				var uri = 'http://gamejolt.com/api/game/v1/scores/add/?game_id=' + settings.gameId + '&username=' + API.user.username + '&user_token=' + API.user.token + '&score=' + score + '&sort=' + value + '&format=json';
				
				if (typeof tableId !== 'undefined') {
					uri += '&table_id=' + tableId;
				}
				
				return API.sendRequest(uri);
			});
	},
	getScore: function() {
		// TODO: implement 
	}
};

module.exports = API;