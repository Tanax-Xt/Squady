import { getTeamsMy } from "@/entities/team";
import { getCurrentUser } from "@/entities/user";
import { getUserProfileProgress, UserProfileProgress } from "@/widgets/profile";
import { TeamsMy } from "@/widgets/team-item";

const HomePage: React.FunctionComponent = async () => {
  const user = await getCurrentUser();
  const teamsMy = await getTeamsMy();

  const { currentStep } = getUserProfileProgress(user);

  return (
    <>
      <h1 className="text-3xl font-semibold md:text-2xl">
        Привет,{" "}
        {!!user.full_name
          ? user.full_name?.split(" ").slice(1, 2).join(" ")
          : user.username}
        !
      </h1>

      <div className="flex flex-col gap-8">
        {currentStep && <UserProfileProgress user={user} />}

        {(currentStep === undefined || currentStep.id === "team") && (
          <TeamsMy teamsMy={teamsMy} />
        )}
      </div>
    </>
  );
};

export default HomePage;
