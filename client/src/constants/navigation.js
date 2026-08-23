export const publicNavItems = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Lab", to: "/lab" },
  { label: "Journal", to: "/journal" },
];

export const publicActionItem = {
  label: "Start a Project",
  to: "/start-a-project",
};

export const adminNavItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    matchPrefix: "/admin",
    excludePrefixes: ["/admin/login"],
  },
];
