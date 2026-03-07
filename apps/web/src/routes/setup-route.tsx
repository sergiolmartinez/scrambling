import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import { useRoundSessionStore } from '@/store/round-session';

const courseSearchSchema = z.object({
  query: z.string().min(2, 'Enter at least 2 characters.'),
});

type CourseSearchForm = z.infer<typeof courseSearchSchema>;

export function SetupRoute(): JSX.Element {
  const roundId = useRoundSessionStore((state) => state.roundId);
  const setRoundId = useRoundSessionStore((state) => state.setRoundId);

  const form = useForm<CourseSearchForm>({
    resolver: zodResolver(courseSearchSchema),
    defaultValues: { query: '' },
  });

  const query = form.watch('query');

  const courseSearch = useQuery({
    queryKey: ['courses-search', query],
    queryFn: () => apiClient.searchCourses(query),
    enabled: query.length >= 2,
  });

  const createRound = useMutation({
    mutationFn: () => apiClient.createRound(),
    onSuccess: (created) => setRoundId(created.id),
  });

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <Card>
        <CardTitle>Round Setup</CardTitle>
        <CardDescription>Create a round and keep its ID in local session state.</CardDescription>

        <div className='mt-4 space-y-3'>
          <Button onClick={() => createRound.mutate()} type='button'>
            Create Round
          </Button>
          {roundId !== null ? (
            <p className='text-sm text-zinc-300'>Current round ID: {roundId}</p>
          ) : (
            <p className='text-sm text-zinc-500'>No round selected yet.</p>
          )}
          {createRound.isError ? <ErrorState message='Failed to create round.' /> : null}
        </div>
      </Card>

      <Card>
        <CardTitle>Course Search</CardTitle>
        <CardDescription>Search the API for course records before assignment.</CardDescription>

        <form className='mt-4 space-y-3' onSubmit={form.handleSubmit(() => undefined)}>
          <Input placeholder='Search courses...' {...form.register('query')} />
          {form.formState.errors.query ? (
            <p className='text-sm text-rose-300'>{form.formState.errors.query.message}</p>
          ) : null}
        </form>

        <div className='mt-4 space-y-2'>
          {courseSearch.isError ? <ErrorState message='Course search failed.' /> : null}
          {courseSearch.isSuccess && courseSearch.data.length === 0 ? (
            <EmptyState title='No courses found' description='Try a different query string.' />
          ) : null}
          {courseSearch.data?.map((course) => (
            <div className='rounded-md border border-zinc-800 px-3 py-2 text-sm' key={course.id}>
              <p className='font-medium'>{course.name}</p>
              <p className='text-zinc-400'>
                {course.city ?? 'Unknown city'}, {course.state ?? 'Unknown state'}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
