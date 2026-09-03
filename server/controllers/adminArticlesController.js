const BlogPost = require("../models/BlogPost");
const { escapeSearch, isValidId, normalizeArticleInput, parsePagination } = require("../utils/adminValidation");

const getArticle = async (id, res) => {
  if (!isValidId(id)) { res.status(400).json({ success: false, error: "Invalid article id" }); return null; }
  const article = await BlogPost.findById(id).lean();
  if (!article) { res.status(404).json({ success: false, error: "Article not found" }); return null; }
  return article;
};

const listArticles = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const query = {};
  if (req.query.status && req.query.status !== "all") {
    if (!["draft", "published", "archived"].includes(req.query.status)) return res.status(400).json({ success: false, error: "Invalid article status" });
    query.status = req.query.status;
  }
  const search = escapeSearch(req.query.search);
  if (search) {
    const pattern = new RegExp(search, "i");
    query.$or = [{ title: pattern }, { slug: pattern }, { excerpt: pattern }, { tags: pattern }];
  }
  const [items, total] = await Promise.all([
    BlogPost.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(query),
  ]);
  return res.json({ success: true, data: { items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } });
};

const getArticleById = async (req, res) => {
  const article = await getArticle(req.params.articleId, res);
  if (!article) return undefined;
  return res.json({ success: true, data: { article } });
};

const createArticle = async (req, res) => {
  const normalized = normalizeArticleInput(req.body);
  if (!normalized.valid) return res.status(400).json({ success: false, error: "Validation failed", details: normalized.errors });
  if (normalized.data.status === "published") normalized.data.publishedAt = new Date();
  const article = await BlogPost.create({ ...normalized.data, origin: { generator: "devkofi-admin", sourceType: "manual" } });
  return res.status(201).json({ success: true, data: { article } });
};

const updateArticle = async (req, res) => {
  const current = await getArticle(req.params.articleId, res);
  if (!current) return undefined;
  if (current.status === "archived") return res.status(409).json({ success: false, error: "Restore the article before editing" });
  const normalized = normalizeArticleInput(req.body, { partial: true });
  if (!normalized.valid) return res.status(400).json({ success: false, error: "Validation failed", details: normalized.errors });
  delete normalized.data.status;
  const article = await BlogPost.findByIdAndUpdate(current._id, { $set: normalized.data }, { new: true, runValidators: true });
  return res.json({ success: true, data: { article } });
};

const transition = (action) => async (req, res) => {
  const current = await getArticle(req.params.articleId, res);
  if (!current) return undefined;
  const patch = {};
  if (action === "publish") {
    if (current.status === "archived") return res.status(409).json({ success: false, error: "Restore the article before publishing" });
    const normalized = normalizeArticleInput(current);
    if (!normalized.valid) return res.status(400).json({ success: false, error: "Article is incomplete", details: normalized.errors });
    patch.status = "published"; patch.publishedAt = current.publishedAt || new Date(); patch.archivedAt = null;
  } else if (action === "unpublish") {
    if (current.status === "archived") return res.status(409).json({ success: false, error: "Restore the article before unpublishing" });
    patch.status = "draft"; patch.publishedAt = null;
  } else if (action === "archive") {
    patch.status = "archived"; patch.archivedAt = new Date();
  } else {
    patch.status = "draft"; patch.archivedAt = null; patch.publishedAt = null;
  }
  const article = await BlogPost.findByIdAndUpdate(current._id, { $set: patch }, { new: true, runValidators: true });
  return res.json({ success: true, data: { article } });
};

const handleArticleDuplicate = (handler) => async (req, res, next) => {
  try { return await handler(req, res, next); }
  catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, error: "An article with this slug already exists" });
    return next(error);
  }
};

module.exports = {
  archiveArticle: transition("archive"), createArticle: handleArticleDuplicate(createArticle),
  getArticleById, listArticles, publishArticle: transition("publish"), restoreArticle: transition("restore"),
  unpublishArticle: transition("unpublish"), updateArticle: handleArticleDuplicate(updateArticle),
};
