export const publicNavItems = [
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "Systems", to: "/engineering-systems" },
  { label: "About", to: "/about" },
];

export const secondaryNavItems = [
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
  { label: "AI Workflow Audit", to: "/ai-workflow-audit" },
];

export const publicActionItem = {
  label: "Book a call",
  to: "/book-a-call",
};

export const adminNavItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    matchPrefix: "/admin",
    excludePrefixes: ["/admin/login"],
  },
];
