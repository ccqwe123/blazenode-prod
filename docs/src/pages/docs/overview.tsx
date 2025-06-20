import DocLayout from "@/components/docs/Layout";
import { motion } from "framer-motion";
import { FaAngleRight } from "react-icons/fa";

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
  1: "0.001",
  2: "10.5",
  3: "15.55",
  4: "20.5",
  5: "-",
};

const miningSpeeds: Record<number, string> = {
  1: "1.0",
  2: "1.3",
  3: "1.8",
  4: "2.3",
  5: "3.0",
};
export default function ProjectOverviewPage() {
    const nodeLevels = [1, 2, 3, 4, 5];
  return (
    <DocLayout contentSections={contentSections}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.section variants={itemVariants} id="project-overview" className="mb-12">
          <h2 className="inline-block text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight dark:text-gray-200 my-5">Project Overview</h2>
          <p className="mb-4">BlazeNode allows users to run virtual nodes directly through their browsers. Users earn rewards by:</p>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4" id="activate-nodes">
              <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted border border-border text-sm font-medium">1</div>
              <div>
                <h3 className="font-medium text-lg mb-2">Activate Nodes</h3>
                <p className="text-muted-foreground mb-2">Activating nodes every 6 hours. You can activate nodes manually by clicking the <span className="text-primary">Start Mining</span> button on the Dashboard page.</p>
              </div>
            </div>
            <div className="flex gap-4" id="daily-checkin">
              <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted border border-border text-sm font-medium">2</div>
              <div>
                <h3 className="font-medium text-lg mb-2">Daily checkin</h3>
                <p className="text-muted-foreground mb-2">Checking in every 24 hours. You can check in manually by cli  cking the <span className="text-primary">Check In</span> button on the Dashboard page.</p>
              </div>
            </div>
            <div className="flex gap-4" id="upgrade-nodes">
              <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted border border-border text-sm font-medium">3</div>
              <div>
                <h3 className="font-medium text-lg mb-2">Upgrade Nodes</h3>
                <p className="text-muted-foreground mb-2">Upgrading nodes for higher mining speeds</p>
              </div>
            </div>
            <div className="flex gap-4" id="refer-friend">
              <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted border border-border text-sm font-medium">4</div>
              <div>
                <h3 className="font-medium text-lg mb-2">Refer a Friend</h3>
                <p className="text-muted-foreground mb-2">Referring friends to unlock ranked bonuses</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-muted-foreground">
            <p><span className="font-bold text-white">Vision: </span>Democratize access to browser-based mining with low entry barriers.</p>
          </div>

        </motion.section>

        <motion.section variants={itemVariants} id="node-mechanics" className="mb-12">
          <h2 className="inline-block text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight dark:text-gray-200 my-5">Node Mechanics</h2>
          <p className="mb-4">Upgrade Costs & Mining Speeds</p>
            <div className="overflow-x-auto w-full">
                <div className="mx-auto space-y-2">
                {/* Header Row */}
                <div className="grid grid-cols-3 bg-slate-900 text-white font-bold py-2 px-4 text-center border border-slate-700">
                    <div>Node Level</div>
                    <div>Upgrade Cost</div>
                    <div>Mining Speed (Units/hr)</div>
                </div>

                {/* Data Rows */}
                {nodeLevels.map((level) => (
                    <div
                    key={level}
                    className="grid grid-cols-3 bg-transparent hover:bg-slate-900 p-2 text-center text-sm"
                    >
                    <div className="border-r border-b border-slate-700">{level}</div>
                    <div className="border-r border-b border-slate-700">{upgradeCosts[level]}</div>
                    <div className="border-r border-b border-slate-700">{miningSpeeds[level]}</div>
                    </div>
                ))}
                </div>
            </div>
            <div className="mt-8 text-muted-foreground">
                <p><span className="font-bold text-white">Notes:</span></p>
                <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                    <li>Level 5 nodes are <span className="text-primary">reward-only</span> (cannot be purchased).</li>
                    <li>Upgrade costs reset after each level.</li>
                </ul>
            </div>
        </motion.section>

      </motion.div>
    </DocLayout>
  );
}
