
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function Returns() {
  const { toast } = useToast();
  const [returns, setReturns] = useState([
    {
      id: 'RET001',
      date: '2024-01-18',
      type: 'Purchase Return',
      vendorCustomer: 'Premium Wine Suppliers',
      items: 2,
      amount: '₹5,000',
      status: 'Pending'
    }
  ]);

  const handleCreateReturn = () => {
    const newReturn = {
      id: `RET${String(returns.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Sales Return',
      vendorCustomer: 'Customer Name',
      items: Math.floor(Math.random() * 5) + 1,
      amount: `₹${(Math.random() * 20000).toFixed(0)}`,
      status: 'Draft'
    };
    
    setReturns([...returns, newReturn]);
    toast({
      title: "Return Created",
      description: `New return ${newReturn.id} has been created successfully.`,
    });
  };

  const handleViewReturn = (returnId: string) => {
    toast({
      title: "Viewing Return",
      description: `Opening details for return ${returnId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Returns</h1>
        <Button onClick={handleCreateReturn}>Create Return</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Returns List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Return No.</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Vendor/Customer</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((returnItem) => (
                  <tr key={returnItem.id} className="border-b">
                    <td className="p-2">{returnItem.id}</td>
                    <td className="p-2">{returnItem.date}</td>
                    <td className="p-2">{returnItem.type}</td>
                    <td className="p-2">{returnItem.vendorCustomer}</td>
                    <td className="p-2">{returnItem.items}</td>
                    <td className="p-2">{returnItem.amount}</td>
                    <td className="p-2"><Badge variant="destructive">{returnItem.status}</Badge></td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReturn(returnItem.id)}
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
