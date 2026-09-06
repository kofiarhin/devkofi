const BlogPost = require("../models/BlogPost");

const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 50;

const toPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const listPublishedPosts = async (req, res, next) => {
  try {
    const page = toPositiveInteger(req.query.page, 1);
    const requestedLimit = toPositiveInteger(req.query.limit, DEFAULT_PAGE_SIZE);
    const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);
    const filter = { status: "published" };
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalPosts / limit));

    return res.status(200).json({
      posts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getPublishedPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!post) {
      return res.status(404).json({ success: false, error: "Article not found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listPublishedPosts, getPublishedPost };
