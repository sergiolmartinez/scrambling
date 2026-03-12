import { Alert } from '@/components/ui/alert';
import { AlertCircleIcon } from '@/components/ui/icons';

export function ErrorState({ message }: { message: string }): JSX.Element {
  return (
    <Alert>
      <span className='inline-flex items-start gap-2'>
        <AlertCircleIcon className='mt-0.5 h-4 w-4 shrink-0' />
        <span>{message}</span>
      </span>
    </Alert>
  );
}
