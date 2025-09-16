import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSearchParams = () => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);

  return url.search;
};