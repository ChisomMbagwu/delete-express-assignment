const fs = require("fs").promises;

async function writeFile(file) {
  try {
    await fs.writeFile("./db/database.json", JSON.stringify(file, null, 2), "utf-8");
    console.log("File written successfully");
  } catch (error) {
    console.error("Error writing to file", error);
  }
}

module.exports = writeFile;