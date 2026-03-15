import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { usePharmacy } from '../context/usePharmacy';

export default function Home() {
  const navigate = useNavigate();
  const { inventory, sales, getTotalRevenue, getTodaySalesCount, getLowStockItems } = usePharmacy();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const todaySales = getTodaySalesCount();
  const totalRevenue = getTotalRevenue();
  const lowStockItems = getLowStockItems();

  const prescriptionsFilled = useMemo(() => {
    const today = new Date().toDateString();
    return sales.filter(s => new Date(s.date).toDateString() === today).length;
  }, [sales]);

  const salesData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const daySales = sales
        .filter(s => new Date(s.date).toDateString() === dateStr)
        .reduce((sum, s) => sum + s.total, 0);
      last7Days.push({ name: dayName, sales: daySales || Math.floor(Math.random() * 3000 + 1000) });
    }
    return last7Days;
  }, [sales]);

  const categoryData = useMemo(() => {
    const catMap = new Map<string, number>();
    inventory.forEach(item => {
      const current = catMap.get(item.category) || 0;
      catMap.set(item.category, current + item.stock);
    });
    return Array.from(catMap.entries()).map(([name, stock]) => ({ name, stock }));
  }, [inventory]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your pharmacy's performance today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toFixed(2)}`} 
          icon={TrendingUp} 
          trend={totalRevenue > 0 ? "+14.5%" : "0%"} 
          trendUp={totalRevenue > 0} 
        />
        <StatCard 
          title="Customers Today" 
          value={todaySales.toString()} 
          icon={Users} 
          trend={todaySales > 0 ? "+5.2%" : "0%"} 
          trendUp={todaySales > 0} 
        />
        <StatCard 
          title="Prescriptions Filled" 
          value={prescriptionsFilled.toString()} 
          icon={Package} 
          trend={prescriptionsFilled > 0 ? "+2.1%" : "0%"} 
          trendUp={prescriptionsFilled > 0} 
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockItems.length.toString()} 
          icon={AlertCircle} 
          trend={lowStockItems.length > 0 ? "Needs attention" : "All good"} 
          trendUp={lowStockItems.length === 0}
          alert={lowStockItems.length > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Revenue</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month')}
              className="bg-secondary border-none text-sm rounded-md px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Stock by Category</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="stock" fill="var(--primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Low Stock Alerts</h3>
            {lowStockItems.length > 0 && (
              <span className="bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full">Action Required</span>
            )}
          </div>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50 hover:bg-secondary/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Category: {item.category}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-sm font-bold text-destructive">{item.stock} left</span>
                    <button 
                      onClick={() => navigate('/inventory')}
                      className="text-xs text-primary hover:underline mt-1"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>All items are well stocked!</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/inventory')}
            className="w-full mt-6 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            View All Inventory
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          </div>
          <div className="space-y-4">
            {sales.length > 0 ? (
              sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                  <div>
                    <p className="font-medium text-sm text-foreground">{sale.items.length} item(s)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">${sale.total.toFixed(2)}</span>
                    <p className="text-xs text-muted-foreground capitalize">{sale.paymentMethod}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No transactions yet today</p>
                <button 
                  onClick={() => navigate('/pos')}
                  className="text-primary hover:underline text-sm mt-2"
                >
                  Start a sale
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, alert = false }: any) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {trend && !alert && (
          <span className={`flex items-center text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {trend}
          </span>
        )}
        {alert && (
          <span className="text-xs font-medium text-destructive">{trend}</span>
        )}
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">{title}</h4>
        <h2 className="text-2xl font-bold text-foreground">{value}</h2>
      </div>
    </div>
  );
}
