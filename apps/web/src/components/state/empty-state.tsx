import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export function EmptyState({ title, description }: { title: string; description: string }): JSX.Element {
  return (
    <Card className='border-dashed'>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
}
