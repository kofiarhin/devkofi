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
        name: "AI systems engineering",
        description: "Architecture and engineering for production AI systems connected to application data, tools, APIs, permissions, verification, and user workflows.",
        provider: organizationRef,
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "AI product engineering",
        description: "Full-stack product engineering for AI-native applications, agentic workflows, integrations, interfaces, and production delivery.",
        provider: organizationRef,
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "AI engineering systems and workflows",
        description: "Context systems, agent infrastructure, evaluation, verification, delivery controls, and reusable workflows for dependable AI-assisted engineering.",
        provider: organizationRef,
      },
    },
  ],
};

export const SEO_BY_PATH = {
  "/": {
    title: "DevKofi | AI Engineering Studio for Production AI Systems",
    description: "DevKofi is Kofi Arhin's AI engineering studio for production AI systems, agentic workflows, AI-native products, full-stack software, context infrastructure, and verified delivery.",
    canonicalPath: "/",
    image: workStation,
    structuredData: makePageSchema({
      path: "/",
      name: "DevKofi — AI Engineering Studio",
      description: "Founder-led AI engineering studio for production AI systems, agentic workflows, AI-native products, full-stack software, and engineering infrastructure.",
    }),
  },
  "/services": {
    title: "AI Engineering Services | DevKofi",
    description: "AI systems engineering, AI product engineering, agentic workflows, integrations, context systems, evaluation, verification, and ongoing AI engineering support from DevKofi.",
    canonicalPath: "/services",
    image: aiImage,
    structuredData: makePageSchema({
      path: "/services",
      name: "DevKofi AI Engineering Services",
      description: "Production AI systems engineering, AI product engineering, agentic workflows, integrations, context systems, and verification services.",
      mainEntity: serviceEntities,
    }),
  },
  "/work": {
    title: "AI Engineering Work & Case Studies | DevKofi",
    description: "Explore DevKofi engineering work across AI agents, context infrastructure, full-stack systems, AI-native products, APIs, verification, and production software delivery.",
    canonicalPath: "/work",
    image: aiImage,
    structuredData: makePageSchema({
      path: "/work",
      name: "DevKofi AI Engineering Work",
      description: "Selected AI engineering systems, products, case studies, and implementation evidence from DevKofi.",
      schemaType: "CollectionPage",
    }),
  },
  "/engineering-systems": {
    title: "AI Engineering Systems & Agent Infrastructure | DevKofi",
    description: "Explore DevKofi's reusable agent infrastructure, context systems, workflow controls, verification patterns, and engineering systems for dependable AI-assisted software delivery.",
    canonicalPath: "/engineering-systems",
    image: codeSnippetImage,
    structuredData: makePageSchema({
      path: "/engineering-systems",
      name: "DevKofi Engineering Systems",
      description: "Reusable agent infrastructure, context systems, delivery workflows, verification patterns, and engineering controls from DevKofi.",
      schemaType: "CollectionPage",
    }),
  },
  "/about": {
    title: "About Kofi Arhin | AI & Full-Stack Engineer at DevKofi",
    description: "Meet Kofi Arhin, founder of DevKofi: an AI and full-stack engineer focused on production AI systems, agentic workflows, software architecture, APIs, verification, and product engineering.",
    canonicalPath: "/about",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/about",
      name: "About Kofi Arhin and DevKofi",
      description: "About Kofi Arhin, founder of DevKofi and an AI and full-stack engineer building production AI systems and software products.",
      schemaType: "AboutPage",
      mainEntity: founderRef,
    }),
  },
  "/contact": {
    title: "Contact DevKofi | AI Engineering Project Enquiries",
    description: "Contact Kofi Arhin at DevKofi about AI systems, agentic workflows, AI-native products, full-stack engineering, dashboards, integrations, automation, or product delivery.",
    canonicalPath: "/contact",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/contact",
      name: "Contact DevKofi",
      description: "Project enquiry page for DevKofi AI engineering and full-stack product work.",
      schemaType: "ContactPage",
      mainEntity: organizationRef,
    }),
  },
  "/book-a-call": {
    title: "Book an AI Engineering Discovery Call | DevKofi",
    description: "Book a 30-minute discovery call with Kofi Arhin to discuss an AI system, agentic workflow, AI-native product, integration, or full-stack engineering project.",
    canonicalPath: "/book-a-call",
    image: profileImage,
    structuredData: makePageSchema({
      path: "/book-a-call",
      name: "Book a DevKofi Discovery Call",
      description: "Book a discovery call with Kofi Arhin about an AI engineering or full-stack software project.",
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

  if (pathname.startsWith("/admin") || pathname === "/newsletter/verify") {
    return noIndexMeta(pathname, "DevKofi Private Route");
  }

  return noIndexMeta(pathname, "Page Not Found | DevKofi");
};
