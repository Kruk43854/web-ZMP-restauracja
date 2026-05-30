import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import ConfirmEmail from '../routes/confirm-email';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

let mockSearchParams = new URLSearchParams('');

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams], 
  };
});

global.fetch = vi.fn();

describe('Komponent ConfirmEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('powinien pokazać błąd z tytułu nieprawidłowego linku (brak tokena/emaila)', async () => {
    mockSearchParams = new URLSearchParams('');

    render(<MemoryRouter><ConfirmEmail /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('confirmEmail.error_invalid_link')).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled(); 
  });

  it('powinien zweryfikować token i wyświetlić ekran sukcesu', async () => {
    mockSearchParams = new URLSearchParams('email=test@test.pl&token=tajnyToken123');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'confirmEmail.success_message' }),
    });

    render(<MemoryRouter><ConfirmEmail /></MemoryRouter>);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register-confirm?token=tajnyToken123'),
        expect.any(Object)
      );
    });

    expect(await screen.findByText('confirmEmail.success_title')).toBeInTheDocument();
    expect(screen.getByText('confirmEmail.success_message')).toBeInTheDocument();
  });
});