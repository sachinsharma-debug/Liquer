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
import { BASE_URL,getvoucherresult} from '@/api/BaseUrl';
import { useSelector, useDispatch } from 'react-redux'



function logiccode(allparameter) {
  return {
  }
}








export default function PurchaseReturn() {

  const[voucherresult,setvoucherresult]=useState("")
   const companyid = useSelector((state) => state?.Store.companyid)
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
  let [depotlist, setdepotlist] = useState([])

  let [ledgerlist, setledgerlist] = useState([])
  let [ledgerselected, setledgerselected] = useState([])
  let [itemind,setitemind]=useState(0)



  let [actionstate,setactionstate]=useState(false)
  let [updateid,setupdateid]=useState("")



  let [datalist,setdatalist]=useState([])


  async function getdata(){
MasterGet("purchasereturn")
      .then((response) => {
      
setdatalist(response)

      })
      .catch(() => {

      })
    
  }



let defaultdataitem= { "prodid": "", "quantity": "", "rate": "", "amount": "","originalinvoiceno":"","date":"",
       "productdetails":[{"trackingno":"","orderno":"","godown":"","quantity":"","rate":"","amount":""}
       ] 
 }
  let [formdata,setformdata]=useState({
  "vouchered":"",
  "debitnoteno": "",
  "date": "",
  "partyAccountName": "",
  "trackFromIndent": "",
  "purchaseLedger": "",
  "supplierinovoiceno": "",
  "items": [
  

  ]
}
)

formdata.debitnoteno=voucherresult

  useEffect(() => {
    MasterGet("transactiontypes")
      .then((response) => {
        let tmpstore = []
        response.map((val) => {
          if (val.voucherType == "debit-note") {
            tmpstore.push({ label: val.name, value: val._id })
          }
        })
        setVouchertype(tmpstore)
      })
      .catch(() => {

      })

getdata()
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
       MasterGet("depots")
      .then((response) => {
        let tmpstore = []
        response.map((val) => {
          tmpstore.push({ label: val.Name, value: val._id })

        })
        setdepotlist(tmpstore)
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

  }, [companyid])




  function generatePONumber() {
    return "PO-" + Date.now();  // Example: PO-1693991875632
  }

  // console.log(generatePONumber());

  const funtypscript = (e) => {
    let wheree = {
      debitnoteno: new RegExp(`${e.label}`, "i").toString(),
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

  const handleItemSelect = (value,i) => {
    formdata.items[i].prodid=value
    setitemind(i)
    setSelectedItem(productlist.filter((e)=>e.value==value)[0].label);
    setOpenItemDialog(true); // Open item dialog when value is selected
  };


const addpurchaseupdate=async()=>{
let response={}
let payload={
  tablename:"purchasereturn",
  data:{...formdata}
}
if(actionstate){
  response=await fetch(`${BASE_URL}update_master/${updateid}`,{
   method:"POST", 
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify(payload),
     credentials: "include",
  })
}
else{
response=await fetch(`${BASE_URL}create_master`,{
   method:"POST", 
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify(payload),  
        credentials: "include",
  
  })
}
response=await response.json()
setOpenMainDialog1(false)
setOpenMainDialog2(false)
setOpenMainDialog(false)
getdata()
}




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
        <h1 className="text-3xl font-bold text-gray-900">Purchase Returns</h1>


        <Dialog open={openMainDialog1} onOpenChange={setOpenMainDialog1}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenMainDialog1(true)}>Returns</Button>
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
                        getvoucherresult(e.value,"debitnoteno",setvoucherresult)
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






        
        {/* Main Dialog for Creating PO */}
        <Dialog open={openMainDialog} onOpenChange={setOpenMainDialog}>
          {/* <DialogTrigger asChild>
            <Button onClick={() => setOpenMainDialog(true)}>Add Order</Button>
          </DialogTrigger> */}

          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle className='grid grid-cols-4 gap-1 '>
                <div className='flex items-center gap-2'>
                  <div>Returns</div>
                  
                </div>
                                  <div className='flex items-center gap-2'>

                    <div>{VoucherTypeselect.label}</div>
                </div>
              
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4 pt-4  border-t">




                <div className="flex items-center gap-2">
               
                  <Label htmlFor="poNumber" className="text-xs w-32">Debit Note No</Label>
                  <Input id="poNumber" className="h-6 text-xs flex-1"  
                  
                  value={formdata.debitnoteno} 
                   onChange={(e)=>{
                     formdata.debitnoteno=e.target.value
                     setformdata({...formdata})
                   }}
                  
                  />
                </div>

                  {/* <div className="flex items-center gap-2">
                <Label htmlFor="amount" className="text-xs w-32" 
                >Supplier Invoice No</Label>
                <Input id="amount" type="number" className="h-6 text-xs flex-1" 
                  value={formdata.supplierinovoiceno} 
                      onChange={(e)=>{
                     formdata.supplierinovoiceno=e.target.value
                     setformdata({...formdata})
                   }}
                
                />
              </div> */}
 <div className="flex items-center gap-2">

                <Label htmlFor="poNumber" className="text-xs w-32">Party A/C Name</Label>

                <Select
                  options={vendorlist}
                  className=' text-xs w-100 flex-1'
                  value={vendorlist.filter((val1)=>val1.value==formdata.partyAccountName)}
                  onChange={(e)=>{
                   
                     formdata.partyAccountName=e.value
                     setformdata({...formdata})
                  
                  }}

                />


              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="vendor" className="text-xs w-32">Purchase Ledger</Label>

                <Select


                  options={ledgerlist}
                  value={ledgerselected}
                  onChange={(e) => {

                    formdata.purchaseLedger=e.value
                    setledgerselected(e)
                  }}
                  className=' text-xs w-100 flex-1'


                />

              </div>

                <div className='flex items-center gap-2'>
                  <Label htmlFor="poNumber" className="text-xs w-32">Date</Label>
                  <Input
                    type="date"
                    className="text-xs h-6 "
                    style={{ width: '155px'}}
                     value={formdata.date} 
                      onChange={(e)=>{
                     formdata.date=e.target.value
                     setformdata({...formdata})
                   }}
                  />
                </div>


           

            
              {/* Name Of Item dropdown that opens another modal on select */}
              {/* <div className="flex items-center gap-2">
                <Label className="text-xs w-32">Name Of Item</Label>
                
              </div> */}
            </div>
      



            <div className='container-fluid'>
              <div className='row border-b space-y-0 pb-3'>
                
                <div className='col-2'>Name Of Item</div>
                <div className='col-2'>Quantity</div>
                <div className='col-2'>Rate</div>
                <div className='col-2'>Amount</div>
                <div className='col-2'>Original <br/>Invoice no.</div>
                <div className='col-2'>Date</div>
              </div>
              {<div className='sm:max-h-[300px] overflow-auto'>
                { formdata.items.map((val1, i1) =><div className='row mt-3'>
                    
                    <div className='col-2'>
                      <RSelect       onValueChange={(e)=>handleItemSelect(e,i1)} value={val1.prodid}>
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {productlist.map((vall)=><SelectItem value={vall.value}>{vall.label}</SelectItem>)}
                    </SelectContent>
                  </RSelect>
                    </div>
                    <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={val1.quantity} onChange={((e)=>{
                         formdata.items[i1].quantity=e.target.value
                         setformdata({...formdata})
                      })} />
                    </div>
                    <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={val1.rate}
                      
                      
                      onChange={((e)=>{
                         formdata.items[i1].rate=e.target.value
                         setformdata({...formdata})
                      })}
                      />
                    </div>
                    <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={val1.amount} 
                      
                      onChange={((e)=>{
                         formdata.items[i1].amount=e.target.value
                         setformdata({...formdata})
                      })}
                      
                      
                      />
                    </div>


                     <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={val1.originalinvoiceno} 
                      
                      onChange={((e)=>{
                         formdata.items[i1].originalinvoiceno=e.target.value
                         setformdata({...formdata})
                      })}
        
                      />
                    </div>




                           <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={val1.date} 
                      
                      onChange={((e)=>{
                         formdata.items[i1].date=e.target.value
                         setformdata({...formdata})
                      })}
        
                      />
                    </div>

                  </div>)}
                  <>
                  <div className='d-flex flex-row mt-4 justifiy-content-end '>
                   <svg
                   style={{backgroundColor:"black",color:"white"}}
                    onClick={() => {
                      formdata.items.pop()
                      setformdata({...formdata})
                      
                    }}

                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi justifiy-content-end bi-dash-lg" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
                  </svg>
                  <svg

                   style={{backgroundColor:"black",color:"white"}}


                    onClick={() => {
                                           formdata.items.push(defaultdataitem)
                      setformdata({...formdata})

                    }}

                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    className="bi bi-plus ms-2 " viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                  </svg>
                  </div>
                  
                  </>
                  </div>

                  }

            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit"   onClick={()=>{
                addpurchaseupdate()
              }}>Add</Button>
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
                <div className='text-xs'>Tracking No</div>
              </div>
               <div className='col-2'>
                <div className='text-xs'>Order No</div>
              </div>
              <div className='col-2'>
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
{formdata.items[itemind]?.productdetails?.map((val1,i1)=><div className='row'>

  <div className='col-2'>
                   <Input type='text' className='text-xs h6' style={{ height: 26 }} 
                   
                   
                   value={val1.trackingno}
                   onChange={(e)=>{
                    formdata.items[itemind].productdetails[i1].trackingno=e.target.value
                    setformdata({...formdata})


                   }}


                   />
              </div>
              <div className='col-2'>
                   <Input type='text' className='text-xs h6' style={{ height: 26 }} 
                   
                   
                   value={val1.orderno}
                   onChange={(e)=>{
                    formdata.items[itemind].productdetails[i1].orderno=e.target.value
                    setformdata({...formdata})


                   }}


                   />
              </div>
              <div className='col-2'>
               <RSelect onValueChange={(e)=>{
                formdata.items[itemind].productdetails[i1].godown=e
                    setformdata({...formdata})
               }} value={val1.godown}
                
                >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {depotlist.map((vall)=><SelectItem value={vall.value}>{vall.label}</SelectItem>)}
                    </SelectContent>
                    </RSelect>
              </div>
              <div className='col-2'>
                <Input type='text' className='text-xs h6' style={{ height: 26 }}
                
                
                 value={val1.quantity}
                   onChange={(e)=>{
                    formdata.items[itemind].productdetails[i1].quantity=e.target.value
                    setformdata({...formdata})


                   }}
                
                />
              </div>
              <div className='col-2'>
                <Input type='text' className='text-xs h6' style={{ height: 26 }} 
                
                  value={val1.rate}
                   onChange={(e)=>{
                    formdata.items[itemind].productdetails[i1].rate=e.target.value
                    setformdata({...formdata})
                   }}
                
                />
              </div>
              <div className='col-2'>
                <Input type='text' className='text-xs h6' style={{ height: 26 }} 



                   value={val1.amount}
                   onChange={(e)=>{
                    formdata.items[itemind].productdetails[i1].amount=e.target.value
                    setformdata({...formdata})
                   }}
                
                
                
                
                />
              </div>
            </div>
)}

  <div className='d-flex flex-row mt-4 justifiy-content-end '>
                   <svg
                   style={{backgroundColor:"black",color:"white"}}
                    onClick={() => {
                      formdata.items[itemind].productdetails.pop()
                      setformdata({...formdata})
                    }}


                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi justifiy-content-end bi-dash-lg" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
                  </svg>
                  <svg


                   style={{backgroundColor:"black",color:"white"}}
                    onClick={() => {
                      formdata.items[itemind].productdetails.push({"trackingno":"","orderno":"","godown":"","quantity":"","rate":"","amount":""})
                      setformdata({...formdata})
                    }}

                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    className="bi bi-plus ms-2 " viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                  </svg>
                  </div>




            <DialogFooter>
             
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table showing the purchase list */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Returns List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                 
                  <th className="text-left p-2" >Debit Note No</th>
                  <th className="text-left p-2" >Name Of Item</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Rate</th>
                  <th className="text-left p-2">Amount</th>
                </tr>
              </thead>
              <tbody>

{datalist.map((vall)=>
                <tr className="border-b">
                  <td className="p-2">{vall.debitnoteno}</td>
                  <td className="p-2"></td>
                  <td className="p-2"></td>
                  <td className="p-2"></td>
                  <td className="p-2"></td>
                </tr>)
}




              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
