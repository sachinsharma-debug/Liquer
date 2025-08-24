
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function DeliveryNotes() {
  const { toast } = useToast();
  const [deliveryNotes, setDeliveryNotes] = useState([
    {
      id: 'DN001',
      date: '2024-01-16',
      customer: 'ABC Wines & Spirits',
      soNumber: 'SO001',
      items: 12,
      status: 'Delivered'
    }
  ]);

  const handleCreateDeliveryNote = () => {
    const newDN = {
      id: `DN${String(deliveryNotes.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customer: 'New Customer',
      soNumber: `SO${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      items: Math.floor(Math.random() * 20) + 1,
      status: 'Pending'
    };
    
    setDeliveryNotes([...deliveryNotes, newDN]);
    toast({
      title: "Delivery Note Created",
      description: `New delivery note ${newDN.id} has been created successfully.`,
    });
  };

  const handleViewDeliveryNote = (dnId: string) => {
    toast({
      title: "Viewing Delivery Note",
      description: `Opening details for delivery note ${dnId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Notes</h1>
        <Button onClick={handleCreateDeliveryNote}>Create Delivery Note</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Delivery Notes List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">DN Number</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">SO Number</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveryNotes.map((dn) => (
                  <tr key={dn.id} className="border-b">
                    <td className="p-2">{dn.id}</td>
                    <td className="p-2">{dn.date}</td>
                    <td className="p-2">{dn.customer}</td>
                    <td className="p-2">{dn.soNumber}</td>
                    <td className="p-2">{dn.items}</td>
                    <td className="p-2"><Badge>{dn.status}</Badge></td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDeliveryNote(dn.id)}
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
