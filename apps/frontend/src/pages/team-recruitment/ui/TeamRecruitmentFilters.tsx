"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelXIcon,
  SearchIcon,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import {
  EDUCATION_TYPES,
  getEducationTypeDisplayName,
} from "@/entities/resume";
import { EducationType } from "@/shared/api";
import { env } from "@/shared/config/client";
import { Button } from "@/shared/ui/button";
import { CardContent, CardRoot, CardTitle } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { Field, FieldGroup, FieldTitle } from "@/shared/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { ItemGroup } from "@/shared/ui/item";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Slider } from "@/shared/ui/slider";

export type TeamRecruitmentFiltersProps = {
  skills: string[] | undefined;
  experienceRange: number[];
  setExperienceRange: Dispatch<SetStateAction<number[]>>;
  projectsRange: number[];
  setProjectsRange: Dispatch<SetStateAction<number[]>>;
  selectedSkills: string[];
  setSelectedSkills: Dispatch<SetStateAction<string[]>>;
  selectedEducationTypes: EducationType[];
  setSelectedEducationTypes: Dispatch<SetStateAction<EducationType[]>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  searchQ: string;
  setSearchQ: Dispatch<SetStateAction<string>>;
  onReset?: VoidFunction;
};

export function TeamRecruitmentFilters({
  skills,
  experienceRange,
  setExperienceRange,
  projectsRange,
  setProjectsRange,
  selectedSkills,
  setSelectedSkills,
  selectedEducationTypes,
  setSearchQ,
  setSelectedEducationTypes,
  searchQuery,
  setSearchQuery,
  onReset,
}: TeamRecruitmentFiltersProps) {
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [educationTypesOpen, setEducationTypesOpen] = useState(false);

  const toggleSkillSelection = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const toggleEducationTypeSelection = (educationType: EducationType) => {
    setSelectedEducationTypes((prev) =>
      prev.includes(educationType)
        ? prev.filter((s) => s !== educationType)
        : [...prev, educationType],
    );
  };

  const filteredSkills =
    skills?.filter((skill) =>
      skill.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <FieldGroup className="gap-4">
      <Collapsible asChild open={skillsOpen} onOpenChange={setSkillsOpen}>
        <CardRoot className="gap-0 overflow-hidden p-0">
          <CollapsibleTrigger className="flex items-center justify-between gap-0 px-5 py-3 hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none">
            <CardTitle className="text-sm">Навыки</CardTitle>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-sm font-medium tabular-nums">
                {selectedSkills.length}/{skills?.length}
              </span>

              {skillsOpen ? (
                <ChevronUpIcon className="size-5" />
              ) : (
                <ChevronDownIcon className="size-5" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col">
            <Separator />
            <div className="px-2 pt-2">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Поиск навыков"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </div>
            <ItemGroup className="flex h-52 flex-col gap-2 overflow-y-scroll p-2">
              {filteredSkills.map((skill) => (
                <Label
                  key={skill}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
                >
                  <Checkbox
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={() => toggleSkillSelection(skill)}
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">{skill}</p>
                  </div>
                </Label>
              ))}
            </ItemGroup>
          </CollapsibleContent>
        </CardRoot>
      </Collapsible>
      <Collapsible
        asChild
        open={educationTypesOpen}
        onOpenChange={setEducationTypesOpen}
      >
        <CardRoot className="gap-0 overflow-hidden p-0">
          <CollapsibleTrigger className="flex items-center justify-between gap-0 px-5 py-3 hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none">
            <CardTitle className="text-sm">Уровень образования</CardTitle>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-sm font-medium tabular-nums">
                {selectedEducationTypes.length}/{EDUCATION_TYPES?.length}
              </span>

              {educationTypesOpen ? (
                <ChevronUpIcon className="size-5" />
              ) : (
                <ChevronDownIcon className="size-5" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col">
            <Separator />
            <ItemGroup className="flex h-52 flex-col gap-2 overflow-y-scroll p-2">
              {EDUCATION_TYPES.map((education) => (
                <Label
                  key={education}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
                >
                  <Checkbox
                    checked={selectedEducationTypes.includes(education)}
                    onCheckedChange={() =>
                      toggleEducationTypeSelection(education)
                    }
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      {getEducationTypeDisplayName(education)}
                    </p>
                  </div>
                </Label>
              ))}
            </ItemGroup>
          </CollapsibleContent>
        </CardRoot>
      </Collapsible>
      <CardRoot>
        <CardContent>
          <Field>
            <FieldTitle>
              Лет опыта
              <div className="ms-auto text-sm font-medium text-muted-foreground tabular-nums">
                {experienceRange[0]} – {experienceRange[1]}
              </div>
            </FieldTitle>
            <Slider
              value={experienceRange}
              onValueChange={setExperienceRange}
              min={
                env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MIN_COUNT
              }
              max={
                env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MAX_COUNT
              }
              step={1}
            />
          </Field>
        </CardContent>
      </CardRoot>
      <CardRoot>
        <CardContent>
          <Field>
            <FieldTitle>
              Количество проектов
              <div className="ms-auto text-sm font-medium text-muted-foreground tabular-nums">
                {projectsRange[0]} – {projectsRange[1]}
              </div>
            </FieldTitle>
            <Slider
              value={projectsRange}
              onValueChange={setProjectsRange}
              min={env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MIN_COUNT}
              max={env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MAX_COUNT}
              step={1}
            />
          </Field>
        </CardContent>
      </CardRoot>
      <Button
        size="lg"
        variant="outline"
        className="!text-destructive"
        onClick={() => {
          setSelectedSkills([]);
          setSelectedEducationTypes(Array.from(EDUCATION_TYPES));
          setExperienceRange([
            env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MIN_COUNT,
            env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MAX_COUNT,
          ]);
          setProjectsRange([
            env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MIN_COUNT,
            env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MAX_COUNT,
          ]);
          setSearchQ("");
          onReset?.();
        }}
      >
        <FunnelXIcon />
        Сбросить фильтры
      </Button>
    </FieldGroup>
  );
}
