const { Router } = require("express");
const {
  listPublishedPosts,
  getPublishedPost,
} = require("../controllers/blogController");

const router = Router();

router.get("/", listPublishedPosts);
router.get("/:slug", getPublishedPost);

module.exports = router;
