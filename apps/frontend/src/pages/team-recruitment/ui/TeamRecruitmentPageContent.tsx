"use client";

import { FunnelIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { EDUCATION_TYPES } from "@/entities/resume";
import { EducationType } from "@/shared/api";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/ui/input-group";
import Page from "@/shared/ui/page";

import { TeamRecruitmentFilters } from "./TeamRecruitmentFilters";

export function TeamRecruitmentPageContent({
  skills,
}: {
  skills: string[] | undefined;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [experienceRange, setExperienceRange] = useState([0, 50]);
  const [projectsRange, setProjectsRange] = useState([0, 10]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedEducationTypes, setSelectedEducationTypes] = useState<
    EducationType[]
  >(Array.from(EDUCATION_TYPES));
  const [searchQuery, setSearchQuery] = useState("");

  const filterProps = {
    skills,
    experienceRange,
    setExperienceRange,
    projectsRange,
    setProjectsRange,
    selectedSkills,
    setSelectedSkills,
    selectedEducationTypes,
    setSelectedEducationTypes,
    searchQuery,
    setSearchQuery,
  };
  // Calculate the number of applied filters
  const appliedFiltersCount = useMemo(() => {
    let count = 0;

    // Check experience range
    if (experienceRange[0] !== 0 || experienceRange[1] !== 50) {
      count++;
    }

    // Check projects range
    if (projectsRange[0] !== 0 || projectsRange[1] !== 10) {
      count++;
    }

    // Check skills
    if (selectedSkills.length > 0) {
      count++;
    }

    // Check education types
    if (selectedEducationTypes.length !== EDUCATION_TYPES.length) {
      count++;
    }

    // Check search query
    // if (searchQuery.trim() !== "") {
    //   count++;
    // }

    return count;
  }, [
    experienceRange,
    projectsRange,
    selectedSkills,
    selectedEducationTypes,
    searchQuery,
  ]);

  return (
    <Page.Content size="7xl" className="grid grid-cols-12 gap-4">
      <DrawerRoot open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="col-span-12 md:col-span-9">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Поиск участников" />
            <InputGroupAddon align="inline-end" className="md:hidden">
              <DrawerTrigger asChild>
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  className="relative"
                >
                  <FunnelIcon />
                  {appliedFiltersCount > 0 && (
                    <Badge className="absolute top-0.5 right-0 flex size-3.5 items-center justify-center p-0 text-[10px] tabular-nums">
                      {appliedFiltersCount}
                    </Badge>
                  )}
                </InputGroupButton>
              </DrawerTrigger>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="col-span-3 flex flex-col gap-6 max-md:hidden">
          <TeamRecruitmentFilters {...filterProps} />
        </div>
        <DrawerContent className="h-4/5">
          <DrawerHeader>
            <DrawerTitle>Фильтры</DrawerTitle>
            <DrawerDescription>
              Установите фильтры для подбора участников.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <TeamRecruitmentFilters
              {...filterProps}
              onReset={() => setMobileOpen(false)}
            />
            <DrawerClose asChild>
              <Button size="lg" variant="outline" className="mt-2 w-full">
                Закрыть
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </DrawerRoot>
    </Page.Content>
  );
}
