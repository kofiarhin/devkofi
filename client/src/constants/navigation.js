export const publicNavItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "Engineering Systems", to: "/engineering-systems" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
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
