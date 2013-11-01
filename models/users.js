var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types,
    crypto = require('crypto'),
    Mailgun = require('mailgun').Mailgun;

var schema = mongoose.Schema({
	firstname : { type: String, required: true },
	lastname : { type: String, required: true },
	pid : { type: String, required: true },
	email : { type: String, required: true },
	phone : { type: String, required: false },
	whatsapp : { type: Boolean, required: false },
	address : { type: String, required: false },
	password: { type: String, required: false },
	type: { type: String, required: true, enum: ['admin', 'user', 'assistant'], default: 'admin'},
	updated_at : { type: Date },
	created: { type: Date, 'default' : (new Date()) }
});

var hashPass = function(password) {
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
};

schema.pre('save', function (next) {
  // Si no tiene password generar uno aleatorio y enviar por mail
  if(this.password == '' || this.password == undefined) {
  	var pss = (new Date()).getTime().toString(16);
  	
  	this.password = hashPass( pss );

  	var doc = this;
  	if( this.type == 'admin' || this.type == 'assistant' ) {
  		var mg = new Mailgun(app.get('mailgun_key'));

  		mongoose.model('Config').find({}, function(err, configs) {
			var text = "Estimado " + doc.firstname + ' ' + doc.lastname + '\n\n';
	
			text += "Su cuenta fue creada, podrá ingresar con los siguientes datos:\n"
			text += "Nombre de usuario: " + doc.email + '\n';
			text += "Contraseña: " + pss + '\n';
			text += "URL: " + app.get('server_url');

			text += "\n\n" + configs[0].title;

			mg.sendText(configs[0].email, doc.email, 'Usuario creado', text);
		});
  	}
  } else {
  	if( this.isModified('password') ) {
  		var hashed = hashPass(this.password);

  		this.password = hashed;
  	}
  }

  // Update updated
  this.updated_at = (new Date());

  next();
});

schema.static('auth', function(username, password, callback) {
	this.findOne({ email: username }, function( err, doc ) {
		if( err || doc == null || !doc ) {
			callback(false);
		} else {
			if( doc.password == hashPass( password ) ) {
				callback(doc);
			} else {
				callback(false);
			}
		}
	});
});

schema.post('save', function (doc) {

});

var user = module.exports = mongoose.model('User', schema);