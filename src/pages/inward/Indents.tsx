import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
import { BASE_URL } from '@/api/BaseUrl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Trash2, Edit, Save, Plus, Loader2 } from "lucide-react";
import * as Reselect from "react-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Value } from '@radix-ui/react-select';
export default function Indents() {
  const { toast } = useToast();
  const [indents, setIndents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileobj, setfileobj] = useState({})
  let [errorfile, seterrorfile] = useState("")
  const [Units,setUnits]=useState([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [excelviewerbox, Excelfileviewer] = useState(false);
  const [showtabledata, setshowtabledata] = useState({ data: [], showtab: [] })

  let [tmpstoreprudctinof,settmpstoreprudctinof]=useState([])






  const [depot,setdepots]=useState([])
  const [product,setproduct]=useState([])



  const [dueon, setdueon] = useState("")
  const [backup, setbackup] = useState("")


  const [currentIndent, setCurrentIndent] = useState({
    sofNo: "", sofDate: "", data: [{
      depot_id: "",
      product_id: "", pack_size: "", indent_qty: 0,
      uom1: "",
      indent_qty2: ""
      , uom2: "",
    }],
    narration: "",
    indent_date: "",
    transuctiontype:"",
    indentvoucherno: generatePONumber(),
    status: 'draft'
  });
const [transuctiontypelist,settransuctiontypelist]=useState([])
const [transuctiontype,settransuctiontype]=useState({Value:"",label:"Select"})

  const [isEditing, setIsEditing] = useState(false);
  const [viewingIndent, setViewingIndent] = useState(null);




   const fetchUnits = async () => {
      try {
        const response = await fetch(`${BASE_URL}stockunit_list`);
        const result = await response.json();
  
        if (!response.ok)
          throw new Error(result.message || "Failed to fetch units");
        console.log(result.data,"units ")
        setUnits(result.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to load units",
          variant: "destructive",
        });
      } finally {
      }
    };



    const fetchTransuction = async () => {
      try {
        const response = await fetch(`${BASE_URL}getTransactionTypes`);
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Failed to fetch units");
        let tmpstore=[]
        
        
        result.data.map((val)=>{


          if(val.voucherType=="indent"){
                tmpstore.push({Value:val._id,label:val.name})
          }

          
        })
        settransuctiontypelist([...tmpstore])
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to load units",
          variant: "destructive",
        });
      } finally {
      }
    };

  function generateUniqueId(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }
  function generatePONumber() {
     return "PO-" + Date.now();  // Example: PO-1693991875632
   }

// console.log(generatePONumber());



  // Fetch indents from API
  const fetchIndents = async () => {


    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      let response = await fetch(
        `${BASE_URL}indent_list?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let data = await response.json();

       if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.data && Array.isArray(data.data)) {
        setTotalItems(data.total || data.data.length);
      }
      else 
        {
        setIndents([]);
        setTotalItems(0);
        throw new Error(data.message || 'No data found');
      }
     setIndents(data.data);
       response =await fetch(`${BASE_URL}get_master/depots`,
          {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }

       )


       data = await response.json();
       setdepots(data.data)
        response =await fetch(`${BASE_URL}get_master/products`,
          {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }

       )


     data = await response.json();
     setproduct(data.data)

    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndents();
    fetchUnits();
    fetchTransuction()
  }, [currentPage, itemsPerPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentIndent(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentIndent(prev => ({ ...prev, status: e.target.value }));
  };

  const handleCreateOrUpdateIndent = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const url = isEditing
        ? `${BASE_URL}update_indent/${currentIndent._id}`
        : `${BASE_URL}create_indent`;
      const method = isEditing ? 'PUT' : 'POST';

      const payload = { ...currentIndent };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      toast({
        title: isEditing ? "Indent Updated" : "Indent Created",
        description: data.message || (isEditing
          ? 'Indent updated successfully'
          : 'New indent created successfully'),
      });

      fetchIndents();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleEditIndent = (indent) => {
    setCurrentIndent(indent);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleViewIndent = (indent) => {
    setViewingIndent(indent);
    setViewDialogOpen(true);
  };

  const handleDeleteIndent = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${BASE_URL}delete_indent/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Delete failed');
      }

      toast({
        title: "Indent Deleted",
        description: data.message || "Indent deleted successfully",
      });

      fetchIndents();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
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
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
        let datafil = []
        let checkitme = []
        let storetmp = []
        let tmpind = 0


          let depotname=[...depot.map((val,i)=>val.Name)]
          let depotnameid=[...depot.map((val,i)=>val._id)]

          let productname=[...product.map((val,i)=>val.name)]
          let productnameid=[...product.map((val,i)=>val._id)]


        const mappedData = jsonData.map((item) => {
          if (!checkitme.includes(item["SOF NO"])) {
            checkitme.push(item["SOF NO"])
            // datafil[item["SOF NO"]] = []
            let date = excelDateToJSDate(item["SOF DATE"]);
            datafil.push({
              sofNo: item["SOF NO"], sofDate: date, data: [],
              narration: "",
              indentvoucherno: generatePONumber(),
              status: 'draft',
              transuctiontype:transuctiontype.value,
              indent_date: new Date().toISOString().split('T')[0]

            })
            jsonData.map((item2) => {
              if (item2["SOF NO"] == item["SOF NO"]) {
                let valll = Object.values(item2)
                date = excelDateToJSDate(valll[1]);
                storetmp.push({
                  soft_date: date, depot_id: valll[0].trim(),
                  product_id: valll[3].trim(), pack_size: valll[4], indent_qty: valll[5],
                  sof_no___: valll[2]
                })
                datafil[tmpind].data.push({
                  depot_id: depotname.indexOf(valll[0].trim())!=-1?depotnameid[depotname.indexOf(valll[0].trim())]:"",
                  product_id:productname.indexOf(valll[3].trim())!=-1? productnameid[productname.indexOf(valll[3].trim())]:"", pack_size: valll[4], indent_qty: valll[5],
                  uom1: "",
                  indent_qty2: ""
                  , uom2: ""

                })
              }
            })
            tmpind++
          }
        })
        setshowtabledata({ data: datafil, showtab: storetmp })


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
        body: JSON.stringify({ indents: showtabledata.data, dueon, backup }),
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


  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    seterrorfile("")
    const file = e.target.files?.[0];
    setfileobj(file)
  };


  const resetForm = () => {
    setCurrentIndent({
      sofNo: "", sofDate: "", data: [{
        depot_id: "",
        product_id: "", pack_size: "", indent_qty: "",
        uom1: "",
        indent_qty2: ""
        , uom2: "",
      }],
      narration: "",
      indent_date: "",
      indentvoucherno: generatePONumber(),
      status: 'draft'
    });
    setIsEditing(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [isDialogOpen1, setIsDialogOpen1] = useState(false);

  let depotname=[...depot.map((val,i)=>val.Name)]
  let productname=[...product.map((val,i)=>val.name)]


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
  


  console.log(transuctiontypelist,depot,product,">>>>>>>>>>>>>>>>>>",showtabledata)

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: state.isFocused ? "2px solid #213257ff" : "1px solid #d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    "&:hover": { borderColor: "#2563eb" },
    borderRadius: "0.75rem",
    padding: "2px",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    padding: "4px",
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "#99c7e5ff"
      : state.isSelected
      ? "#152445ff"
      : "white",
    color: state.isSelected ? "white" : "white",
    borderRadius: "0.5rem",
    padding: "10px",
    cursor: "pointer",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontStyle: "italic",
  }),
};



  return (
    <div className="space-y-6">
      <style type='text/css'>
      
      {
        `
        .selectBox__control {
        
        min-width:300px;


        
        }

         .selectBox__menu {
        
        background-color:white;
        color:black;


        
        }
        
        
        
        `
      }

      
      </style>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Indents Management</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" className="btn-primary btn" onClick={() => setIsDialogOpen1(true)}>Import</button>

          <Dialog open={excelviewerbox} onOpenChange={Excelfileviewer}>
            <DialogContent className="max-w-[95vw] sm:max-w-[1500px]">
              <DialogHeader>
                <DialogTitle>Excel View</DialogTitle>
              </DialogHeader>


              <div style={{ maxHeight: "600px", overflowY: "scroll" }}>
                <table>
                  <thead><tr>
                    <th>Depot</th>
                    <th className='px-2'>SOF DATE</th>
                    <th>SOF NO</th>
                    <th className='px-2'>Product Name</th>
                    <th>Pack Size</th>
                    <th className='px-2'>Indent QTY (In Case)</th>

                  </tr></thead>
                  <tbody>
                    {showtabledata.showtab.map((val) => <tr className='border-b'>
                      <td className={'border-r'+(!checktmpdepot(val.depot_id)?" text-danger ":"")}>{val.depot_id}</td>
                      <td className='border-r px-2'>{val.soft_date}</td>
                      <td className='border-r'>{val.sof_no___}</td>
                      <td className={'border-r px-2'+(!checktmpdepotprod(val.product_id)?" text-danger ":"")}>{val.product_id}</td>
                      <td className='border-r'>{val.pack_size}</td>
                      <td className='px-2'>{val.indent_qty}</td>

                    </tr>)}

                  </tbody>

                </table>
              </div>





            </DialogContent>
          </Dialog>










          <Dialog open={isDialogOpen1} onOpenChange={setIsDialogOpen1}>
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
                   <Reselect.default styles={customStyles}  options={transuctiontypelist}
                       classNamePrefix='selectBox'
                       value={transuctiontype}
                       onChange={(e)=>{
                        settransuctiontype(e)
                       }}
               />

              </div>






              <div className="flex items-center gap-2 mt-3">
                <Label htmlFor="standardRate" className="text-xs w-60">
                  Preview Import Summary :
                </Label>
                <Select onValueChange={(value) => {
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
                </Select>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Label htmlFor="standardRate" className="text-xs w-60">
                  Due on:
                </Label>

                 <Input
                  id="minStockLevel"
                  type="date"
                  onChange={(e)=>{
                     setdueon(e.target.value)
                  }}
                  value={dueon}
                />
                


           

              </div>



              <div className="flex items-center gap-2 mt-3">
                <Label htmlFor="standardRate" className="text-xs w-60">
                  Backup Company Data Before Import :
                </Label>
                <Select onValueChange={setbackup} value={backup}>
                  <SelectTrigger className="h-6 text-xs ">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)} disabled={loading}>
                Create Indent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-[1200px]"
              style={{ maxHeight: 600, overflowY: 'auto' }} >
              <DialogHeader className='border-b pb-3'>
                <DialogTitle className='d-flex justify-content-between'>
                  <div>New Indent</div>
                  <div>
                    <Input
                      type="text"
                      className="text-xs h-6 "
                      style={{ width: '105px', marginRight: 10 }}
                      value={'27-08-2025'}
                      disabled
                    />
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className='space-y-3 pb-4 border-b'>
                <div className="grid grid-cols-4 gap-2 ">
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                    <Label htmlFor="Indent_Voucher" className="text-xs w-32 ">
                      Indent Voucher No
                    </Label>
                    <Input
                      id="Indent_Voucher"
                      name="Indent_Voucher"
                      type="text"
                      className="sm:col-span-2 text-xs h-6 "
                      style={{ marginLeft: 25 }}
                      value={currentIndent.indentvoucherno}
                      disabled
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <Label htmlFor="indent_date" className="text-xs text-right">
                      Date
                    </Label>
                    <Input
                      id="indent_date"
                      name="indent_date"
                      type="date"
                      className="sm:col-span-2 text-xs h-6"
                      value={currentIndent.indent_date}

                      onChange={(e) => {

                        const today = new Date(e.target.value);
                        const formattedDate = today.toISOString().split('T')[0];


                        setCurrentIndent(prev => ({ ...prev, indent_date: formattedDate }));
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <Label htmlFor="sof_date" className="text-xs text-right">
                      SOF Date
                    </Label>
                    <Input
                      id="sof_date"
                      name="sof_date"
                      type="date"
                      className="sm:col-span-2 text-xs h-6"

                      value={currentIndent.sofDate}

                      onChange={(e) => {

                        const today = new Date(e.target.value);
                        const formattedDate = today.toISOString().split('T')[0];


                        setCurrentIndent(prev => ({ ...prev, sofDate: formattedDate }));
                      }}

                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <Label htmlFor="sof_no" className="text-xs text-right">
                      SOF No
                    </Label>
                    <Input
                      id="sof_no"
                      name="sof_no"
                      type="text"
                      className="sm:col-span-2 text-xs h-6"
                      value={currentIndent.sofNo}
                      onChange={(e) => {
                        setCurrentIndent(prev => ({ ...prev, sofNo: e.target.value }));
                      }}


                    />
                  </div>
                </div>
              </div>


              <div>
                <div className='row align-content-end pb-3 border-b flex-wrap'>
                  <div className='col-1'>
                    <div>Sl No.</div>
                  </div>
                  <div className='col-2'>
                    <div>Depot</div>
                  </div>
                  <div className='col-2'>
                    <div>Product Name</div>
                  </div>
                  <div className='col-2'>
                    <div>Pack Size</div>
                  </div>
                  <div className='col-1'>
                    <div>Qty</div>
                  </div>
                  <div className='col-1'>
                    <div>Uom1</div>
                  </div>
                  <div className='col-1'>
                    <div>Qty</div>
                  </div>
                  <div className='col-1'>
                    <div>Uom2</div>
                  </div>

                </div>
              </div>
              {currentIndent.data.map((val, idx) => (
                <div className=''>
                  <div className='row'>
                    {/* <div className='border-b pb-3' style={{ width: 50 }}>Sl No.</div> */}
                    <div className='col-1 d-flex '>
                      <div className='pt-3 me-1 mt-1 '>{1 != currentIndent.data.length ?
                        <svg onClick={() => {
                          let tmpdata = currentIndent.data
                          tmpdata.splice(idx, 1)
                          setCurrentIndent(prev => ({ ...prev, data: tmpdata }))
                        }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
                        </svg>

                        : <></>}</div>
                      <div className='pt-3'>{idx + 1}</div>
                    </div>
                    {/* <div className='border-b px-3 pb-3'>Depot</div> */}
                    <div className='col-2 pt-3'>





                         
                                            <Select
                                               value={val.depot_id}
                                               onValueChange={(value) =>{
                                                let tmpdata = currentIndent.data
                                                    tmpdata[idx].depot_id = value
                                                  setCurrentIndent(prev => ({ ...prev, data: tmpdata }))
                                               }
                                              }
                                             >
                                               <SelectTrigger id="category">
                                                 <SelectValue placeholder="Select category" />
                                               </SelectTrigger>
                                               <SelectContent>
                                                 {depot.map((cat) => (
                                                   <SelectItem key={cat._id} value={cat._id}>
                                                     {cat.Name}
                                                   </SelectItem>
                                                 ))}
                                               </SelectContent>
                                             </Select>




                    </div>
                    {/* <div className='border-b pb-3'>Product Name</div> */}
                    <div className='col-2 pt-3'>


                      <Select
                                               value={val.product_id}
                                               onValueChange={(value) =>{
                                                let tmpdata = currentIndent.data
                                                    tmpdata[idx].product_id = value

                                    let tmptxx=product.filter((val)=>val._id==value)[0]
                                     tmpdata[idx].pack_size=tmptxx.volume


                                     tmpstoreprudctinof[idx]=tmptxx;


                                                    
                                                  setCurrentIndent(prev => ({ ...prev, data: tmpdata }))
                                               }
                                              }
                                             >
                                               <SelectTrigger id="category">
                                                 <SelectValue placeholder="Select category" />
                                               </SelectTrigger>
                                               <SelectContent>
                                                 {product.map((cat) => (
                                                   <SelectItem key={cat._id} value={cat._id}>
                                                     {cat.name}
                                                   </SelectItem>
                                                 ))}
                                               </SelectContent>
                                             </Select>
                    
                    </div>
                    {/* <div className='border-b px-3 pb-3'>Pack Size</div> */}
                    <div className='col-2 px-3 pt-3'>
                      <Input
                        id="Depot"
                        name="Depot"
                        type="text"
                        className=" text-xs h-6"
                        value={val.pack_size}
                        onChange={(event) => {

                          let tmpdata = currentIndent.data
                          tmpdata[idx].pack_size = event.target.value
                          setCurrentIndent(prev => ({ ...prev, data: tmpdata }))
                        }}
                      />
                    </div>
                    {/* <div className='border-b pb-3'>Qty</div> */}
                    <div className='col-1 pt-3'>
                      <Input
                        id="Depot"
                        name="Depot"
                        type="text"
                        className=" text-xs h-6"

                        value={val.indent_qty}
                        onChange={(event) => {
                          let tmpdata = currentIndent.data
                          tmpdata[idx].indent_qty = event.target.value
                          if(tmpstoreprudctinof?.[idx]?.bottle && tmpstoreprudctinof?.[idx]?.where){
                          
                           tmpdata[idx].indent_qty2 =tmpstoreprudctinof[idx].bottle/tmpstoreprudctinof?.[idx]?.where*event.target.value



                          }



                          setCurrentIndent(prev => ({ ...prev, data: tmpdata }))
                        }}
                      />
                    </div>
                    {/* <div className='border-b px-3 pb-3'>Uom1</div> */}
                    <div className='col-1 px-3 pt-3'>


                                                                  <Select
                                               value={val.uom1}
                                               onValueChange={(value) =>{
                                                let tmpdata = currentIndent.data
                                                    tmpdata[idx].uom1 = value
                                                    tmpdata[idx].uom2=tmpstoreprudctinof[idx].unit ==tmpdata[idx].uom1?tmpstoreprudctinof[idx].altUnit:tmpstoreprudctinof[idx].unit
                                                  setCurrentIndent(prev => ({ ...prev, data: tmpdata }))
                                               }
                                              }
                                             >
                                               <SelectTrigger id="category">
                                                 <SelectValue placeholder="Select uom" />
                                               </SelectTrigger>
                                               <SelectContent>
                                                 {Units.map((cat) => (tmpstoreprudctinof?.[idx]?.unit==cat._id || tmpstoreprudctinof?.[idx]?.altUnit==cat._id?
                                                                    <SelectItem key={cat._id} value={cat._id}>
                                                           {cat.symbol}
                                                   </SelectItem>
                                                   :
                                                   <></>
                                                 ))}
                                               </SelectContent>
                                             </Select>
                     
                    </div>
                    {/* <div className='border-b pb-3'>Qty</div> */}
                    <div className='col-1 pt-3'>
                      <Input
                        id="Depot"
                        name="Depot"
                        type="text"
                        className=" text-xs h-6"
                        value={val.indent_qty2}
                        onChange={(event) => {
                          let tmpdata = currentIndent.data
                          tmpdata[idx].indent_qty2 = event.target.value
                          setCurrentIndent(prev => ({ ...prev, data: tmpdata }))
                        }}
                      />
                    </div>
                    {/* <div className='border-b px-3 pb-3'>Uom</div> */}
                    <div className='col-1 px-3 pt-3'>

                        <Select
                                               value={val.uom2}
                                               onValueChange={(value) =>{
                                                let tmpdata = currentIndent.data
                                                    tmpdata[idx].uom2 = value
                                                  setCurrentIndent(prev => ({ ...prev, data: tmpdata }))
                                               }
                                              }
                                             >
                                               <SelectTrigger id="category">
                                                 <SelectValue placeholder="Select" />
                                               </SelectTrigger>
                                               <SelectContent>
                                                 {Units.map((cat) => (tmpstoreprudctinof?.[idx]?.unit==cat._id || tmpstoreprudctinof?.[idx]?.altUnit==cat._id?
                                                                    <SelectItem key={cat._id} value={cat._id}>
                                                           {cat.symbol}
                                                   </SelectItem>
                                                   :
                                                   <></>
                                                 ))}
                                               </SelectContent>
                                             </Select>
                    

                    </div>

                </div>

              </div>

              ))}

              <div className='row'>
                <div className='col-12 text-end'>
                  <span style={{ cursor: 'pointer' }} className='text-primary' onClick={() => {
                    let tmpdata = currentIndent.data
                    tmpdata.push({
                      depot_id: "", 
                      product_id: "", pack_size: "", indent_qty: "",
                      uom1: "",
                      indent_qty2: ""
                      , uom2: "",
                    })
                    tmpstoreprudctinof.push([])
                    setCurrentIndent(prev => ({ ...prev, data: tmpdata }))
                  }}>+ Add More</span>
                </div>
              </div>

              <div className='mt-5 pt-5'>
                <div className='d-flex'>
                  <div className='my-auto'>Narration</div>
                  <div className='px-3 my-auto'>
                    <Input
                      id="Narration"
                      name="Narration"
                      type="text"
                      className=" text-xs h-6"
                      value={currentIndent.narration}

                      onChange={(event) => {
                        setCurrentIndent(prev => ({ ...prev, narration: event.target.value }))
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}>
                  Quite
                </Button>
                <Button onClick={handleCreateOrUpdateIndent} disabled={loading}>
                  {isEditing ? 'Update' : 'Accept'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <CardTitle>All Indents</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Items per page</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border rounded p-1 text-sm"
                  disabled={loading}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Indent Date</th>
                  <th className="text-left p-2">Depot</th>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Pack Size</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4">Loading indents...</td>
                  </tr>
                ) : indents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4">No indents found</td>
                  </tr>
                ) : (
                  indents.map((indent) => (
                    <tr key={indent._id || indent.id} className="border-b">
                      <td className="p-2">{indent.indent_date?.split('T')[0] || indent.sofDate?.split('T')[0]}</td>
                      <td className="p-2">{indent.depot_id || indent.depot}</td>
                      <td className="p-2">{indent.product_id || indent.productName}</td>
                      <td className="p-2">{indent.pack_size || indent.packSize}</td>
                      <td className="p-2">{indent.indent_qty || indent.indentQty}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${indent.status === 'approved' ? 'bg-green-100 text-green-800' :
                          indent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            indent.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {indent.status || 'draft'}
                        </span>
                      </td>
                      <td className="p-2 space-x-1 sm:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditIndent(indent)}
                          disabled={loading || indent.status === 'approved'}
                          className="text-xs sm:text-sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewIndent(indent)}
                          disabled={loading}
                          className="text-xs sm:text-sm"
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteIndent(indent._id || indent.id)}
                          disabled={loading || indent.status === 'approved'}
                          className="text-xs sm:text-sm"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-1 sm:px-2">...</span>
              )}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={loading}
                >
                  {totalPages}
                </Button>
              )}
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Indent Details</DialogTitle>
          </DialogHeader>
          {viewingIndent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label className="sm:text-right font-medium">Indent Date</Label>
                <div className="sm:col-span-3">{viewingIndent.indent_date || viewingIndent.sofDate?.split('T')[0]}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label className="sm:text-right font-medium">Depot</Label>
                <div className="sm:col-span-3">{viewingIndent.depot_id || viewingIndent.depot}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label className="sm:text-right font-medium">Product</Label>
                <div className="sm:col-span-3">{viewingIndent.product_id || viewingIndent.productName}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label className="sm:text-right font-medium">Pack Size</Label>
                <div className="sm:col-span-3">{viewingIndent.pack_size || viewingIndent.packSize}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label className="sm:text-right font-medium">Quantity</Label>
                <div className="sm:col-span-3">{viewingIndent.indent_qty || viewingIndent.indentQty}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label className="sm:text-right font-medium">Status</Label>
                <div className="sm:col-span-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${viewingIndent.status === 'approved' ? 'bg-green-100 text-green-800' :
                    viewingIndent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      viewingIndent.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {viewingIndent.status || 'draft'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}