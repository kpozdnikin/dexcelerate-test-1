import * as React from 'react';
import { Link } from 'react-router';

import { Heading } from '@/components/ui';

export const NotFoundPage = () => {

  return (
    <div className="flex flex-1 flex-col items-center gap-5">
      <Heading className="mt-[150px]">Page not found</Heading>
      <div className="flex flex-wrap gap-4">
        <Link to="/" className="text-primary">
          Go back home
        </Link>
      </div>
    </div>
  );
};
