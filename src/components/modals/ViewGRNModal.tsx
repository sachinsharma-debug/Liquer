
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ViewGRNModalProps {
  isOpen: boolean;
  onClose: () => void;
  grnId: string;
}

export function ViewGRNModal({ isOpen, onClose, grnId }: ViewGRNModalProps) {
  // Mock GRN data
  const grnData = {
    id: grnId,
    date: '2024-01-16',
    poNumber: 'PO001',
    vendor: 'Premium Wine Suppliers',
    itemsReceived: '8/10',
    status: 'Partial',
    items: [
      { name: 'Cabernet Sauvignon 2020', ordered: 5, received: 5, unit: 'Bottles' },
      { name: 'Chardonnay 2021', ordered: 3, received: 3, unit: 'Bottles' },
      { name: 'Merlot 2019', ordered: 2, received: 0, unit: 'Bottles' }
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>GRN Details - {grnId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">GRN Number</label>
              <p className="text-sm font-semibold">{grnData.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date</label>
              <p className="text-sm">{grnData.date}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">PO Number</label>
              <p className="text-sm">{grnData.poNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Vendor</label>
              <p className="text-sm">{grnData.vendor}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Items Received</label>
              <p className="text-sm">{grnData.itemsReceived}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge>{grnData.status}</Badge>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Item Name</th>
                    <th className="text-left p-2">Ordered</th>
                    <th className="text-left p-2">Received</th>
                    <th className="text-left p-2">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {grnData.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.ordered}</td>
                      <td className="p-2">{item.received}</td>
                      <td className="p-2">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>Print GRN</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
