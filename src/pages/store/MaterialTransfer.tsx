
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function MaterialTransfer() {
  const { toast } = useToast();
  const [transfers, setTransfers] = useState([
    {
      id: 'MT001',
      date: '2024-01-20',
      fromLocation: 'Main Warehouse',
      toLocation: 'Retail Store A',
      items: 15,
      status: 'In Transit'
    }
  ]);

  const handleCreateTransfer = () => {
    const newTransfer = {
      id: `MT${String(transfers.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      fromLocation: 'Warehouse B',
      toLocation: 'Store C',
      items: Math.floor(Math.random() * 25) + 1,
      status: 'Pending'
    };
    
    setTransfers([...transfers, newTransfer]);
    toast({
      title: "Transfer Created",
      description: `New material transfer ${newTransfer.id} has been created successfully.`,
    });
  };

  const handleViewTransfer = (transferId: string) => {
    toast({
      title: "Viewing Transfer",
      description: `Opening details for transfer ${transferId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Material Transfer</h1>
        <Button onClick={handleCreateTransfer}>Create Transfer</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transfer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Transfer No.</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">From Location</th>
                  <th className="text-left p-2">To Location</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="border-b">
                    <td className="p-2">{transfer.id}</td>
                    <td className="p-2">{transfer.date}</td>
                    <td className="p-2">{transfer.fromLocation}</td>
                    <td className="p-2">{transfer.toLocation}</td>
                    <td className="p-2">{transfer.items}</td>
                    <td className="p-2"><Badge>{transfer.status}</Badge></td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewTransfer(transfer.id)}
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
