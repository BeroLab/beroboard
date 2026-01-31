export const siteConfig = {
  name: "Blaboard",
  url: process.env.NEXT_PUBLIC_FRONTEND_URL,
  ogImage: process.env.NEXT_PUBLIC_FRONTEND_URL + "/og.jpg",
  description:
    "Blaboard is an open-source Kanban board built by the BeroLab community to help beginner developers gain their first open-source experience while collaboratively creating a practical task management tool.",
  links: {
    twitter: "https://twitter.com/berolabx",
    github: "https://github.com/BeroLab",
  },
  authors: [
    {
      name: "Berolab",
      url: "https://berolab.app",
    },
  ],
  keywords: [
    "Open Source",
    "Kanban Board",
    "Task Management",
    "Developer Community",
    "Beginner Friendly",
    "Open Source Contribution",
    "BeroLab",
    "Blaboard",
  ],
  navItems: [],
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
