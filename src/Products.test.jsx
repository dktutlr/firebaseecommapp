import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Products from "./Products";

// Mock the product service used by Products.jsx
vi.mock("./productsService", () => ({
  fetchProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

import { fetchProducts, deleteProduct } from "./productsService";

describe("Products", () => {
  test("loads and renders products list", async () => {
    fetchProducts.mockResolvedValueOnce([
      { id: "1", title: "USB Cable", price: 9.99, category: "Tech" },
      { id: "2", title: "Mouse", price: 19.5, category: "Tech" },
    ]);

    render(<Products />);

    // shows loading first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // then renders products
    expect(await screen.findByText("USB Cable")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText("$19.50")).toBeInTheDocument();

    // header count updates
    expect(screen.getByText(/Products \(2\)/)).toBeInTheDocument();
  });

  test("Refresh button reloads products", async () => {
    const user = userEvent.setup();

    fetchProducts
      .mockResolvedValueOnce([{ id: "1", title: "USB Cable", price: 9.99 }])
      .mockResolvedValueOnce([{ id: "2", title: "Keyboard", price: 49.0 }]);

    render(<Products />);

    expect(await screen.findByText("USB Cable")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /refresh/i }));

    expect(await screen.findByText("Keyboard")).toBeInTheDocument();
    expect(screen.getByText(/Products \(1\)/)).toBeInTheDocument();
  });

  test("Delete button deletes and reloads", async () => {
    const user = userEvent.setup();

    fetchProducts
      .mockResolvedValueOnce([
        { id: "1", title: "USB Cable", price: 9.99 },
        { id: "2", title: "Mouse", price: 19.5 },
      ])
      .mockResolvedValueOnce([{ id: "2", title: "Mouse", price: 19.5 }]);

    deleteProduct.mockResolvedValueOnce();

    render(<Products />);

    expect(await screen.findByText("USB Cable")).toBeInTheDocument();

    // Click first delete (for USB Cable)
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Verify delete service called correctly
    expect(deleteProduct).toHaveBeenCalledTimes(1);
    expect(deleteProduct).toHaveBeenCalledWith("1");

    // Reload happened and USB Cable is gone
    expect(await screen.findByText("Mouse")).toBeInTheDocument();
    expect(screen.queryByText("USB Cable")).not.toBeInTheDocument();
  });
});