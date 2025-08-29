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

export default function StockAdjustment() {
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  

  return (
    <div className="space-y-6">
      {/* Header and Purchase Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Stock Adjustment</h1>

        {/* Main Dialog for Creating PO */}
        <Dialog open={openMainDialog} onOpenChange={setOpenMainDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenMainDialog(true)}>Add Stock Adjustment</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle className='d-flex justify-content-between'>
                <div>Add Stock Adjustment</div>
                <div>
                  <Input
                    type="text"
                    className="text-xs h-6 "
                    style={{ width:'105px',marginRight:10}}
                    value={'27-08-2025'}
                  />
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4 py-4 border-b border-t">
              <div className="flex items-center gap-2">
                <Label htmlFor="poNumber" className="text-xs w-32">Stock Adjustment No</Label>
                <Input id="poNumber" className="h-6 text-xs flex-1" />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="poNumber" className="text-xs w-32">Branch Name</Label>
                <Input id="poNumber" className="h-6 text-xs flex-1" />
              </div>
            </div>
            <div className='container-fluid'>
              <div className='row border-b space-y-0 pb-3'>
                <div className='col-6'>Name Of Item</div>
                <div className='col-2'>Godown</div>
                <div className='col-2'>Quantity</div>
                <div className='col-2'>Amount</div>
              </div>
              <div className='row mt-3'>
                <div className='col-6'>
                  <Select >
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

      </div>

      {/* Table showing the purchase list */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Adjustment List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2" style={{ width: '60%'}}>Name Of Item</th>
                  <th className="text-left p-2">Godown</th>
                  <th className="text-left p-2">Quantity</th>
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
