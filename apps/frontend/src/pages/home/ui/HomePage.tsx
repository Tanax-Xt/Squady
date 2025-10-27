import { getCurrentUser } from "@/entities/user";
import { getUserProfileProgress, UserProfileProgress } from "@/widgets/profile";

const HomePage: React.FunctionComponent = async () => {
  const user = await getCurrentUser();

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

      {currentStep && <UserProfileProgress user={user} />}
    </>
  );
};

export default HomePage;
