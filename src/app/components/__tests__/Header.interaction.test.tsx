import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../Header";

const mockUseAuth = jest.fn();
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("Header interactions", () => {
  afterEach(() => mockUseAuth.mockReset());

  test("未ログイン時に /login へのリンクが表示される", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
    } as any);
    const { container } = render(<Header />);

    const loginLink = container.querySelector('a[href="/login"]');
    expect(loginLink).toBeInTheDocument();
  });

  test("ログイン済みなら /user へのリンクが表示される", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "1", displayName: "U" },
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
    } as any);
    const { container } = render(<Header />);

    const userLink = container.querySelector('a[href="/user"]');
    expect(userLink).toBeInTheDocument();
  });
});
