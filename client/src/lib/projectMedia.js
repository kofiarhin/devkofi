const widths = [320, 480, 640, 960, 1280, 1920, 2560];

// Mirrors main.styles.scss gutters/container and Studio's 900px grid breakpoint.
// Single column: viewport minus two gutters. Two columns: (container - 32px) / 2.
const sizes = "(max-width: 586px) calc(100vw - 2.2rem), (max-width: 900px) 94vw, (max-width: 1466px) calc(47vw - 1rem), (max-width: 1488px) calc(50vw - 3.75rem), 684px";

const isSimpleTransform = (segment) => segment.split(",").every((part) =>
  /^(w|h|ar)_(\d+(?:\.\d+)?|auto)$/.test(part)
  || /^c_(scale|fit|fill|limit|lfill|crop|pad|lpad|mfit|mpad|thumb)$/.test(part)
  || /^g_(auto|center|north|south|east|west|north_east|north_west|south_east|south_west|face|faces)$/.test(part)
  || /^f_(auto|jpg|jpeg|png|webp|avif|gif)$/.test(part)
  || /^q_(\d+|auto(?::[a-z]+)?)$/.test(part));

export const getProjectImageProps = (src) => {
  const unchanged = { src };
  if (typeof src !== "string" || !src) return unchanged;

  let url;
  try {
    url = new URL(src);
  } catch {
    return unchanged;
  }
  if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com"
    || url.port || url.username || url.password || url.search || url.hash) return unchanged;

  const match = url.pathname.match(/^\/([a-zA-Z0-9_-]+)\/image\/upload\/(.+)$/);
  if (!match) return unchanged;

  const segments = match[2].split("/");
  if (segments.some((segment) => !segment)) return unchanged;
  let assetIndex = 0;
  while (assetIndex < segments.length && isSimpleTransform(segments[assetIndex])) assetIndex += 1;
  const asset = segments.slice(assetIndex);
  if (!asset.length || /^s--/.test(asset[0])) return unchanged;
  if (/^v\d+$/.test(asset[0])) {
    if (asset.length < 2) return unchanged;
  } else if (/^[a-z]{1,4}_/.test(asset[0])) {
    // Named/conditional/overlay transforms and ambiguous public-ID folders need
    // their own parsing contract; never modify a signed or uncertain URL.
    return unchanged;
  }

  const prefix = `${url.origin}/${match[1]}/image/upload/`;
  const existingTransforms = segments.slice(0, assetIndex);
  const variant = (width) => prefix + [
    ...existingTransforms, `c_scale,w_${width}`, "f_auto,q_auto", ...asset,
  ].join("/");

  return {
    src: variant(960),
    srcSet: widths.map((width) => `${variant(width)} ${width}w`).join(", "),
    sizes,
  };
};
