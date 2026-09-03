const mongoose = require("mongoose");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const parsePagination = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
};

const escapeSearch = (value, maxLength = 100) =>
  String(value || "")
    .trim()
    .slice(0, maxLength)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidId = (value) => mongoose.Types.ObjectId.isValid(value);

const normalizeArticleInput = (input = {}, { partial = false } = {}) => {
  const errors = {};
  const data = {};
  const text = (key, max, required = true) => {
    if (partial && input[key] === undefined) return;
    const value = String(input[key] ?? "").trim();
    if (required && !value) errors[key] = `${key} is required`;
    else if (value.length > max) errors[key] = `${key} must be ${max} characters or fewer`;
    else data[key] = value;
  };

  text("title", 160);
  text("slug", 180);
  text("excerpt", 500);
  text("content", 100000);
  text("seoTitle", 160);
  text("seoDescription", 320);

  if (!partial || input.slug !== undefined) {
    data.slug = String(input.slug || "").trim().toLowerCase();
    if (data.slug && !SLUG_PATTERN.test(data.slug)) errors.slug = "slug must be URL safe";
  }

  if (!partial || input.tags !== undefined) {
    if (!Array.isArray(input.tags)) errors.tags = "tags must be an array";
    else {
      const tags = [...new Set(input.tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))];
      if (tags.length > 12 || tags.some((tag) => tag.length > 40)) errors.tags = "tags are invalid";
      else data.tags = tags;
    }
  }

  if (!partial || input.sources !== undefined) {
    if (!Array.isArray(input.sources)) errors.sources = "sources must be an array";
    else {
      const sources = input.sources.map((source) => ({
        title: String(source?.title || "").trim(),
        url: String(source?.url || "").trim(),
      }));
      if (sources.length > 20 || sources.some((source) => !source.title || !/^https:\/\//i.test(source.url))) {
        errors.sources = "sources require a title and HTTPS URL";
      } else data.sources = sources;
    }
  }

  for (const key of ["coverImageUrl", "coverImageAlt"]) {
    if (!partial || input[key] !== undefined) data[key] = input[key] ? String(input[key]).trim() : null;
  }
  if (data.coverImageUrl && !/^https:\/\//i.test(data.coverImageUrl)) errors.coverImageUrl = "coverImageUrl must use HTTPS";
  if (data.coverImageUrl && !data.coverImageAlt) errors.coverImageAlt = "coverImageAlt is required with an image";

  if (!partial || input.status !== undefined) {
    const status = input.status || "draft";
    if (!new Set(["draft", "published"]).has(status)) errors.status = "status must be draft or published";
    else data.status = status;
  }

  return { data, errors, valid: Object.keys(errors).length === 0 };
};

module.exports = { EMAIL_PATTERN, escapeSearch, isValidId, normalizeArticleInput, parsePagination };
