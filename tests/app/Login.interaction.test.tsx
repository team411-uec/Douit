import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/login/page";

const mockUseAuth = jest.fn();
jest.mock("@/app/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// mock router
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("LoginPage interactions", () => {
  afterEach(() => mockUseAuth.mockReset());

  test("フォーム送信で signIn が呼ばれる (既存アカウント)", async () => {
    const signIn = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ user: null, loading: false, signIn } as any);

    const user = userEvent.setup();
    const { container } = render(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/メールアドレス/), "a@b.com");
    await user.type(screen.getByPlaceholderText(/パスワード/), "pass123");

    // ヘッダー等に同名のボタンがあるため、フォーム内の submit ボタンを特定してクリック
    const loginButtons = screen.getAllByRole("button", { name: /ログイン/ });
    const submitButton =
      loginButtons.find(b => b.getAttribute("type") === "submit") ||
      container.querySelector('button[type="submit"]');
    if (!submitButton) throw new Error("submit button not found");
    await user.click(submitButton as HTMLElement);

    expect(signIn).toHaveBeenCalledWith("a@b.com", "pass123");
  });

  test("新規アカウント作成トグル後に submit すると signUp が呼ばれる", async () => {
    const signUp = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ user: null, loading: false, signUp } as any);

    const user = userEvent.setup();
    render(<LoginPage />);

    // トグルボタンを押して isSignUp を有効にする
    await user.click(screen.getByRole("button", { name: /新規アカウント作成/ }));

    await user.type(screen.getByPlaceholderText(/メールアドレス/), "new@b.com");
    await user.type(screen.getByPlaceholderText(/パスワード/), "newpass");
    // 新規作成ボタンはラベルがアカウント作成なのでそれをクリック
    await user.click(screen.getByRole("button", { name: /アカウント作成/ }));

    expect(signUp).toHaveBeenCalledWith("new@b.com", "newpass");
  });
});
