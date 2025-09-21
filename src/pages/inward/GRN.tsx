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
import { BASE_URL } from '@/api/BaseUrl';
import { useSelector, useDispatch } from 'react-redux'
import * as XLSX from 'xlsx';



function logiccode(allparameter) {
  return {
  }
}








export default function GRNComponent() {
  const companyid = useSelector((state) => state?.Store.companyid)
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [openMainDialog1, setOpenMainDialog1] = useState(false);
  const [openMainDialog2, setOpenMainDialog2] = useState(false);



  const [openMainDialog3, setOpenMainDialog3] = useState(false);
  const [openMainDialog4, setOpenMainDialog4] = useState(false);








  const [trackfromindent, settrackfromindent] = useState(false);

  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [VoucherType, setVouchertype] = useState([])
  const [VoucherTypeselect, setVouchertypeselect] = useState([])
  const [vendorlist, setvendorlist] = useState([])
  const [indentlist, setindentlist] = useState([])
  const [purchaseorderlist, setpurchaseorderlist] = useState({})
  let [indentAdded, setindentAdded] = useState([])
  let [indentAddedselect, setindentAddedselect] = useState([])
  let [productlist, setproductlist] = useState([])
  let [depotlist, setdepotlist] = useState([])

  let [ledgerlist, setledgerlist] = useState([])
  let [ledgerselected, setledgerselected] = useState([])
  let [itemind,setitemind]=useState(0)



  let [actionstate,setactionstate]=useState(false)
  let [updateid,setupdateid]=useState("")

  let [grnsdata,setgrnsdata]=useState([])
 













let defaultdataitem= { "prodid": "", "quantity": "", "rate": "", "amount": "", "orderno": "", "godownwastge": "",
       "productdetails":[{"trackingno":"","orderno":"","godown":"","quantity":"","rate":"","amount":"","godownwastge":""}
       ] 
 }
  let [formdata,setformdata]=useState({
  "vouchered":"",
  "recieptno": "",
  "orderno": [],


  "date": "",
  "partyAccountName": "",
  "trackFromIndent": "",
  "purchaseLedger": "",
  "referenceno": "",
  "items": [

  ]
}
)


async function getgrns(){        
  
  
  
  MasterGet("grns")
      .then((response) => {
      setgrnsdata(response)
       
      })
      .catch(() => {

      })




}




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


getgrns()

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


        console.log(response,">>>>>>")



        let tmpstore = []
        response.map((val) => {
          tmpstore.push({ label: val.name, value: val._id ,val:val})

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




         MasterGet("purchaseorder")
      .then((response) => {
    let tmpstore={

    }
    response.map((vall)=>{
      if(!Array.isArray(tmpstore[vall.partyAccountName])){
        tmpstore[vall.partyAccountName]=[]
      }
      tmpstore[vall.partyAccountName].push(vall)
             
    })
           setpurchaseorderlist(tmpstore)
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
      recieptno: new RegExp(`${e.label}`, "i").toString(),
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
  tablename:"grns",
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
getgrns()

}


function reset(){

setformdata({
  "vouchered":"",
  "recieptno": "",
  "orderno": [],


  "date": "",
  "partyAccountName": "",
  "trackFromIndent": "",
  "purchaseLedger": "",
  "referenceno": "",
  "items": [

  ]
})



}


  const [excelviewerbox, Excelfileviewer] = useState(false);
  const [showtabledata, setshowtabledata] = useState({ data: [], showtab: [] })
   

  const [error, setError] = useState(null);
  const [errorfile, seterrorfile] = useState("");

  const [fileobj, setfileobj] = useState({})






const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    seterrorfile("")
    const file = e.target.files?.[0];
    setfileobj(file)
  };

 function takeinput(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId); // Clear the previous timer
      timeoutId = setTimeout(() => {
        func.apply(this, args); // Call function with correct context and arguments
      }, delay);
    };
  }
  function excelDateToJSDate(serial) {
    const excelEpoch = new Date(1899, 11, 30); // Excel's day 0
    const jsDate = new Date(excelEpoch.getTime() + serial * 86400000); // 86400000 ms/day
    return jsDate.toISOString().split('T')[0];
  }


 // Example:
  function handleSearch(e) {
    let namesearch = e.target.value
    const reader = new FileReader();

    reader.onload = async (e) => {

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      let checktmp = workbook.SheetNames.filter((val) => val == namesearch)

      if (checktmp.length > 0) {
        seterrorfile("")
        const worksheet = workbook.Sheets[checktmp[0]];
        let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
        console.log(jsonData)

        // let datafil = []
        // let checkitme = []
        // let storetmp = []
        // let tmpind = 0


        //   let depotname=[...depot.map((val,i)=>val.Name)]
        //   let depotnameid=[...depot.map((val,i)=>val._id)]

        //   let productname=[...product.map((val,i)=>val.name)]
        //   let productnameid=[...product.map((val,i)=>val._id)]


        // const mappedData = jsonData.map((item) => {
        //   if (!checkitme.includes(item["SOF NO"])) {
        //     checkitme.push(item["SOF NO"])
        //     // datafil[item["SOF NO"]] = []
        //     let date = excelDateToJSDate(item["SOF DATE"]);
        //     datafil.push({
        //       sofNo: item["SOF NO"], sofDate: date, data: [],
        //       narration: "",
        //       indentvoucherno: generatePONumber(),
        //       status: 'draft',
        //       transuctiontype:transuctiontype.value,
        //       indent_date: new Date().toISOString().split('T')[0]

        //     })
        //     jsonData.map((item2) => {
        //       if (item2["SOF NO"] == item["SOF NO"]) {
        //         let valll = Object.values(item2)
        //         date = excelDateToJSDate(valll[1]);
        //         storetmp.push({
        //           soft_date: date, depot_id: valll[0].trim(),
        //           product_id: valll[3].trim(), pack_size: valll[4], indent_qty: valll[5],
        //           sof_no___: valll[2]
        //         })
        //         datafil[tmpind].data.push({
        //           depot_id: depotname.indexOf(valll[0].trim())!=-1?depotnameid[depotname.indexOf(valll[0].trim())]:"",
        //           product_id:productname.indexOf(valll[3].trim())!=-1? productnameid[productname.indexOf(valll[3].trim())]:"", pack_size: valll[4], indent_qty: valll[5],
        //           uom1: "",
        //           indent_qty2: ""
        //           , uom2: ""

        //         })
        //       }
        //     })
        //     tmpind++
        //   }
        // })
        // setshowtabledata({ data: datafil, showtab: storetmp })


      }
      else {
        seterrorfile("invalide sheet name")
      }


    };

    reader.readAsArrayBuffer(fileobj);


  }
  let takeinputfrom = takeinput(handleSearch, 500)

 async function uploadexcel() {
if(errorfile!=""){
  return 
}
    const response = await fetch(
      BASE_URL + 'import_indents_excel',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer `,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ indents: showtabledata.data }),
           credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Import failed');
    }

    toast({
      title: "Import Successful",
      description: ` indents imported successfully`,
    });



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

 <Dialog open={openMainDialog4} onOpenChange={setOpenMainDialog4}>
            <DialogContent style={{ display: 'block' }}>
              <DialogHeader>
                <DialogTitle>Import</DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-2 mt-3">
                <Label htmlFor="myfile" className='text-xs w-40 text-start'>Select a file:</Label>
                <input className='text-xs ' type="file" id="myfile" name="myfile" onChange={handleImportExcel} />
                {/* <Input type="submit" /> */}
              </div>


              <div className="flex items-center gap-2 mt-3">
                <Label htmlFor="minStockLevel" className="text-xs w-40 text-start">
                  Worksheet Name :
                </Label>
                <Input
                  id="minStockLevel"
                  type="text"
                  min="0"
                  className="h-6 text-xs flex-1"
                  onInput={takeinputfrom}
                />
                <span className=' text-danger '>{errorfile}</span>
              </div>


              

    <div className="flex items-center gap-2 mt-3">
                <Label htmlFor="standardRate" className="text-xs w-60">
                  Transuction Type:
                </Label>
                    <Select options={VoucherType}
                       classNamePrefix='selectBox'
                       value={VoucherTypeselect}
                       onChange={(e)=>{
                        formdata.vouchered=e.value
                        setVouchertypeselect(e)
                           funtypscript(e)
                       }}
               />

              </div>






              <div className="flex items-center gap-2 mt-3">
                <Label htmlFor="standardRate" className="text-xs w-60">
                  Preview Import Summary :
                </Label>
                <RSelect onValueChange={(value) => {
                  if (value == "yes") {
                    Excelfileviewer(true)
                  }
                  else {
                    Excelfileviewer(false)
                  }



                }}>
                  <SelectTrigger className="h-6 text-xs ">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </RSelect>
              </div>



       
              <div className="flex items-center gap-2 mt-3">
                <Button onClick={() => {
                  uploadexcel()
                }} >
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>



  <Dialog open={openMainDialog3} onOpenChange={setOpenMainDialog3}>
          {/* <DialogTrigger asChild>
            <Button onClick={() => setOpenMainDialog1(true)}>Track Indent</Button>
          </DialogTrigger> */}
          <DialogContent className="sm:max-w-[800px] sm:max-h-[600px] overflow-auto ">
            <DialogHeader>
              <DialogTitle className='d-flex justify-content-between'>
                <div>Order no</div>
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2" style={{ width: '10%' }}>Action</th>
                    <th className="text-left p-2">Purchase Order No</th>
                    <th className="text-left p-2">Order Number</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseorderlist[formdata.partyAccountName]?.map((val, i) => <tr className="border-b">
                    <td className="p-2"><input type='checkbox' checked={formdata.orderno.includes(val.orderNumber)}
                      onClick={(e) => {
                        if (e?.target?.checked) {
                          if (!formdata.orderno.includes(val.orderNumber)) {
                              formdata.orderno.push(val.orderNumber)
                                                      
                          }

                        }
                        else {
                           formdata.orderno.splice(formdata.orderno.indexOf(val.orderNumber),1)


                         
                        }



                         setformdata({...formdata})




                      }} /></td>
                    <td className="p-2">{val.purchaseOrderNo}</td>
                    <td className="p-2">{val.orderNumber}</td>
                    <td className="p-2">{dateconvertion(val.date)}</td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>








      {/* Header and Purchase Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Goods Receipt Notes (GRN)</h1>
        <button type="button" className="btn-primary justify-between items-end btn" onClick={() => setOpenMainDialog4(true)}>Import</button>







        <Dialog open={openMainDialog1} onOpenChange={setOpenMainDialog1}>
          <DialogTrigger asChild>
            
            <Button onClick={() => { 
            reset()
              setOpenMainDialog1(true)
            
            }}>Add GRN</Button>
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






        
        {/* Main Dialog for Creating PO */}
        <Dialog open={openMainDialog} onOpenChange={setOpenMainDialog}>
          {/* <DialogTrigger asChild>
            <Button onClick={() => setOpenMainDialog(true)}>Add Order</Button>
          </DialogTrigger> */}

          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle className='grid grid-cols-4 gap-1 '>
                <div className='flex items-center gap-2'>
                  <div>Add GRN</div>
                  
                </div>
                   <div className='flex items-center gap-2'>
                    <div>{VoucherTypeselect.label}</div>
                </div>
              
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4 pt-4  border-t">
                <div className="flex items-center gap-2">
                  <Label htmlFor="poNumber" className="text-xs w-32">Reciept Note No</Label>
                  <Input id="poNumber" className="h-6 text-xs flex-1"  
                  value={formdata.recieptno} 
                   onChange={(e)=>{
                     formdata.recieptno=e.target.value
                     setformdata({...formdata})
                   }}
                  />
                </div>
                  <div className="flex items-center gap-2">
                <Label htmlFor="amount" className="text-xs w-32" 
                >Reference No</Label>
                <Input id="amount" type="number" className="h-6 text-xs flex-1" 
                  value={formdata.referenceno} 
                      onChange={(e)=>{
                     formdata.referenceno=e.target.value
                     setformdata({...formdata})
                   }}
                
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
       <div className="grid grid-cols-2 gap-4  ">
           <div className="flex items-center gap-2">

                <Label htmlFor="poNumber" className="text-xs w-32">Party A/C Name</Label>

                <Select
                  options={vendorlist}
                  className=' text-xs w-100 flex-1'
                  value={vendorlist.filter((val1)=>val1.value==formdata.partyAccountName)}
                  onChange={(e)=>{
                     formdata.partyAccountName=e.value
                    setOpenMainDialog3(true) 
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


               {/* <div className='flex items-center gap-2'>
                  <Label htmlFor="poNumber" className="text-xs w-32">Order no.</Label>
                  <Input
                    type="text"
                    className="text-xs h-6 "
                    style={{ width: '155px'}}
                     value={formdata.orderno} 
                      onChange={(e)=>{
                     formdata.orderno=e.target.value
                     setformdata({...formdata})
                   }}
                  />
                </div> */}
       </div>



            <div className='container-fluid'>
              <div className='row border-b space-y-0 pb-3'>
                <div className='col-2'>Name Of Item</div>
                <div className='col-2'>Quantity</div>
                <div className='col-2'>Rate</div>
                <div className='col-2'>Amount</div>
                  <div className='col-2'>Order no</div>
                    <div className='col-2'>Godown Wastage</div>
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
                      <Input type='text' className='h-6 text-xs' value={val1.orderno} 
                      
                      onChange={((e)=>{
                         formdata.items[i1].orderno=e.target.value
                         setformdata({...formdata})
                      })}
                      
                      
                      />
                    </div>




                    <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={val1.godownwastage} 
                      onChange={((e)=>{
                         formdata.items[i1].godownwastage=e.target.value
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
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle style={{ textTransform: 'uppercase' }}>{selectedItem}</DialogTitle>
            </DialogHeader>

            <div className='row border-t border-b py-2'>
              <div className='col-1'>
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
              <div className='col-1'>
                <div className='text-xs'>Godown Wastage</div>
              </div>
            </div>
{formdata.items[itemind]?.productdetails?.map((val1,i1)=><div className='row'>

  <div className='col-1'>
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




              <div className='col-1'>
                <Input type='text' className='text-xs h6' style={{ height: 26 }} 



                   value={val1.godownwastge}
                   onChange={(e)=>{
                    formdata.items[itemind].productdetails[i1].godownwastge=e.target.value
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
          <CardTitle>GRN List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                   <th className="text-left p-2" style={{ width: '60%' }}>Reciept Note No</th>
                  <th className="text-left p-2" style={{ width: '60%' }}>Name Of Item</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Rate</th>
                  <th className="text-left p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {grnsdata.map((val)=>
                <tr className="border-b">
                   <td className="p-2">{val.recieptno}</td>
                  <td className="p-2">Royal sadsadGreen Premium</td>
                  <td className="p-2">10</td>
                  <td className="p-2">₹1,000</td>
                  <td className="p-2">₹10,000</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
