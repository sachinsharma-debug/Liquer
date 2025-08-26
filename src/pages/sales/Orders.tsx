
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SalesOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([
    {
      id: 'SO001',
      date: '2024-01-15',
      customer: 'ABC Wines & Spirits',
      items: 12,
      amount: '₹45,000',
      status: 'Confirmed'
    }
  ]);

  const handleCreateOrder = () => {
    const newOrder = {
      id: `SO${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customer: 'New Customer',
      items: Math.floor(Math.random() * 20) + 1,
      amount: `₹${(Math.random() * 100000).toFixed(0)}`,
      status: 'Draft'
    };
    
    setOrders([...orders, newOrder]);
    toast({
      title: "Sales Order Created",
      description: `New sales order ${newOrder.id} has been created successfully.`,
    });
  };

  const handleViewOrder = (orderId: string) => {
    toast({
      title: "Viewing Order",
      description: `Opening details for order ${orderId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleCreateOrder}>Create Sales Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sales Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Input id="customer" placeholder="Enter customer name" />
              </div>
              <div>
                <Label htmlFor="items">Number of Items</Label>
                <Input id="items" type="number" placeholder="Enter number of items" />
              </div>
              <div>
                <Label htmlFor="amount">Total Amount</Label>
                <Input id="amount" placeholder="Enter total amount" />
              </div>
              <Button onClick={handleCreateOrder} className="w-full">Create Order</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">SO Number</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Total Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.date}</td>
                    <td className="p-2">{order.customer}</td>
                    <td className="p-2">{order.items}</td>
                    <td className="p-2">{order.amount}</td>
                    <td className="p-2"><Badge variant="secondary">{order.status}</Badge></td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
