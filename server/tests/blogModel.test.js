const BlogPost = require("../models/BlogPost");

describe("BlogPost shared database contract", () => {
  it("uses the writer's deterministic unique slug index", () => {
    expect(BlogPost.schema.indexes()).toContainEqual([
      { slug: 1 },
      expect.objectContaining({ unique: true, name: "blog_slug_unique" }),
    ]);
  });
});
