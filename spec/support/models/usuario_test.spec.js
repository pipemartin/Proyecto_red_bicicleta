var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');
var server = require('../../bin/www'); //Para Mongoose



describe('Testing Usuarios', function() {

    beforeEach(function (done) {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, { useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'conn error'))
        db.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    });

    afterEach(function(done) {
        Reserva.deleteMany({}, function(err, success){
            if (err) console.log(err);
            Usuario.deleteMany({}, function(err, success){
                if (err) console.log(err);
                Bicicleta.deleteMany({}, function(err, success){
                    if (err) console.log(err);
                    mongoose.disconnect(err); 
                    done();
                });
            });
        });
    });

    describe('Cuando un Usuario reserva una bici',() => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({nombre: 'Martín'});
            usuario.save(function(err, user){
                const bicicleta = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                bicicleta.save(function(err, bici){
                    var hoy = new Date();
                    var mañana = new Date();
                    mañana.setDate(hoy.getDate()+1); //tambien podemos hacer add day con Moment
                    user.reservar(bicicleta.id, hoy, mañana, function(err, reserva){
                        Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                            console.log(reservas[0]);
                            expect(reservas.length).toBe(1);
                            expect(reservas[0].diasDeReserva()).toBe(2);
                            expect(reservas[0].bicicleta.code).toBe(1);
                            expect(reservas[0].usuario.nombre).toBe(user.nombre);
                            done();
                        });
                    });
                });
            });
        });
    });
});