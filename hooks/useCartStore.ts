import { create } from "zustand";

interface CartState {
  items: { id: string; quantity: number }[];
  addItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (id, quantity) =>
    set((state) => ({
      items: [...state.items, { id, quantity }],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateItemQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
}));
