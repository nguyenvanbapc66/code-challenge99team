import React, { useMemo } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // => Info: Added blockchain field to WalletBalance interface
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps { // => Error: BoxProps is not imported

}

// Define blockchain priorities as a constant object for better maintainability
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

const WalletPage: React.FC<Props> = (props: Props) => { // => Error: React.FC is not imported
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => {
	  return BLOCKCHAIN_PRIORITIES?.[blockchain] ?? -99;
	}

  const sortedBalances = useMemo(() => { // => Error: useMemo is not imported
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain); // => Error: missing blockchain field in WalletBalance
		  return balancePriority > -99 && balance.amount > 0; // => Error: lhsPriority is not defined, using wrong variable, should be `balancePriority`
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain); // => Error: missing blockchain field in WalletBalance
		  const rightPriority = getPriority(rhs.blockchain); // => Error: missing blockchain field in WalletBalance

		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }

      return 0; // => Error: Missing equal priority case, return 0
    })
    .map((balance: WalletBalance): FormattedWalletBalance => ({
      ...balance,
      formatted: balance.amount.toFixed(2), // Add decimal places for better formatting
    }));
  }, [balances]); // => Error: Removed prices from dependencies since it's not used in the computation

  /**
   * Info: `formattedBalances` variable is created but not used
   *        If using sortedBalances to handle multiple iterations over the same data => Solution above
   */
  // const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  //   return {
  //     ...balance,
  //     formatted: balance.amount.toFixed()
  //   }
  // })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;

    /**
     * Error: Using index as key is not a good practice, should use a unique identifier
     * Related to changing order of items => UI will have errors
     */
    return (
      <WalletRow 
        className={classes.row}
        key={`${balance.currency}-${balance.blockchain}-${index}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}

export default WalletPage; // => Info: Component has to be exported