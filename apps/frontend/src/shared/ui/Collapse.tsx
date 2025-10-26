"use client";

import { AnimatePresence, motion } from "motion/react";

export type CollapseProps = React.ComponentProps<"div">;

const Collapse: React.FunctionComponent<CollapseProps> = ({
  children,
  ...otherProps
}) => {
  return (
    <AnimatePresence>
      {children && (
        <motion.div
          initial={{
            height: 0,
            opacity: 0,
            y: -20,
          }}
          animate={{
            height: "auto",
            opacity: 1,
            y: 0,
          }}
          exit={{
            height: 0,
            opacity: 0,
            y: -20,
          }}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.15,
          }}
          className="overflow-hidden"
        >
          <div {...otherProps}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Collapse;
