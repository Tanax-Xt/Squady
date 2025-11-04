"use client";

import {
  animate,
  Easing,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useId } from "react";

import { cn } from "../lib/utils";

export interface ProgressCircleProps extends React.ComponentProps<"div"> {
  size?: number;
  progress?: number;
  trackWidth?: number;
  trackColor?: string;
  indicatorWidth?: number;
  indicatorColor?: string;
  indicatorStrokeLinecap?: "inherit" | "butt" | "round" | "square" | undefined;
  label?: React.ReactNode;
  animateDelay?: number;
  animateDuration?: number;
  animateEase?: Easing | Easing[] | undefined;
}

const ProgressCircle: React.FunctionComponent<ProgressCircleProps> = ({
  size = 128,
  progress = 0,
  trackWidth = size / 12,
  trackColor = "var(--color-border)",
  indicatorWidth = size / 12,
  indicatorColor = "var(--color-primary)",
  indicatorStrokeLinecap = "round",
  label,
  animateDelay = 0.125,
  animateDuration = 1,
  animateEase = [0.32, 0.72, 0, 1],
  className,
  ...otherProps
}) => {
  const center = size / 2;
  const radius = center - Math.max(trackWidth, indicatorWidth);
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray * ((100 - progress) / 100);

  const id = useId();
  const rootId = `progress-circle-${id}`;
  const labelId = `${rootId}-label`;

  const progressMotionValue = useMotionValue(0);

  const progressDisplay = useTransform(
    progressMotionValue,
    (value) => `${Math.round(value)}%`,
  );

  useEffect(() => {
    const { stop } = animate(progressMotionValue, progress, {
      duration: animateDuration,
      delay: animateDelay,
      ease: animateEase,
    });

    return stop;
  }, [progress, progressMotionValue]);

  return (
    <>
      <div
        role="progressbar"
        style={{ width: size, height: size }}
        className={cn("@container relative shrink-0", className)}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${progress}%`}
        aria-labelledby={labelId}
        {...otherProps}
      >
        <svg className="-rotate-90" width={size} height={size}>
          <circle
            r={radius}
            cx={center}
            cy={center}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
          <motion.circle
            key={`progress-circle-${id}-${size}`}
            r={radius}
            cx={center}
            cy={center}
            fill="transparent"
            stroke={indicatorColor}
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap={indicatorStrokeLinecap}
            initial={{
              strokeDasharray: dashArray,
              strokeDashoffset: dashArray,
            }}
            animate={{
              strokeDashoffset: dashOffset,
            }}
            transition={{
              duration: animateDuration,
              delay: animateDelay,
              ease: animateEase,
            }}
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-1/2 text-center">
          <motion.span
            className={cn(
              "block font-bold tracking-wider text-foreground tabular-nums",
              label ? "text-[19cqi]" : "text-[23cqi] leading-relaxed",
            )}
          >
            {progressDisplay}
          </motion.span>

          {label && (
            <span
              id={labelId}
              className="block text-[10cqi] leading-tight font-semibold text-balance text-muted-foreground"
            >
              {label}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ProgressCircle;
