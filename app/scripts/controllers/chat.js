'use strict';
var webrtc;
angular.module('confApp')
  .controller('ChatCtrl', function ($scope) {

   var room = 'test', nick = Math.random().toString(36).substring(7), query,
            	$messages = $('#messages');

        	
        	function renderChat(message) {
        		$messages.append($('<li/>').addClass('message').html('<span>' + message.from + ':</span> ' + message.msg));
        	}
        	if (room) {
        		$('#room, #room_label').hide();
        		$('#room_btn').text('Set Nickname');
        		$('h1').text('Chatting in ' + room + ' as ' + (nick||'[Anonymous]'));
        	}
            var webrtc = new SimpleWebRTCData({debug: true});

            webrtc.on('readyToCall', function () {
            	if (room) webrtc.joinRoom(room);
            });

            webrtc.on('data', function (message) {
            	console.log('message ' + message);
            	renderChat(message.payload);
            });

            function joinRoom(name, nick) {
            	$('body').addClass('active');
            	$('h1').text('Chatting in ' + room + ' as ' + nick);
            	$('.join_link').text('Others can join here: ' + location.href);
            }

            if (room && nick) {
            	joinRoom(room, nick);
            } else {
            	$('.room_form').submit(function (e) {
            		var room_set = !!room;
            		room = $(this).find('#room').val() || room;
        			nick = $(this).find('#nick').val();
            		console.log('room name is ' + room);

            		if (!room_set) {
            			webrtc.createRoom(room, function (err, name) {
	            			console.log(' create room cb', arguments);
	                    
	                        var newUrl = location.pathname + '?room=' + name;
	                        if (!err) {
	                            history.replaceState({foo: 'bar'}, null, newUrl);
	                            joinRoom(room, nick);
	                        } else {
	                            console.log(err);
	                            if (err === 'taken') {
	                            	webrtc.joinRoom(room)
	                            }
	                        }
	            		});
            		} else {
            			joinRoom(room, nick);
            			webrtc.joinRoom(room);
            		}
            		
            		return false;
            	});
            }

            $('textarea').on('keydown', function (e) {
            	if (e.keyCode && e.keyCode === 13) {
            		var $this = $(this),
            			msg = $this.val(),
            			payload = {from: nick, msg: msg};
            		renderChat(payload);
            		$this.val('');
            		webrtc.sendToAll('data', payload);
            		return false;
            	}
            });
  });
