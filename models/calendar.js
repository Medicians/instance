var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types,
    moment = require('moment'),
    notifications = require('../helpers/notifications');

moment.lang('es');

var schema = mongoose.Schema({
	user: { type: Types.ObjectId, ref: 'User', required: true },
	user_name: { type: String, required: true },
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
	confirmed: { type: Boolean, default: false, required: true },
	special: { type: Boolean, default: false, required: true },
	updated: { type: Date, required: false },
	owner: { type: Types.ObjectId, ref: 'User', required: true },
	updated_at : { type: Date },
	created: { type: Date, 'default' : (new Date()) }
});

schema.pre('save', function(next) {
	// Update updated
  	this.updated_at = (new Date());

  	next();
});

schema.post('save', function (doc) {
	mongoose.model('User').findById(doc.user, function(err, user) {
		mongoose.model('User').findById(doc.owner, function(err, adminUser) {
			var text = '';
			
			var title = 'Nuevo turno';
			if( doc.updated != undefined ) {
				title = 'Cambio de Turno';

				text += "Su turno ha sido actualizado: <br/>";
				text += "Médico: " + adminUser.firstname + ' ' + adminUser.lastname + '<br/>';
				text += "Turno anterior: " + moment( doc.updated ).format('LLL');
				text += "<br/>Nuevo turno: " + moment( doc.startTime ).format('LLL');
			} else {
				text += "Su turno: <br/>";
				text += "Médico: " + adminUser.firstname + ' ' + adminUser.lastname + '<br/>';
				text += "Fecha y Hora: " + moment( doc.startTime ).format('LLL');
			}

			text += '<br/><br/><p class="callout">Confirme su turno haciendo click en el siguiente enlace: <br/><a href="';
			text += app.get('server_url') + '/appointment/confirm/' + doc._id + '">Confirmar Turno</a></p>';

			notifications.send_ics_email(
				user.email, 
				'Confirmación Turno', 
				doc.startTime, 
				doc.endTime, 
				'Turno con ' + adminUser.firstname + ' ' + adminUser.lastname, 
				title, 
				doc.user_name,
				text);

			/*if( user.whatsapp ) {
				console.info("Trying whatsapp...");
				waa.send_message(user.phone, text);
			}*/
		});
	});

});

var Calendar = module.exports = mongoose.model('Calendar', schema);