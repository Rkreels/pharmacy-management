import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package,
  Download
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { usePharmacy } from '../context/usePharmacy';
import { toast } from 'react-toastify';

const COLORS = ['#0284c7', '#0d9488', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function Reports() {
  const { sales } = usePharmacy();
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');

  const handleExport = () => {
    const exportData = filteredSales.map(sale => ({
      Date: new Date(sale.date).toLocaleString(),
      'Transaction ID': sale.id,
      Items: sale.items.map(i => `${i.name} x${i.quantity}`).join(', '),
      Subtotal: sale.subtotal.toFixed(2),
      Tax: sale.tax.toFixed(2),
      Total: sale.total.toFixed(2),
      'Payment Method': sale.paymentMethod,
    }));

    const csv = [
      Object.keys(exportData[0] || {}).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacy-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully!');
  };

  const filteredSales = useMemo(() => {
    const now = new Date();
    const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 365;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return sales.filter(s => new Date(s.date) >= startDate);
  }, [sales, dateRange]);

  const stats = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
    const totalTransactions = filteredSales.length;
    const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const cashSales = filteredSales.filter(s => s.paymentMethod === 'cash');
    const cardSales = filteredSales.filter(s => s.paymentMethod === 'card');
    const cashTotal = cashSales.reduce((sum, s) => sum + s.total, 0);
    const cardTotal = cardSales.reduce((sum, s) => sum + s.total, 0);
    
    return { totalRevenue, totalTransactions, avgTransaction, cashTotal, cardTotal };
  }, [filteredSales]);

  const dailySalesData = useMemo(() => {
    const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 12;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayName = dateRange === 'year' 
        ? date.toLocaleDateString('en-US', { month: 'short' })
        : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const daySales = filteredSales
        .filter(s => new Date(s.date).toDateString() === dateStr)
        .reduce((sum, s) => sum + s.total, 0);
      data.push({ name: dayName, revenue: daySales, transactions: filteredSales.filter(s => new Date(s.date).toDateString() === dateStr).length });
    }
    return data;
  }, [filteredSales, dateRange]);

  const categoryData = useMemo(() => {
    const catMap = new Map<string, number>();
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const current = catMap.get(item.category) || 0;
        catMap.set(item.category, current + (item.price * item.quantity));
      });
    });
    return Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredSales]);

  const topSellingItems = useMemo(() => {
    const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = itemMap.get(item.id) || { name: item.name, quantity: 0, revenue: 0 };
        itemMap.set(item.id, { 
          name: item.name, 
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + (item.price * item.quantity)
        });
      });
    });
    return Array.from(itemMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredSales]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">View sales performance and business insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'year')}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</h4>
            <h2 className="text-2xl font-bold text-foreground">${stats.totalRevenue.toFixed(2)}</h2>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2%
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Transactions</h4>
            <h2 className="text-2xl font-bold text-foreground">{stats.totalTransactions}</h2>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Avg. Transaction</h4>
            <h2 className="text-2xl font-bold text-foreground">${stats.avgTransaction.toFixed(2)}</h2>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Items Sold</h4>
            <h2 className="text-2xl font-bold text-foreground">
              {filteredSales.reduce((sum, s) => sum + s.items.reduce((i, item) => i + item.quantity, 0), 0)}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySalesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Sales by Category</h3>
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No sales data available
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-muted-foreground">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Top Selling Items</h3>
          <div className="space-y-4">
            {topSellingItems.length > 0 ? (
              topSellingItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} units sold</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">${item.revenue.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Payment Methods</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Cash Payments</span>
                <span className="text-sm text-muted-foreground">{Math.round((filteredSales.filter(s => s.paymentMethod === 'cash').length / (filteredSales.length || 1)) * 100)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${(stats.cashTotal / (stats.totalRevenue || 1)) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-bold text-foreground mt-2">${stats.cashTotal.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Card Payments</span>
                <span className="text-sm text-muted-foreground">{Math.round((filteredSales.filter(s => s.paymentMethod === 'card').length / (filteredSales.length || 1)) * 100)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${(stats.cardTotal / (stats.totalRevenue || 1)) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-bold text-foreground mt-2">${stats.cardTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
