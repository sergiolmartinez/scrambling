import { Alert } from '@/components/ui/alert';

export function ErrorState({ message }: { message: string }): JSX.Element {
  return <Alert>{message}</Alert>;
}
