const { Router } = require("express");
const path = require("path");
const fs = require("fs").promises;

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { filename: fileName } = req.query;
    let filePath;
    if (fileName) {
      filePath = path.join(__dirname, "..", "files", `${fileName}`);
    } else {
      filePath = path.join(__dirname, "..", "files", "default.zip");
    }
    await fs.access(filePath);

    // send download file
    return res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).send("Error downloading file.");
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, error: error.message });
  }
});

module.exports = router;
