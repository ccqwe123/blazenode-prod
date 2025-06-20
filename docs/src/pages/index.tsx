import { Link } from "wouter";
import { motion } from "framer-motion";
import DocLayout from "@/components/docs/Layout";

export default function HomePage() {
  return (
    <DocLayout>
      <motion.div
        className="py-12 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">BladeNode Documentation</h1>
          <p className="text-muted-foreground text-lg">
            Powering the Decentralized Future with Browser-Based Light Nodes on Ethereum
          </p>
        </div>
        <div className="group block p-6 bg-secondary/60 border border-border rounded-lg transition-all hover:border-primary/50 hover:bg-secondary">
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold">What is Blazenode?</h2>
            </div>
            <p className="text-muted-foreground">
                Blazenode is a revolutionary platform that allows users to run light nodes on the Ethereum blockchain directly from their web browsers. By verifying zero-knowledge proofs for layer 2 solutions, users contribute to Ethereum’s scalability and security while earning rewards. The browser-based approach makes Blazenode accessible to everyone, requiring no complex software installations. Additionally, Blazenode offers a referral program to reward community growth and engagement.
            </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/docs/meet-gradient-network">
            <a className="group block p-6 bg-secondary/60 border border-border rounded-lg transition-all hover:border-primary/50 hover:bg-secondary">
              <div className="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <h2 className="text-xl font-semibold">Getting Started</h2>
              </div>
              <p className="text-muted-foreground">
                Get an overview of Gradient Network and learn how to set up your Sentry Node.
              </p>
            </a>
          </Link>

          <Link href="/docs/rewards">
            <a className="group block p-6 bg-secondary/60 border border-border rounded-lg transition-all hover:border-primary/50 hover:bg-secondary">
              <div className="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7"/><path d="M15 7h6v6"/></svg>
                <h2 className="text-xl font-semibold">Rewards</h2>
              </div>
              <p className="text-muted-foreground">
                Learn about the reward system, how to earn Taps, and maximize your participation.
              </p>
            </a>
          </Link>

          <Link href="/docs/troubleshoot">
            <a className="group block p-6 bg-secondary/60 border border-border rounded-lg transition-all hover:border-primary/50 hover:bg-secondary">
              <div className="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <h2 className="text-xl font-semibold">Troubleshoot</h2>
              </div>
              <p className="text-muted-foreground">
                Find solutions to common issues with your Sentry Node and network connection.
              </p>
            </a>
          </Link>
        </div>

        <div className="p-6 bg-secondary/40 border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <h2 className="text-xl font-semibold">Join the community</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Connect with other Gradient Network participants, ask questions, and stay updated on the latest developments.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Discord
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              Twitter
            </a>
          </div>
        </div>
      </motion.div>
    </DocLayout>
  );
}
