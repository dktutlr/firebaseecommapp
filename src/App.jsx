import { useState } from "react";
import { registerUser, loginUser, logoutUser } from "./auth";
import { useAuth } from "./AuthProvider";

import Products from "./Products";
import Orders from "./Orders";
import CheckoutButton from "./CheckoutButton";

export default function App() {
  const { user, loading } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // extra profile fields for Firestore
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const [msg, setMsg] = useState("");

  // Cart state (must be here, NOT inside if(user))
  const [cartItems, setCartItems] = useState([]);

  function addDemoProduct() {
    setCartItems((c) => [
      ...c,
      {
        id: `demo-${c.length + 1}`,
        title: "Demo Product",
        price: 10,
        qty: 1,
      },
    ]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    try {
      if (mode === "register") {
        await registerUser({
          email,
          password,
          profile: { name, address },
        });
        setMsg("Registered successfully");
      } else {
        await loginUser({ email, password });
        setMsg("Logged in");
      }
    } catch (err) {
      setMsg(err?.message || "Something went wrong");
    }
  }

  if (loading) return <p style={{ padding: 16 }}>Loading...</p>;

  //  LOGGED IN VIEW
  if (user) {
    return (
      <div>
        <div style={{ padding: 16 }}>
          <h1> Logged in</h1>
          <p>
            <b>Email:</b> {user.email}
          </p>

          <button onClick={logoutUser}>Logout</button>

          {/*  Cart demo section (for integration test) */}
          <div style={{ marginTop: 12 }}>
            <h3>Cart demo (for integration test)</h3>

            <button onClick={addDemoProduct}>Add to Cart</button>

            <p data-testid="cart-count">Cart Items: {cartItems.length}</p>
          </div>

          {/*  Checkout section */}
          <div style={{ marginTop: 12 }}>
            <h3>Checkout test</h3>
            <CheckoutButton
              userId={user.uid}
              cartItems={cartItems}
              onSuccess={(orderId) => console.log("Order created:", orderId)}
            />
          </div>
        </div>

        <Products />
        <Orders userId={user.uid} />
      </div>
    );
  }

  //  LOGGED OUT VIEW
  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h1>{mode === "register" ? "Register" : "Login"}</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode("login")}>Login</button>
        <button onClick={() => setMode("register")}>Register</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          placeholder="Password (6+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        {mode === "register" && (
          <>
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </>
        )}

        <button type="submit">
          {mode === "register" ? "Create account" : "Login"}
        </button>

        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}