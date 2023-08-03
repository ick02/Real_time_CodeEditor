const Room = require("../models/roomModel");
const User = require("../models/userModel");

const mapUserToRoom = async (roomId, username, socketId) => {
  const user = await User.create({ username: username, socketId: socketId });
  // room.users.push()
  await Room.findOneAndUpdate(
    { roomId: roomId },
    {
      $push: { users: user },
    }
  );
  const room = await Room.findOne({ roomId: roomId }).populate({
    path: "users",
  });
  // console.log(users)
  return room;
};

const getCurrentUser = async (socketId) => {
  const user = await User.findOne({ socketId: socketId });
  return user;
};

const deleteUser = async (socketId) => {
  await User.deleteOne({ socketId: socketId });
};

module.exports = {
  mapUserToRoom,
  getCurrentUser,
  deleteUser,
};
