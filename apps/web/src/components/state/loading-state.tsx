import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState({ title }: { title: string }): JSX.Element {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDescription>Loading data from the API.</CardDescription>
      <div className='mt-4 space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    </Card>
  );
}
