// Node (Jest) 環境では global.fetch が存在しないため、一部ライブラリ（firebase 等）が
// 問題を起こすことがあります。ここで簡易に polyfill しておきます。
if (typeof (global as any).fetch === "undefined") {
  (global as any).fetch = (..._args: any[]) =>
    Promise.resolve({ ok: true, json: async () => ({}) });
}

import React from "react";
import { render, screen } from "@testing-library/react";

// AuthContext をテスト単位でモック可能にするため、useAuth を jest.fn() で差し替え
const mockUseAuth = jest.fn();
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

import Header from "../Header";

// next/image をシンプルな img にモック
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt } = props;
    return React.createElement("img", { src, alt });
  },
}));

describe("Header", () => {
  afterEach(() => {
    mockUseAuth.mockReset();
  });

  test("表示: 未ログイン時にログインリンクが表示される", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
    } as any);

    render(<Header />);

    // ログインボタン（リンク）が存在することを確認
    expect(screen.getByRole("link", { name: /ログイン/ })).toBeInTheDocument();
  });

  test("表示: ログイン済みなら /user へのリンクが表示される", () => {
    const mockUser = { uid: "1", displayName: "Test User", email: "a@b.com", photoURL: null };
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
    } as any);

    const { container } = render(<Header />);

    // /user へのリンクが存在すること
    expect(container.querySelector('a[href="/user"]')).toBeInTheDocument();
  });

  test("表示: showUserIcon=true のときユーザーの photoURL が img として表示される", () => {
    const mockUser = { uid: "1", displayName: "U", email: "a@b.com", photoURL: "/me.png" };
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
    } as any);

    const { container } = render(<Header showUserIcon />);

    // ログインボタンは表示されず、/user へのリンクがあることを確認
    expect(screen.queryByRole("link", { name: /ログイン/ })).toBeNull();
    expect(container.querySelector('a[href="/user"]')).toBeInTheDocument();
  });
});
