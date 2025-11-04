import { render, screen } from '@testing-library/react';
import TermsPage from '@/app/terms/page';
import type { AuthContextType } from '@/features/auth/contexts/AuthContext';

const mockUseAuth = jest.fn();
jest.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// mock term set service to avoid firebase imports if needed
jest.mock('@/app/functions/termSetService', () => ({
  createUserTermSet: async () => ({}),
  getUserTermSets: async () => [],
}));

describe('TermsPage', () => {
  afterEach(() => mockUseAuth.mockReset());

  test('未ログイン時はログインが必要ですのメッセージを表示', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
    } as AuthContextType);
    render(<TermsPage />);

    expect(screen.getByText(/ログインが必要です/)).toBeInTheDocument();
  });
});
