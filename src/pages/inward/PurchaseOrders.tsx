import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTrigger,
  DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose
} from '@/components/ui/dialog';
import Select from 'react-select';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select as RSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MasterGet } from "@/api/mastercontroller"
function logiccode(allparameter) {
  return {
  }
}








export default function PurchaseOrders() {
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [openMainDialog1, setOpenMainDialog1] = useState(false);
  const [openMainDialog2, setOpenMainDialog2] = useState(false);
  const [trackfromindent, settrackfromindent] = useState(false);

  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [VoucherType, setVouchertype] = useState([])
  const [VoucherTypeselect, setVouchertypeselect] = useState([])
  const [vendorlist, setvendorlist] = useState([])
  const [indentlist, setindentlist] = useState([])
  let [indentAdded, setindentAdded] = useState([])
  let [indentAddedselect, setindentAddedselect] = useState([])
  let [productlist, setproductlist] = useState([])
  let [ledgerlist, setledgerlist] = useState([])
  let [ledgerselected, setledgerselected] = useState([])


  let [formdata,setformdata]=useState({
  "vouchered":"",
  "purchaseOrderNo": "",
  "date": "",
  "partyAccountName": "",
  "trackFromIndent": "",
  "purchaseLedger": "",
  "orderNumber": "",
  "items": [
    { "name": "", "quantity": 10, "rate": 50, "amount": 500,
       "productdetails":[{"dueon":"","godown":"","quantity":"","rate":"","amount":""}] 
 },

  ]
}
)







  useEffect(() => {
    MasterGet("transactiontypes")
      .then((response) => {
        let tmpstore = []
        response.map((val) => {
          if (val.voucherType == "purchase-order") {
            tmpstore.push({ label: val.name, value: val._id })
          }
        })
        setVouchertype(tmpstore)
      })
      .catch(() => {

      })


    MasterGet("accountingledgers")
      .then((response) => {
        let tmpstore = []
        response.map((val) => {

          tmpstore.push({ label: val.name, value: val._id })

        })
        setledgerlist(tmpstore)
      })
      .catch(() => {

      })






    MasterGet("products")
      .then((response) => {
        let tmpstore = []
        response.map((val) => {

          tmpstore.push({ label: val.name, value: val._id })

        })
        setproductlist(tmpstore)
      })
      .catch(() => {

      })








    MasterGet("vendors")
      .then((response) => {
        let tmpstore = []
        response.map((vall) => {
          tmpstore.push({ value: vall._id, label: vall.name })
        })
        setvendorlist(tmpstore)
      })
      .catch(() => {

      })





    MasterGet("indents")
      .then((response) => {
        setindentlist(response)
      })
      .catch(() => {

      })

  }, [])




  function generatePONumber() {
    return "PO-" + Date.now();  // Example: PO-1693991875632
  }

  // console.log(generatePONumber());

  const funtypscript = (e) => {
    let wheree = {
      purchaseorderno: new RegExp(`${e.label}`, "i").toString(),
      hihi: "asdasddsasd"
    }
    console.log(new RegExp(`${e.label}`, "i"), e.label, wheree)


    MasterGet("purchaseorder?where=" + JSON.stringify(wheree) + "")
      .then((response) => {
        console.log(response)
      })
      .catch(() => {

      })

  }
  function dateconvertion(datein) {
    const today = new Date(datein); const formattedDate = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return formattedDate
  }

  const handleItemSelect = (value) => {
    setSelectedItem(value);
    setOpenItemDialog(true); // Open item dialog when value is selected
  };

  // console.log(indentAddedselect,openMainDialog2,">>>>>>>>>>",openMainDialog2==true)




  return (
    <div className="space-y-6">
      <style type='text/css'>
        {

          `
    
    .selectBox__control{
      width:250px;
    }
    
    `
        }
      </style>
      {/* Header and Purchase Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>


        <Dialog open={openMainDialog1} onOpenChange={setOpenMainDialog1}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenMainDialog1(true)}>Add Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className='d-flex justify-content-between'>
                <div>Voucher Type Alteration</div>
              </DialogTitle>
            </DialogHeader>
            <div className="grid   border-b border-t">
              <div className="flex items-center gap-2">
                <Label htmlFor="poNumber" className="text-xs w-45 ">Voucher type</Label>
               <Select options={VoucherType}
                       classNamePrefix='selectBox'
                       value={VoucherTypeselect}
                       onChange={(e)=>{


                        
                        formdata.vouchered=e.value
                        setVouchertypeselect(e)
                        funtypscript(e)

                       }}
               />
                         <Button type="submit" className=' ms-4  w-34 '   
                          onClick={(val)=>{
                            setOpenMainDialog(true)
                          }}
                         
                         >Add</Button>
              </div>
              <div className="flex items-center gap-2">
              </div>
            </div>


          </DialogContent>
        </Dialog>






        <Dialog open={openMainDialog2} onOpenChange={setOpenMainDialog2}>
          {/* <DialogTrigger asChild>
            <Button onClick={() => setOpenMainDialog1(true)}>Track Indent</Button>
          </DialogTrigger> */}
          <DialogContent className="sm:max-w-[800px] sm:max-h-[600px] overflow-auto ">
            <DialogHeader>
              <DialogTitle className='d-flex justify-content-between'>
                <div>Track From Indent</div>
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2" style={{ width: '10%' }}>Action</th>
                    <th className="text-left p-2">Indent Voucher No</th>
                    <th className="text-left p-2">SOF NO</th>
                    <th className="text-left p-2">SOF Date</th>
                    <th className="text-left p-2">Indent Date</th>
                  </tr>
                </thead>
                <tbody>
                  {indentlist.map((val, i) => <tr className="border-b">
                    <td className="p-2"><input type='checkbox' checked={indentAdded.includes(val._id)}
                      onClick={(e) => {
                        if (e.target.checked) {
                          if (!indentAdded.includes(val._id)) {
                            indentAddedselect.push(val)
                            indentAdded.push(val._id)
                            setindentAddedselect([...indentAddedselect])
                            setindentAdded([...indentAdded])
                          }

                        }
                        else {
                          indentAddedselect.splice(indentAdded.indexOf(val._id), 1)
                          indentAdded.push(val._id)
                          setindentAddedselect([...indentAddedselect])
                          indentAdded.splice(indentAdded.indexOf(val._id), 1)
                          setindentAdded([...indentlist])
                        }
                      }} /></td>
                    <td className="p-2">{val.indentvoucherno}</td>
                    <td className="p-2">{val.sofNo}</td>
                    <td className="p-2">{dateconvertion(val.sofDate)}</td>
                    <td className="p-2">{dateconvertion(val.indent_date)}</td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
        {/* Main Dialog for Creating PO */}
        <Dialog open={openMainDialog} onOpenChange={setOpenMainDialog}>
          {/* <DialogTrigger asChild>
            <Button onClick={() => setOpenMainDialog(true)}>Add Order</Button>
          </DialogTrigger> */}

          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle className='grid grid-cols-3 gap-4'>
                <div className='flex items-center gap-2'>
                  <div>Add Order</div>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="poNumber" className="text-xs w-32">Purchase Order No</Label>
                  <Input id="poNumber" className="h-6 text-xs flex-1" />
                </div>
                <div className='flex items-center gap-2'>
                  <Label htmlFor="poNumber" className="text-xs w-32">Date</Label>
                  <Input
                    type="text"
                    className="text-xs h-6 "
                    style={{ width: '105px'}}
                    value={'27-08-2025'}
                  />
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4 border-b border-t">
              <div className="flex items-center gap-2">

                <Label htmlFor="poNumber" className="text-xs w-32">Party A/C Name</Label>

                <Select
                  options={vendorlist}
                  className=' text-xs w-100 flex-1'
                />


              </div>

              <div className="flex items-center gap-2">
                <Label className="text-xs w-32">Track From Indent</Label>
                <RSelect onValueChange={(value) => {
                  if (value == "yes") {
                    settrackfromindent(true)
                    setOpenMainDialog2(true)
                  }
                  else {
                    settrackfromindent(false)
                    setOpenMainDialog2(false)

                  }
                }}>
                  <SelectTrigger className="h-6 text-xs flex-1">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </RSelect>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="vendor" className="text-xs w-32">Purchase Ledger</Label>

                <Select
                  options={ledgerlist}
                  value={ledgerselected}
                  onChange={(e) => {
                    setledgerselected(e)
                  }}
                  className=' text-xs w-100 flex-1'


                />

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
                <div className='col-1'>#</div>
                <div className='col-4'>Name Of Item</div>
                <div className='col-2'>Quantity</div>
                <div className='col-2'>Rate</div>
                <div className='col-2'>Amount</div>
              </div>
              {trackfromindent == true ? <div className='sm:max-h-[300px] overflow-auto'>
                {indentAddedselect.map((val, i) => val.data.map((val1, i1) =>
                  <div className='row mt-3'>
                    <div className='col-1'>
                      {((i * 10) + (i1 + 1))}
                    </div>
                    <div className='col-4'>
                      {productlist.filter((val) => val1.product_id == val._id)?.[0]?.name || ""}
                    </div>
                    <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={val1.indent_qty} />
                    </div>
                    <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={productlist.filter((val) => val1.product_id == val._id)?.[0]?.rate || ""} />
                    </div>
                    <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={productlist.filter((val) => val1.product_id == val._id)?.[0]?.volume || ""} />
                    </div>
                  </div>

                ))}
              </div> : <div className='row mt-3'>
                <div className='col-6'>
                  <RSelect onValueChange={handleItemSelect}>
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="royal-green">Royal Green Premium</SelectItem>
                      <SelectItem value="officer-choice">Officer's Choice Blue</SelectItem>
                    </SelectContent>
                  </RSelect>
                </div>
                <div className='col-2'>
                  <Input type='text' className='h-6 text-xs' />
                </div>
                <div className='col-2'>
                  <Input type='text' className='h-6 text-xs' />
                </div>
                <div className='col-2'>
                  <Input type='text' className='h-6 text-xs' />
                </div>
              </div>}

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
              <DialogTitle style={{ textTransform: 'uppercase' }}>{selectedItem}</DialogTitle>
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
                <Input type='text' className='h6 text-xs' style={{ height: 26 }} />
              </div>
              <div className='col-4'>
                <Input type='text' className='h6 text-xs' style={{ height: 26 }} />
              </div>
              <div className='col-2'>
                <Input type='text' className='text-xs h6' style={{ height: 26 }} />
              </div>
              <div className='col-2'>
                <Input type='text' className='text-xs h6' style={{ height: 26 }} />
              </div>
              <div className='col-2'>
                <Input type='text' className='text-xs h6' style={{ height: 26 }} />
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
                  <th className="text-left p-2" style={{ width: '60%' }}>Name Of Item</th>
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
