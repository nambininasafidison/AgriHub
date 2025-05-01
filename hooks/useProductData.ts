import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export const useProductData = (productId: string) => {
  const { data, error, isLoading } = useSWR(
    productId ? `/api/products/${productId}` : null,
    fetcher
  );

  return {
    product: data,
    isLoading,
    isError: !!error,
  };
};
