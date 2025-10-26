import Skeleton from "@/shared/ui/skeleton";

import UserProfileCardSkeleton from "./card/UserProfileCardSkeleton";

interface UserProfileSkeletonProps {}

const UserProfileSkeleton: React.FunctionComponent<
  UserProfileSkeletonProps
> = () => {
  return (
    <div className="flex flex-col gap-4">
      <UserProfileCardSkeleton />

      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-17.5 w-full bg-accent/75 ring ring-accent"
          />
        ))}
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
