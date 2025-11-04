"use client";

import { LifeBuoyIcon } from "lucide-react";
import Link from "next/link";

import ThemeRadioGroup from "@/shared/ui/ThemeRadioGroup";
import { Button } from "@/shared/ui/button";

export function Footer() {
  return (
    <footer className="w-full py-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <Button variant="ghost" className="text-muted-foreground" asChild>
          <Link href="/docs/help">
            <LifeBuoyIcon />
            Помощь
          </Link>
        </Button>

        <ThemeRadioGroup />
      </div>
    </footer>
  );
}
