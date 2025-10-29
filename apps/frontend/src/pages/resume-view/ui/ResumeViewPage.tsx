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
import Group from "@/shared/ui/Group";
import Badge from "@/shared/ui/badge";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";
import Page from "@/shared/ui/page";
import { UserProfilePersonal } from "@/widgets/profile";

const ResumeViewPage: React.FunctionComponent<{
  params: Promise<{ id?: string | undefined }>;
  searchParams: Promise<{ back?: string | undefined }>;
}> = async ({ params, searchParams }) => {
  const resumeId = (await params).id;
  const back = (await searchParams).back;

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
          <Link href={back ?? "/resumes"}>
            <ArrowLeftIcon />
            <span>Назад</span>
          </Link>
        </Button>

        <Bar.Center className="flex items-center justify-center gap-1.5">
          Резюме
          {!resume.is_public && <ResumePrivateIcon />}
        </Bar.Center>

        <Bar.End>
          <ResumeCardUserActions resume={resume} />
        </Bar.End>
      </Bar>

      <Page.Content size="3xl" className="gap-6">
        <section>
          <p className="mb-2 flex items-center gap-1 text-sm leading-none font-medium select-none">
            Персональные данные
          </p>
          <UserProfilePersonal user={resume.personal_data} />
        </section>
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
          <Item size="sm" variant="muted" className="border border-border">
            <ItemMedia className="my-auto">
              <GraduationCapIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                {resume.education.title} – {resume.education.end_year}
              </ItemTitle>
              <ItemDescription>
                {getEducationTypeDisplayName(resume.education.type)}
              </ItemDescription>
            </ItemContent>
          </Item>
        </section>
        <section>
          <p className="mb-2 flex items-center gap-1 text-sm leading-none font-medium select-none">
            <span>Навыки</span>
            <span className="text-muted-foreground tabular-nums">
              ({resume.skills.length})
            </span>
          </p>
          <div className="flex flex-wrap gap-1">
            {resume.skills.map((skill, index) => (
              <Badge
                key={`${index}-${skill}`}
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
                .map((experience, index) => (
                  <ResumeExperienceCell
                    key={`${index}-${experience.title}`}
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
                ({resume.achievements.length})
              </span>
            </p>
            <Group>
              {resume.achievements
                .sort(compareAchievements)
                .map((achievement, index) => (
                  <ResumeAchievementCell
                    key={`${index}-${achievement.title}`}
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
                  .map((additionalEducation, index) => (
                    <ResumeAdditionalEducationCell
                      key={`${index}-${additionalEducation.title}`}
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
