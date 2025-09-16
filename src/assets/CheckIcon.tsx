import { FC } from 'react';

import { IconProps } from './types';

export const CheckIcon: FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ? props.size : 24}
    height={props.size ? props.size : 24}
    viewBox="0 0 24 24"
    color={'var(--white)'}
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" stroke="currentColor" />
  </svg>
);
