import { render, screen } from '@testing-library/react';
import UnderstoodPage from '@/app/understood/page';
import type { AuthContextType } from '@/features/auth/contexts/AuthContext';

const mockUseAuth = jest.fn();
jest.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// mock understanding service to avoid firebase imports
jest.mock('@/app/functions/understandingService', () => ({
  getUnderstoodRecordsWithFragments: async () => [],
}));

describe('UnderstoodPage', () => {
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
    render(<UnderstoodPage />);

    expect(screen.getByText(/ログインが必要です/)).toBeInTheDocument();
  });
});
