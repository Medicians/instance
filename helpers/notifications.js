var request = require('request'),
	mongoose = require('mongoose'),
	_ = require('underscore');

exports.send_ics_email = function(to, subject, startTime, endTime, eventSummary, title, name, text) {
	var sign_logo = app.get('server_url') + '/images/logo_email.png';

	mongoose.model('Config').find({}, function(err, configs) {
		var config = configs[0];

		request.post( app.get('nserver') + '/send_email', {
			form: {
				from: config.email,
				to: to,
				subject: subject,
				startTime: startTime,
				endTime: endTime,
				eventSummary: eventSummary,
				title: title,
				name: name,
				text: text,
				sign_name: config.title,
				sign_phone: config.phone,
				sign_logo: sign_logo,
				ics: 1
			}
		});
	});
};

exports.send_email = function(to, subject, title, name, text) {
	var sign_logo = app.get('server_url') + '/images/logo_email.png';

	mongoose.model('Config').find({}, function(err, configs) {
		var config = configs[0];

		request.post( app.get('nserver') + '/send_email', {
			form: {
				from: config.email,
				to: to,
				subject: subject,
				title: title,
				name: name,
				text: text,
				sign_name: config.title,
				sign_phone: config.phone,
				sign_logo: sign_logo,
				ics: 0
			}
		});
	});
};

exports.short_message = function(number, text, whatsapp) {
	if (_.isUndefined(number) || number == null) return;

	request.post( app.get('nserver') +  '/send_short_message', {
		form: {
			number: number,
			text: text,
			whatsapp: ( (whatsapp == true && whatsapp != undefined) ? 1 : 0)
		}
	});
};