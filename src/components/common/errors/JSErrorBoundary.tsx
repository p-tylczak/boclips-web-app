import React from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  fallback: any;
  children: React.ReactNode;
}

export const JSErrorBoundary = ({ children, fallback }: Props) => {
  return (
    <Sentry.ErrorBoundary fallback={fallback}>{children}</Sentry.ErrorBoundary>
  );
};
