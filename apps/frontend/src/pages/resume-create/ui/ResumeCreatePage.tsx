import {
  ChevronRightIcon,
  FileTextIcon,
  MousePointerClickIcon,
  PenLineIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Placeholder from "@/shared/ui/Placeholder";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";

const ResumeCreatePage: React.FunctionComponent = () => {
  return (
    <div className="space-y-4">
      <Placeholder
        before={<MousePointerClickIcon />}
        title="Выберите способ создания резюме"
        description="Вы можете создать резюме вручную или импортировать из поддерживаемых источников."
      />

      <Item
        size="sm"
        variant="muted"
        className="my-8 border border-border"
        asChild
      >
        <Link href="/resume/create/new">
          <ItemMedia>
            <PenLineIcon className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Создать с нуля</ItemTitle>
            <ItemDescription className="line-clamp-none text-pretty">
              Создайте резюме полностью вручную, начав с чистого листа.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Link>
      </Item>
      <Item size="sm" variant="muted" className="border border-border" asChild>
        <Link href="/resume/create/pdf">
          <ItemMedia>
            <FileTextIcon className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Импортировать из PDF</ItemTitle>
            <ItemDescription className="line-clamp-none text-pretty">
              Загрузите PDF-файл, и наш ИИ автоматически извлечёт данные и
              оформит резюме в нужном формате.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Link>
      </Item>
      <Item size="sm" variant="muted" className="border border-border" asChild>
        <Link href="/resume/create/github">
          <ItemMedia>
            <Image
              src="/assets/github.png"
              alt="hh.ru"
              width={20}
              height={20}
              className="size-5 dark:invert"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Импортировать из GitHub</ItemTitle>
            <ItemDescription className="line-clamp-none text-pretty">
              Импортируйте данные о навыках и опыте из вашего GitHub-профиля.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Link>
      </Item>
      <Item size="sm" variant="muted" className="border border-border" asChild>
        <Link href="/resume/create/hh">
          <ItemMedia>
            <Image
              src="/assets/hh.svg"
              alt="hh.ru"
              width={20}
              height={20}
              className="size-5"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Импортировать из HeadHunter</ItemTitle>
            <ItemDescription className="line-clamp-none text-pretty">
              Перенесите информацию о резюме с HeadHunter одной ссылкой.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Link>
      </Item>
    </div>
  );
};

export default ResumeCreatePage;
