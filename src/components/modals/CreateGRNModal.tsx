
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CreateGRNModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (grn: any) => void;
}

export function CreateGRNModal({ isOpen, onClose, onSubmit }: CreateGRNModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    poNumber: '',
    vendor: '',
    deliveryDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGRN = {
      id: `GRN${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      poNumber: formData.poNumber,
      vendor: formData.vendor,
      itemsReceived: `${Math.floor(Math.random() * 10) + 1}/${Math.floor(Math.random() * 15) + 10}`,
      status: 'Pending'
    };
    
    onSubmit(newGRN);
    toast({
      title: "GRN Created",
      description: `New GRN ${newGRN.id} has been created successfully.`,
    });
    setFormData({ poNumber: '', vendor: '', deliveryDate: '', notes: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New GRN</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="poNumber">PO Number</Label>
            <Input
              id="poNumber"
              value={formData.poNumber}
              onChange={(e) => setFormData({...formData, poNumber: e.target.value})}
              placeholder="Enter PO Number"
              required
            />
          </div>
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Input
              id="vendor"
              value={formData.vendor}
              onChange={(e) => setFormData({...formData, vendor: e.target.value})}
              placeholder="Enter Vendor Name"
              required
            />
          </div>
          <div>
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Optional notes"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create GRN</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
