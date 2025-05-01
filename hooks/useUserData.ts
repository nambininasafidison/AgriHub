import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export const useUserData = (userId: string) => {
  const { data, error, isLoading } = useSWR(
    userId ? `/api/users/${userId}` : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
  };
};
