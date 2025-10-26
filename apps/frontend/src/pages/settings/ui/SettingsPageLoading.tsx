import { LogoutButtonSkeleton } from "@/features/auth/logout";
import Skeleton from "@/shared/ui/skeleton";
import { UserProfileCardSkeleton } from "@/widgets/profile";

const SettingsPageLoading: React.FunctionComponent = () => {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <UserProfileCardSkeleton />
      <Skeleton className="h-34.75 w-full bg-accent/75 ring ring-accent" />
      <Skeleton className="h-31.75 w-full bg-accent/75 ring ring-accent" />
      <Skeleton className="h-17.5 w-full bg-accent/75 ring ring-accent" />
      <Skeleton className="h-34.75 w-full bg-accent/75 ring ring-accent" />
      <LogoutButtonSkeleton />
    </div>
  );
};

export default SettingsPageLoading;
