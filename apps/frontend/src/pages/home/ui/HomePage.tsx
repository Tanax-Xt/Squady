import {
  getCurrentUser,
  getCurrentUserPersonalDataOrUndefined,
} from "@/entities/user";
import { getUserProfileProgress, UserProfileProgress } from "@/widgets/profile";

const HomePage: React.FunctionComponent = async () => {
  const [user, personal] = await Promise.all([
    getCurrentUser(),
    getCurrentUserPersonalDataOrUndefined(),
  ]);

  const { currentStep } = getUserProfileProgress({ user, personal });

  return (
    <>
      <h1 className="text-3xl font-semibold md:text-2xl">
        Привет, {user.username}!
      </h1>

      {currentStep && <UserProfileProgress user={user} personal={personal} />}
    </>
  );
};

export default HomePage;
