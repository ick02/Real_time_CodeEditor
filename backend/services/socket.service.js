const { generateFile } = require("./generateFile");
const {
  cCodeRunner,
  cppCodeRunner,
  javaCodeRunner,
  pythonCodeRunner,
  jsCodeRunner,
} = require("./codeRunner");

const socketOnRun = async ({ code, extension = "c" }) => {
    try {
      const filePath = await generateFile(code, extension);
      let output;
      const startedAt = new Date();
      if (extension === "c") output = await cCodeRunner(filePath);
      else if (extension === "cpp") output = await cppCodeRunner(filePath);
      else if (extension === "java") output = await javaCodeRunner(filePath);
      else if (extension === "py") output = await pythonCodeRunner(filePath);
      else if (extension === "js") output = await jsCodeRunner(filePath);

      const endedAt = new Date();
      io.to(socket.id).emit(ACTIONS.RETURN, {
        output,
        success: true,
        startedAt,
        endedAt,
      });
    } catch (err) {
      io.to(socket.id).emit(ACTIONS.RETURN, {
        output: err,
        success: false,
      });
    }
  };


module.exports = {
    socketOnRun
}