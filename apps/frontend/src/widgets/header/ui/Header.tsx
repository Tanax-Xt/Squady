import Image from "next/image";
import Link from "next/link";

import { getCurrentUserOrUndefined, UserAvatar } from "@/entities/user";
import { Button } from "@/shared/ui/button";

export async function Header() {
  const currentUser = await getCurrentUserOrUndefined();

  return (
    <header className="sticky top-0 z-50 w-full bg-background py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 transition-opacity hover:opacity-75 focus-visible:opacity-75 active:opacity-50"
        >
          <Image
            src="/icon.svg"
            alt="Логотип"
            width={32}
            height={32}
            decoding="async"
            draggable={false}
            fetchPriority="high"
          />
          <span className="text-lg font-semibold">Squady</span>
        </Link>
        {currentUser ? (
          <Link href="/home">
            <UserAvatar user={currentUser} />
          </Link>
        ) : (
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/login">Войти</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
