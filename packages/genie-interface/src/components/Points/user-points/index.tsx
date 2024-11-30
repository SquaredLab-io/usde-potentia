import { Address } from "viem";
import { useUserPoints } from "@lib/hooks/useUserPoints";
import { useRewardHistory } from "@lib/hooks/useRewardHistory";
import { GpointsAndReferals, RewardHistory, UserActivity } from "../sections/stats";

interface Props {
  address: Address | undefined;
}

const UserPoints = ({ address }: Props) => {
  const points = useUserPoints({ address });
  const rewards = useRewardHistory({ address });

  return (
    <div className="py-4 flex flex-col gap-y-12 md:gap-y-14">
      <GpointsAndReferals points={points} isUser />
      <UserActivity points={points} rewards={rewards} isUser />
      <RewardHistory rewards={rewards} />
    </div>
  );
};

export default UserPoints;
