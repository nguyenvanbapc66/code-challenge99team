import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

export type TokenOption = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
};

type TokenSelectDropdownProps = {
  options: TokenOption[];
  value: TokenOption;
  onChange: (token: TokenOption) => void;
};

const TokenSelectDropdown: React.FC<TokenSelectDropdownProps> = ({ options, value, onChange }) => {
  const [isExpandedDropdown, setIsExpandedDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (token) =>
          token.name.toLowerCase().includes(search.toLowerCase()) ||
          token.symbol.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsExpandedDropdown(false);
    }
  }, []);

  const handlePressEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsExpandedDropdown(false);
    }
  }, []);

  useEffect(() => {
    if (!isExpandedDropdown) return;

    const abortController = new AbortController();

    document.addEventListener('mousedown', handleClickOutside, abortController);
    document.addEventListener('keydown', handlePressEscape, abortController);

    return () => {
      abortController.abort();
    };
  }, [isExpandedDropdown, handleClickOutside, handlePressEscape]);

  const handleSelect = (token: TokenOption) => {
    onChange(token);
    setIsExpandedDropdown(false);
    setSearch('');
  };

  return (
    <div className='relative' ref={ref}>
      <button
        type='button'
        className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
        onClick={() => setIsExpandedDropdown((prev) => !prev)}
        aria-haspopup='listbox'
        aria-expanded={isExpandedDropdown}
      >
        <img src={value.icon} alt={value.symbol} className='w-5 h-5 rounded-full' />
        <span className='font-medium text-gray-900'>{value.symbol}</span>
        <svg
          className={`w-4 h-4 ml-auto transition-transform${isExpandedDropdown ? ' rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isExpandedDropdown && (
        <div className='absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-x-hidden'>
          <div className='p-2 sticky top-0 bg-white z-10'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search token...'
              className='w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
              autoFocus
            />
          </div>
          <ul
            className='max-h-60 overflow-y-auto divide-y divide-gray-100 custom-scrollbar overflow-x-hidden'
            role='listbox'
          >
            {filteredOptions.length === 0 ? (
              <li className='p-3 text-center text-gray-400 text-sm'>No tokens found</li>
            ) : (
              filteredOptions.map((token) => (
                <li
                  key={token.id}
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors${
                    value.id === token.id ? ' bg-blue-100 font-semibold' : ''
                  }`}
                  onClick={() => handleSelect(token)}
                  role='option'
                  aria-selected={value.id === token.id}
                >
                  <img src={token.icon} alt={token.symbol} className='w-5 h-5 rounded-full' />
                  <span>{token.symbol}</span>
                  {value.id === token.id && (
                    <svg
                      className='w-4 h-4 text-blue-500 ml-auto'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TokenSelectDropdown;
