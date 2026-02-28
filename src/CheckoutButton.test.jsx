import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CheckoutButton from "./CheckoutButton";

vi.mock("./ordersService", () => ({
  createOrder: vi.fn(() => Promise.resolve("order-123"))
}));

describe("CheckoutButton", () => {
  test("shows error if not logged in", async () => {
    const user = userEvent.setup();

    render(<CheckoutButton userId={null} cartItems={[{ id: 1 }]} />);

    await user.click(screen.getByRole("button", { name: /checkout/i }));

    expect(screen.getByText("You must be logged in.")).toBeInTheDocument();
  });

  test("shows error if cart is empty", async () => {
    const user = userEvent.setup();

    render(<CheckoutButton userId="abc" cartItems={[]} />);

    await user.click(screen.getByRole("button", { name: /checkout/i }));

    expect(screen.getByText("Cart is empty.")).toBeInTheDocument();
  });
});