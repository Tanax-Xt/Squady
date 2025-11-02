"use client";

import {
  FunnelIcon,
  FunnelXIcon,
  SearchIcon,
  SearchXIcon,
  SendIcon,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { EDUCATION_TYPES } from "@/entities/resume";
import { sendTeamInvite } from "@/features/team/manage";
import {
  EducationType,
  ResumeWithUserResponse,
  TeamResponse,
} from "@/shared/api";
import { env } from "@/shared/config/client";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CardContent, CardRoot } from "@/shared/ui/card";
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
  InputGroupButton,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { ItemGroup, ItemSeparator } from "@/shared/ui/item";
import Page from "@/shared/ui/page";
import Spinner from "@/shared/ui/spinner";
import { TeamMemberItem } from "@/widgets/team-item";

import { TeamRecruitmentFilters } from "./TeamRecruitmentFilters";
import { getResumes } from "../api/cache/getResumes";

const debounce = (func: CallableFunction, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null; // Allow null for TypeScript

  return (...args: unknown[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null; // Resetting timeoutId to null after execution
    }, delay);
  };
};

function Result({
  team,
  response,
}: {
  team: TeamResponse;
  response: ResumeWithUserResponse;
}) {
  const [inviting, startInviting] = useTransition();

  return (
    <TeamMemberItem
      team={team}
      resume={response}
      member={{ ...response.user, ...response.personal_data }}
      back={`/teams/${team.id}/recruitment#result-${response.id}`}
      actions={
        <Button
          size="sm"
          className="rounded-full"
          variant="outline"
          onClick={() =>
            startInviting(async () => {
              const { status } = await sendTeamInvite(team.id, {
                email: response.user.email,
              });

              if (status === 204) {
                toast.success(
                  `Приглашение отправлено на почту ${response.user.email}!`,
                );
              } else {
                toast.error(
                  "Не удалось отправить приглашение! Попробуйте ещё раз.",
                );
              }
            })
          }
          disabled={inviting}
        >
          {inviting ? <Spinner /> : <SendIcon />}
          <span className="max-md:sr-only">Пригласить</span>
        </Button>
      }
      className="px-0"
    />
  );
}

export function TeamRecruitmentPageContent({
  skills,
  team,
}: {
  skills: string[] | undefined;
  team: TeamResponse;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [experienceRange, setExperienceRange] = useState([
    env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MIN_COUNT,
    env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MAX_COUNT,
  ]);
  const [projectsRange, setProjectsRange] = useState([
    env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MIN_COUNT,
    env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MAX_COUNT,
  ]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedEducationTypes, setSelectedEducationTypes] = useState<
    EducationType[]
  >(Array.from(EDUCATION_TYPES));
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQ, setSearchQ] = useState("");

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
    searchQ,
    setSearchQ,
    setSearchQuery,
  };
  // Calculate the number of applied filters
  const appliedFiltersCount = useMemo(() => {
    let count = 0;

    // Check experience range
    if (
      experienceRange[0] !==
        env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MIN_COUNT ||
      experienceRange[1] !==
        env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MAX_COUNT
    ) {
      count++;
    }

    // Check projects range
    if (
      projectsRange[0] !==
        env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MIN_COUNT ||
      projectsRange[1] !==
        env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MAX_COUNT
    ) {
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

  const [loading, setLoading] = useState(false);

  const [filterParams, setFilterParams] = useState({
    education_types: selectedEducationTypes,
    q: searchQ,
    skills: selectedSkills,
    experience_years_from: experienceRange[0],
    experience_years_to: experienceRange[1],
    projects_count_from: projectsRange[0],
    projects_count_to: projectsRange[1],
  });

  // Combine all filter updates into a single useEffect
  const updateFilterParams = () => {
    setFilterParams({
      education_types: selectedEducationTypes,
      q: searchQ,
      skills: selectedSkills,
      experience_years_from: experienceRange[0],
      experience_years_to: experienceRange[1],
      projects_count_from: projectsRange[0],
      projects_count_to: projectsRange[1],
    });
  };

  const debouncedUpdateFilterParams = debounce(updateFilterParams, 300);

  useEffect(() => {
    debouncedUpdateFilterParams();
  }, [
    selectedEducationTypes,
    selectedSkills,
    searchQ,
    experienceRange,
    projectsRange,
  ]);

  const [responses, setResponses] = useState<ResumeWithUserResponse[]>([]);

  const getResponses = async () => {
    if (loading) return; // Prevent further fetching if already loading
    setLoading(true); // Set loading to true

    try {
      const data = await getResumes(
        Object.keys(filterParams).length === 0 ? {} : filterParams,
      );

      setResponses(data ?? []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false); // Reset loading state after fetching
    }
  };

  useEffect(() => {
    getResponses(); // Fetch data whenever filterParams change
  }, [filterParams]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Page.Content
      size="7xl"
      className="flex grid-cols-12 flex-col !items-start gap-4 xl:grid"
    >
      <DrawerRoot open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="col-span-12 w-full grow max-xl:order-2 xl:col-span-9">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Поиск участников"
              onChange={(e) => setSearchQ(e.currentTarget.value)}
              value={searchQ}
            />
            <InputGroupAddon align="inline-end" className="md:hidden">
              <DrawerTrigger asChild>
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  className="relative"
                >
                  <FunnelIcon />
                  {mounted && appliedFiltersCount > 0 && (
                    <Badge className="absolute top-0.5 right-0 flex size-3.5 items-center justify-center p-0 text-[10px] tabular-nums">
                      {appliedFiltersCount}
                    </Badge>
                  )}
                </InputGroupButton>
              </DrawerTrigger>
            </InputGroupAddon>
          </InputGroup>

          <CardRoot className="mt-4 py-0">
            <CardContent className="!px-3">
              <ItemGroup>
                {!!responses.length ? (
                  responses.map((response, index) => {
                    return (
                      <Fragment key={response.id}>
                        <Result team={team} response={response} />
                        {index !== responses.length - 1 && <ItemSeparator />}
                      </Fragment>
                    );
                  })
                ) : (
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
                          setExperienceRange([
                            env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MIN_COUNT,
                            env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_YEARS_EXPERIENCE_MAX_COUNT,
                          ]);
                          setProjectsRange([
                            env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MIN_COUNT,
                            env.NEXT_PUBLIC_SQUADY_API_RESUME_QUERY_PROJECTS_MAX_COUNT,
                          ]);
                          setSearchQ("");
                        }}
                      >
                        <FunnelXIcon />
                        Сбросить фильтры
                      </Button>
                    </EmptyContent>
                  </Empty>
                )}
              </ItemGroup>
            </CardContent>
          </CardRoot>
        </div>
        <div className="col-span-12 flex h-fit w-full flex-col gap-6 max-xl:order-1 max-md:hidden xl:col-span-3">
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
