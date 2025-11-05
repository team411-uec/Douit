import { render, screen } from '@testing-library/react';
import UserPage from '@/app/user/page';
import type { AuthContextValue } from '../mocks/auth';

const mockUseAuth = jest.fn();
jest.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// mock next/navigation useRouter to avoid 'app router to be mounted' invariant
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('UserPage', () => {
  afterEach(() => mockUseAuth.mockReset());

  test('未ログイン時はログインが必要ですのメッセージを表示', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
    } satisfies AuthContextValue);
    render(<UserPage />);

    expect(screen.getByText(/ログインが必要です/)).toBeInTheDocument();
  });
});
