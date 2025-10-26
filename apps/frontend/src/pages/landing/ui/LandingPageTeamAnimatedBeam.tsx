"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/shared/lib/utils";
import AnimatedBeam from "@/shared/ui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-16 cursor-default items-center justify-center rounded-full border-2 bg-background p-3 shadow-xl select-none",
        className,
      )}
    >
      {children}
    </div>
  );
});

const LandingPageTeamAnimatedBeam = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-10",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref} className="text-4xl">
            ☹️
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-20 text-4xl">
            💬
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref} className="text-3xl">
            <span className="opacity-25">😉</span>
          </Circle>
          <Circle ref={div2Ref} className="text-3xl">
            <span className="opacity-25">😄</span>
          </Circle>
          <Circle ref={div3Ref} className="text-4xl">
            😎
          </Circle>
          <Circle ref={div4Ref} className="text-3xl">
            <span className="opacity-25">🙃</span>
          </Circle>
          <Circle ref={div5Ref} className="text-3xl">
            <span className="opacity-25">😀</span>
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={3}
      />
    </div>
  );
};

export default LandingPageTeamAnimatedBeam;
