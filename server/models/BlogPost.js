const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    sources: { type: [sourceSchema], default: [] },
    coverImageUrl: { type: String, default: null, trim: true },
    coverImageAlt: { type: String, default: null, trim: true },
    seoTitle: { type: String, required: true, trim: true },
    seoDescription: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      required: true,
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, default: null, index: true },
    archivedAt: { type: Date, default: null },
    origin: {
      generator: { type: String, default: "ideahub-generate-post" },
      sourceType: { type: String, default: "generated" },
    },
  },
  { timestamps: true, collection: "blogposts" },
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ slug: 1 }, { unique: true, name: "blog_slug_unique" });

module.exports = mongoose.model("BlogPost", blogPostSchema);
