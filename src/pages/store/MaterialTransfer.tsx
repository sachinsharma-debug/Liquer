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
import { BASE_URL,getvoucherresult } from '@/api/BaseUrl';
import { useSelector, useDispatch } from 'react-redux'
import * as XLSX from 'xlsx';
import { Receipt } from 'lucide-react';



function logiccode(allparameter) {
  return {
  }
}








export default function MaterialComponent() {
  const companyid = useSelector((state) => state?.Store.companyid)
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [openMainDialog1, setOpenMainDialog1] = useState(false);
  const [openMainDialog2, setOpenMainDialog2] = useState(false);
  const[voucherresult,setvoucherresult]=useState("")


  const [openMainDialog3, setOpenMainDialog3] = useState(false);
  const [openMainDialog4, setOpenMainDialog4] = useState(false);





  const [depot,setdepots]=useState([])
  const [product,setproduct]=useState([])





  const [trackfromindent, settrackfromindent] = useState(false);

  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [VoucherType, setVouchertype] = useState([])
  const [VoucherTypeselect, setVouchertypeselect] = useState([])
  const [VoucherTypeselect1, setVouchertypeselect1] = useState([])

  const [vendorlist, setvendorlist] = useState([])
  const [indentlist, setindentlist] = useState([])
  const [purchaseorderlist, setpurchaseorderlist] = useState({})
  const [purchaseorderforlist, setpurchaseorderforlist] = useState([])

  let [indentAdded, setindentAdded] = useState([])
  let [indentAddedselect, setindentAddedselect] = useState([])
  let [productlist, setproductlist] = useState([])
  let [branchlist, setbranchlist] = useState([])

  let [depotlist, setdepotlist] = useState([])

  let [ledgerlist, setledgerlist] = useState([])
  let [ledgerselected, setledgerselected] = useState([])
  let [itemind,setitemind]=useState(0)



  let [actionstate,setactionstate]=useState(false)
  let [updateid,setupdateid]=useState("")

  let [grnsdata,setgrnsdata]=useState([])




  let [importmat,setimportmat]=useState([])
 













let defaultdataitem= { "prodid": "","recieptinbotle":"", "quantity": "", "rate": "", "amount": "", "orderno": "", "godownwastge": "",
       "productdetails":[{"trackingno":"","orderno":"","godown":"","quantity":"","rate":"","amount":"","godownwastge":""}
       ] 
 }
  let [formdata,setformdata]=useState({
  "vouchered":"",
  "materialtransferno": "",
  "destinationgodown": "",


  "orderno": [],
  "date": "",
  "partyAccountName": "",
  "trackFromIndent": "",
  "purchaseLedger": "",
  "branchno": "",
  "items": [

  ]
}
)
formdata.materialtransferno=voucherresult

async function getgrns(){        
  
  
  
  MasterGet("materialout")
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
          if (val.voucherType == "material-out") {
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

           setproduct(response)

        console.log(response,">>>>>>")



        let tmpstore = []
        response.map((val) => {
          tmpstore.push({ label: val.name, value: val._id ,val:val})

        })
        setproductlist(tmpstore)

      })
      .catch(() => {
      })






      
    MasterGet("ledgers")
      .then((response) => {

           setproduct(response)

    
        let tmpstore = []
        response.map((val) => {
          tmpstore.push({ label: val.Name, value: val._id ,val:val})

        })
        setbranchlist(tmpstore)

      })
      .catch(() => {
      })









       MasterGet("depots")
      .then((response) => {
             setdepots(response)
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
    let tmpparchase=[]
    response.map((vall,i)=>{
tmpparchase.push({partyid:vall.partyAccountName,prodid:[]})
vall.items.map((val2)=>{
   tmpparchase[i].prodid.push(val2.prodid)   
})
        setpurchaseorderforlist(tmpparchase)

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
    // console.log(new RegExp(`${e.label}`, "i"), e.label, wheree)


    MasterGet("purchaseorder?where=" + JSON.stringify(wheree) + "")
      .then((response) => {
        // console.log(response)
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
  tablename:"materialout",
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
  "materialtransferno": "",
  "destinationgodown":"",
  "orderno": [],
  "date": "",
  "partyAccountName": "",
  "trackFromIndent": "",
  "purchaseLedger": "",
  "branchno": "",
  "items": [

  ]
})



}


  const [excelviewerbox, Excelfileviewer] = useState(false);
  const [showtabledata, setshowtabledata] = useState({ data: [], showtab: [] })
  const [excelview,setexcelview]=useState({})
   

  const [error, setError] = useState(null);
  let [errorfile, seterrorfile] = useState("");

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


       

        let storealldata={
          depot:[],
          productlist:[],
          destinationgodown:[],
          branch:[],
          qty:[],
          rate:[],
          amount:[],
          date:[],

        }

  

let date=new Date().toISOString()
        let matcreationlist=[]
        let tmprod={
        }
         let tmdepot={
        }

        let tmdebranch={
        }
        product.map((val)=>{
          tmprod[val.name]=val._id
        })
        depot.map((val)=>{
           tmdepot[val.Name]=val._id  
        })

        branchlist.map((val)=>{
           tmdebranch[val.label]={name:val.value,depotid:val.val.depotId}
        })



        let tmpaccountid=[]
        let tmpdefaultdataitem={...defaultdataitem}
        jsonData.map((val)=>{
           storealldata.depot.push(val.DEPO)
           storealldata.productlist.push(val.PRODUCT)
           storealldata.destinationgodown.push(val["DESTINATION DEPO"])
           storealldata.date.push(val.DATE)
           storealldata.qty.push(val.QTY)
           storealldata.amount.push(val.AMOUNT)

           let partyid=""
           if(tmdebranch[val.BRANCH] && tmdepot[val["DESTINATION DEPO"]]==tmdebranch[val.BRANCH].depotid && tmprod[val.PRODUCT] && tmdepot[val.DEPO]){
            
            if(!tmpaccountid.includes(tmdebranch[val.BRANCH])){
                  matcreationlist.push(formdata)
                  tmpaccountid.push(tmdebranch[val.BRANCH])                    
            }

            let indexgrn=tmpaccountid.indexOf(partyid)
            tmpdefaultdataitem.prodid=tmprod[val.PRODUCT]
            tmpdefaultdataitem.quantity=val.QTY
            tmpdefaultdataitem.amount=val.AMOUNT
            tmpdefaultdataitem.rate=val.RATE
            matcreationlist[indexgrn].branchno=tmdebranch[val.BRANCH]
            matcreationlist[indexgrn].date=val.DATE?excelDateToJSDate(val.DATE):date
            matcreationlist[indexgrn].destinationgodown=tmdebranch[val.BRANCH].depotid
            matcreationlist[indexgrn].materialtransferno=voucherresult.split("/")[0]+"/"+(indexgrn+voucherresult.split("/")[1])+"/"+voucherresult.split("/")[2]
            matcreationlist[indexgrn].vouchered=VoucherTypeselect1.value
            matcreationlist[indexgrn].items.push(tmpdefaultdataitem)         
           }
           
          
        })
setimportmat(matcreationlist)
setexcelview(storealldata)
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
      BASE_URL + 'import_mat_excel',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer `,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mat: importmat }),
           credentials: "include",
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Import failed');
    }

    toast({
      title: "Import Successful",
      description: ` grn imported successfully`,
    });


setOpenMainDialog4(false)
  }


   let depotname=[...depot?.map((val,i)=>val.Name)]
  let productname=[...product?.map((val,i)=>val.name)]
  let branchname=[...branchlist?.map((val,i)=>val.label)]


const branchva=(xxxxx)=>{
    if(branchname.includes(xxxxx)){
       return true
    }
    errorfile="Please keep coorrect file data"
     return false
  }




 const checktmpdepot=(xxxxx)=>{
    if(depotname.includes(xxxxx)){
       return true
    }
    errorfile="Please keep coorrect file data"
     return false
  }


   const checktmpdepotprod=(xxxxx)=>{
    if(productname.includes(xxxxx)){
       return true
    }
    errorfile="Please keep coorrect file data"
     return false
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

       <Dialog open={excelviewerbox} onOpenChange={Excelfileviewer}>
                  <DialogContent className="max-w-[95vw] sm:max-w-[900px]">
                    <DialogHeader>
                      <DialogTitle>Excel View</DialogTitle>
                    </DialogHeader>
      
      
                    <div style={{ maxHeight: "600px", overflowY: "scroll" }}>
                      <table>
                        <thead><tr>
                          <th>Date</th>
                          <th className='px-2'>Branch</th>
                          <th>DESTINATION DEPO </th>
                          <th className='px-2'>PRODUCT</th>
                          <th className='px-2'>DEPO</th>
                          <th className='px-2'>QTY</th>
                          <th className='px-2'>RATE</th>
                          <th className='px-2'>AMOUNT</th>
                        </tr>
                      </thead>
                        <tbody> 
                          {excelview?.depot?.map((val,i) => <tr className='border-b'>
                            <td className='border-r'>{excelview.date[i]}</td>

                            <td className={'border-r'+(!branchva(excelview.branch[i])?" text-danger ":"")}>{val}</td>
                            <td className={'border-r px-2'}>{excelview.destinationgodown[i]}</td>
                             <td className={'border-r'+(!checktmpdepotprod(excelview.productlist[i])?" text-danger ":"")}>{excelview.productlist[i]}</td>
                            <td className={'border-r'+(!checktmpdepot(excelview.depot[i])?" text-danger ":"")}>{excelview.depot[i]}</td>




                            <td className='border-r'>{excelview.qty[i]}</td>
                            <td className='border-r'>{excelview.rate[i]}</td>
                            <td className='border-r'>{excelview.amount[i]}</td>

      
                          </tr>)}
      
                        </tbody>
      
                      </table>
                    </div>
      
      
      
      
      
                  </DialogContent>
                </Dialog>

 <Dialog open={openMainDialog4} onOpenChange={setOpenMainDialog4}>
            <DialogContent style={{ display: 'block' }}>
              <DialogHeader>
                <DialogTitle> Import </DialogTitle>
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


              <div className="flex items-center gap-2 mt-1 ">
                <Label htmlFor="poNumber" className="text-xs w-40   ">Voucher type</Label>
               <Select options={VoucherType}
                       classNamePrefix='selectBox'
                       className="h-6 text-xs "
                       value={VoucherTypeselect1}
                       onChange={(e)=>{
                        formdata.vouchered=e.value
                        getvoucherresult(e.value,"recieptno",setvoucherresult)
                        setVouchertypeselect1(e)
                       }}
               />
                       
              </div>

    
              <div className="flex items-center gap-2 mt-4 ">
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
                <div> Order no </div>
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


                        if (e.target.checked) {
                                                 

                          if (!indentAdded.includes(val._id)) {
                              formdata.orderno.push(val.orderNumber)                         

                            val.items.map((valll)=>{
                              formdata.items.push({ "prodid":valll.prodid, "quantity": "", "rate": "", "amount": "", "orderno": "", "godownwastge": "",
                                "productdetails":[{"trackingno":"","orderno":"","godown":"","quantity":"","rate":"","amount":"","godownwastge":""}]})      
                            })
                           
                            
                          }

                        }
                        else {


                          val.items.map((valll)=>{
                                let tmpfordata=[...formdata.items]
                                tmpfordata.map((val2,iii)=>{
                                  if(val2.prodid==valll.prodid){
                                     tmpfordata.splice(iii,1)
                                  }
                                })
                                formdata.items=[...tmpfordata]
                            })
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
        <h1 className="text-3xl font-bold text-gray-900">Material Transfer</h1>
        <button type="button" className="btn-primary justify-between items-end btn" onClick={() => setOpenMainDialog4(true)}>Import</button>







        <Dialog open={openMainDialog1} onOpenChange={setOpenMainDialog1}>
          <DialogTrigger asChild>
            
            <Button onClick={() => { 
            reset()
              setOpenMainDialog1(true)
            
            }}>Add Material Transfer</Button>
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
                        getvoucherresult(e.value,"recieptno",setvoucherresult)

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
                  <div>Add Material Transfer</div>
                  
                </div>
                   <div className='flex items-center gap-2'>
                    <div>{VoucherTypeselect.label}</div>
                </div>
                  <div className='flex items-center gap-2'>
                  {/* <Label htmlFor="poNumber" className="text-xs w-32">Destination Godown</Label> */}
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

              
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4 pt-4  border-t">
                <div className="flex items-center gap-2">
                  <Label htmlFor="poNumber" className="text-xs w-32">Material Transfer No</Label>
                  <Input id="poNumber" className="h-6 text-xs flex-1"  
                  value={formdata.materialtransferno} 
                   onChange={(e)=>{
                     formdata.materialtransferno=e.target.value
                     setformdata({...formdata})
                   }}
                  />
                </div>
                  <div className="flex items-center gap-2">
                <Label htmlFor="amount" className="text-xs w-32" 
                >Branch Name</Label>

                <select    className="h-6 text-xs flex-1 border-1 "  value={formdata.branchno}    onChange={(e)=>{
                           formdata.branchno=e.target.value
                           formdata.destinationgodown=branchlist.filter((vvv)=>vvv.value==e.target.value)?.[0]?.val?.depotId || ""
                           setformdata({...formdata})
                }}>
                  <option></option>
                      {branchlist.map((vall)=><option value={vall.value}    destgownid={vall.val.depotId}>{vall.label}</option>)}

                </select>

          
               
              </div>


                <div className='flex items-center gap-2'>
                  <Label htmlFor="poNumber" className="text-xs w-32">Destination Godown</Label>
                  <Input
                    type="text"
                    className="text-xs h-6 "
                    style={{ width: '155px'}}
                    value={depotlist.filter((vvv)=>formdata.destinationgodown==vvv.value)?.[0]?.label||""} 
                     
                  />
                </div>


           

            
              {/* Name Of Item dropdown that opens another modal on select */}
              {/* <div className="flex items-center gap-2">
                <Label className="text-xs w-32">Name Of Item</Label>
                
              </div> */}
            </div>
       <div className="grid grid-cols-2 gap-4  ">
           {/* <div className="flex items-center gap-2">

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

              </div> */}


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
                <div className='col-3'>Name Of Item</div>
                <div className='col-3'>Quantity</div>
                <div className='col-3'>Rate</div>
                <div className='col-3'>Amount</div>
                  {/* <div className='col-2'>Order no</div>
                    <div className='col-2'>Godown Wastage</div> */}
              </div>
              {<div className='sm:max-h-[300px] overflow-auto'>
                { formdata.items.map((val1, i1) =><div className='row mt-3'>
                   
                    <div className='col-3'>
                      <RSelect       onValueChange={(e)=>handleItemSelect(e,i1)} value={val1.prodid}>
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {productlist.map((vall)=><SelectItem value={vall.value}>{vall.label}</SelectItem>)}
                    </SelectContent>
                  </RSelect>
                    </div>
                    <div className='col-3'>
                      <Input type='text' className='h-6 text-xs' value={val1.quantity} onChange={((e)=>{
                         formdata.items[i1].quantity=e.target.value
                         setformdata({...formdata})
                      })} />
                    </div>
                    <div className='col-3'>
                      <Input type='text' className='h-6 text-xs' value={val1.rate}
                      
                      
                      onChange={((e)=>{
                         formdata.items[i1].rate=e.target.value
                         setformdata({...formdata})
                      })}
                      />
                    </div>
                    <div className='col-3'>
                      <Input type='text' className='h-6 text-xs' value={val1.amount} 
                      
                      onChange={((e)=>{
                         formdata.items[i1].amount=e.target.value
                         setformdata({...formdata})
                      })}
                      
                      
                      />
                    </div>


{/* 
                     <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={val1.orderno} 
                      
                      onChange={((e)=>{
                         formdata.items[i1].orderno=e.target.value
                         setformdata({...formdata})
                      })}
                      
                      
                      />
                    </div> */}



{/* 
                    <div className='col-2'>
                      <Input type='text' className='h-6 text-xs' value={val1.godownwastage} 
                      onChange={((e)=>{
                         formdata.items[i1].godownwastage=e.target.value
                         setformdata({...formdata})
                      })}
                      
                      
                      />
                    </div> */}





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
              {/* <div className='col-1'>
                <div className='text-xs'>Tracking No</div>
              </div> */}
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
              {/* <div className='col-1'>
                <div className='text-xs'>Godown Wastage</div>
              </div> */}
            </div>
{formdata.items[itemind]?.productdetails?.map((val1,i1)=><div className='row'>

  {/* <div className='col-1'>
                   <Input type='text' className='text-xs h6' style={{ height: 26 }} 
                   
                   
                   value={val1.trackingno}
                   onChange={(e)=>{
                    formdata.items[itemind].productdetails[i1].trackingno=e.target.value
                    setformdata({...formdata})


                   }}


                   />
              </div> */}
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




              {/* <div className='col-1'>
                <Input type='text' className='text-xs h6' style={{ height: 26 }} 



                   value={val1.godownwastge}
                   onChange={(e)=>{
                    formdata.items[itemind].productdetails[i1].godownwastge=e.target.value
                    setformdata({...formdata})
                   }}
                
                
                
                
                />
              </div> */}
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
          <CardTitle>Material Transfer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                   <th className="text-left p-2" style={{ width: '60%' }}>Material Transfer No</th>
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
