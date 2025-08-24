
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const stats = [
    {
      title: 'Total Inventory',
      value: '2,547',
      change: '+12%',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Sales This Month',
      value: '₹45,67,890',
      change: '+8%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Purchase Orders',
      value: '156',
      change: '+15%',
      icon: TrendingDown,
      color: 'text-orange-600'
    },
    {
      title: 'Active Users',
      value: '24',
      change: '+2%',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-product':
        navigate('/inventory');
        toast({
          title: "Navigating to Inventory",
          description: "Add your products in the inventory section.",
        });
        break;
      case 'create-sale':
        navigate('/sales/orders');
        toast({
          title: "Creating Sales Order",
          description: "Redirecting to sales orders page.",
        });
        break;
      case 'purchase-order':
        navigate('/inward/purchase-orders');
        toast({
          title: "Creating Purchase Order",
          description: "Redirecting to purchase orders page.",
        });
        break;
      case 'add-user':
        toast({
          title: "Add User",
          description: "User management feature coming soon!",
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New purchase order created</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Inventory updated</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sales order delivered</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 hover:bg-gray-50"
                onClick={() => handleQuickAction('add-product')}
              >
                <Package className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Add Product</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 hover:bg-gray-50"
                onClick={() => handleQuickAction('create-sale')}
              >
                <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Create Sale</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 hover:bg-gray-50"
                onClick={() => handleQuickAction('purchase-order')}
              >
                <TrendingDown className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Purchase Order</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 hover:bg-gray-50"
                onClick={() => handleQuickAction('add-user')}
              >
                <Users className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Add User</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
