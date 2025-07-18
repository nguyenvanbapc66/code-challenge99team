export type TokenPriceType = {
  currency: string;
  price: number;
};

export const getTokenPrice = async (): Promise<TokenPriceType[]> => {
  try {
    const response = await fetch('https://interview.switcheo.com/prices.json');
    const data = await response.json();
    return data as TokenPriceType[];
  } catch (error) {
    console.error('Error fetching token price:', error);
    return [];
  }
};
