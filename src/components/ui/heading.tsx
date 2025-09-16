import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const headingVariants = cva(
  'font-bold font-raleway proportional-nums lining-nums',
  {
    variants: {
      variant: {
        h1: 'text-[32px]',
        h2: 'text-2xl',
        h3: 'text-xl',
        h4: 'text-xl',
        h5: 'text-lg',
        h6: 'text-sm',
      },
      colorMode: {
        primary: 'text-text',
        secondary: 'text-text-secondary',
        tertiary: 'text-text-tertiary',
        inverse: 'text-text-inverse',
      },
    },
    defaultVariants: {
      variant: 'h1',
      colorMode: 'primary',
    },
  },
);

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant = 'h1', colorMode = 'primary', ...props }, ref) => {
    const Comp = variant || 'h1';

    return (
      <Comp
        className={cn(headingVariants({ variant, colorMode, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Heading.displayName = 'Heading';

 
export { Heading };
