import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

global.fetch = vi.fn();

const TestConsumer = () => {
  const { isAuthenticated, username } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'Zalogowany' : 'Wylogowany'}</span>
      <span data-testid="username-display">{username || 'Brak'}</span>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('powinien zalogować użytkownika po udanym odświeżeniu sesji', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { username: 'MateuszTestowy' } }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Zalogowany');
    });
    
    expect(screen.getByTestId('username-display')).toHaveTextContent('MateuszTestowy');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('powinien zachować status wylogowanego w przypadku błędu autoryzacji (np. 401)', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Wylogowany');
    });

    expect(screen.getByTestId('username-display')).toHaveTextContent('Brak');
  });
});