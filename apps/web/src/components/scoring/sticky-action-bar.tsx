import type { PropsWithChildren } from 'react';

import { StickyActionBar as BaseStickyActionBar } from '@/components/ui/sticky-action-bar';

type StickyActionBarProps = PropsWithChildren;

export function StickyActionBar({ children }: StickyActionBarProps): JSX.Element {
  return <BaseStickyActionBar>{children}</BaseStickyActionBar>;
}
