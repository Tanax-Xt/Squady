"use client";

import { MoreHorizontalIcon, PlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { compareResumeResponses, ResumePrivateIcon } from "@/entities/resume";
import { ResumeCardUserActions } from "@/features/resume/edit";
import { ResumeResponse } from "@/shared/api";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

function ResumeSidebarMenuItem({
  resume,
  isActive,
}: {
  resume: ResumeResponse;
  isActive?: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} asChild>
        <Link href={`/resumes/${resume.id}`}>
          <UsersIcon />
          <span className="flex items-center justify-between gap-1">
            <span className="truncate">{resume.role}</span>
            {!resume.is_public && <ResumePrivateIcon />}
          </span>
        </Link>
      </SidebarMenuButton>
      <ResumeCardUserActions resume={resume} isCurrentUser>
        <SidebarMenuAction>
          <MoreHorizontalIcon />
          <span className="sr-only">Действия с резюме</span>
        </SidebarMenuAction>
      </ResumeCardUserActions>
    </SidebarMenuItem>
  );
}

export function NavResumes({
  resumes,
}: {
  resumes: ResumeResponse[] | undefined;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Мои резюме</SidebarGroupLabel>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <SidebarGroupAction asChild>
            <Link href="/resumes/create">
              <PlusIcon />
            </Link>
          </SidebarGroupAction>
        </TooltipTrigger>
        <TooltipContent>Новое резюме</TooltipContent>
      </TooltipRoot>
      <SidebarGroupContent>
        <SidebarMenu>
          {resumes?.sort(compareResumeResponses).map((resume) => {
            const href = `/resumes/${resume.id}`;
            const isActive = href === pathname;

            return (
              <ResumeSidebarMenuItem
                key={resume.id}
                resume={resume}
                isActive={isActive}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
