import { ArrowLeftIcon, GraduationCapIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  compareAchievements,
  compareAdditionalEducation,
  compareExperiences,
  getEducationTypeDisplayName,
  getResume,
  mapAdditionalEducationItemToResumeAdditionalEducation,
  mapExperienceItemToResumeExperience,
  ResumeAchievementCell,
  ResumeAdditionalEducationCell,
  ResumeExperienceCell,
  ResumePrivateIcon,
} from "@/entities/resume";
import { ResumeCardUserActions } from "@/features/resume/edit";
import Cell from "@/shared/ui/Cell";
import Group from "@/shared/ui/Group";
import Badge from "@/shared/ui/badge";
import Bar from "@/shared/ui/bar";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";
import Page from "@/shared/ui/page";

const ResumeViewPage: React.FunctionComponent<{
  params: Promise<{ id?: string | undefined }>;
}> = async ({ params }) => {
  const resumeId = (await params).id;

  if (!resumeId) {
    return notFound();
  }

  const resume = await getResume(resumeId);

  if (!resume) {
    return notFound();
  }

  return (
    <Page>
      <Bar>
        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground max-md:text-base max-md:[&_svg:not([class*='size-'])]:size-5"
        >
          <Link href="/resume">
            <ArrowLeftIcon />
            <span>Назад</span>
          </Link>
        </Button>

        <Bar.Center className="flex items-center justify-center gap-1.5">
          Резюме
          {!resume.is_public && <ResumePrivateIcon />}
        </Bar.Center>

        <Bar.End>
          <ResumeCardUserActions resume={resume} variant="ghost" />
        </Bar.End>
      </Bar>

      <Page.Content size="xl" className="gap-6">
        <section>
          <p className="mb-2 flex items-center gap-1 text-sm leading-none font-medium select-none">
            Роль
          </p>
          <Input readOnly value={resume.role} />
        </section>
        <section>
          <p className="mb-2 flex items-center gap-1 text-sm leading-none font-medium select-none">
            Учебное заведение
          </p>
          <Group>
            <Cell
              size="sm"
              color="default"
              multiline
              before={<GraduationCapIcon className="!mt-0" />}
              label={`${resume.education.title} – ${resume.education.end_year}`}
              description={getEducationTypeDisplayName(resume.education.type)}
            />
          </Group>
        </section>
        <section>
          <p className="mb-2 flex items-center gap-1 text-sm leading-none font-medium select-none">
            <span>Навыки</span>
            <span className="text-muted-foreground tabular-nums">
              ({resume.skills.length})
            </span>
          </p>
          <div className="flex flex-wrap gap-1">
            {resume.skills.map((skill) => (
              <Badge
                key={skill}
                size="sm"
                shape="circle"
                variant="card"
                className="!font-normal"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </section>
        {!!resume.experience?.length && (
          <section>
            <p className="mb-2 flex items-center gap-1 text-sm leading-none font-medium select-none">
              <span>Опыт</span>
              <span className="text-muted-foreground tabular-nums">
                ({resume.experience.length})
              </span>
            </p>
            <Group>
              {resume.experience
                .map(mapExperienceItemToResumeExperience)
                .sort(compareExperiences)
                .map((experience) => (
                  <ResumeExperienceCell
                    key={experience.title}
                    size="sm"
                    experience={experience}
                  />
                ))}
            </Group>
          </section>
        )}
        {!!resume.achievements?.length && (
          <section>
            <p className="mb-2 flex items-center gap-1 text-sm leading-none font-medium select-none">
              <span>Достижения</span>
              <span className="text-muted-foreground tabular-nums">
                ({resume.skills.length})
              </span>
            </p>
            <Group>
              {resume.achievements
                .sort(compareAchievements)
                .map((achievement) => (
                  <ResumeAchievementCell
                    key={achievement.title}
                    as="button"
                    type="button"
                    size="sm"
                    achievement={achievement}
                  />
                ))}
            </Group>
          </section>
        )}
        {!!resume.additional_education?.length && (
          <section>
            <p className="mb-2 flex items-center gap-1 text-sm leading-none font-medium select-none">
              <span>Дополнительное образование</span>
              <span className="text-muted-foreground tabular-nums">
                ({resume.additional_education.length})
              </span>
            </p>
            <div className="flex flex-wrap gap-1">
              <Group>
                {resume.additional_education
                  .map(mapAdditionalEducationItemToResumeAdditionalEducation)
                  .sort(compareAdditionalEducation)
                  .map((additionalEducation) => (
                    <ResumeAdditionalEducationCell
                      key={additionalEducation.title}
                      size="sm"
                      additionalEducation={additionalEducation}
                    />
                  ))}
              </Group>
            </div>
          </section>
        )}
      </Page.Content>
    </Page>
  );
};

export default ResumeViewPage;
