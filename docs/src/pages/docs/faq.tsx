import DocLayout from "@/components/docs/Layout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


export default function FAQPage() {
    return (
        <DocLayout>
            <motion.section id="general" className="mb-12 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6">FAQs</h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="run-nodes">
                <AccordionTrigger>How many nodes can i run</AccordionTrigger>
                    <AccordionContent>
                        You can run up to 5 nodes per account. This limit helps ensure fair access and resource distribution across the network.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="miss-check-in">
                <AccordionTrigger>What happens if I miss a check-in?</AccordionTrigger>
                    <AccordionContent>
                        Missed check-ins will break streak.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="referral-rankings">
                <AccordionTrigger>How are referral rankings calculated?</AccordionTrigger>
                    <AccordionContent>
                        Ranking are cumulative. For example, 20 referrals unlock Rank 4 (2.5x bonus points).
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="minimum-requirements">
                <AccordionTrigger>Is there a minimum hardware requirement?</AccordionTrigger>
                    <AccordionContent>
                        No – nodes run entirely in the browser.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            </motion.section>
        </DocLayout>
    );
}
