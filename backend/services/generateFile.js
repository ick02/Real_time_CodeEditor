const fs = require('fs');
const path = require('path');
const { v4:uuid } = require('uuid');

const codeDir = path.join(__dirname, "codes")

if (!fs.existsSync(codeDir)) {
    fs.mkdirSync(codeDir, {recursive: true});
}

const generateFile = async (code, extension) => {
    const fileId = uuid();
    const filename = `${fileId}.${extension}`;
    const filePath = path.join(codeDir, filename);

    await fs.writeFileSync(filePath, code);
    return filePath;
}

const deleteFile = async (filePath) => {
    fs.unlinkSync(filePath)
    return
}

module.exports = {
    generateFile,
    deleteFile
}