import Skeleton from "@/shared/ui/skeleton";

const UserProfileCardSkeleton: React.FunctionComponent = () => {
  return (
    <Skeleton className="h-59 w-full bg-accent/50 p-4 ring ring-accent md:h-57">
      <Skeleton className="mx-auto mb-3 size-24 rounded-full" />
      <div className="mt-4 space-y-1">
        <Skeleton className="mx-auto h-8 w-36 md:h-7" />
        <Skeleton className="mx-auto h-6 w-48 md:h-5" />
      </div>
      <Skeleton className="mx-auto mt-2.5 h-5.5 w-28" />
    </Skeleton>
  );
};

export default UserProfileCardSkeleton;
