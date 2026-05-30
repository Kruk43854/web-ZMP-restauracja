import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Menu from '../routes//menu';
import * as AuthContext from '../contexts/AuthContext';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'pl' } }) // Podmieniamy tylko t()
  };
});

vi.mock('../hooks/useWebSocket', () => ({
  useWebSocket: () => ({ isConnected: false, subscribe: vi.fn() })
}));

global.fetch = vi.fn();

describe('Komponent Menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false, 
      authFetch: vi.fn(),
      login: vi.fn(), loginGoogle: vi.fn(), logout: vi.fn(), username: null
    });
  });

  it('powinien pobrać i wyświetlić listę pizz z API publicznego', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          menu: [
            {
              category: "Pizza",
              dish: [
                { token: "1", name: "Margherita", price: 3500, ingredients: ["Ser", "Sos"] },
                { token: "2", name: "Pepperoni", price: 4200, ingredients: ["Ser", "Salami"] }
              ]
            }
          ]
        }
      })
    });

    render(<Menu />);

    await waitFor(() => {
      expect(screen.getByText('Margherita')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('35.00 PLN')).toBeInTheDocument();
    expect(screen.getByText('42.00 PLN')).toBeInTheDocument();
  });

  it('powinien wyświetlić komunikat o braku wyników, gdy API zwróci pustą listę', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { menu: [] } })
    });

    render(<Menu />);

    await waitFor(() => {
      expect(screen.getByText('menu.no_results')).toBeInTheDocument();
    });
  });
});