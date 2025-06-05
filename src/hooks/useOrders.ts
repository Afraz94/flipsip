import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export function useOrders(initialOrders?: any[]) {
  const { data, error, isLoading, mutate } = useSWR("/api/order", fetcher, {
    fallbackData: initialOrders ? { orders: initialOrders } : undefined,
    revalidateOnFocus: false,
    dedupingInterval: 15_000,
  });
  return {
    orders: data?.orders || [],
    loading: isLoading,
    error,
    mutate,
  };
}
