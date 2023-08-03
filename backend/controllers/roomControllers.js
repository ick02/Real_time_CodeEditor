const { v4: uuid } = require('uuid');
const Room = require('../models/roomModel');

const createRoom = async (req, res) => {
    try {
        const roomId = uuid();
        const newRoom = await Room.create({roomId: roomId})
        return res.status(201).json({
            roomId: newRoom.roomId,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const deleteRoom = async (req, res) => {
    const { roomId } = req.params
    await Room.delete({ roomId: roomId })
    return res.status(204).json({
        success: true
    })
}
 
const verifyRoom = async (req, res) => { 
    const room = await Room.findOne({ roomId: req.params.roomId })
    if (room) {
        return res.status(200).json({
            message: 'Room exists'
        })
    }
    else {
        return res.status(404).json({
            message: 'Invalid room id'
        })
    }
}

module.exports = {
    createRoom,
    deleteRoom,
    verifyRoom,
}