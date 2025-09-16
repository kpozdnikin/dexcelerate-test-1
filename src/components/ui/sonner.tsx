import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      duration={5000}
      closeButton={true}
      richColors
      toastOptions={{
        classNames: {
          closeButton: '!top-3 !right-2 !left-[95%]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
