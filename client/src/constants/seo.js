import { aiImage, codeSnippetImage, profileImage, profileImageSecondary, workStation } from "./constants";

export const SITE_URL = "https://devkofi.com";
export const SITE_NAME = "DevKofi";

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

const makeService = (name, description, audience) => ({
  "@type": "Service",
  name,
  description,
  provider: founderRef,
  ...(audience ? { audience: { "@type": "Audience", audienceType: audience } } : {}),
});

const serviceEntities = {
  "@type": "ItemList",
  itemListElement: [
    makeService(
      "AI integration into existing systems",
      "Integrating AI assistants, governed agents and workflow automation into the software and data a business already runs.",
      "Businesses",
    ),
    makeService(
      "AI engineering mentorship",
      "1-on-1 mentorship in building software with LLMs, agents and AI coding tools.",
      "Developers",
    ),
    makeService(
      "MERN stack mentorship",
      "1-on-1 coaching in MongoDB, Express, React and Node.js through real projects.",
      "Developers",
    ),
  ].map((item, index) => ({ "@type": "ListItem", position: index + 1, item })),
};

export const SEO_BY_PATH = {
  "/": {
    title: "DevKofi | AI Engineer with Real MERN Stack Experience",
    description: "Kofi Arhin integrates AI into the systems businesses already run, and mentors developers 1-on-1 in AI engineering and the MERN stack. Book a free intro call.",
    canonicalPath: "/",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/",
      name: "DevKofi: AI integration and 1-on-1 mentorship",
      description: "AI integration into existing systems for businesses, plus 1-on-1 AI engineering and MERN stack mentorship.",
      mainEntity: serviceEntities,
    }),
  },
  "/ai-integration": {
    title: "AI Integration into Existing Systems | DevKofi",
    description: "Add AI to the software, data and workflows you already run: grounded assistants, governed agents and automation with human approval. Book a free intro call.",
    canonicalPath: "/ai-integration",
    image: aiImage,
    structuredData: makePageSchema({
      path: "/ai-integration",
      name: "AI integration into existing systems",
      description: "AI integration service for businesses: assistants grounded in your data, governed agents and workflow automation with human review.",
      mainEntity: serviceEntities.itemListElement[0].item,
    }),
  },
  "/mentorship": {
    title: "1-on-1 AI Engineering & MERN Stack Mentorship | DevKofi",
    description: "Direct, project-based 1-on-1 mentorship in AI engineering and the MERN stack: real code, review, tests and shipping habits. Book a free intro call.",
    canonicalPath: "/mentorship",
    image: profileImageSecondary,
    structuredData: makePageSchema({
      path: "/mentorship",
      name: "1-on-1 AI engineering and MERN stack mentorship",
      description: "1-on-1 mentorship for developers in AI engineering and the MERN stack.",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: serviceEntities.itemListElement.slice(1).map((entry, index) => ({ ...entry, position: index + 1 })),
      },
    }),
  },
  "/work": {
    title: "Work & Case Studies: Hibachi, Brain, EscoWear | DevKofi",
    description: "Case studies and engineering systems from Kofi Arhin: a governed local AI agent, an AI personal operating system and a live MERN e-commerce store.",
    canonicalPath: "/work",
    image: workStation,
    structuredData: makePageSchema({
      path: "/work",
      name: "DevKofi work and case studies",
      description: "Case studies, engineering systems and selected projects from DevKofi.",
      schemaType: "CollectionPage",
    }),
  },
  "/about": {
    title: "About Kofi Arhin | AI Engineer and Mentor | DevKofi",
    description: "Meet Kofi Arhin: a full-stack engineer building AI systems, agentic workflows and AI-native products, and mentoring developers 1-on-1.",
    canonicalPath: "/about",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/about",
      name: "About Kofi Arhin and DevKofi",
      description: "About Kofi Arhin, AI engineer with real MERN stack experience and founder of DevKofi.",
      schemaType: "AboutPage",
      mainEntity: founderRef,
    }),
  },
  "/blog": {
    title: "AI Engineering Articles | DevKofi",
    description: "Practical writing about AI engineering, reliable workflow systems, architecture, agents, and software delivery.",
    canonicalPath: "/blog",
    image: codeSnippetImage,
    structuredData: makePageSchema({
      path: "/blog",
      name: "DevKofi AI Engineering Articles",
      description: "Practical writing about AI engineering, full-stack systems, architecture, agents, reliability, and software delivery.",
      schemaType: "CollectionPage",
    }),
  },
  "/contact": {
    title: "Contact Kofi Arhin | DevKofi",
    description: "Send Kofi Arhin a message about AI integration for your business or 1-on-1 AI engineering and MERN stack mentorship.",
    canonicalPath: "/contact",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/contact",
      name: "Contact DevKofi",
      description: "Contact page for AI integration and mentorship enquiries.",
      schemaType: "ContactPage",
      mainEntity: organizationRef,
    }),
  },
  "/book-a-call": {
    title: "Book a Free Intro Call | DevKofi",
    description: "Book a free intro call with Kofi Arhin about AI integration for your business or 1-on-1 AI engineering and MERN stack mentorship.",
    canonicalPath: "/book-a-call",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/book-a-call",
      name: "Book a free intro call with DevKofi",
      description: "Book a free intro call about AI integration or 1-on-1 mentorship.",
    }),
  },
};

// Retired routes redirect client-side (react-router Navigate) and share the destination's canonical URL.
export const legacyRedirects = {
  "/services": "/ai-integration",
  "/ai-workflow-audit": "/ai-integration",
  "/engineering-systems": "/work",
  "/systems": "/work",
  "/templates": "/work",
  "/products": "/work",
  "/projects": "/work",
};

const noIndexMeta = (path, title) => ({
  title,
  description: "This DevKofi route is not intended for public search results.",
  canonicalPath: path,
  image: workStation,
  robots: "noindex,follow",
  structuredData: null,
});

export const getSeoForPath = (pathname) => {
  const canonicalPath = legacyRedirects[pathname] || pathname;

  if (SEO_BY_PATH[canonicalPath]) {
    return SEO_BY_PATH[canonicalPath];
  }

  if (pathname.startsWith("/blog/")) {
    return { ...SEO_BY_PATH["/blog"], canonicalPath: pathname };
  }

  if (pathname.startsWith("/admin") || pathname === "/newsletter/verify") {
    return noIndexMeta(pathname, "DevKofi Private Route");
  }

  return noIndexMeta(pathname, "Page Not Found | DevKofi");
};
