import React from "react";
import { render, screen } from "@testing-library/react";
import UnderstoodPage from "../understood/page";

const mockUseAuth = jest.fn();
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// mock understanding service to avoid firebase imports
jest.mock("../functions/understandingService", () => ({
  getUnderstoodRecordsWithFragments: async () => [],
}));

describe("UnderstoodPage", () => {
  afterEach(() => mockUseAuth.mockReset());

  test("未ログイン時はログインが必要ですのメッセージを表示", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false } as any);
    render(<UnderstoodPage />);

    expect(screen.getByText(/ログインが必要です/)).toBeInTheDocument();
  });
});
