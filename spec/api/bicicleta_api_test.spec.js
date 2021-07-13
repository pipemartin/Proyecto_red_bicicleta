var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');
var mongoose = require('mongoose');

var baseURL = 'http://localhost:3000/api/bicicletas'

describe('Bicicleta API', () => {
    beforeAll((done) => {
        mongoose.connection.close().then(() => {
            var mongoDB = 'mongodb://localhost/testdb';
            mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.set('useCreateIndex', true);

            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error: '));
            db.once('open', function () {
                console.log('We are connected to test database!');
                done();
            });

        }); 

        

    });

    afterEach((done) => {
        Bicicleta.deleteMany({}, function (err, success) {
            if (err) {
                console.log(err);
            }
            mongoose.disconnect(err); 
            done();
        });
    });

    describe('GET Bicicletas /', () => {
        it('Status 200', (done) => {
            request.get(baseURL, function (err, resp, body) {
                var result = JSON.parse(body);
                expect(resp.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);

                done();
            });
        });
    });

    describe('POST Bicicletas /create', () => {
        it('Status 200', (done) => {
            var headers = { 'content-type': 'application/json' };
            var bici = '{ "code": 2, "color": "negro", "modelo": "montaña", "lat": 3.4760683, "lng": -76.4887271 }';

            request.post({
                headers: headers,
                url: `${baseURL}/create`,
                body: bici
            }, function (err, resp, body) {
                expect(resp.statusCode).toBe(200);

                var oBici = JSON.parse(body).bicicleta;
                console.log(oBici);

                expect(oBici.color).toBe('negro');
                expect(oBici.modelo).toBe('montaña');
                expect(oBici.ubicacion[0]).toBe(3.4760683);
                expect(oBici.ubicacion[1]).toBe(-76.4887271);

                done();
            });

        });
    });

    describe('UPDATE Bicicletas /update', () => {
        it('Status 200', (done) => {
            var headers = { 'content-type': 'application/json' };
            var bici = '{ "code": 3, "color": "azul", "modelo": "urbana", "lat": 3.4760683, "lng": -76.4887271 }';

            var a = new Bicicleta({
                code: 3,
                color: 'rojo',
                modelo: 'montaña',
                ubicacion: [3.4693968, -76.4887123]
            });

            Bicicleta.add(a, function (err, newBici) {
                request.put({
                    headers: headers,
                    url: `${baseURL}/update`,
                    body: bici
                }, function (err, resp, body) {
                    expect(resp.statusCode).toBe(200);

                    Bicicleta.findByCode(a.code, function (err, targetBici) {
                        console.log(targetBici);

                        expect(targetBici.color).toBe('azul');
                        expect(targetBici.modelo).toBe('urbana');
                        expect(targetBici.ubicacion[0]).toBe(3.4760683);
                        expect(targetBici.ubicacion[1]).toBe(-76.4887271);

                        done();
                    });
                });
            });
        });
    });

    describe('DELETE Bicicletas /delete', () => {
        it('Status 204', (done) => {
            var a = Bicicleta.createInstance(4, 'gris', 'urbana', [3.4693968, -76.4887123]);

            Bicicleta.add(a, function (err, newBici) {
                var headers = { 'content-type': 'application/json' };
                var bici = '{ "code": 4 }';

                request.delete({
                    headers: headers,
                    url: `${baseURL}/delete`,
                    body: bici
                }, function (err, resp, body) {
                    expect(resp.statusCode).toBe(204);

                    Bicicleta.allBicis(function (err, newBicis) {
                        expect(newBicis.length).toBe(0);

                        done();
                    });
                });
            });
        });
    });

});