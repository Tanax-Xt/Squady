"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/shared/ui/button";

export const ResumeEditPageBack: React.FunctionComponent<{ href: string }> = ({
  href,
}) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button variant="ghost" onClick={() => router.push(href)}>
      <ArrowLeftIcon />
      <span>Назад</span>
    </Button>
  );
};
