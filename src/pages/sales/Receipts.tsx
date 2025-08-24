
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function Receipts() {
  const { toast } = useToast();
  const [receipts, setReceipts] = useState([
    {
      id: 'RCP001',
      date: '2024-01-22',
      customer: 'ABC Wines & Spirits',
      invoiceNumber: 'INV001',
      amount: '₹45,000',
      paymentMode: 'Bank Transfer'
    }
  ]);

  const handleRecordReceipt = () => {
    const newReceipt = {
      id: `RCP${String(receipts.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customer: 'New Customer',
      invoiceNumber: `INV${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      amount: `₹${(Math.random() * 100000).toFixed(0)}`,
      paymentMode: 'Cash'
    };
    
    setReceipts([...receipts, newReceipt]);
    toast({
      title: "Receipt Recorded",
      description: `New receipt ${newReceipt.id} has been recorded successfully.`,
    });
  };

  const handleViewReceipt = (receiptId: string) => {
    toast({
      title: "Viewing Receipt",
      description: `Opening details for receipt ${receiptId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payment Receipts</h1>
        <Button onClick={handleRecordReceipt}>Record Receipt</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Receipts List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Receipt No.</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Invoice No.</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Payment Mode</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b">
                    <td className="p-2">{receipt.id}</td>
                    <td className="p-2">{receipt.date}</td>
                    <td className="p-2">{receipt.customer}</td>
                    <td className="p-2">{receipt.invoiceNumber}</td>
                    <td className="p-2">{receipt.amount}</td>
                    <td className="p-2"><Badge>{receipt.paymentMode}</Badge></td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReceipt(receipt.id)}
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
