import React from "react";
import { render, screen } from "@testing-library/react";
import LoginPage from "../login/page";

const mockUseAuth = jest.fn();
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// mock next/navigation useRouter to avoid 'app router to be mounted' invariant
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("LoginPage", () => {
  afterEach(() => mockUseAuth.mockReset());

  test("未ログイン時にログインフォームが表示される", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false } as any);
    render(<LoginPage />);

    // ページ見出しとしての「ログイン」が表示されていることを確認
    expect(screen.getByRole("heading", { name: /ログイン/ })).toBeInTheDocument();
  });
});
