
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function Invoices() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState([
    {
      id: 'INV001',
      date: '2024-01-17',
      customer: 'ABC Wines & Spirits',
      dnNumber: 'DN001',
      amount: '₹45,000',
      status: 'Pending'
    }
  ]);

  const handleCreateInvoice = () => {
    const newInvoice = {
      id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customer: 'New Customer',
      dnNumber: `DN${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      amount: `₹${(Math.random() * 100000).toFixed(0)}`,
      status: 'Draft'
    };
    
    setInvoices([...invoices, newInvoice]);
    toast({
      title: "Invoice Created",
      description: `New invoice ${newInvoice.id} has been created successfully.`,
    });
  };

  const handleViewInvoice = (invoiceId: string) => {
    toast({
      title: "Viewing Invoice",
      description: `Opening details for invoice ${invoiceId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Sales Invoices</h1>
        <Button onClick={handleCreateInvoice}>Create Invoice</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoices List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Invoice No.</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">DN Number</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Payment Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="p-2">{invoice.id}</td>
                    <td className="p-2">{invoice.date}</td>
                    <td className="p-2">{invoice.customer}</td>
                    <td className="p-2">{invoice.dnNumber}</td>
                    <td className="p-2">{invoice.amount}</td>
                    <td className="p-2"><Badge variant="secondary">{invoice.status}</Badge></td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewInvoice(invoice.id)}
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
