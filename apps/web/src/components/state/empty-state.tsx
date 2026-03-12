import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { InboxIcon } from '@/components/ui/icons';

export function EmptyState({ title, description }: { title: string; description: string }): JSX.Element {
  return (
    <Card className='border-dashed'>
      <CardTitle>
        <span className='inline-flex items-center gap-2'>
          <InboxIcon className='h-4 w-4' />
          {title}
        </span>
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
}
