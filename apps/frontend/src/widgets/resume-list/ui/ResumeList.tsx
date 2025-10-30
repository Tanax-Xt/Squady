"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { compareResumeResponses, ResumeCard } from "@/entities/resume";
import { ResumeCardUserActions } from "@/features/resume/edit";
import { ResumeResponse } from "@/shared/api";

export interface ResumeListProps extends React.ComponentProps<"div"> {
  resumes: ResumeResponse[];
}

const ResumeList: React.FunctionComponent<ResumeListProps> = ({
  resumes,
  ...props
}) => {
  const sorted = [...resumes].sort(compareResumeResponses);
  const [isInitial, setIsInitial] = useState(true);

  const stagger = 0.1;
  const itemAnimDuration = 0.5;

  useEffect(() => {
    const total = sorted.length * stagger + itemAnimDuration;
    const t = setTimeout(() => setIsInitial(false), Math.ceil(total * 1000));
    return () => clearTimeout(t);
  }, [sorted.length]);

  return (
    <div className="mt-2 space-y-4" {...props}>
      <AnimatePresence>
        {sorted.map((resume, index) => (
          <motion.div
            key={resume.id}
            initial={{ opacity: 0, y: 6, scale: 0.995 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{ opacity: 0, y: -6, scale: 0.995 }}
            transition={{
              type: "spring",
              duration: 0.5,
              delay: isInitial ? index * stagger : 0,
            }}
            layout
          >
            <ResumeCard
              resume={resume}
              actions={<ResumeCardUserActions resume={resume} isCurrentUser />}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ResumeList;
