import { PenLineIcon, SignatureIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";

const UserProfilePersonalEmpty: React.FunctionComponent = () => {
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <SignatureIcon />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Нет личных данных</EmptyTitle>
        <EmptyDescription>
          Чтобы создать первое резюме, сперва необходимо заполнить личные
          данные.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" asChild>
          <Link href="/resumes/profile/edit">
            <PenLineIcon />
            Заполнить личные данные
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default UserProfilePersonalEmpty;
