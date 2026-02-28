import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "./App";

// Mock AuthProvider so App renders logged-in view
vi.mock("./AuthProvider", () => ({
  useAuth: () => ({
    loading: false,
    user: { uid: "u1", email: "test@example.com" },
  }),
}));

// Mock auth functions
vi.mock("./auth", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
}));

// Mock Products and Orders so test stays focused
vi.mock("./Products", () => ({ default: () => <div /> }));
vi.mock("./Orders", () => ({ default: () => <div /> }));

// Mock ordersService used by CheckoutButton
vi.mock("./ordersService", () => ({
  createOrder: vi.fn(async () => "order-123"),
}));

describe("Integration: cart updates when adding product", () => {
  test("clicking Add to Cart increments cart count", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Initially 0
    expect(screen.getByTestId("cart-count")).toHaveTextContent("Cart Items: 0");

    // Click Add to Cart
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    // Now should be 1
    expect(screen.getByTestId("cart-count")).toHaveTextContent("Cart Items: 1");
  });
});