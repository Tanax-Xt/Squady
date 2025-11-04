"use client";

import { useEffect, useState } from "react";

import { cn } from "../lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function Toc({ className, ...props }: React.ComponentProps<"nav">) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headingElements = Array.from(
      article.querySelectorAll("h2, h3, h4, h5, h6"),
    );

    const headingData = headingElements.map((heading) => ({
      id:
        heading.id ||
        heading.textContent?.toLowerCase().replace(/\s+/g, "-") ||
        "",
      text: heading.textContent || "",
      level: parseInt(heading.tagName.charAt(1)),
    }));

    setHeadings(headingData);

    headingElements.forEach((heading) => {
      if (!heading.id) {
        heading.id =
          heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0% 0% -80% 0%",
        threshold: 1.0,
      },
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={cn("sticky top-24", className)} {...props}>
      <h3 className="mb-4 text-sm font-semibold">На этой странице</h3>
      <ul className="h-[calc(100vh-9rem)] space-y-2 overflow-y-auto text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ marginLeft: `${Math.max(0, heading.level - 2) * 16}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block transition-colors",
                activeId === heading.id
                  ? "text-foreground"
                  : "text-foreground/50 hover:text-foreground focus-visible:text-foreground",
              )}
            >
              {heading.text.replace("#", "")}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
