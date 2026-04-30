import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { PackageSearch, ReceiptCent, TrendingUp, Download } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Table, Thead, Tr, Th, Td } from '../components/ui/Table';
import { Button } from '../components/ui/Button';

// Enhanced Dark Stat Card
const StatCard = ({ title, value, icon: Icon, trend, isRevenue }) => (
  <Card className="group hover:border-white/10 transition-colors cursor-default relative overflow-hidden">
    <div className={`absolute -right-12 -top-12 w-32 h-32 blur-3xl opacity-10 rounded-full transition-opacity group-hover:opacity-20 ${isRevenue ? 'bg-[#22C55E]' : 'bg-[#3B82F6]'}`} />
    
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{title}</p>
          <h3 className={`text-3xl font-bold mt-2 tracking-tight ${isRevenue ? 'text-[#22C55E] drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'text-white'}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${isRevenue ? 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-6 flex items-center text-sm">
          <span className="text-[#22C55E] font-medium bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">+{trend}%</span>
          <span className="text-gray-500 ml-3 text-xs">from last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [allOrders, setAllOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders')
        ]);
        
        const productsCount = prodRes.data.length;
        const ordersCount = orderRes.data.length;
        const totalRevenue = orderRes.data.reduce((acc, order) => acc + order.total, 0);

        setStats({ products: productsCount, orders: ordersCount, revenue: totalRevenue });
        setAllOrders(orderRes.data);
        setRecentOrders(orderRes.data.slice(0, 5));
      } catch (err) {
        toast.error('Failed to load dashboard telemetry');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    try {
      if (allOrders.length === 0) {
         toast.error("No active orders to export.");
         return;
      }
      
      const formattedData = allOrders.map(order => ({
        "Order ID": order._id,
        "Transaction Date": new Date(order.createdAt).toLocaleString(),
        "Net Items Purchased": order.items.reduce((s, i) => s + i.quantity, 0),
        "Total Revenue (₹)": order.total,
        "Status": "COMPLETED"
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Lifetime Orders");
      XLSX.writeFile(workbook, "NexusBilling_Export.xlsx");
      
      toast.success("Excel ledger generated and downloaded!");
    } catch (err) {
      toast.error("An error occurred during ledger export.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 rounded-2xl border border-white/5" />)}
        </div>
        <div className="h-80 bg-white/5 rounded-2xl mt-8 border border-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time telemetry and order history.</p>
        </div>
        <Button variant="secondary" className="gap-2 self-start sm:self-auto" onClick={handleExport}>
          <Download size={16} /> Export XL Data
        </Button>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.products} 
          icon={PackageSearch} 
          trend="12.5"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.orders} 
          icon={ReceiptCent} 
          trend="8.1"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
          icon={TrendingUp} 
          trend="24.3"
          isRevenue={true}
        />
      </div>

      {/* Table Section */}
      <Card>
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Recent Transactions</h3>
          <Button variant="ghost" size="sm">View all &rarr;</Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          <Table>
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Date processed</Th>
                <Th>Products</Th>
                <Th>Items</Th>
                <Th className="text-right">Total Amount</Th>
                <Th className="text-right">Status</Th>
              </Tr>
            </Thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <Tr>
                  <Td colSpan={5} className="text-center py-12 text-gray-500 italic">No transactions found.</Td>
                </Tr>
              ) : (
                recentOrders.map(order => (
                  <Tr key={order._id}>
                    <Td className="font-mono text-xs text-blue-400">#{order._id.slice(-6).toUpperCase()}</Td>
                    <Td className="text-gray-400">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300 font-medium">
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </Td>
                    <Td className="text-gray-400">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </Td>
                    <Td className="text-right font-medium text-white">
                      ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Td>
                    <Td className="text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 text-xs font-semibold">
                        Completed
                      </span>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden divide-y divide-white/5">
          {recentOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-500 italic text-sm">No transactions found.</p>
          ) : (
            recentOrders.map(order => (
              <div key={order._id} className="px-4 py-4 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-blue-400 font-semibold">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} &bull; {order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300 font-medium">
                        {item.name} &times;{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-white font-semibold text-sm">₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 text-[10px] font-semibold">Completed</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
