import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import Login from '../routes/login';
import * as AuthContext from '../contexts/AuthContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login-mock" />
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Komponent Login', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: mockLogin,
      loginGoogle: vi.fn(),
      isAuthenticated: false,
      username: null,
      logout: vi.fn(),
      authFetch: vi.fn(),
    });
  });

  it('powinien wyświetlić błąd przy niepoprawnych danych', async () => {
    mockLogin.mockResolvedValueOnce(false);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('login.usernamePlaceholder'), { target: { value: 'zlyUser' } });
    fireEvent.change(screen.getByPlaceholderText('login.passwordPlaceholder'), { target: { value: 'zleHaslo' } });
    fireEvent.click(screen.getByRole('button', { name: 'login.submitBtn' }));

    expect(mockLogin).toHaveBeenCalledWith({ username: 'zlyUser', password: 'zleHaslo' });
    
    await waitFor(() => {
      expect(screen.getByText('login.errors.invalidCredentials')).toBeInTheDocument();
    });
  });

  it('powinien przenieść użytkownika na stronę główną po udanym logowaniu', async () => {
    mockLogin.mockResolvedValueOnce(true);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('login.usernamePlaceholder'), { target: { value: 'dobryUser' } });
    fireEvent.change(screen.getByPlaceholderText('login.passwordPlaceholder'), { target: { value: 'dobreHaslo' } });
    fireEvent.click(screen.getByRole('button', { name: 'login.submitBtn' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});