import { useEffect, useState } from "react";
import DocHeader from "./Header";
import DocSidebar from "./Sidebar";
import TableOfContents from "./TableOfContents"
import SearchOverlay from "./SearchOverlay";
import MobileNavigation from "./MobileNavigation";
import { useMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface DocLayoutProps {
  children: React.ReactNode;
  contentSections?: {
    id: string;
    title: string;
    level: number;
    subsections?: Array<{ id: string; title: string }>;
  }[];
}

export default function DocLayout({ children, contentSections }: DocLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isMobile = useMobile();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!contentSections?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0,
      }
    );

    contentSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      contentSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [contentSections]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DocHeader
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <div className="flex min-h-screen pt-14">
        <DocSidebar className="hidden md:block" />
        <motion.main
          className="md:pl-36 md:pr-32 w-full pb-16 min-h-screen"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6">
            {children}
          </div>
        </motion.main>

        <TableOfContents
          sections={contentSections || []}
          activeSection={activeSection}
          className="hidden lg:block"
        />
      </div>

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-40"
          aria-label="Open navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      )}

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}
