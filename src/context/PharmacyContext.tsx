import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  expiry: string;
}

export interface CartItem extends Medicine {
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card';
  date: string;
}

interface PharmacyContextType {
  inventory: Medicine[];
  cart: CartItem[];
  sales: Sale[];
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  addToCart: (medicine: Medicine) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  processSale: (paymentMethod: 'cash' | 'card') => void;
  getTotalRevenue: () => number;
  getTodaySalesCount: () => number;
  getLowStockItems: () => Medicine[];
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

const generateId = () => `MED-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`;

const initialInventory: Medicine[] = [
  { id: 'MED-001', name: 'Paracetamol 500mg', category: 'Analgesics', price: 5.99, stock: 150, expiry: '2025-10-12' },
  { id: 'MED-002', name: 'Amoxicillin 250mg', category: 'Antibiotics', price: 15.50, stock: 12, expiry: '2024-08-05' },
  { id: 'MED-003', name: 'Cetirizine 10mg', category: 'Antihistamines', price: 8.25, stock: 85, expiry: '2026-01-20' },
  { id: 'MED-004', name: 'Ibuprofen 400mg', category: 'Analgesics', price: 6.50, stock: 0, expiry: '2025-05-15' },
  { id: 'MED-005', name: 'Vitamin C 1000mg', category: 'Supplements', price: 12.00, stock: 200, expiry: '2026-11-30' },
  { id: 'MED-006', name: 'Omeprazole 20mg', category: 'Antacids', price: 22.00, stock: 45, expiry: '2025-03-22' },
  { id: 'MED-007', name: 'Lisinopril 10mg', category: 'Cardiovascular', price: 18.75, stock: 18, expiry: '2024-12-10' },
];

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<Medicine[]>(initialInventory);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const addMedicine = (medicine: Omit<Medicine, 'id'>) => {
    const newMedicine: Medicine = { ...medicine, id: generateId() };
    setInventory(prev => [...prev, newMedicine]);
    toast.success(`${medicine.name} added to inventory`);
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setInventory(prev => prev.map(med => 
      med.id === id ? { ...med, ...updates } : med
    ));
    toast.success('Medicine updated successfully');
  };

  const deleteMedicine = (id: string) => {
    const med = inventory.find(m => m.id === id);
    setInventory(prev => prev.filter(m => m.id !== id));
    toast.success(`${med?.name} removed from inventory`);
  };

  const addToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        if (existing.quantity >= medicine.stock) {
          toast.warning(`Only ${medicine.stock} units available in stock.`);
          return prev;
        }
        return prev.map(item => 
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > item.stock) {
          toast.warning(`Cannot exceed available stock (${item.stock}).`);
          return item;
        }
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const processSale = (paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const newSale: Sale = {
      id: `SALE-${Date.now()}`,
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
      date: new Date().toISOString(),
    };

    setSales(prev => [newSale, ...prev]);

    setInventory(prev => prev.map(med => {
      const cartItem = cart.find(item => item.id === med.id);
      if (cartItem) {
        return { ...med, stock: Math.max(0, med.stock - cartItem.quantity) };
      }
      return med;
    }));

    clearCart();
    toast.success(`Payment of $${total.toFixed(2)} processed successfully!`);
  };

  const getTotalRevenue = () => {
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const getTodaySalesCount = () => {
    const today = new Date().toDateString();
    return sales.filter(sale => new Date(sale.date).toDateString() === today).length;
  };

  const getLowStockItems = () => {
    return inventory.filter(med => med.stock > 0 && med.stock < 20);
  };

  return (
    <PharmacyContext.Provider value={{
      inventory,
      cart,
      sales,
      addMedicine,
      updateMedicine,
      deleteMedicine,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      processSale,
      getTotalRevenue,
      getTodaySalesCount,
      getLowStockItems,
    }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export { PharmacyContext };
