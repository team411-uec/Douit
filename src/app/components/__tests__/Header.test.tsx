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

  describe("未ログイン時の表示", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signInWithGoogle: jest.fn(),
        logout: jest.fn(),
      } as any);
    });

    test("ログインリンク (/login) が表示される", () => {
      const { container } = render(<Header />);
      const loginLink = container.querySelector('a[href="/login"]');
      expect(loginLink).toBeInTheDocument();
    });

    test("ログインボタン（テキスト）が表示される", () => {
      render(<Header />);
      expect(screen.getByRole("link", { name: /ログイン/ })).toBeInTheDocument();
    });
  });

  describe("ログイン済み時の表示", () => {
    const mockUser = { uid: "1", displayName: "Test User", email: "a@b.com", photoURL: null };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signInWithGoogle: jest.fn(),
        logout: jest.fn(),
      } as any);
    });

    test("/user へのリンクが表示される", () => {
      const { container } = render(<Header />);
      expect(container.querySelector('a[href="/user"]')).toBeInTheDocument();
    });

    test("ログインリンク (/login) は表示されない", () => {
      const { container } = render(<Header />);
      const loginLink = container.querySelector('a[href="/login"]');
      expect(loginLink).not.toBeInTheDocument();
    });
  });

  describe("showUserIcon プロップによる表示制御", () => {
    const mockUser = { uid: "1", displayName: "U", email: "a@b.com", photoURL: "/me.png" };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signInWithGoogle: jest.fn(),
        logout: jest.fn(),
      } as any);
    });

    test("showUserIcon=true のときユーザーアイコン (img) が表示される", () => {
      const { container } = render(<Header showUserIcon />);
      expect(container.querySelector("img")).toBeInTheDocument();
    });

    test("showUserIcon=true のときログインボタンは表示されない", () => {
      render(<Header showUserIcon />);
      expect(screen.queryByRole("link", { name: /ログイン/ })).toBeNull();
    });

    test("showUserIcon=true のとき /user へのリンクが表示される", () => {
      const { container } = render(<Header showUserIcon />);
      expect(container.querySelector('a[href="/user"]')).toBeInTheDocument();
    });
  });
});
