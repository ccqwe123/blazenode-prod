import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface Section {
  id: string;
  title: string;
  level: number;
  subsections?: Array<{ id: string; title: string }>;
}

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  className?: string;
}

export default function TableOfContents({ sections, activeSection, className }: TableOfContentsProps) {
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      // Smooth scroll to section with offset for fixed header
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside className={cn(
      "fixed right-24 top-24 w-64 h-[calc(100vh-3.5rem)] bg-background/80 backdrop-blur-sm overflow-y-auto scrollbar-hide",
      className
    )}>
      <div className="p-4">
        <div className="mb-4 text-sm font-medium">On this page</div>

        <nav className="space-y-1">
          {sections.map((section) => (
            <div key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection(section.id);
                }}
                className={cn(
                  "toc-link pl-3 border-l-2 py-1 block text-sm transition-colors",
                  activeSection === section.id
                    ? "border-primary font-medium text-white"
                    : "border-transparent text-muted-foreground hover:text-white"
                )}
              >
                {section.title}
              </a>

              {section.subsections && activeSection === section.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 mt-1 mb-2 text-xs text-muted-foreground space-y-1"
                >
                  {section.subsections.map((subsection) => (
                    <a
                      key={subsection.id}
                      href={`#${subsection.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleScrollToSection(subsection.id);
                      }}
                      className="block hover:text-white py-1"
                    >
                      {subsection.title}
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
