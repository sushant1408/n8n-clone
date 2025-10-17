import { useQuery } from "@tanstack/react-query";

import { customer } from "@/lib/auth-client";

const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await customer.state();
      return data;
    },
  });
};

const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...rest } = useSubscription();

  const hasActiveSubscription =
    customerState?.activeSubscriptions &&
    customerState.activeSubscriptions.length > 0;

  return {
    hasActiveSubscription,
    activeSubscription: customerState?.activeSubscriptions[0],
    isLoading,
    ...rest,
  };
};

export { useSubscription, useHasActiveSubscription };
