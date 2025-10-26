import React from "react";
import { render, screen } from "@testing-library/react";
import TermsPage from "../terms/page";

const mockUseAuth = jest.fn();
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// mock term set service to avoid firebase imports if needed
jest.mock("../functions/termSetService", () => ({
  createUserTermSet: async () => ({}),
  getUserTermSets: async () => [],
}));

describe("TermsPage", () => {
  afterEach(() => mockUseAuth.mockReset());

  test("未ログイン時はログインが必要ですのメッセージを表示", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false } as any);
    render(<TermsPage />);

    expect(screen.getByText(/ログインが必要です/)).toBeInTheDocument();
  });
});
