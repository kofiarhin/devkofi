export const publicNavItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Templates", to: "/templates" },
  { label: "Contact", to: "/contact" },
];

export const publicActionItem = {
  label: "Book a Call",
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
