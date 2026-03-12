import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { SpinnerIcon } from '@/components/ui/icons';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState({ title }: { title: string }): JSX.Element {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDescription>
        <span className='inline-flex items-center gap-2'>
          <SpinnerIcon className='h-4 w-4 animate-spin' />
          Loading latest data...
        </span>
      </CardDescription>
      <div className='mt-4 space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    </Card>
  );
}
