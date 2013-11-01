/**
* Generate MongoDB url
*/

exports.generate_mongo_url = function() {
    if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
        var mongo = env['mongodb-1.8'][0]['credentials'];
    } else {
        var mongo = {
            "hostname": "localhost",
            "port": 27017,
            "username": "",
            "password": "",
            "name": "",
            "db": "appians_medical" // Se debe componer con el id de instancia
        }
    }

    var obj = mongo;

    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if (obj.username && obj.password) {
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    } else {
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}