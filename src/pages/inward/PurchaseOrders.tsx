
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function PurchaseOrders() {
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 'PO001',
      date: '2024-01-15',
      vendor: 'Premium Wine Suppliers',
      items: 10,
      amount: '₹1,25,000',
      status: 'Open'
    },
    {
      id: 'PO002',
      date: '2024-01-12',
      vendor: 'Elite Spirits Ltd',
      items: 8,
      amount: '₹89,500',
      status: 'Delivered'
    }
  ]);

  const handleCreatePO = () => {
    const newPO = {
      id: `PO${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      vendor: 'New Vendor',
      items: Math.floor(Math.random() * 20) + 1,
      amount: `₹${(Math.random() * 200000).toFixed(0)}`,
      status: 'Draft'
    };
    
    setPurchaseOrders([...purchaseOrders, newPO]);
    toast({
      title: "Purchase Order Created",
      description: `New purchase order ${newPO.id} has been created successfully.`,
    });
  };

  const handleViewPO = (poId: string) => {
    toast({
      title: "Viewing Purchase Order",
      description: `Opening details for purchase order ${poId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
        <Button onClick={handleCreatePO}>Create PO</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">PO Number</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Vendor</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Total Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="border-b">
                    <td className="p-2">{po.id}</td>
                    <td className="p-2">{po.date}</td>
                    <td className="p-2">{po.vendor}</td>
                    <td className="p-2">{po.items}</td>
                    <td className="p-2">{po.amount}</td>
                    <td className="p-2"><Badge>{po.status}</Badge></td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPO(po.id)}
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
