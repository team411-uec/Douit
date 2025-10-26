import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "../page";

// mock useAuth
const mockUseAuth = jest.fn();
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// mock getAllTermFragments to avoid network / firebase
jest.mock("../functions/tagSearch", () => ({
  getAllTermFragments: async () => [],
}));
// mock createTermFragment to avoid importing firebase-backed module
jest.mock("../functions/termFragments", () => ({
  createTermFragment: async () => ({}),
}));

describe("HomePage", () => {
  afterEach(() => {
    mockUseAuth.mockReset();
  });

  test("renders search input and 検索 button", async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false } as any);
    render(<HomePage />);

    expect(screen.getByPlaceholderText(/規約片をタグで検索/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /検索/ })).toBeInTheDocument();

    // wait for any async effects to settle
    await waitFor(() => {});
  });
});
