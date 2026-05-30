import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import MyReservations from '../routes/my-reservations';
import * as AuthContext from '../contexts/AuthContext';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'pl' } }) 
  };
});
describe('Komponent MyReservations', () => {
  const mockAuthFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      authFetch: mockAuthFetch,
      login: vi.fn(), loginGoogle: vi.fn(), logout: vi.fn(), username: 'Test'
    });
  });

  it('powinien wyświetlić puste okno, gdy użytkownik nie ma rezerwacji', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { items: [] } })
    });

    render(<MemoryRouter><MyReservations /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('myreservations.noReservations')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'myreservations.makeFirst' })).toBeInTheDocument();
  });

  it('powinien wyświetlić listę z aktywną rezerwacją', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          items: [
            {
              token: "res-123",
              startTime: "2026-10-15T15:00:00Z",
              endTime: "2026-10-15T17:00:00Z",
              status: "Aktywna"
            }
          ]
        }
      })
    });

    render(<MemoryRouter><MyReservations /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('Aktywna')).toBeInTheDocument();
      expect(screen.getByText('myreservations.details')).toBeInTheDocument();
      expect(screen.getByText('myreservations.delete')).toBeInTheDocument();
    });
  });
});