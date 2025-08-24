
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function StockAdjustment() {
  const { toast } = useToast();
  const [adjustments, setAdjustments] = useState([
    {
      id: 'ADJ001',
      date: '2024-01-21',
      product: 'Wine Brand ABC',
      adjustmentType: 'Increase',
      quantity: '+10',
      reason: 'Physical Count',
      status: 'Approved'
    }
  ]);

  const handleCreateAdjustment = () => {
    const adjustmentTypes = ['Increase', 'Decrease'];
    const selectedType = adjustmentTypes[Math.floor(Math.random() * adjustmentTypes.length)];
    const newAdjustment = {
      id: `ADJ${String(adjustments.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      product: 'New Product',
      adjustmentType: selectedType,
      quantity: `${selectedType === 'Increase' ? '+' : '-'}${Math.floor(Math.random() * 20) + 1}`,
      reason: 'System Correction',
      status: 'Pending'
    };
    
    setAdjustments([...adjustments, newAdjustment]);
    toast({
      title: "Adjustment Created",
      description: `New stock adjustment ${newAdjustment.id} has been created successfully.`,
    });
  };

  const handleViewAdjustment = (adjustmentId: string) => {
    toast({
      title: "Viewing Adjustment",
      description: `Opening details for adjustment ${adjustmentId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Stock Adjustment</h1>
        <Button onClick={handleCreateAdjustment}>Create Adjustment</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Adjustment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Adjustment No.</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Adjustment Type</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Reason</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="border-b">
                    <td className="p-2">{adjustment.id}</td>
                    <td className="p-2">{adjustment.date}</td>
                    <td className="p-2">{adjustment.product}</td>
                    <td className="p-2">{adjustment.adjustmentType}</td>
                    <td className="p-2">{adjustment.quantity}</td>
                    <td className="p-2">{adjustment.reason}</td>
                    <td className="p-2"><Badge>{adjustment.status}</Badge></td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewAdjustment(adjustment.id)}
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
