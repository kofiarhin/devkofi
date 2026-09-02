export const publicNavItems = [
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "Systems", to: "/engineering-systems" },
  { label: "About", to: "/about" },
];

export const secondaryNavItems = [
  { label: "Blog", to: "/blog" },
  { label: "AI Workflow Audit", to: "/ai-workflow-audit" },
];

export const publicActionItem = {
  label: "Contact",
  to: "/contact",
};

export const adminNavItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    matchPrefix: "/admin",
    excludePrefixes: ["/admin/login"],
  },
];
