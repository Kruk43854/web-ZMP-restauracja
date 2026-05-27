import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import Register from './register';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

global.fetch = vi.fn();

describe('Komponent Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers(); 
  });

  afterEach(() => {
    vi.useRealTimers(); 
  });

  it('powinien zablokować rejestrację, gdy hasła się nie zgadzają', () => {
    render(<MemoryRouter><Register /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('register.usernamePlaceholder'), { target: { value: 'NowyUser' } });
    fireEvent.change(screen.getByPlaceholderText('register.emailPlaceholder'), { target: { value: 'test@test.pl' } });
    fireEvent.change(screen.getByPlaceholderText('register.passwordPlaceholder'), { target: { value: 'haslo123' } });
    fireEvent.change(screen.getByPlaceholderText('register.confirm_password_placeholder'), { target: { value: 'innehaslo321' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'register.submitBtn' }));

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByText('register.error_password_mismatch')).toBeInTheDocument();
  });

  it('powinien wysłać poprawne żądanie do API i przenieść na stronę logowania po 2 sekundach', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'register.success_message' }),
    });

    render(<MemoryRouter><Register /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('register.usernamePlaceholder'), { target: { value: 'NowyUser' } });
    fireEvent.change(screen.getByPlaceholderText('register.emailPlaceholder'), { target: { value: 'test@test.pl' } });
    fireEvent.change(screen.getByPlaceholderText('register.passwordPlaceholder'), { target: { value: 'dobreHaslo' } });
    fireEvent.change(screen.getByPlaceholderText('register.confirm_password_placeholder'), { target: { value: 'dobreHaslo' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'register.submitBtn' }));
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('register.success_message')).toBeInTheDocument();
    
    expect(mockNavigate).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});