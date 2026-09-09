import React from 'react';
import { 
  TrendingUp, Users, Package, AlertCircle, 
  CreditCard, IndianRupee 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

// Mock Data
const revenueData = [
  { name: 'Mon', revenue: 120000 },
  { name: 'Tue', revenue: 180000 },
  { name: 'Wed', revenue: 150000 },
  { name: 'Thu', revenue: 240000 },
  { name: 'Fri', revenue: 290000 },
  { name: 'Sat', revenue: 380000 },
  { name: 'Sun', revenue: 420000 },
];

const categoryData = [
  { name: 'Gold Rings', value: 35 },
  { name: 'Gold Chains', value: 25 },
  { name: 'Silver Items', value: 20 },
  { name: 'Diamond', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#f59e0b', '#d97706', '#94a3b8', '#38bdf8', '#fbbf24'];

const paymentData = [
  { name: 'Cash', value: 45 },
  { name: 'UPI', value: 35 },
  { name: 'Card', value: 15 },
  { name: 'Bank Transfer', value: 5 },
];

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
        <span className="text-emerald-500 font-medium">{trend}</span>
        <span className="text-slate-500 dark:text-slate-400 ml-2">vs last period</span>
      </div>
    )}
  </div>
);

const ShopDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
        <select className="input-field max-w-xs py-1.5 text-sm">
          <option>Last 7 Days</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Today's Sales" 
          value={formatCurrency(245600)} 
          icon={IndianRupee}
          trend="+12.5%"
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
        />
        <StatCard 
          title="This Month" 
          value={formatCurrency(3842500)} 
          icon={TrendingUp}
          trend="+5.2%"
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        />
        <StatCard 
          title="Outstanding" 
          value={formatCurrency(1245000)} 
          icon={AlertCircle}
          colorClass="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
        />
        <StatCard 
          title="Total Customers" 
          value="2,845" 
          icon={Users}
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
        />
        <StatCard 
          title="Inventory Items" 
          value="4,215" 
          icon={Package}
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
        />
        <StatCard 
          title="Total Payments Today" 
          value={formatCurrency(280000)} 
          icon={CreditCard}
          colorClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Revenue Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#fcd34d' }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Sales by Category</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{ borderRadius: '8px', border: 'none' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ShopDashboard;
