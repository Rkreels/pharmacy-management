import React, { useState } from 'react';
    import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

    // Mock Data
    const initialInventory = [
      { id: 'MED-001', name: 'Paracetamol 500mg', category: 'Analgesics', price: 5.99, stock: 150, status: 'In Stock', expiry: '2025-10-12' },
      { id: 'MED-002', name: 'Amoxicillin 250mg', category: 'Antibiotics', price: 15.50, stock: 12, status: 'Low Stock', expiry: '2024-08-05' },
      { id: 'MED-003', name: 'Cetirizine 10mg', category: 'Antihistamines', price: 8.25, stock: 85, status: 'In Stock', expiry: '2026-01-20' },
      { id: 'MED-004', name: 'Ibuprofen 400mg', category: 'Analgesics', price: 6.50, stock: 0, status: 'Out of Stock', expiry: '2025-05-15' },
      { id: 'MED-005', name: 'Vitamin C 1000mg', category: 'Supplements', price: 12.00, stock: 200, status: 'In Stock', expiry: '2026-11-30' },
      { id: 'MED-006', name: 'Omeprazole 20mg', category: 'Antacids', price: 22.00, stock: 45, status: 'In Stock', expiry: '2025-03-22' },
      { id: 'MED-007', name: 'Lisinopril 10mg', category: 'Cardiovascular', price: 18.75, stock: 18, status: 'Low Stock', expiry: '2024-12-10' },
    ];

    export default function Inventory() {
      const [searchTerm, setSearchTerm] = useState('');
      const [inventory, setInventory] = useState(initialInventory);

      const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const getStatusColor = (status: string) => {
        switch(status) {
          case 'In Stock': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
          case 'Low Stock': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
          case 'Out of Stock': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
          default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
      };

      return (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory Management</h1>
              <p className="text-muted-foreground mt-1">Manage medicines, stock levels, and pricing.</p>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
              <Plus className="h-5 w-5" />
              Add Medicine
            </button>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/30">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search by name, ID, or category..."
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap">
                <Filter className="h-4 w-4" />
                Filter by Category
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Item ID</th>
                    <th className="px-6 py-4 font-medium">Medicine Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium text-right">Price</th>
                    <th className="px-6 py-4 font-medium text-right">Stock</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Expiry Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{item.id}</td>
                        <td className="px-6 py-4 font-semibold text-primary">{item.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                        <td className="px-6 py-4 text-right font-medium">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-medium">{item.stock}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{item.expiry}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Edit">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                        No medicines found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing 1 to {filteredInventory.length} of {inventory.length} entries</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-border rounded-md hover:bg-secondary disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-border bg-primary text-primary-foreground rounded-md">1</button>
                <button className="px-3 py-1 border border-border rounded-md hover:bg-secondary">2</button>
                <button className="px-3 py-1 border border-border rounded-md hover:bg-secondary">Next</button>
              </div>
            </div>
          </div>
        </div>
      );
    }