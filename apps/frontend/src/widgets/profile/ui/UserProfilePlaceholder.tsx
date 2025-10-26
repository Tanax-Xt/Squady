import { ArrowRightIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import Placeholder from "@/shared/ui/Placeholder";
import Button from "@/shared/ui/button";

export interface UserProfilePlaceholderProps
  extends React.ComponentProps<typeof Placeholder> {}

const UserProfilePlaceholder: React.FunctionComponent<
  UserProfilePlaceholderProps
> = (props) => {
  return (
    <Placeholder
      before={<UserIcon />}
      title="Нет личных данных"
      description="Вы ещё не заполнили личные данные."
      after={
        <Button asChild size="lg">
          <Link href="/resume/profile/edit">
            <span>Заполнить личные данные</span>
            <ArrowRightIcon />
          </Link>
        </Button>
      }
      {...props}
    />
  );
};

export default UserProfilePlaceholder;
