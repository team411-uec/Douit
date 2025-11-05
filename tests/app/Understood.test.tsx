import { render, screen } from '@testing-library/react';
import UnderstoodPage from '@/app/understood/page';
import type { UnderstoodRecord } from '@/types';
import type { AuthContextValue } from '../mocks/auth';

const mockUseAuth = jest.fn<AuthContextValue, []>();

jest.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/features/understanding/services/understandingService', () => ({
  getUserUnderstoodRecords: jest.fn<Promise<UnderstoodRecord[]>, [string]>().mockResolvedValue([]),
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
    });
    render(<UnderstoodPage />);

    expect(screen.getByText(/ログインが必要です/)).toBeInTheDocument();
  });
});
