import { Link } from "wouter";
import { motion } from "framer-motion";
import { BsDiscord, BsTwitterX } from "react-icons/bs";

interface DocHeaderProps {
  onOpenSearch: () => void;
}

export default function DocHeader({ onOpenSearch }: DocHeaderProps) {
  return (
    <motion.header
      className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm h-14"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto h-full px-4">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
              <img src="assets/logo/logo.png" alt="BlazeNode" className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg whitespace-nowrap">BlazeNode</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <BsTwitterX />
          </a>

          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block"
          >
            <BsDiscord />
          </a>
          <button
            onClick={onOpenSearch}
            className="flex items-center text-muted-foreground bg-secondary px-3 py-1.5 text-sm rounded-md border border-border"
            aria-label="Search documentation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <span>Search...</span>
            <span className="ml-4 text-xs border border-border rounded px-1.5 py-0.5">Ctrl K</span>
          </button>

          <Link href="/join" className="bg-primary hover:bg-primary/90 text-white py-1.5 px-4 rounded-md text-sm font-medium transition-colors">
              Join Now
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
