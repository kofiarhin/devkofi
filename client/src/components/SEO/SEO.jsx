import { useEffect } from "react";
import { SITE_URL } from "../../constants/seo";

const upsertMeta = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const upsertStructuredData = (structuredData) => {
  const scriptId = "devkofi-page-jsonld";
  const existing = document.getElementById(scriptId);

  if (!structuredData) {
    existing?.remove();
    return;
  }

  const script = existing || document.createElement("script");
  script.id = scriptId;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(structuredData);

  if (!existing) {
    document.head.appendChild(script);
  }
};

const SEO = ({
  title,
  description,
  path,
  image,
  type = "website",
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  structuredData = null,
}) => {
  const canonicalUrl = new URL(path, SITE_URL).toString();

  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "author", "Kofi Arhin");

    upsertMeta("property", "og:site_name", "DevKofi");
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", image);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    upsertCanonical(canonicalUrl);
    upsertStructuredData(structuredData);
  }, [canonicalUrl, description, image, robots, structuredData, title, type]);

  return null;
};

export default SEO;
