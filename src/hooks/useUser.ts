import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export function useUser(initialUser?: any) {
  const { data, error, isLoading, mutate } = useSWR("/api/user", fetcher, {
    fallbackData: initialUser ? { user: initialUser } : undefined,
    revalidateOnFocus: false,
    dedupingInterval: 15_000,
  });
  return {
    user: data?.user,
    loading: isLoading,
    error,
    mutate,
  };
}
