const fs = require("fs");

function writeFile(data) {
  fs.writeFile("./db/products.json", JSON.stringify(data, null, 2), "utf-8", (error) => {
    if (error) {
      console.error("Error writing to file", error);
    } else {
      console.log("File written successfully");
    }
  });
}

module.exports = writeFile;