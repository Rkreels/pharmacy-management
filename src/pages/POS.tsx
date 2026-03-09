import React, { useState } from 'react';
    import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, User } from 'lucide-react';
    import { toast } from 'react-toastify';

    // Mock Data matching Inventory
    const availableItems = [
      { id: 'MED-001', name: 'Paracetamol 500mg', price: 5.99, stock: 150 },
      { id: 'MED-002', name: 'Amoxicillin 250mg', price: 15.50, stock: 12 },
      { id: 'MED-003', name: 'Cetirizine 10mg', price: 8.25, stock: 85 },
      { id: 'MED-005', name: 'Vitamin C 1000mg', price: 12.00, stock: 200 },
      { id: 'MED-006', name: 'Omeprazole 20mg', price: 22.00, stock: 45 },
      { id: 'MED-007', name: 'Lisinopril 10mg', price: 18.75, stock: 18 },
    ];

    interface CartItem {
      id: string;
      name: string;
      price: number;
      quantity: number;
      stock: number;
    }

    export default function POS() {
      const [searchTerm, setSearchTerm] = useState('');
      const [cart, setCart] = useState<CartItem[]>([]);

      const filteredItems = availableItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const addToCart = (item: typeof availableItems[0]) => {
        setCart(prev => {
          const existing = prev.find(i => i.id === item.id);
          if (existing) {
            if (existing.quantity >= item.stock) {
              toast.error(`Only ${item.stock} units available in stock.`);
              return prev;
            }
            return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
          }
          return [...prev, { ...item, quantity: 1 }];
        });
      };

      const updateQuantity = (id: string, delta: number) => {
        setCart(prev => {
          return prev.map(item => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              if (newQty > item.stock) {
                toast.warning(`Cannot exceed available stock (${item.stock}).`);
                return item;
              }
              return { ...item, quantity: Math.max(1, newQty) };
            }
            return item;
          });
        });
      };

      const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
      };

      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax;

      const handleCheckout = () => {
        if (cart.length === 0) return;
        toast.success(`Payment of $${total.toFixed(2)} processed successfully!`);
        setCart([]);
      };

      return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-fade-in">
          
          {/* Left Panel: Search & Select */}
          <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30">
              <h2 className="text-lg font-semibold text-foreground mb-4">Select Items</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Scan barcode or search medicine..."
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => addToCart(item)}
                    className="bg-background border border-border rounded-xl p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all group flex flex-col justify-between h-32"
                  >
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{item.id}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-lg text-foreground">${item.price.toFixed(2)}</span>
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                        Stock: {item.stock}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredItems.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    No items found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Cart & Checkout */}
          <div className="w-full lg:w-[400px] flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Current Order</h2>
              </div>
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                {cart.length} Items
              </span>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
                  <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-2">
                    <ShoppingCart className="h-8 w-8 opacity-50" />
                  </div>
                  <p>Cart is empty</p>
                  <p className="text-xs text-center px-8">Search and select items from the left panel to add them to the order.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex flex-col bg-background border border-border rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm text-foreground pr-4">{item.name}</span>
                      <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-border rounded-md bg-secondary/50">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-background rounded-l-md transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-background rounded-r-md transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors ml-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Section */}
            <div className="p-4 bg-muted/30 border-t border-border mt-auto">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end border-t border-border/50 pt-2 mt-2">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button className="flex items-center justify-center gap-2 py-2.5 border border-border bg-background rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                  <Banknote className="h-4 w-4" /> Cash
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 border border-border bg-background rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                  <CreditCard className="h-4 w-4" /> Card
                </button>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      );
    }