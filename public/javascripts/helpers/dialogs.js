define(['jquery', 'jquery_mobile'], function($) {

	return {
		init: function() {
			$("#dialogs").trigger('create');
			$("#dialogs").show();
		},

		message: function(title, message) {
			$("#toastPopup .popup_text").text(message);
			$("#toastPopup").popup('open');

			setTimeout(function() {
				$("#toastPopup").popup('close');
			}, 3000);
		},

		toast: function(message) {
			$("#toastPopup .popup_text").text(message);
			$("#toastPopup").popup('open');

			setTimeout(function() {
				$("#toastPopup").popup('close');
			}, 3000);
		},

		ask: function(title, message, callback) {
			$("#dialogPopup .title").text(title);
			$("#dialogPopup .text").text(message);

			$("#dialogPopup").popup('open');

			$("#dialogPopup .no_dialog").on('tap', function(e) {
				$("#dialogPopup").popup('close');				

				callback(e, false);

				return false;
			});

			$("#dialogPopup .yes_dialog").on('tap', function(e) {
				$("#dialogPopup").popup('close');				

				callback(e, true);

				return false;
			});
		}
	};

});