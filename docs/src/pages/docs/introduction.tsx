import DocLayout from "@/components/docs/Layout";
import { motion } from "framer-motion";
import { FaAngleRight, FaAngleLeft  } from "react-icons/fa";
import { Link } from "wouter";

// Define sections for the table of contents
const contentSections = [
  {
    id: "introduction",
    title: "BladeNode Introduction",
    level: 2,
  },
  {
    id: "why-blaze",
    title: "Why is BlazeNode different?",
    level: 2,
  },
  {
    id: "browser-based",
    title: "Browser-Based Light Node Mining",
    level: 2,
  },
  {
    id: "the-process",
    title: "The Process",
    level: 2,
  },
  {
    id: "benefits",
    title: "Benefits of Browser-Based Nodes",
    level: 2,
  },
];

// The content animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

const upgradeCosts: Record<number, string> = {
    1: "1. Join the Network",
    2: "2. Perform Tasks",
    3: "3. Submit Proofs",
    4: "4. Get Rewarded",
};

const miningSpeeds: Record<number, string> = {
    1: "Sync block headers from full nodes directly in your browser.",
    2: "Verify zk-proofs or relay data for layer 2 solutions.",
    3: "Submit evidence of participation, such as uptime or verifications.",
    4: "Earn Blazenode tokens (name TBD) based on your contributions.",
};
export default function IntroductionPage() {
    const nodeLevels = [1, 2, 3, 4];
  return (
    <DocLayout contentSections={contentSections}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} id="introduction" className="my-5">
          <h1 className="inline-block text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight dark:text-gray-200 my-5">BladeNode Introduction</h1>
          <p className="text-muted-foreground">Blazenode is a revolutionary platform that allows users to run light nodes on the Ethereum blockchain directly from their web browsers. By verifying zero-knowledge proofs for layer 2 solutions, users contribute to Ethereum’s scalability and security while earning rewards. The browser-based approach makes Blazenode accessible to everyone, requiring no complex software installations. Additionally, Blazenode offers a referral program to reward community growth and engagement.</p>
        </motion.div>

        <motion.div variants={itemVariants} id="why-blaze" className="my-5">
          <h1 className="inline-block text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight dark:text-gray-200 mt-5">Why is BlazeNode different?</h1>
        </motion.div>
        <motion.section variants={itemVariants} id="uptime-not-increasing" className="mb-12">
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                <li>BlazeNode is a browser-based light node that runs on the Ethereum blockchain directly from your web browser. It is designed to be accessible to everyone, requiring no complex software installations.</li>
                <li>BlazeNode offers a referral program to reward community growth and engagement.</li>
                <li>BlazeNode is open-source and free to use, with no fees or subscriptions.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 tracking-tight mt-10" id="browser-based">Browser-Based Light Node Mining</h2>
            <p className="my-4 text-muted-foreground">Unlike traditional Proof of Work mining, which requires significant computational resources, Blazenode’s light nodes operate in browsers to verify zk-proofs for Ethereum layer 2 solutions, such as zk-rollups. This process supports Ethereum’s scalability by enabling faster, cheaper transactions while rewarding users with Blazenode tokens (name TBD).</p>


            <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 tracking-tight mt-10 mb-2" id="the-process">The Process</h2>
            <div className="overflow-x-auto w-full">
                <div className="mx-auto space-y-2">
                {/* Header Row */}
                <div className="grid grid-cols-2 bg-slate-900 text-white font-bold py-2 px-4">
                    <div>Step</div>
                    <div>Description</div>
                </div>

                {/* Data Rows */}
                {nodeLevels.map((level) => (
                    <div
                    key={level}
                    className="grid grid-cols-2 bg-transparent hover:bg-slate-900 p-2 text-sm"
                    >
                    <div>{upgradeCosts[level]}</div>
                    <div>{miningSpeeds[level]}</div>
                    </div>
                ))}
                </div>
            </div>

            <h1 className="inline-block text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight dark:text-gray-200 mt-10" id="benefits">Benefits of Browser-Based Nodes</h1>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground mt-5">
                <li>Your browser is in sleep mode or the computer is turned off</li>
                <li>Network connection issues</li>
                <li>Extension is disabled or in error state</li>
                <li>System time synchronization issues</li>
            </ul>
        </motion.section>
        <div className="flex flex-col md:flex-row mt-6 gap-4">
            <Link className="group text-sm p-2.5 flex gap-4 flex-1 flex-row items-center pr-4 border border-tint-subtle rounded straight-corners:rounded-none hover:border-primary text-pretty md:p-4 md:text-base" href="/">
                <FaAngleLeft  className="gb-icon hidden size-4 text-tint-subtle contrast-more:text-tint-strong group-hover:text-primary md:block"/>
                <span className="flex flex-col flex-1">
                <span className="text-xs">Previous</span>
                <span className="text-tint-strong group-hover:text-primary line-clamp-2">Home</span>
                </span>
            </Link>
            <Link className="group text-sm p-2.5 flex gap-4 flex-1 flex-row items-center pr-4 border border-tint-subtle rounded straight-corners:rounded-none hover:border-primary text-pretty md:p-4 md:text-base" href="/overview">
                <span className="flex flex-col flex-1">
                <span className="text-xs">Next</span>
                <span className="text-tint-strong group-hover:text-primary line-clamp-2">Overview</span>
                </span>
                <FaAngleRight className="gb-icon hidden size-4 text-tint-subtle contrast-more:text-tint-strong group-hover:text-primary md:block"/>
            </Link>
        </div>
      </motion.div>
    </DocLayout>
  );
}
