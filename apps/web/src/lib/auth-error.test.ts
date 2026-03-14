import { ApiRequestError } from '@scrambling/api-client';
import { describe, expect, it } from 'vitest';

import { getAuthErrorMessage } from '@/lib/auth-error';

describe('getAuthErrorMessage', () => {
  it('maps sign-up conflict to user-friendly message', () => {
    const error = new ApiRequestError(409, 'Request failed', 'conflict', null);
    expect(getAuthErrorMessage(error, 'sign-up')).toMatch(/already exists/i);
  });

  it('maps network errors to API unavailable message', () => {
    const error = new TypeError('Failed to fetch');
    expect(getAuthErrorMessage(error, 'sign-in')).toMatch(/backend is running/i);
  });
});
