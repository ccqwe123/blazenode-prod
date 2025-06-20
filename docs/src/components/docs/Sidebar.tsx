import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavLink {
  title: string;
  href: string;
  isActive?: boolean;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "BladeNode Introduction",
    links: [
      { title: "Introduction", href: "/introduction" },
      { title: "Overview", href: "/overview" },
      { title: "Light Node", href: "/docs/light-node" },
      { title: "Rewards", href: "/rewards" },
    ],
  },
  {
    title: "Quick Start Guide",
    links: [
      { title: "Account Basics", href: "/docs/account-basics" },
      { title: "Referral Bonus", href: "/docs/referral-bonus" },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "Troubleshoot", href: "/troubleshoot" },
      { title: "FAQ", href: "/faq" },
      { title: "Official Links", href: "/docs/official-links" },
    ],
  },
];

interface DocSidebarProps {
  className?: string;
}

export default function DocSidebar({ className }: DocSidebarProps) {
  const [location] = useLocation();

  return (
    <aside className={cn(
      "fixed left-36 top-24 w-52 h-[calc(100vh-3.5rem)] bg-background overflow-y-auto scrollbar-hide",
      className
    )}>
      <nav className="p-4 space-y-6">
        {NAV_GROUPS.map((group, index) => (
          <div key={index}>
            <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </div>
            <ul className="space-y-1">
              {group.links.map((link, linkIndex) => {
                const isActive = location === link.href;
                return (
                  <li key={linkIndex}>
                    <Link href={link.href} className={cn(
                        "block py-1 px-2 text-sm rounded-md transition-colors",
                        isActive
                          ? "font-medium bg-muted/50 text-white"
                          : "text-muted-foreground hover:text-white"
                      )}>
                        {link.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
