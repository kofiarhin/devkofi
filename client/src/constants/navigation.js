// Primary navigation in the approved order. The item flagged `cta` renders as the primary button.
export const primaryNavItems = [
  { label: "Home", to: "/" },
  { label: "AI Integration", to: "/ai-integration" },
  { label: "Mentorship", to: "/mentorship" },
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Book a call", to: "/book-a-call", cta: true },
  { label: "Blog", to: "/blog" },
];

export const publicActionItem = primaryNavItems.find((item) => item.cta);

export const adminNavItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    matchPrefix: "/admin",
    excludePrefixes: ["/admin/login"],
  },
];
