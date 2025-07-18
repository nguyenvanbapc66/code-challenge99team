import React, { useState, useEffect } from 'react';
import { TokenSelectDropdown, type TokenOption } from '@/components';
import { getTokenPrice } from './services';
import toast, { Toaster } from 'react-hot-toast';

type Token = TokenOption & {
  price: number;
};

const TOKEN_ICON_URL = (symbol: string) =>
  `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`;

const App: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const convertAmountWithRate = (fromAmount?: number, toAmount?: number, value?: string) => {
    const converted = ((fromAmount ?? 0) * parseFloat(value ?? '0')) / (toAmount ?? 1);
    return converted.toFixed(6);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);

    const converted = convertAmountWithRate(fromToken?.price, toToken?.price, value);
    setToAmount(converted);
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);

    const converted = convertAmountWithRate(toToken?.price, fromToken?.price, value);
    setFromAmount(converted);
  };

  const handleSwapTokens = () => {
    if (fromToken && toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
      setFromAmount(toAmount);
      setToAmount(fromAmount);
    }
  };

  const handleExchange = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0 || !fromToken || !toToken) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success(`Successfully exchanged ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`);
    setFromAmount('');
    setToAmount('');
    setIsLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  useEffect(() => {
    (async function fetchTokens() {
      const response = await getTokenPrice();

      if (response) {
        const unique: Record<string, Token> = {};

        response.forEach((item) => {
          unique[item.currency] = {
            id: item.currency,
            name: item.currency,
            symbol: item.currency,
            icon: TOKEN_ICON_URL(item.currency),
            price: item.price,
          };
        });

        const tokenList = Object.values(unique);
        setTokens(tokenList);
        setFromToken(tokenList[0] || null);
        setToToken(tokenList[1] || null);
      }
    })();
  }, []);

  return (
    <div className='flex justify-center items-center h-screen'>
      <Toaster position='top-right' toastOptions={{ duration: 3500 }} />
      <div className='w-full max-w-xl'>
        <div className='bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.05),0_0px_0px_1px_rgba(0,0,0,0.08)] p-6'>
          <h2 className='text-2xl font-semibold text-center text-gray-900 mb-3'>Swap Tokens</h2>
          <div className='mb-3'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>From</label>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                value={fromAmount}
                onChange={handleFromAmountChange}
                placeholder='0.00'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <div className='min-w-[160px]'>
                {fromToken && (
                  <TokenSelectDropdown
                    options={tokens}
                    value={fromToken}
                    onChange={(token) => {
                      const newFromToken = token as Token;
                      const converted = convertAmountWithRate(newFromToken?.price, toToken?.price, fromAmount);
                      setFromToken(newFromToken);
                      setToAmount(converted);
                    }}
                  />
                )}
              </div>
            </div>
            <div className='flex items-center justify-end mt-2 text-sm text-gray-500'>
              <span>{fromToken ? formatPrice(fromToken.price) : '-'}</span>
            </div>
          </div>
          <div className='flex justify-center mb-3'>
            <button
              onClick={handleSwapTokens}
              className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
              disabled={!fromToken || !toToken}
            >
              <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
                />
              </svg>
            </button>
          </div>
          <div className='mb-3'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>To</label>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                value={toAmount}
                onChange={handleToAmountChange}
                placeholder='0.00'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <div className='min-w-[160px]'>
                {toToken && (
                  <TokenSelectDropdown
                    options={tokens}
                    value={toToken}
                    onChange={(token) => {
                      const newToToken = token as Token;
                      const converted = convertAmountWithRate(newToToken?.price, fromToken?.price, toAmount);
                      setToToken(newToToken);
                      setFromAmount(converted);
                    }}
                  />
                )}
              </div>
            </div>
            <div className='flex items-center justify-end mt-2 text-sm text-gray-500'>
              <span>{toToken ? formatPrice(toToken.price) : '-'}</span>
            </div>
          </div>

          <button
            onClick={handleExchange}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading || !fromToken || !toToken}
            className='w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
