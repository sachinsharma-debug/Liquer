
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function Wastage() {
  const { toast } = useToast();
  const [wastageRecords, setWastageRecords] = useState([
    {
      id: 'WST001',
      date: '2024-01-19',
      type: 'Transit',
      product: 'Premium Wine XYZ',
      quantity: '3 bottles',
      reason: 'Breakage',
      status: 'Recorded'
    }
  ]);

  const handleRecordWastage = () => {
    const newWastage = {
      id: `WST${String(wastageRecords.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Storage',
      product: 'Wine Product ABC',
      quantity: `${Math.floor(Math.random() * 10) + 1} bottles`,
      reason: 'Expiry',
      status: 'Pending'
    };
    
    setWastageRecords([...wastageRecords, newWastage]);
    toast({
      title: "Wastage Recorded",
      description: `New wastage record ${newWastage.id} has been created successfully.`,
    });
  };

  const handleViewWastage = (wastageId: string) => {
    toast({
      title: "Viewing Wastage Record",
      description: `Opening details for wastage ${wastageId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Wastage Management</h1>
        <Button onClick={handleRecordWastage}>Record Wastage</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Wastage Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Record No.</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Reason</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wastageRecords.map((wastage) => (
                  <tr key={wastage.id} className="border-b">
                    <td className="p-2">{wastage.id}</td>
                    <td className="p-2">{wastage.date}</td>
                    <td className="p-2">{wastage.type}</td>
                    <td className="p-2">{wastage.product}</td>
                    <td className="p-2">{wastage.quantity}</td>
                    <td className="p-2">{wastage.reason}</td>
                    <td className="p-2"><Badge variant="secondary">{wastage.status}</Badge></td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewWastage(wastage.id)}
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
