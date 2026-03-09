import React from 'react';
    import { 
      TrendingUp, 
      Users, 
      Package, 
      AlertCircle,
      ArrowUpRight,
      ArrowDownRight
    } from 'lucide-react';
    import { 
      LineChart, 
      Line, 
      XAxis, 
      YAxis, 
      CartesianGrid, 
      Tooltip, 
      ResponsiveContainer 
    } from 'recharts';

    const salesData = [
      { name: 'Mon', sales: 4000 },
      { name: 'Tue', sales: 3000 },
      { name: 'Wed', sales: 5000 },
      { name: 'Thu', sales: 2780 },
      { name: 'Fri', sales: 6890 },
      { name: 'Sat', sales: 8390 },
      { name: 'Sun', sales: 3490 },
    ];

    const lowStockAlerts = [
      { id: 1, name: 'Amoxicillin 250mg', stock: 12, threshold: 20 },
      { id: 2, name: 'Ibuprofen 400mg', stock: 5, threshold: 50 },
      { id: 3, name: 'Bandages (Large)', stock: 8, threshold: 30 },
      { id: 4, name: 'Cough Syrup (Adult)', stock: 2, threshold: 15 },
    ];

    export default function Home() {
      return (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your pharmacy's performance today.</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Revenue" 
              value="$12,426.00" 
              icon={TrendingUp} 
              trend="+14.5%" 
              trendUp={true} 
            />
            <StatCard 
              title="Customers Today" 
              value="142" 
              icon={Users} 
              trend="+5.2%" 
              trendUp={true} 
            />
            <StatCard 
              title="Prescriptions Filled" 
              value="89" 
              icon={Package} 
              trend="-2.4%" 
              trendUp={false} 
            />
            <StatCard 
              title="Low Stock Items" 
              value="24" 
              icon={AlertCircle} 
              trend="Needs attention" 
              trendUp={false} 
              alert={true}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="col-span-1 lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Weekly Revenue</h3>
                <select className="bg-secondary border-none text-sm rounded-md px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none">
                  <option>This Week</option>
                  <option>Last Week</option>
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
                    />
                    <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="col-span-1 bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Low Stock Alerts</h3>
                <span className="bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full">Action Required</span>
              </div>
              <div className="space-y-4">
                {lowStockAlerts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50 hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Threshold: {item.threshold}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-sm font-bold text-destructive">{item.stock} left</span>
                      <button className="text-xs text-primary hover:underline mt-1">Reorder</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors">
                View All Inventory
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Helper component for Stats
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