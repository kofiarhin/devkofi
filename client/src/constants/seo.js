import { aiImage, codeSnippetImage, profileImage, workStation } from "./constants";

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

const serviceEntities = {
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "AI Workflow Audit",
        description: "Map one expensive manual process, identify where AI is appropriate, and define a scoped pilot plan.",
        provider: organizationRef,
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "AI Pilot Sprint",
        description: "Build one working vertical slice against real inputs with structured outputs, evaluation, and human approval.",
        provider: organizationRef,
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Production AI System",
        description: "Turn a validated pilot into an integrated application with auth, observability, failure handling, and deployment.",
        provider: organizationRef,
      },
    },
  ],
};

export const SEO_BY_PATH = {
  "/": {
    title: "DevKofi | AI Engineering Studio for Production AI Workflow Systems",
    description: "DevKofi is Kofi Arhin's founder-led AI engineering studio for turning manual workflows and AI prototypes into dependable, human-controlled production systems.",
    canonicalPath: "/",
    image: workStation,
    structuredData: makePageSchema({
      path: "/",
      name: "DevKofi — AI Engineering Studio",
      description: "Founder-led AI engineering studio for production AI workflow systems, agents, and AI-native products.",
    }),
  },
  "/services": {
    title: "AI Engineering Services | DevKofi",
    description: "AI Workflow Audit, Pilot Sprint, and Production AI System engagements for founder-led teams building human-controlled AI workflow systems.",
    canonicalPath: "/services",
    image: aiImage,
    structuredData: makePageSchema({
      path: "/services",
      name: "DevKofi AI Engineering Services",
      description: "Productized AI workflow engagements: audit, pilot sprint, and production system delivery.",
      mainEntity: serviceEntities,
    }),
  },
  "/ai-workflow-audit": {
    title: "AI Workflow Audit | DevKofi",
    description: "Map one expensive manual process, identify where AI is appropriate, and leave with a scoped pilot plan for a human-controlled AI system.",
    canonicalPath: "/ai-workflow-audit",
    image: aiImage,
    structuredData: makePageSchema({
      path: "/ai-workflow-audit",
      name: "AI Workflow Audit",
      description: "Focused audit engagement for one expensive business workflow.",
    }),
  },
  "/work": {
    title: "AI Engineering Work & Case Studies | DevKofi",
    description: "Case studies and selected engineering work across AI workflow systems, governed agents, and full-stack products from DevKofi.",
    canonicalPath: "/work",
    image: aiImage,
    structuredData: makePageSchema({
      path: "/work",
      name: "DevKofi AI Engineering Work",
      description: "Selected AI engineering systems, products, and case studies from DevKofi.",
      schemaType: "CollectionPage",
    }),
  },
  "/engineering-systems": {
    title: "AI Engineering Systems & Agent Infrastructure | DevKofi",
    description: "Reusable agent infrastructure, context systems, workflow controls, and verification patterns for dependable AI-assisted software delivery.",
    canonicalPath: "/engineering-systems",
    image: codeSnippetImage,
    structuredData: makePageSchema({
      path: "/engineering-systems",
      name: "DevKofi Engineering Systems",
      description: "Reusable agent infrastructure, context systems, delivery workflows, and verification patterns from DevKofi.",
      schemaType: "CollectionPage",
    }),
  },
  "/about": {
    title: "About Kofi Arhin | AI Engineering Studio Founder at DevKofi",
    description: "Meet Kofi Arhin, founder of DevKofi: focused on production AI workflow systems, agentic workflows, verification, and full-stack product engineering.",
    canonicalPath: "/about",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/about",
      name: "About Kofi Arhin and DevKofi",
      description: "About Kofi Arhin, founder of DevKofi and an AI engineer building production AI workflow systems.",
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
    title: "Contact DevKofi | AI Workflow Enquiries",
    description: "Contact Kofi Arhin at DevKofi about AI workflow audits, pilot sprints, production AI systems, integrations, and human-controlled agent systems.",
    canonicalPath: "/contact",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/contact",
      name: "Contact DevKofi",
      description: "Workflow enquiry page for DevKofi AI engineering engagements.",
      schemaType: "ContactPage",
      mainEntity: organizationRef,
    }),
  },
  "/book-a-call": {
    title: "Book an AI Workflow Call | DevKofi",
    description: "Book a 30-minute AI workflow call with Kofi Arhin to scope an audit, pilot sprint, or production AI system.",
    canonicalPath: "/book-a-call",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/book-a-call",
      name: "Book a DevKofi AI Workflow Call",
      description: "Book a discovery call about an AI workflow system engagement with DevKofi.",
    }),
  },
};

const legacyPaths = {
  "/products": "/work",
  "/projects": "/work",
  "/templates": "/engineering-systems",
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
  const canonicalPath = legacyPaths[pathname] || pathname;

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
