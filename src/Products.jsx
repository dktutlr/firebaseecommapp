import { useEffect, useMemo, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productsService";

const emptyForm = {
  title: "",
  price: "",
  category: "",
  image: "",
  description: "",
};

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    setMsg("");
    try {
      const data = await fetchProducts();
      setItems(data);
    } catch (e) {
      setMsg(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totalCount = useMemo(() => items.length, [items]);

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      price: p.price ?? "",
      category: p.category || "",
      image: p.image || "",
      description: p.description || "",
    });
    setMsg("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMsg("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const priceNum = Number(form.price);
    if (!form.title.trim()) return setMsg("Title is required");
    if (!Number.isFinite(priceNum) || priceNum <= 0)
      return setMsg("Price must be a number > 0");

    const payload = {
      title: form.title.trim(),
      price: priceNum,
      category: form.category.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setMsg("Updated ✅");
      } else {
        await createProduct(payload);
        setMsg("Created ✅");
      }
      cancelEdit();
      await load();
    } catch (e2) {
      setMsg(e2?.message || "Save failed");
    }
  }

  async function handleDelete(id) {
    setMsg("");
    try {
      await deleteProduct(id);
      setMsg("Deleted ✅");
      await load();
    } catch (e) {
      setMsg(e?.message || "Delete failed");
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2>Products ({totalCount})</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Form */}
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>
            {editingId ? "Edit product" : "Add product"}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
            <input
              placeholder="Title *"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />

            <input
              placeholder="Price * (e.g., 9.99)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            />

            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={4}
            />

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">
                {editingId ? "Save changes" : "Create"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>

            {msg && <p style={{ margin: 0 }}>{msg}</p>}
          </form>
        </div>

        {/* List */}
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>All products</h3>

          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p>No products yet. Add one on the left.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {items.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #eee",
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.title}</div>
                      <div>${Number(p.price).toFixed(2)}</div>
                      {p.category && <div>Category: {p.category}</div>}
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => startEdit(p)}>Edit</button>
                      <button onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </div>

                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{
                        width: "100%",
                        maxHeight: 180,
                        objectFit: "contain",
                        marginTop: 10,
                      }}
                    />
                  )}

                  {p.description && (
                    <p style={{ marginTop: 10 }}>{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}