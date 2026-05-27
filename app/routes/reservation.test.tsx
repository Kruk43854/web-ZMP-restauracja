import { render, screen } from '@testing-library/react';
import { act } from 'react'; 
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import Reservation from './reservation';
import * as AuthContext from '../contexts/AuthContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'pl' } })
}));

describe('Komponent Reservation', () => {
  const mockAuthFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { items: [] } })
    });
  });

  it('powinien zablokować formularz i pokazać przycisk logowania dla niezalogowanego gościa', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      authFetch: mockAuthFetch,
      login: vi.fn(), loginGoogle: vi.fn(), logout: vi.fn(), username: null
    });

    await act(async () => {
      render(<MemoryRouter><Reservation /></MemoryRouter>);
    });

    expect(screen.getByText('reservation.login_required_title')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'navbar.login' })).toBeInTheDocument();
    expect(screen.queryByText('reservation.date')).not.toBeInTheDocument();
  });

  it('powinien wyświetlić pełny formularz rezerwacji dla zalogowanego użytkownika', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      authFetch: mockAuthFetch,
      login: vi.fn(), loginGoogle: vi.fn(), logout: vi.fn(), username: 'Admin'
    });

    await act(async () => {
      render(<MemoryRouter><Reservation /></MemoryRouter>);
    });

    expect(screen.getByText('reservation.date')).toBeInTheDocument();
    expect(screen.getByText('reservation.tableToken')).toBeInTheDocument();
    expect(screen.queryByText('reservation.login_required_title')).not.toBeInTheDocument();
  });
});