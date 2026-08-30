import { describe, expect, it } from "vitest";
import { getProjectImageProps } from "../src/lib/projectMedia";

const upload = "https://res.cloudinary.com/dlsiabgiw/image/upload/";

describe("responsive project media", () => {
  it("creates width-descriptor sources without changing the asset or version", () => {
    const props = getProjectImageProps(`${upload}v1788130712/devkofi/agent-system-cover-20260831.png`);
    expect(props.src).toBe(`${upload}c_scale,w_960/f_auto,q_auto/v1788130712/devkofi/agent-system-cover-20260831.png`);
    const candidates = props.srcSet.split(", ");
    expect(candidates).toHaveLength(7);
    expect(candidates[0]).toBe(`${upload}c_scale,w_320/f_auto,q_auto/v1788130712/devkofi/agent-system-cover-20260831.png 320w`);
    expect(candidates.at(-1)).toBe(`${upload}c_scale,w_2560/f_auto,q_auto/v1788130712/devkofi/agent-system-cover-20260831.png 2560w`);
    expect(props.sizes).toContain("(max-width: 900px) 94vw");
    expect(props.sizes).toContain("684px");
  });

  it.each([
    ["c_fill,w_1200,h_675/g_center/", "v42/covers/a%20b.png"],
    ["f_webp,q_80/", "v42/covers/cover.jpg"],
    ["c_fill,w_1200,h_675/", "cover.jpg"],
    ["", "covers/cover.jpg"],
  ])("preserves existing transformations and public ID: %s%s", (transform, asset) => {
    expect(getProjectImageProps(`${upload}${transform}${asset}`).src)
      .toBe(`${upload}${transform}c_scale,w_960/f_auto,q_auto/${asset}`);
  });

  it.each([
    "https://opengraph.githubassets.com/1/kofiarhin/forge",
    "/images/local.png",
    "https://res.cloudinary.com.evil.test/demo/image/upload/cover.png",
    "https://res.cloudinary.com/demo/image/private/cover.png",
    "https://res.cloudinary.com/demo/video/upload/cover.mp4",
    `${upload}s--signature--/v42/cover.png`,
    `${upload}v42/cover.png?__cld_token__=token`,
    `${upload}v42/cover.png#fragment`,
    `${upload}w_gallery/cover.png`,
    `${upload}t_custom/cover.png`,
    `${upload}l_logo/fl_layer_apply/v42/cover.png`,
    `${upload}dpr_2,w_640/v42/cover.png`,
    `${upload}c_unknown/cover.png`,
    `${upload}v42`,
    "https://user:password@res.cloudinary.com/demo/image/upload/cover.png",
    undefined,
    "",
  ])("leaves unsupported or ambiguous sources untouched: %s", (src) => {
    expect(getProjectImageProps(src)).toEqual({ src });
  });
});
