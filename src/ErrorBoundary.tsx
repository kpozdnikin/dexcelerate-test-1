import * as React from 'react';

import { CustomError } from '@/entities';
import { getSearchParams } from '@/lib';

interface Props {
  children?: React.ReactNode;
}

const defaultActionText = 'Tray again';

interface State {
  code: string | undefined;
  error: null | CustomError;
  hasError: boolean;
  errorStatus: number | undefined;
  message: string;
  actionText: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      actionText: defaultActionText,
      code: '',
      hasError: false,
      errorStatus: undefined,
      error: null,
      message: '',
    };
  }

  public static getDerivedStateFromError(error: CustomError): State {
    const searchParams = getSearchParams();

    return {
      actionText: searchParams ? defaultActionText : 'Tray again',
      hasError: true,
      error,
      code: error?.code,
      errorStatus: error?.status,
      message: '',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log({ error, errorInfo });
  }

  reload = () => {
    const { actionText } = this.state;

    this.setState({
      actionText,
      hasError: false,
      errorStatus: undefined,
      error: null,
      code: '',
      message: '',
    });

    const searchParams = getSearchParams();

    window.location.href = `/${searchParams}`;
  };

  render(): React.ReactNode {
    const { children } = this.props;
    const { actionText, code, errorStatus, hasError, message } = this.state;

    if (hasError) {
      return (
        <div className="bg-white dark:bg-gray-800 min-h-screen">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-between w-full h-full p-6">
              <div className="flex-grow"></div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-6">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="56" height="56" rx="28" fill="#FF303C" fillOpacity="0.12" />
                    <path
                      d="M28.0002 26.3501L20.6899 19.0397C20.2343 18.5841 19.4956 18.5841 19.04 19.0397C18.5843 19.4953 18.5843 20.234 19.04 20.6896L26.3503 28L19.04 35.3104C18.5843 35.766 18.5843 36.5047 19.04 36.9603C19.4956 37.4159 20.2343 37.4159 20.6899 36.9603L28.0002 29.6499L35.3103 36.96C35.7659 37.4156 36.5046 37.4156 36.9602 36.96C37.4159 36.5044 37.4159 35.7657 36.9602 35.3101L29.6502 28L36.9602 20.6899C37.4159 20.2343 37.4159 19.4956 36.9602 19.04C36.5046 18.5844 35.7659 18.5844 35.3103 19.04L28.0002 26.3501Z"
                      fill="#FF303C"
                    />
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h2 className="text-xl font-bold">
                    Something went wrong
                  </h2>
                  {code && errorStatus ? (
                    <p className="text-red-500">
                      {code}: {errorStatus}
                    </p>
                  ) : null}
                  <p className="text-gray-500 dark:text-gray-400">
                    {message ||
                      'Please try again later. If the problem persists, contact support.'}
                  </p>
                </div>
              </div>
              <div className="mt-8 w-full">
                <button
                  onClick={this.reload}
                  className="w-full py-3 px-4 bg-transparent border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {actionText}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
