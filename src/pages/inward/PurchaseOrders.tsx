import React, { useState } from 'react';
import { Dialog, DialogTrigger,
  DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PurchaseOrders() {
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const handleItemSelect = (value) => {
    setSelectedItem(value);
    setOpenItemDialog(true); // Open item dialog when value is selected
  };

  return (
    <div className="space-y-6">
      {/* Header and Purchase Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>

        {/* Main Dialog for Creating PO */}
        <Dialog open={openMainDialog} onOpenChange={setOpenMainDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenMainDialog(true)}>Add Order</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle className='d-flex justify-content-between'>
                <div>Add Order</div>
                <div>
                  <Input
                    type="text"
                    className="text-xs h-6 "
                    style={{ width:'105px',marginRight:10}}
                    value={'27-08-2025'}
                    disabled
                  />
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4 py-4 border-b border-t">
              <div className="flex items-center gap-2">
                <Label htmlFor="poNumber" className="text-xs w-32">Purchase Order No</Label>
                <Input id="poNumber" className="h-6 text-xs flex-1" />
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="date" className="text-xs w-32">Date</Label>
                <Input type="date" id="date" className="h-6 text-xs flex-1" style={{ width: 100, display:'block' }} />
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="poNumber" className="text-xs w-32">Party A/C Name</Label>
                <Input id="poNumber" className="h-6 text-xs flex-1" />
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-xs w-32">Track From Indent</Label>
                <Select>
                  <SelectTrigger className="h-6 text-xs flex-1">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="vendor" className="text-xs w-32">Purchase Ledger</Label>
                <Input id="vendor" className="h-6 text-xs flex-1" />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="amount" className="text-xs w-32">Order Number</Label>
                <Input id="amount" type="number" className="h-6 text-xs flex-1" />
              </div>

              {/* Name Of Item dropdown that opens another modal on select */}
              {/* <div className="flex items-center gap-2">
                <Label className="text-xs w-32">Name Of Item</Label>
                
              </div> */}
            </div>
            <div className='container-fluid'>
              <div className='row border-b space-y-0 pb-3'>
                <div className='col-6'>Name Of Item</div>
                <div className='col-2'>Quantity</div>
                <div className='col-2'>Rate</div>
                <div className='col-2'>Amount</div>
              </div>
              <div className='row mt-3'>
                <div className='col-6'>
                  <Select onValueChange={handleItemSelect}>
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="royal-green">Royal Green Premium</SelectItem>
                      <SelectItem value="officer-choice">Officer's Choice Blue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='col-2'>
                  <Input type='text' className='h-6 text-xs'/>
                </div>
                <div className='col-2'>
                  <Input type='text' className='h-6 text-xs'/>
                </div>
                <div className='col-2'>
                  <Input type='text' className='h-6 text-xs'/>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Secondary Dialog for Item Details */}
        <Dialog open={openItemDialog} onOpenChange={setOpenItemDialog}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle style={{textTransform:'uppercase'}}>{selectedItem}</DialogTitle>
            </DialogHeader>

            <div className='row border-t border-b py-2'>
              <div className='col-2'>
                <div className='text-xs'>Due On</div>
              </div>
              <div className='col-4'>
                <div className='text-xs'>Godown</div>
              </div>
              <div className='col-2'>
                <div className='text-xs'>Quantity</div>
              </div>
              <div className='col-2'>
                <div className='text-xs'>Rate</div>
              </div>
              <div className='col-2'>
                <div className='text-xs'>Amount</div>
              </div>
            </div>

            <div className='row'>
              <div className='col-2'>
                <Input type='text' className='h6 text-xs' style={{height:26}}/>
              </div>
              <div className='col-4'>
                <Input type='text' className='h6 text-xs' style={{height:26}}/>
              </div>
              <div className='col-2'>
                <Input type='text' className='text-xs h6' style={{height:26}}/>
              </div>
              <div className='col-2'>
                <Input type='text' className='text-xs h6' style={{height:26}}/>
              </div>
              <div className='col-2'>
                <Input type='text' className='text-xs h6' style={{height:26}}/>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setOpenItemDialog(false)}>Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table showing the purchase list */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2" style={{ width: '60%'}}>Name Of Item</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Rate</th>
                  <th className="text-left p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Royal Green Premium</td>
                  <td className="p-2">10</td>
                  <td className="p-2">₹1,000</td>
                  <td className="p-2">₹10,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
