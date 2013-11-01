var cronJob = require('cron').CronJob,
	mongoose = require('mongoose'),
	moment = require('moment'),
	notifications = require('./notifications');

exports.start = function() {
	// '00 00 5 * * *'

	var job = new cronJob({
		cronTime: '00 00 5 * * *',
		onTick: function() {
			//runs once at the specified date.
			mongoose.model('Calendar').find({
				startTime: {
					$gte: moment().hour(0).minute(0).second(0).toDate(),
					$lt: moment().add('d', 1).hour(0).minute(0).second(0).toDate()
				}
			}, function(err, data) {
				for (var i in data) {
					var doc = data[i];

					mongoose.model('User').findById(doc.user, function(err, user) {
						mongoose.model('User').findById(doc.owner, function(err, adminUser) {
							var text = "Usted tiene programado un turno para hoy: <br/>"
							text += "Médico: " + adminUser.firstname + ' ' + adminUser.lastname + '<br/>';
							text += "Hora: " + moment(doc.startTime).format('LT');

							notifications.send_email(user.email, 'Recordatorio', 'Recordatorio', doc.user_name, text);

							notifications.short_message(user.phone, "Hoy " + moment(doc.startTime).format('LT') + ' tiene turno con ' + adminUser.firstname + ' ' + adminUser.lastname + '. Gracias.', user.whatsapp);
						});
					});

				}
			});
		},
		onComplete: function() {
			// This function is executed when the job stops
		},
		start: true
	});
	job.start();
}