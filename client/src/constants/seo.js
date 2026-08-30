import { profileImage, workStation } from "./constants";

export const SITE_URL = "https://devkofi.com";

const organizationRef = { "@id": `${SITE_URL}/#organization` };
const founderRef = { "@id": `${SITE_URL}/#kofi-arhin` };
const websiteRef = { "@id": `${SITE_URL}/#website` };

const makePageSchema = ({ path, name, description, schemaType = "WebPage", mainEntity }) => ({
  "@context": "https://schema.org",
  "@type": schemaType,
  "@id": `${SITE_URL}${path === "/" ? "/" : path}#webpage`,
  url: `${SITE_URL}${path === "/" ? "/" : path}`,
  name,
  description,
  isPartOf: websiteRef,
  about: organizationRef,
  ...(mainEntity ? { mainEntity } : {}),
});

const serviceEntities = {
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "Service",
      position: 1,
      name: "Product strategy and discovery",
      description: "Product discovery, MVP scoping, product briefs, and prototype direction for new or unclear digital product opportunities.",
      provider: organizationRef,
    },
    {
      "@type": "Service",
      position: 2,
      name: "UX/UI design and full-stack development",
      description: "User experience design, interface systems, and production-ready web application delivery across the full product stack.",
      provider: organizationRef,
    },
    {
      "@type": "Service",
      position: 3,
      name: "Product evolution and AI-enabled features",
      description: "Product audits, focused redesigns, automation, AI-enabled features, and engineering improvements for existing software.",
      provider: organizationRef,
    },
  ],
};

export const SEO_BY_PATH = {
  "/": {
    title: "DevKofi | Creative Technology Studio for Web & AI Products",
    description: "DevKofi is Kofi Arhin's founder-led creative technology studio for product strategy, UX/UI design, full-stack web development, and practical AI engineering.",
    path: "/",
    image: workStation,
    structuredData: makePageSchema({
      path: "/",
      name: "DevKofi — Creative Technology Studio",
      description: "Founder-led creative technology studio for product strategy, UX/UI design, full-stack web development, and practical AI engineering.",
    }),
  },
  "/work": {
    title: "Work | DevKofi — Full-Stack & AI Product Case Studies",
    description: "Explore DevKofi product work: web applications, full-stack MVPs, product systems, commerce experiences, and experiments designed and engineered by Kofi Arhin.",
    path: "/work",
    image: workStation,
    structuredData: makePageSchema({
      path: "/work",
      name: "DevKofi Work",
      description: "Selected digital product work and case studies from DevKofi.",
      schemaType: "CollectionPage",
    }),
  },
  "/services": {
    title: "Services | DevKofi — Product Strategy, UX/UI & Full-Stack Development",
    description: "DevKofi helps founders and teams shape, design, and build digital products through product strategy, UX/UI design, full-stack development, and AI-enabled product engineering.",
    path: "/services",
    image: workStation,
    structuredData: makePageSchema({
      path: "/services",
      name: "DevKofi Services",
      description: "Product strategy, UX/UI design, full-stack development, and AI-enabled product engineering services.",
      mainEntity: serviceEntities,
    }),
  },
  "/about": {
    title: "About Kofi Arhin | DevKofi — Full-Stack & AI Engineer",
    description: "Meet Kofi Arhin, founder of DevKofi: a MERN-stack and AI engineer who combines product thinking, interface design, software engineering, content, and creative practice.",
    path: "/about",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/about",
      name: "About Kofi Arhin and DevKofi",
      description: "About Kofi Arhin, founder of DevKofi and a full-stack and AI engineer.",
      schemaType: "AboutPage",
      mainEntity: founderRef,
    }),
  },
  "/lab": {
    title: "Lab | DevKofi — Developer Templates & Product Systems",
    description: "Explore reusable developer templates, starter systems, workflows, and product experiments released from DevKofi's real software engineering practice.",
    path: "/lab",
    image: workStation,
    structuredData: makePageSchema({
      path: "/lab",
      name: "DevKofi Lab",
      description: "Reusable developer templates, starter systems, workflows, and product experiments from DevKofi.",
      schemaType: "CollectionPage",
    }),
  },
  "/journal": {
    title: "Journal | DevKofi — AI Engineering & Product Development Notes",
    description: "DevKofi Journal covers AI engineering, MERN and full-stack development, product strategy, UX/UI decisions, developer workflows, testing, and lessons from building real products.",
    path: "/journal",
    image: workStation,
    structuredData: makePageSchema({
      path: "/journal",
      name: "DevKofi Journal",
      description: "Field notes on AI engineering, full-stack product development, product strategy, UX/UI, testing, and developer workflows.",
      schemaType: "CollectionPage",
    }),
  },
  "/start-a-project": {
    title: "Start a Project | DevKofi — Web, AI & Full-Stack Product Studio",
    description: "Start a project with DevKofi for a web app, full-stack MVP, AI-enabled product, dashboard, landing experience, automation, or focused product redesign.",
    path: "/start-a-project",
    image: workStation,
    structuredData: makePageSchema({
      path: "/start-a-project",
      name: "Start a Project with DevKofi",
      description: "Contact DevKofi about product strategy, UX/UI design, full-stack development, AI-enabled products, or product evolution.",
      schemaType: "ContactPage",
      mainEntity: organizationRef,
    }),
  },
};

const legacyPaths = {
  "/projects": "/work",
  "/templates": "/lab",
  "/contact": "/start-a-project",
  "/book-a-call": "/start-a-project",
};

const noIndexMeta = (path, title) => ({
  title,
  description: "This DevKofi route is not intended for public search results.",
  path,
  image: workStation,
  robots: "noindex,follow",
  structuredData: null,
});

export const getSeoForPath = (pathname) => {
  const canonicalPath = legacyPaths[pathname] || pathname;

  if (SEO_BY_PATH[canonicalPath]) {
    return SEO_BY_PATH[canonicalPath];
  }

  if (pathname.startsWith("/admin") || pathname === "/newsletter/verify") {
    return noIndexMeta(pathname, "DevKofi Private Route");
  }

  return noIndexMeta(pathname, "Page Not Found | DevKofi");
};
