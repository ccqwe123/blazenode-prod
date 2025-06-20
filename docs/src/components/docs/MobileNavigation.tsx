import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface NavLink {
  title: string;
  href: string;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

const NAV_GROUPS: NavGroup[] = [
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

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const [location] = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="md:hidden fixed inset-y-0 left-0 w-64 bg-background border-r border-border z-50 overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="font-semibold">Navigation</div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

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
                          <Link href={link.href}>
                            <a
                              className={cn(
                                "block py-1 px-2 text-sm rounded-md",
                                isActive
                                  ? "font-medium bg-muted/50 text-white"
                                  : "text-muted-foreground hover:text-white"
                              )}
                              onClick={onClose}
                            >
                              {link.title}
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
