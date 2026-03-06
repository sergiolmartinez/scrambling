import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('App', () => {
  it('renders scaffold heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /scrambling mvp foundation/i })).toBeInTheDocument();
  });
});
