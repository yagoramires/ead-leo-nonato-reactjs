import {
  Eye16Regular,
  EyeOff16Regular,
  Warning20Filled,
} from '@fluentui/react-icons';
import { useState } from 'react';

export default function Input({
  theme,
  id,
  type,
  watch,
  register,
  placeholder,
  label,
  error,
}) {
  const value = watch(id);

  const [viewPassword, setViewPassword] = useState(false);

  const toggleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  return (
    <div
      className={`flex flex-col gap-[9px] ${
        theme === 'light' ? 'text-black' : 'text-white'
      }`}
    >
      <label htmlFor={id} className='text-[14px] leading-[20px]'>
        {label}
      </label>
      <div
        className={`relative w-full rounded-[4px] overflow-hidden after:content-[''] after:absolute after:h-[2px] after:bg-[#60cdff] after:left-1/2 after:bottom-0 after:-translate-x-1/2 ${
          value ? 'after:w-full' : 'after:w-0'
        } hover:after:w-full animation ${
          error && 'after:bg-red-500 after:w-full'
        } ${theme === 'light' ? 'shadow-sm shadow-zinc-700/50' : ''}`}
      >
        <input
          type={viewPassword ? 'text' : type}
          {...register(id)}
          placeholder={placeholder}
          id={id}
          className={`w-full rounded-[4px]  px-3 py-[5px] leading-[20px] text-[14px] outline-none ${
            theme === 'light' ? 'bg-white' : 'bg-white/5'
          }`}
          autoComplete='false'
        />

        {error && (
          <div
            className={`absolute ${
              type === 'password' ? 'right-9' : 'right-1'
            } top-1 text-red-500`}
          >
            <Warning20Filled />
          </div>
        )}

        {type === 'password' && (
          <button
            type='button'
            className={`absolute right-1 top-1 w-[26px] h-[22px] flex- justify-center items-center bg-white/5 rounded-[3px]
              
                 ${theme === 'light' ? 'bg-[#F9F9F950]' : 'bg-white/5'}
              `}
            onClick={toggleViewPassword}
          >
            {viewPassword ? (
              <EyeOff16Regular
                className={` ${
                  theme === 'light' ? 'text-black/60' : 'text-white/80'
                }`}
              />
            ) : (
              <Eye16Regular
                className={` ${
                  theme === 'light' ? 'text-black/60' : 'text-white/80'
                }`}
              />
            )}
          </button>
        )}
      </div>
      <span className='text-xs text-red-500'>{error && error}</span>
    </div>
  );
}
