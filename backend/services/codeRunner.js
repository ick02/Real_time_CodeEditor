const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const outputDir = path.join(__dirname, "output");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Native Code Runners start

const cCodeRunnerNative = (filePath) => {
  const fileId = path.basename(filePath).split(".")[0];
  const outputPath = path.join(outputDir, `${fileId}.out`);
  return new Promise((resolve, reject) => {
    exec(
      `gcc ${filePath} -o ${outputPath} && cd ${outputDir} && ${fileId}.out`,
      (error, stdout, stderr) => {
        if (error) reject({ error, stderr });
        if (stderr) reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const cppCodeRunnerNative = (filePath) => {
  const fileId = path.basename(filePath).split(".")[0];
  const outputPath = path.join(outputDir, `${fileId}.out`);
  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outputPath} && cd ${outputDir} && ${fileId}.out`,
      (error, stdout, stderr) => {
        if (error) reject({ error, stdout, stderr });
        if (stderr) reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const javaCodeRunnerNative = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(
      `javac -d ${outputDir} ${filePath} && java -cp ${outputDir} HelloWorld`,
      (error, stdout, stderr) => {
        if (error) reject({ error, stdout, stderr });
        if (stderr) reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const pythonCodeRunnerNative = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`python ${filePath}`, (error, stdout, stderr) => {
      if (error) reject({ error, stdout, stderr });
      if (stderr) reject(stderr);
      resolve(stdout);
    });
  });
};

const jsCodeRunnerNative = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`node ${filePath}`, (error, stdout, stderr) => {
      if (error) reject({ error, stdout, stderr });
      if (stderr) reject(stderr);
      resolve(stdout);
    });
  });
};

// Native Code Runner ends


// API Code Runner starts

const cCodeRunner = async (code, input = null) => {
  const data = {
    language:"c",
    version: "latest",
    code: code,
    input:input,
  }
  const options = {
    method: "POST",
    url: process.env.COMPILER_API_URL,
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.COMPILER_API_KEY,
      "X-RapidAPI-Host": process.env.COMPILER_API_HOST,
    },
    data: data,
  };
  try {
    const response = await axios.request(options);
    return response
  }
  catch (err) {
    return err;
  }
}

const pythonCodeRunner = async (code, input = null) => {
  const data = {
    language: "python3",
    version: "latest",
    code: code,
    input: input,
  };
  const options = {
    method: "POST",
    url: process.env.COMPILER_API_URL,
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.COMPILER_API_KEY,
      "X-RapidAPI-Host": process.env.COMPILER_API_HOST,
    },
    data: data,
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (err) {
    return err;
  }
}

const cppCodeRunner = async (code, input = null) => {
  const data = {
    language: "cpp17",
    version: "latest",
    code: code,
    input: input,
  };
  const options = {
    method: "POST",
    url: process.env.COMPILER_API_URL,
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.COMPILER_API_KEY,
      "X-RapidAPI-Host": process.env.COMPILER_API_HOST,
    },
    data: data,
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (err) {
    return err;
  }
}

const javaCodeRunner = async (code, input) => {
  const data = {
    language: "java",
    version: "latest",
    code: code,
    input: input,
  };
  const options = {
    method: "POST",
    url: process.env.COMPILER_API_URL,
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.COMPILER_API_KEY,
      "X-RapidAPI-Host": process.env.COMPILER_API_HOST,
    },
    data: data,
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (err) {
    return err;
  }
}

const jsCodeRunner = async (code, input) => {
  const data = {
    language: "nodejs",
    version: "latest",
    code: code,
    input: input,
  };
  const options = {
    method: "POST",
    url: process.env.COMPILER_API_URL,
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.COMPILER_API_KEY,
      "X-RapidAPI-Host": process.env.COMPILER_API_HOST,
    },
    data: data,
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (err) {
    return err;
  }
}

// API Code Runner ends

module.exports = {
  cCodeRunner,
  cppCodeRunner,
  javaCodeRunner,
  pythonCodeRunner,
  jsCodeRunner,
};
