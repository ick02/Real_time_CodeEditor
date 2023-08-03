const Router = require('express')

const { createRoom, verifyRoom } = require('../controllers/roomControllers');

const routes = Router();

routes.post('/create', createRoom)
routes.get('/verify/:roomId', verifyRoom)

module.exports = routes;