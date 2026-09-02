export const publicNavItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "Engineering Systems", to: "/engineering-systems" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
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
