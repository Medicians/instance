var mongoose = require('mongoose'),
	crypto = require('crypto'),
	_ = require('underscore');
/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		isProd: (app.get('env') != 'development')
	});
};

exports.login = function(req, res) {
	mongoose.model('User').auth(req.body.username, req.body.password, function(data) {
		if (data) {
			if (data.type == 'admin' || data.type == 'assistant') {
				res.json({
					response: true,
					data: {
						_id: data._id,
						email: data.email,
						firstname: data.firstname,
						lastname: data.lastname,
						type: data.type
					}
				});
			} else {
				res.json({
					response: false
				});
			}
		} else {
			res.json({
				response: false
			});
		}
	});
};


exports.confirm_appointment = function(req, res) {
	var moment = require('moment');

	mongoose.model('Calendar').findById(req.params.aid, function(err, data) {
		mongoose.model('User').findById(data.owner, function(err, adminUser) {
			mongoose.model('Calendar').findByIdAndUpdate(data._id, {
				$set: {
					confirmed: true
				}
			}, function(err) {
				var ics_file = 'BEGIN:VCALENDAR\n';
				ics_file += 'VERSION:2.0\n';
				ics_file += 'PRODID:-//hacksw/handcal//NONSGML v1.0//EN\n';
				ics_file += 'BEGIN:VEVENT\n';
				ics_file += 'UID:' + app.get('config_data').email + '\n';
				ics_file += 'DTSTAMP:' + moment(data.startTime).format('YYYYMMDTHHmmss') + 'Z\n'; //19970714T170000Z
				ics_file += 'ORGANIZER;CN=' + app.get('config_data').title + ':MAILTO:' + app.get('config_data').email + '\n';
				ics_file += 'DTSTART:' + moment(data.startTime).format('YYYYMMDTHHmmss') + 'Z\n';
				ics_file += 'DTEND:' + moment(data.endTime).format('YYYYMMDTHHmmss') + 'Z\n';
				ics_file += 'SUMMARY:Turno con ' + adminUser.firstname + ' ' + adminUser.lastname + '\n';
				ics_file += 'END:VEVENT\n';
				ics_file += 'END:VCALENDAR';

				res.render('confirmation', {
					data_uri: 'data:text/calendar;base64,' + new Buffer(ics_file).toString('base64')
				});
			});
		});
	});
};