import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";

interface SearchResult {
  title: string;
  url: string;
  category?: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock search results
  const recentSearches: SearchResult[] = [
    { title: "Update Sentry Node", url: "/docs/troubleshoot#update-sentry-node" },
    { title: "Node not connecting", url: "/docs/troubleshoot#unsupported-status" },
    { title: "Rewards calculation", url: "/docs/rewards" },
  ];

  const suggestions: SearchResult[] = [
    { title: "Troubleshoot connection issues", url: "/docs/troubleshoot#unsupported-status" },
    { title: "How to increase Tap rewards", url: "/docs/troubleshoot#more-taps" },
    { title: "Multiple accounts policy", url: "/docs/troubleshoot#users-multiple-sentry" },
  ];

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="w-full max-w-xl bg-secondary border border-border rounded-lg overflow-hidden search-box-shadow"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-b border-border flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="bg-transparent border-none outline-none w-full text-white placeholder-muted-foreground"
              />
              <div className="text-xs border border-border rounded px-1.5 py-0.5 text-muted-foreground">Esc</div>
            </div>

            <div className="p-2">
              <div className="p-2 text-xs text-muted-foreground">Recent searches</div>
              <div className="space-y-1">
                {recentSearches.map((result, index) => (
                  <Link key={index} href={result.url}>
                    <a
                      className="block p-2 text-sm rounded hover:bg-muted transition-colors"
                      onClick={handleLinkClick}
                    >
                      {result.title}
                    </a>
                  </Link>
                ))}
              </div>

              <div className="p-2 mt-2 text-xs text-muted-foreground">Suggestions</div>
              <div className="space-y-1">
                {suggestions.map((result, index) => (
                  <Link key={index} href={result.url}>
                    <a
                      className="block p-2 text-sm rounded hover:bg-muted transition-colors"
                      onClick={handleLinkClick}
                    >
                      {result.title}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
