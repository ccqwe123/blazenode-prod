import DocLayout from "@/components/docs/Layout";
import { motion } from "framer-motion";

// Define sections for the table of contents
const contentSections = [
  {
    id: "update-sentry-node",
    title: "1. How to update your Sentry Node",
    level: 2,
    subsections: [
      { id: "open-extension", title: "Open the Extension Page" },
      { id: "developer-mode", title: "Turn on Developer Mode" },
      { id: "click-update", title: "Click to Update" }
    ]
  },
  {
    id: "unsupported-status",
    title: "2. Unsupported Status",
    level: 2,
    subsections: [
      { id: "why-unsupported", title: "Why You're Seeing an \"Unsupported\" Status?" },
      { id: "resolve-tips", title: "Tips to Resolve the Issue" },
      { id: "check-ip", title: "How to Check Your IP Quality?" }
    ]
  },
  {
    id: "users-multiple-sentry",
    title: "3. Users with multiple Sentry Nodes",
    level: 2,
    subsections: [
      { id: "same-ip", title: "Sentry Nodes with the same IP" },
      { id: "different-ips", title: "Sentry Node with different IPs" }
    ]
  },
  {
    id: "uptime-not-increasing",
    title: "4. The Uptime of my Sentry Node isn't Increasing",
    level: 2
  },
  {
    id: "more-taps",
    title: "5. How can I get more \"Taps\"?",
    level: 2
  },
  {
    id: "node-extension-not-launching",
    title: "6. Sentry Node Extension / The Globe Not Launching",
    level: 2,
    subsections: [
      { id: "ext-causes", title: "Possible Causes" },
      { id: "ext-solutions", title: "Solutions" }
    ]
  },
  {
    id: "account-access-restricted",
    title: "7. Account Access Restricted",
    level: 2
  }
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

export default function TroubleshootPage() {
  return (
    <DocLayout contentSections={contentSections}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
          <h1 className="text-2xl font-bold">Troubleshoot</h1>
        </motion.div>

        <motion.p variants={itemVariants} className="text-muted-foreground mb-8">This page will be updated regularly.</motion.p>

        {/* Section 1 */}
        <motion.section variants={itemVariants} id="update-sentry-node" className="mb-12">
          <h2 className="text-xl font-semibold mb-4">1. How to update your Sentry Node</h2>

          <p className="mb-4">Your Sentry Node extension should automatically update to the latest version.</p>

          <p className="mb-6">If it doesn't update automatically, please update it manually by following the steps below:</p>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4" id="open-extension">
              <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted border border-border text-sm font-medium">1</div>
              <div>
                <h3 className="font-medium text-lg mb-2">Open the Extension Page</h3>
                <p className="text-muted-foreground mb-2">Open your Chrome browser and go to "<span className="text-primary">chrome://extensions/</span>" from your address bar.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4" id="developer-mode">
              <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted border border-border text-sm font-medium">2</div>
              <div>
                <h3 className="font-medium text-lg mb-2">Turn on Developer Mode</h3>
                <p className="text-muted-foreground mb-2">On the top right corner of the Extensions page, toggle on "<span className="text-primary">Developer mode</span>". This will enable additional options, including manually updating your extensions.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4" id="click-update">
              <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted border border-border text-sm font-medium">3</div>
              <div>
                <h3 className="font-medium text-lg mb-2">Click to Update</h3>
                <p className="text-muted-foreground mb-2">If an update is available, click the "<span className="text-primary">Update</span>" button on the top left corner.</p>

                <p className="text-muted-foreground mb-2">Chrome will automatically check and install available updates. You'll see a notification once the update is completed.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-muted-foreground">
            <p>You can also try restarting your Chrome browser. It's recommended to keep your browser up to date as well.</p>
          </div>
        </motion.section>

        {/* Section 2 */}
        <motion.section variants={itemVariants} id="unsupported-status" className="mb-12">
          <h2 className="text-xl font-semibold mb-4">2. Unsupported Status</h2>

          <div className="mb-4" id="why-unsupported">
            <h3 className="font-medium text-lg mb-2">Why You're Seeing an "Unsupported" Status?</h3>
            <p className="text-muted-foreground mb-4">This status usually indicates that your Sentry Node extension is unable to connect properly to our network.</p>
          </div>

          <div className="mb-4" id="resolve-tips">
            <h3 className="font-medium text-lg mb-2">Tips to Resolve the Issue:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
              <li>Check your internet connection</li>
              <li>Make sure your browser is not in incognito mode</li>
              <li>Update your extension to the latest version</li>
              <li>Temporarily disable any VPN services</li>
              <li>Clear your browser cache and restart</li>
            </ul>
          </div>

          <div className="mb-4" id="check-ip">
            <h3 className="font-medium text-lg mb-2">How to Check Your IP Quality?</h3>
            <p className="text-muted-foreground">If the issue persists, your IP address might be flagged as low quality. You can check your IP status using our diagnostic tool in the settings page.</p>
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section variants={itemVariants} id="users-multiple-sentry" className="mb-12">
          <h2 className="text-xl font-semibold mb-4">3. Users with multiple Sentry Nodes</h2>

          <div className="space-y-4">
            <div id="same-ip">
              <h3 className="font-medium text-lg mb-2">Sentry Nodes with the same IP</h3>
              <p className="text-muted-foreground">If you're running multiple Sentry Nodes on the same IP address, only one will be counted for rewards. Each IP address can only have one active node in our network.</p>
            </div>

            <div id="different-ips">
              <h3 className="font-medium text-lg mb-2">Sentry Node with different IPs</h3>
              <p className="text-muted-foreground">Running nodes on different IP addresses is allowed, but please ensure each node is associated with a unique Gradient Network account to avoid potential issues.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 4 */}
        <motion.section variants={itemVariants} id="uptime-not-increasing" className="mb-12">
          <h2 className="text-xl font-semibold mb-4">4. The Uptime of my Sentry Node isn't Increasing</h2>

          <p className="text-muted-foreground mb-4">If your uptime counter seems stuck, here are some possible reasons and solutions:</p>

          <div className="bg-secondary/60 border border-border rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-2">Possible Causes:</h3>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>Your browser is in sleep mode or the computer is turned off</li>
              <li>Network connection issues</li>
              <li>Extension is disabled or in error state</li>
              <li>System time synchronization issues</li>
            </ul>
          </div>

          <p className="text-muted-foreground">Remember that the Sentry Node needs to be actively running to accumulate uptime. Your browser should be open, and the extension should be enabled.</p>
        </motion.section>

        {/* Section 5 */}
        <motion.section variants={itemVariants} id="more-taps" className="mb-12">
          <h2 className="text-xl font-semibold mb-4">5. How can I get more "Taps"?</h2>

          <p className="text-muted-foreground mb-4">Taps are rewards for active participation in the Gradient Network. Here's how you can increase your Tap rewards:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/60 border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">Sentry Node Uptime</h3>
              <p className="text-sm text-muted-foreground">Increase your node's uptime to earn more regular Taps. Consistent uptime is rewarded.</p>
            </div>

            <div className="bg-secondary/60 border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">Community Participation</h3>
              <p className="text-sm text-muted-foreground">Engage with the community in Discord and participate in network activities.</p>
            </div>

            <div className="bg-secondary/60 border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">Referral Program</h3>
              <p className="text-sm text-muted-foreground">Invite others to join Gradient Network and earn bonus Taps when they set up nodes.</p>
            </div>

            <div className="bg-secondary/60 border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">Special Events</h3>
              <p className="text-sm text-muted-foreground">Participate in periodic events and challenges announced in our Discord.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 6 */}
        <motion.section variants={itemVariants} id="node-extension-not-launching" className="mb-12">
          <h2 className="text-xl font-semibold mb-4">6. Sentry Node Extension / The Globe Not Launching</h2>

          <p className="text-muted-foreground mb-4">If you're experiencing issues with the Sentry Node extension not launching or the Globe visualization not appearing:</p>

          <div className="mb-4" id="ext-causes">
            <h3 className="font-medium text-lg mb-2">Possible Causes:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 text-primary"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
                <span>Browser compatibility issues - try updating your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 text-primary"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
                <span>Extension permissions - check that all required permissions are granted</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 text-primary"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
                <span>Conflicting extensions - try temporarily disabling other extensions</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 text-primary"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
                <span>Hardware acceleration issues - try enabling/disabling in browser settings</span>
              </li>
            </ul>
          </div>

          <div className="mb-4" id="ext-solutions">
            <h3 className="font-medium text-lg mb-2">Solutions:</h3>
            <p className="text-muted-foreground">Try reinstalling the extension and restarting your browser. If the problem persists, please contact our support team through Discord.</p>
          </div>
        </motion.section>

        {/* Section 7 */}
        <motion.section variants={itemVariants} id="account-access-restricted" className="mb-12">
          <h2 className="text-xl font-semibold mb-4">7. Account Access Restricted</h2>

          <p className="text-muted-foreground mb-4">If you see an "Account Access Restricted" message, your account may have been flagged due to suspicious activity or violation of our terms of service.</p>

          <div className="bg-secondary/60 border border-border rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-2">Common Reasons:</h3>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>Multiple accounts sharing the same IP address</li>
              <li>Use of proxy/VPN services that are on our restricted list</li>
              <li>Automated or bot-like activity patterns</li>
              <li>Violation of community guidelines</li>
            </ul>
          </div>

          <p className="text-muted-foreground mb-4">If you believe this is an error, please contact our support team via Discord with your account details for further assistance.</p>
        </motion.section>
      </motion.div>
    </DocLayout>
  );
}
