// Types for documentation
export interface DocSection {
  id: string;
  title: string;
  level: number;
  subsections?: Array<{ id: string; title: string }>;
}

export interface DocCategory {
  title: string;
  links: Array<{
    title: string;
    href: string;
  }>;
}

// All documentation categories
export const DOC_CATEGORIES: DocCategory[] = [
  {
    title: "Getting Started",
    links: [
      { title: "Meet Gradient Network", href: "/docs/meet-gradient-network" },
      { title: "Architecture", href: "/docs/architecture" },
      { title: "Sentry Node", href: "/docs/sentry-node" },
      { title: "Rewards", href: "/docs/rewards" },
    ],
  },
  {
    title: "Guides",
    links: [
      { title: "Account Basics", href: "/docs/account-basics" },
      { title: "Referral Bonus", href: "/docs/referral-bonus" },
      { title: "Community Guidelines", href: "/docs/community-guidelines" },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "Troubleshoot", href: "/docs/troubleshoot" },
      { title: "FAQ", href: "/docs/faq" },
      { title: "Official Links", href: "/docs/official-links" },
    ],
  },
];

// Utility function to extract heading IDs from content
export function extractHeadingIds(element: HTMLElement): DocSection[] {
  const headings = element.querySelectorAll('h2, h3');
  const sections: DocSection[] = [];

  let currentH2: DocSection | null = null;

  headings.forEach((heading) => {
    const id = heading.id;
    const title = heading.textContent || '';

    if (heading.tagName === 'H2') {
      currentH2 = { id, title, level: 2, subsections: [] };
      sections.push(currentH2);
    } else if (heading.tagName === 'H3' && currentH2) {
      currentH2.subsections = currentH2.subsections || [];
      currentH2.subsections.push({ id, title });
    }
  });

  return sections;
}

// Search function for documentation content
export async function searchDocumentation(query: string): Promise<Array<{
  title: string;
  url: string;
  excerpt?: string;
}>> {
  // In a real app, this would search through the documentation content
  // For this demo, we'll return mock results based on the query

  const mockResults = [
    { title: "Update Sentry Node", url: "/docs/troubleshoot#update-sentry-node" },
    { title: "Node not connecting", url: "/docs/troubleshoot#unsupported-status" },
    { title: "Rewards calculation", url: "/docs/rewards" },
    { title: "Troubleshoot connection issues", url: "/docs/troubleshoot#unsupported-status" },
    { title: "How to increase Tap rewards", url: "/docs/troubleshoot#more-taps" },
    { title: "Multiple accounts policy", url: "/docs/troubleshoot#users-multiple-sentry" },
  ];

  if (!query) return [];

  const lowerQuery = query.toLowerCase();

  return mockResults.filter(result =>
    result.title.toLowerCase().includes(lowerQuery)
  );
}
