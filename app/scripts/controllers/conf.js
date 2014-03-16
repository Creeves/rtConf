'use strict';
var webrtc, users;
angular.module('confApp')
  .controller('ConfCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.user = $routeParams.user;
    $scope.users = [];
    users = $scope.users;
    webrtc = new SimpleWebRTC({
	// the id/element dom element that will hold "our" video
	localVideoEl: 'localVideo',
	// the id/element dom element that will hold remote videos
	remoteVideosEl: 'remotesVideos',
	// immediately ask for camera access
	autoRequestMedia: true,
	media: {audio:false,video:true}
	});
	webrtc.on('readyToCall', function () {
	  // you can name it anything
	  webrtc.joinRoom('conf');
	 
	});
	$scope.$watch('users', function(users) {
		console.log('there are ' + users.length + ' users');
	}, true);


	webrtc.on('videoAdded', function (video, peer) {
			peer.send('chatdata', {
		  	 	user: $scope.user, 
		  	 	data:'set_user'
		  	 });
			if ($('#' + peer.id).length == 0 && userExists(peer.id) == true) {
				$('#' + peer.id + '_video_incoming').after('<label class="vidlbl" id="' + peer.id + '">' + userIdToName(peer.id) + '</label>');
			}

	});

	var userExists = function(id) {
		var found = false;
		$scope.users.forEach(function(u) {
			if (u.id == id) {
				found = true;
			}
		});
		if (found) {
			return true;
		} else {
			return false;
		}

	};

	var userIdToName = function(id) {
		var found = false;
		$scope.users.forEach(function(u) {
			if (u.id == id) {
				found = u.user;
			}
		});
		if (found) {
			return found;
		} else {
			return false;
		}

	};
	webrtc.on('videoRemoved', function (video) {
		$('#' + $(video).attr('id').substring(0, 20)).remove();
		$scope.users.forEach(function (user_, i) {
			if (user_.id == $(video).attr('id').substring(0, 20)) {
				$scope.users.splice(i, 1);
			}	
		});
	});

	webrtc.on('chatdata', function (payload) {
		console.log(payload);
		var message = payload.payload;
		if (message.data == 'set_user' && message.user != $scope.user) {

			console.log($('#' + payload.from + '_video_incoming').length);
			// Add the user to the list:
			$scope.users.push({id: payload.from, user: message.user});
			if ($('#' + payload.from).length == 0) {
				$('#' + payload.from + '_video_incoming').after('<label class="vidlbl" id="' + payload.from + '">' + message.user + '</label>');
			}
		}
	});

	webrtc.on('chat', function (payload) {
		payload = payload.payload;
		if (payload.user != $scope.user) {
			$('ul.chat').append('<label>' + payload.user + ':</label><li>' + payload.data + '</li>');
			$('ul.chat').parent().scrollTop($('ul.chat').parent().height());
		}	  
	});

	$('.input-sm').on('keydown chatevent', function (e) {
    	if ((e.keyCode && e.keyCode === 13) || e.type == "chatevent") {
    		var msg = $(this).val();
    		$('ul.chat').append('<label>' + $scope.user + ':</label><li>' + msg + '</li>');
			$('ul.chat').parent().scrollTop($('ul.chat').parent().height());
    		$(this).val('');
    		webrtc.webrtc.sendToAll('chat', {user: $scope.user, data: msg});
    		return false;
    	}
    });

    $('#btn-chat').on('click', function() {
    	$('.input-sm').trigger('chatevent');
    });
  }]);
