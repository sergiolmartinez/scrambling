import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type PageSectionProps = PropsWithChildren<{
  className?: string;
}>;

export function PageSection({ className, children }: PageSectionProps): JSX.Element {
  return <section className={cn('space-y-3', className)}>{children}</section>;
}
