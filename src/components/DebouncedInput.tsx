import { Search } from 'lucide-react';
import * as React from 'react';

import { Input } from '@/components/ui/input';

export function DebouncedInput({
                                 value: initialValue,
                                 onChange,
                                 onEnter,
                                 iconPosition = 'right',
                                 ...props
                               }: {
  value: string | number;
  onChange: (value: string | number) => void;
  onEnter?: () => void;
  iconPosition?: 'right' | 'left';
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue);
  const deferredValue = React.useDeferredValue(value);

  const handleClickEnter = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onEnter?.();
      }
    },
    [onEnter],
  );


  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  React.useEffect(() => {
    onChangeRef.current(deferredValue);
  }, [deferredValue]);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleClickEnter}
      icon={<Search className="h-4 w-4" />}
      iconPosition={iconPosition}
    />
  );
}
