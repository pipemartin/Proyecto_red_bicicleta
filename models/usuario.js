var mongoose = require('mongoose');
var Reserva  = require('./reserva');
var bcrypt   = require('bcrypt');
var crypto   = require('crypto');
const uniqueValidator = require('mongoose-unique-validator');
const mailer = require('../mailer/mailer');

const saltRounds = 10;

var Schema = mongoose.Schema;

const validateEmail = function(email){
    const  re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true,'El nombre es obligatorio']
    },
    email:{
        type: String,
        trim: true,
        required: [true, 'el email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'por favor, ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password:{
        type: String,
        required: [true, 'el password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado:{
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator,{message: 'El email ya existe con otro usuario'});

usuarioSchema.pre('save',function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    console.log(reserva);
    reserva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return console.log(err.message); }

        const mailOptions = {
            from: 'juanfelipem09@hotmail.com',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '\n'
        };

        mailer.sendMail(mailOptions, function (err, result) {
            if (err) { return console.log(err); }

            console.log('Se ha enviado un email de bienvenida a:  ' + email_destination + '.');
        });
    });

};

module.exports = mongoose.model('Usuario', usuarioSchema);