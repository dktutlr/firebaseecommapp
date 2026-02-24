import { useEffect, useState } from "react";
import { fetchOrdersForUser, fetchOrderById } from "./ordersService";

function formatMoney(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export default function Orders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    setMsg("");
    try {
      const data = await fetchOrdersForUser(userId);
      setOrders(data);
    } catch (e) {
      setMsg(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userId) return;
    load();
  }, [userId]);

  useEffect(() => {
    async function loadOne() {
      if (!selectedId) {
        setSelectedOrder(null);
        return;
      }
      try {
        const one = await fetchOrderById(selectedId);
        setSelectedOrder(one);
      } catch (e) {
        setMsg(e?.message || "Failed to load order details");
      }
    }
    loadOne();
  }, [selectedId]);

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2>Order History</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button onClick={load} disabled={loading}>
          Refresh
        </button>
        {msg && <p style={{ margin: 0 }}>{msg}</p>}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Orders list */}
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Your orders</h3>

          {loading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {orders.map((o) => {
                const created =
                  o.createdAt?.toDate?.()?.toLocaleString() ||
                  "(date unavailable)";
                return (
                  <button
                    key={o.id}
                    onClick={() => setSelectedId(o.id)}
                    style={{
                      textAlign: "left",
                      padding: 10,
                      borderRadius: 8,
                      border:
                        selectedId === o.id
                          ? "2px solid black"
                          : "1px solid #eee",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>Order: {o.id}</div>
                    <div>Date: {created}</div>
                    <div>Total: {formatMoney(o.total)}</div>
                    <div>Status: {o.status || "n/a"}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Order details */}
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Order details</h3>

          {!selectedOrder ? (
            <p>Click an order to see details.</p>
          ) : (
            <>
              <p style={{ marginTop: 0 }}>
                <b>Order ID:</b> {selectedOrder.id}
              </p>

              <p>
                <b>Total:</b> {formatMoney(selectedOrder.total)}
              </p>

              <p>
                <b>Items:</b>
              </p>

              <div style={{ display: "grid", gap: 10 }}>
                {(selectedOrder.items || []).map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #eee",
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{it.title}</div>
                    <div>
                      Qty: {it.qty} | Price: {formatMoney(it.price)}
                    </div>
                    <div>Line total: {formatMoney(it.price * it.qty)}</div>

                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.title}
                        style={{
                          width: "100%",
                          maxHeight: 140,
                          objectFit: "contain",
                          marginTop: 8,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}