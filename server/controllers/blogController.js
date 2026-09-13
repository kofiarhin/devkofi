const ideaHubBlogService = require("../services/ideaHubBlogService");

const listPublishedPosts = async (req, res, next) => {
  try {
    const posts = await ideaHubBlogService.getPublishedPosts();
    return res.status(200).json({ posts });
  } catch (error) {
    return next(error);
  }
};

const getPublishedPost = async (req, res, next) => {
  try {
    const post = await ideaHubBlogService.getPublishedPost(req.params.slug);
    return res.status(200).json({ post });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listPublishedPosts, getPublishedPost };
