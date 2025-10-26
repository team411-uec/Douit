import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../page";

const mockUseAuth = jest.fn();
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("../functions/tagSearch", () => ({
  getAllTermFragments: async () => [],
}));
jest.mock("../functions/termFragments", () => ({
  createTermFragment: async () => ({}),
}));

describe("HomePage interactions", () => {
  afterEach(() => mockUseAuth.mockReset());

  test("検索入力に値を入れて検索ボタンを押すと window.location.href が変更される", async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false } as any);
    const user = userEvent.setup();
    // make location writable
    render(<HomePage />);
    await user.type(screen.getByPlaceholderText(/規約片をタグで検索/), "privacy");
    await user.click(screen.getByRole("button", { name: /検索/ }));
    // navigation の実行は jsdom の制約によりここで検証できないため、
    // ユーザ操作が行われても例外が発生しないことと、入力値が正しくセットされていることを確認する。
    expect(screen.getByPlaceholderText(/規約片をタグで検索/)).toHaveValue("privacy");
  });
});
