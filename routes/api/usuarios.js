var express = require('express');
var router = express.Router();
var usuarioController = require('../../controllers/api/usuarioControllerApi');
router.get('/',usuarioController.usuario_list);
router.post('/create',usuarioController.usuarios_create);
router.post('/reservar',usuarioController.usuario_reservar);

module.exports = router;