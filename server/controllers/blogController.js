const BlogPost = require("../models/BlogPost");

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

const PRODUCTION_AI_AGENTS_COVER = {
  slug: "production-ai-agents-need-tool-contracts",
  title: "Production AI Agents Need Tool Contracts",
  coverImageUrl: "https://res.cloudinary.com/dlsiabgiw/image/upload/v1789259864/devkofi/blog/production-ai-agents-need-tool-contracts.png",
  coverImageAlt: "DevKofi thumbnail showing an AI agent connected to a tool contract and typed tools.",
};

const applyCoverImageFallback = (post) => {
  if (!post || post.coverImageUrl) {
    return post;
  }

  const isTargetPost = post.slug === PRODUCTION_AI_AGENTS_COVER.slug
    || post.title === PRODUCTION_AI_AGENTS_COVER.title;

  if (!isTargetPost) {
    return post;
  }

  return {
    ...post,
    coverImageUrl: PRODUCTION_AI_AGENTS_COVER.coverImageUrl,
    coverImageAlt: PRODUCTION_AI_AGENTS_COVER.coverImageAlt,
  };
};

const parsePagination = (query) => {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);

  const page = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
  const limit = Number.isNaN(parsedLimit)
    ? DEFAULT_PAGE_SIZE
    : Math.min(MAX_PAGE_SIZE, Math.max(1, parsedLimit));

  return { page, limit };
};

const listPublishedPosts = async (req, res, next) => {
  try {
    const filter = { status: "published" };
    const { page: requestedPage, limit } = parsePagination(req.query);
    const totalPosts = await BlogPost.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalPosts / limit));
    const page = Math.min(requestedPage, totalPages);
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      posts: posts.map(applyCoverImageFallback),
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

    return res.status(200).json({ post: applyCoverImageFallback(post) });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listPublishedPosts, getPublishedPost };
