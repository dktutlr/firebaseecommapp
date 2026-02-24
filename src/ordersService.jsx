import { db } from "./firebase";
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const ordersCol = collection(db, "orders");

function normalizeCartItem(item) {
  const qty = item.qty ?? item.quantity ?? item.count ?? 1;
  return {
    productId: item.id || item.productId,
    title: item.title || "",
    price: Number(item.price || 0),
    qty: Number(qty || 1),
    image: item.image || "",
  };
}

export function calcOrderTotal(cartItems = []) {
  return cartItems.reduce((sum, i) => {
    const qty = i.qty ?? i.quantity ?? i.count ?? 1;
    return sum + Number(i.price || 0) * Number(qty || 1);
  }, 0);
}

//  Create order
export async function createOrder({ userId, cartItems }) {
  const items = cartItems.map(normalizeCartItem);
  const total = calcOrderTotal(cartItems);

  const ref = await addDoc(ordersCol, {
    userId,
    items,
    total,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

//  Get current user's order history
export async function fetchOrdersForUser(userId) {
  const q = query(
    ordersCol,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Get one order by id
export async function fetchOrderById(orderId) {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}