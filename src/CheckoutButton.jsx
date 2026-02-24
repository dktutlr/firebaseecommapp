import { useState } from "react";
import { createOrder } from "./ordersService";

export default function CheckoutButton({ userId, cartItems, onSuccess }) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setMsg("");
    if (!userId) return setMsg("You must be logged in.");
    if (!cartItems || cartItems.length === 0) return setMsg("Cart is empty.");

    setLoading(true);
    try {
      const orderId = await createOrder({ userId, cartItems });
      setMsg(`Order placed ✅ (${orderId})`);
      onSuccess?.(orderId);
    } catch (e) {
      setMsg(e?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Placing order..." : "Checkout"}
      </button>
      {msg && <p style={{ margin: 0 }}>{msg}</p>}
    </div>
  );
}