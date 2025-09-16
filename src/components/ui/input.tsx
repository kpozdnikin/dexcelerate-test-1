import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import type { JSX } from 'react';

import { cn } from '@/lib/utils';

const InputVariants = cva('relative', {
  variants: {
    iconPosition: {
      left: ' absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground',
      right:
        ' absolute left-auto right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground',
    },
  },
  defaultVariants: {
    iconPosition: 'left',
  },
});

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {
  icon?: JSX.Element;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition, ...props }, ref) => {
    const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
      if (type === 'number') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        event.target.blur();
      }
    };

    return (
      <>
        {icon ? (
          <div className="relative inline-block w-full">
            {iconPosition !== 'right' && (
              <span className={cn(InputVariants({ iconPosition }))}>
                {icon}
              </span>
            )}
            <input
              type={type}
              className={cn(
                'flex h-10 w-full rounded-md border  py-2 text-sm font-normal ring-offset-background file:border-0 file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-ring  disabled:cursor-not-allowed disabled:bg-background-secondary',
                iconPosition !== 'right' ? 'pl-10 pr-4' : 'pl-4 pr-10',
                className,
              )}
              autoComplete="off"
              ref={ref}
              onWheel={onWheel}
              {...props}
            />
            {iconPosition === 'right' && (
              <span className={cn(InputVariants({ iconPosition }))}>
                {icon}
              </span>
            )}
          </div>
        ) : (
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border  px-4 py-2 text-sm font-normal ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-none focus-visible:-outline-offset-2 focus-visible:outline-ring  disabled:cursor-not-allowed disabled:bg-background-secondary',
              className,
            )}
            autoComplete="off"
            ref={ref}
            onWheel={onWheel}
            {...props}
          />
        )}
      </>
    );
  },
);

Input.displayName = 'Input';
