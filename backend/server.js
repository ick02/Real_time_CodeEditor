const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const { ACTIONS } = require("./actions");
const { generateFile } = require("./services/generateFile");
const {
  cCodeRunner,
  cppCodeRunner,
  javaCodeRunner,
  pythonCodeRunner,
  jsCodeRunner,
} = require("./services/codeRunner");
const roomRoutes = require("./routes/roomRoutes");
const {mapUserToRoom, getCurrentUser, deleteUser} = require("./services/room.service");

dotenv.config({ path: path.join(__dirname, `./.env`) });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors())

app.use("/room", roomRoutes);

app.use(express.static('dist'))
app.use((req, res, next) => { 
  res.sendFile(path.join(__dirname,'dist', 'index.html'));
})

io.on("connection", async (socket) => {
  // Socket: Listening for disconnecting
  socket.on("disconnecting", async () => {
    const rooms = [...socket.rooms];
    const user = await getCurrentUser(socket.id);
    rooms.forEach((room) => {
      socket.in(room).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        user
      })
    })
    await deleteUser(socket.id)
    socket.leave()
  });

  // Socket: Listen for Code Run Events
  socket.on(ACTIONS.RUN, async ({ roomId, code, extension = "c", input=null }) => {
    try {
      // const filePath = await generateFile(code, extension);
      // let output;
      let res;
      if (extension === "c") {
        try {
          res = await cCodeRunner(code, input);
        }
        catch (err) {
          res = err.response;
        }
      }
      else if (extension === "cpp") {
        try {
          res = await cppCodeRunner(code, input);
        }
        catch (err) {
          res = err.response;
        }
      }
      else if (extension === "java") {
        try {
          res = await javaCodeRunner(code, input);
        }
        catch (err) {
          res = err.response;
        }
      }
      else if (extension === "py") {
        try {
          res = await pythonCodeRunner(code, input);
        }
        catch (err) {
          res = err.response;
        }
      }
      else if (extension === "js") {
        try {
          res = await jsCodeRunner(code, input);
        }
        catch (err) {
          res = err.response;
        }
      }
      let output;
      let cpuTime;
      let memory;
      if (res.response?.data.error) {
        output = res.response.data.output
        cpuTime = null;
        memory = null;
      }
      else {
        output = res.data.output;
        cpuTime = res.data.cpuTime;
        memory = res.data.memory;
      }
      io.in(roomId).emit(ACTIONS.RETURN, {
        output: output,
        success: true,
        cpuTime: cpuTime,
        memory: memory
      });
    } catch (err) {
      io.in(roomId).emit(ACTIONS.RETURN, {
        output: err,
        success: false,
      });
    }
  });

  // Socket: Listen for Join Event
  socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
    socket.join(roomId);
    const room = await mapUserToRoom(roomId, username, socket.id);
    const users = room.users;
    const currentUser = await getCurrentUser(socket.id);

    users.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        users,
        currentUser,
        socketId: socket.id,
      });
    });
  });

  // Socket: Listening for code sync
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, roomId }) => { 
      socket.to(roomId).emit(ACTIONS.SYNC_CODE, {
        socketId,
      });
  })

  // Socket: Listening for code changes
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      code
    })
  })
});


const connectDataBase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
connectDataBase().then(server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
}));
