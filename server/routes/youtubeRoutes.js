const { Router } = require("express");
const { fetchYoutubeVideos } = require("../utility/helper");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const videos = await fetchYoutubeVideos();
    return res.json(videos);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
