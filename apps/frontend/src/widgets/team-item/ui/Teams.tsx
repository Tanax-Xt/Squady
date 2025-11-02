"use client";

import {
  ChevronsUpDownIcon,
  FunnelXIcon,
  SearchIcon,
  SearchXIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  EDUCATION_TYPES,
  getEducationTypeDisplayName,
} from "@/entities/resume";
import { EducationType, TeamResponse } from "@/shared/api";
import { debounce } from "@/shared/lib/debounce";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { ItemGroup } from "@/shared/ui/item";
import { Label } from "@/shared/ui/label";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/shared/ui/popover";

import { TeamItem } from "./TeamItem";
import { TeamsEmpty } from "./TeamsEmpty";
import { getTeams } from "../api/cache";

function Teams({
  teams,
  skills,
}: {
  teams: TeamResponse[] | undefined;
  skills: string[];
}) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillsSearchQuery, setSkillsSearchQuery] = useState("");
  const [selectedEducationTypes, setSelectedEducationTypes] = useState<
    EducationType[]
  >(Array.from(EDUCATION_TYPES));

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
      skill.toLowerCase().includes(skillsSearchQuery.toLowerCase()),
    ) || [];

  const [loading, setLoading] = useState(false);

  const [filterParams, setFilterParams] = useState({
    education_types: selectedEducationTypes,
    q: searchQuery,
    skills: selectedSkills,
  });

  // Combine all filter updates into a single useEffect
  const updateFilterParams = () => {
    setFilterParams({
      education_types: selectedEducationTypes,
      q: searchQuery,
      skills: selectedSkills,
    });
  };

  const debouncedUpdateFilterParams = debounce(updateFilterParams, 300);

  useEffect(() => {
    debouncedUpdateFilterParams();
  }, [selectedEducationTypes, selectedSkills, searchQuery]);

  const [responses, setResponses] = useState<TeamResponse[]>([]);

  const getResponses = async () => {
    if (loading) return; // Prevent further fetching if already loading
    setLoading(true); // Set loading to true

    try {
      const data = await getTeams(
        Object.keys(filterParams).length === 0 ? {} : filterParams,
      );

      setResponses(data ?? []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false); // Reset loading state after fetching
    }
  };

  useEffect(() => {
    getResponses(); // Fetch data whenever filterParams change
  }, [filterParams]);

  const hasFiltersApplied =
    !!selectedSkills.length ||
    selectedEducationTypes.length !== EDUCATION_TYPES.length ||
    !!searchQuery;

  return (
    <section className="space-y-4">
      <h2 id="all" className="scroll-mt-18 text-xl font-semibold">
        Все команды
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        {!!teams?.length ? (
          <>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск команд"
              />
            </InputGroup>
            <div className="-my-1 flex gap-2 overflow-x-auto">
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="rounded-full">
                    Компетенции
                    {!!selectedSkills.length && (
                      <Badge
                        className="flex !size-5 items-center justify-center tabular-nums"
                        variant="default"
                      >
                        {selectedSkills.length}
                      </Badge>
                    )}
                    <ChevronsUpDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex h-65 flex-col gap-2 overflow-hidden"
                  align="start"
                >
                  <p className="text-sm font-medium text-accent-foreground">
                    Фильтрация по навыкам
                  </p>
                  <InputGroup>
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Поиск навыков"
                      value={skillsSearchQuery}
                      onChange={(e) => setSkillsSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                  <ItemGroup className="-mx-4 -mb-4 flex flex-col gap-2 overflow-y-auto px-4 pb-4">
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
                          <p className="text-sm leading-none font-medium">
                            {skill}
                          </p>
                        </div>
                      </Label>
                    ))}
                  </ItemGroup>
                </PopoverContent>
              </PopoverRoot>
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="rounded-full">
                    Уровень
                    {selectedEducationTypes.length !==
                      EDUCATION_TYPES.length && (
                      <Badge
                        className="flex !size-5 items-center justify-center tabular-nums"
                        variant="default"
                      >
                        {selectedEducationTypes.length}
                      </Badge>
                    )}
                    <ChevronsUpDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex h-65 flex-col gap-2 overflow-hidden"
                  align="start"
                >
                  <p className="text-sm font-medium text-accent-foreground">
                    Фильтрация по типам образования
                  </p>
                  <ItemGroup className="-mx-4 -mb-4 flex flex-col gap-2 overflow-y-auto px-4 pb-4">
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
                </PopoverContent>
              </PopoverRoot>
              {hasFiltersApplied && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-destructive!"
                  onClick={() => {
                    setSelectedSkills([]);
                    setSelectedEducationTypes(Array.from(EDUCATION_TYPES));
                    setSearchQuery("");
                  }}
                >
                  <FunnelXIcon />
                  Сбросить
                </Button>
              )}
            </div>
            {!!responses.length
              ? responses
                  ?.sort((a, b) => {
                    return (
                      Date.parse(b.updated_at).valueOf() -
                      Date.parse(a.updated_at).valueOf()
                    );
                  })
                  .map((teamMy) => <TeamItem key={teamMy.id} team={teamMy} />)
              : hasFiltersApplied && (
                  <Empty>
                    <EmptyMedia variant="icon">
                      <SearchXIcon />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle>Ничего не найдено</EmptyTitle>
                      <EmptyDescription>
                        Попробуйте изменить критерии поиска.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSkills([]);
                          setSelectedEducationTypes(
                            Array.from(EDUCATION_TYPES),
                          );
                          setSearchQuery("");
                        }}
                      >
                        <FunnelXIcon />
                        Сбросить фильтры
                      </Button>
                    </EmptyContent>
                  </Empty>
                )}
          </>
        ) : (
          <TeamsEmpty />
        )}
      </div>
    </section>
  );
}

export { Teams };
