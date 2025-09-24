import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import '../../App.css'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trash2,
  Edit,
  Save,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BASE_URL } from "@/api/BaseUrl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MasterGet }  from "@/api/mastercontroller"
import { useSelector, useDispatch } from 'react-redux'


interface AccountingGroup {
  _id: string;
  name: string;
  parentGroup?: string | { _id: string; name: string };
  isActive: boolean;
  Master_Id?: string;
  Alter_Id?: string;
  alias?: string;
}

export default function IndentVoucherPending() {

 const companyid = useSelector((state) => state?.Store.companyid)

  const [groups, setGroups] = useState<AccountingGroup[]>([]);
  const [parentOptions, setParentOptions] = useState<AccountingGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [indentlist,setindentlist]=useState([])
  const [vendorlist,setvendorlist]=useState({})
  const [productlist,setproductlist]=useState({})
  const [translist,settranslist]=useState({})


  let datecurr=new Date()

  function formatDate(dateString) {
  const date = new Date(dateString);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months start from 0
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}



  const [fromdate,setfromdate]=useState(formatDate(datecurr.toISOString()))
  const [todate,settodate]=useState(formatDate(datecurr.toISOString()))

  const [formData, setFormData] = useState({
    name: "",
    parentGroup: "no-parent",
    isActive: true,
    Master_Id: "",
    Alter_Id: "",
    alias: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
function formchagedate(tmpdate){

      const today = new Date(tmpdate);
      const formattedDate = today.toLocaleDateString('en-GB');
      return formattedDate
  }

  function getindent(){
      let  fromdate_:any=fromdate.split("-")
      let  todate_:any=todate.split("-")
      // console.log(Number(todate_[0]),">>>>>>>>>>>>",)
      fromdate_=fromdate_[2]+"-"+(fromdate_[1]<10?"0"+Number(fromdate_[1]):fromdate_[1])+"-"+(fromdate_[0]<10?"0"+Number(fromdate_[0]):fromdate_[0])
      todate_=todate_[2]+"-"+(todate_[1]<10?"0"+Number(todate_[1]):todate_[1])+"-"+(todate_[0]<10?"0"+Number(todate_[0]):todate_[0])
     let ddd=new Date(fromdate_)
     let ddd2=new Date(todate_)
  
      let wheretmp={
        indent_date: {
        $gte:ddd,
        $lte: ddd2
      }
      }
        MasterGet("indents?where="+JSON.stringify(wheretmp))
         .then((response)=>{
             setindentlist(response)
          })
        .catch(()=>{
          
        })
    }
  
    useEffect(()=>{
       MasterGet("vendors")
         .then((response)=>{
          let tmpstore={}
          response.map((val)=>{
            tmpstore[val._id]=val
          })
          setvendorlist(tmpstore)
  
          })
        .catch(()=>{
          
        })
  
  
          MasterGet("accountingledgers")
         .then((response)=>{
          let tmpstore={id:[],data:[]}
          response.map((val)=>{
             tmpstore[val._id]=val.name
          })
          setledger(tmpstore)
  
          })
        .catch(()=>{
          
        })
  
  
        
  
  
  
  
         MasterGet("products")
         .then((response)=>{
            let tmpstore={}
          response.map((val)=>{
            tmpstore[val._id]=val
            let tmpstore_={}
            let tmp2=0
            val.effectivedate.map((val1)=>{
              let tmp3:any=new Date(val1.date)
                   tmp3=tmp3.getTime()
             if(tmp2<tmp3){
              tmp2=tmp3
              tmpstore_={...val1}
             }
            })
  
  // console.log(tmpstore_,"amount")
            tmpstore[val._id].effectivedate[0]={...tmpstore_,_amount:tmpstore_.data.amount[tmpstore_.data.description.indexOf("Landed Cost")]}
  
            
          })
  
          
          
  
  
  
  
          setproductlist(tmpstore)
          })
        .catch(()=>{
          
        })
  
  
  
        getindent()
      
        
    },[companyid])
  
  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}accountig_group_list?page=${currentPage}&limit=${itemsPerPage}`,
        {
          method:"GET",
          credentials:"include"
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to fetch groups");

      // Transform parentGroup to consistent format
      const transformedGroups = result.data.map((group: any) => ({
        ...group,
        parentGroup:
          typeof group.parentGroup === "object"
            ? group.parentGroup?._id
            : group.parentGroup,
      }));

      setGroups(transformedGroups || []);
      setParentOptions(result.data || []);
      setTotalItems(result.total || 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [currentPage, itemsPerPage]);

  const resetForm = () => {
    setFormData({
      name: "",
      parentGroup: "no-parent",
      isActive: true,
      Master_Id: "",
      Alter_Id: "",
      alias: "",
    });
    setIsEditing(false);
    setCurrentId(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return setError("Group Name is required");

    try {
      const url =
        isEditing && currentId
          ? `${BASE_URL}accountig_group_update/${currentId}`
          : `${BASE_URL}accountig_group_create`;

      const requestBody: any = {
        name: formData.name,
        isActive: formData.isActive,
        Master_Id: formData.Master_Id,
        Alter_Id: formData.Alter_Id,
        alias: formData.alias,
      };

      // Only include parentGroup if it's a valid ID (not 'no-parent')
      if (formData.parentGroup && formData.parentGroup !== "no-parent") {
        requestBody.parentGroup = formData.parentGroup;
      }

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials:"include"
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Operation failed");

      await fetchGroups();
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleEdit = (group: AccountingGroup) => {
    setFormData({
      name: group.name,
      parentGroup:
        typeof group.parentGroup === "object"
          ? group.parentGroup?._id
          : group.parentGroup || "no-parent",
      isActive: group.isActive,
      Master_Id: group.Master_Id || "",
      Alter_Id: group.Alter_Id || "",
      alias: group.alias || "",
    });
    setIsEditing(true);
    setCurrentId(group._id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      const response = await fetch(`${BASE_URL}delete_accountig_group/${id}`, {
        method: "DELETE",
        credentials:"include"
      });
      if (!response.ok) throw new Error("Delete failed");
      await fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Helper: get parent group name
  const getParentName = (
    parentGroup?: string | { _id: string; name: string }
  ) => {
    if (!parentGroup) return "-";

    if (typeof parentGroup === "object") {
      return parentGroup.name || "-";
    }

    const parent = parentOptions.find((p) => p._id === parentGroup);
    return parent?.name || "-";
  };

  return (
    <div className="">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Indent Voucher Pending</CardTitle>
          <div className="flex items-center space-x-2">
                                <Label htmlFor="itemsPerPage">From:</Label>
                                
                                <Input type='text' value={fromdate} onChange={(e)=>{
                                  setfromdate(e.target.value)
                    
                                }} className='text-xs' placeholder="dd-mm-yyyy" style={{height:26,width:150}}/>
                                <Label htmlFor="itemsPerPage">To :</Label>
                                <Input type='text' className='text-xs'  
                                value={todate} onChange={(e)=>{
                                  settodate(e.target.value)
                    
                                }}
                                
                                placeholder="dd-mm-yyyy" style={{height:26,width:150}}/>
                                <button className="btn btn-primary " onClick={getindent}>ok</button>
                                <button className="btn btn-primary  float-end ">Detailsh</button>
                    
                                
                              </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="itemsPerPage">Items per page:</Label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No groups found. Create your first group above.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden flex-1">
                <div className="h-[380px] overflow-auto">
                  <Table className="min-w-full">
                    <TableHeader className="bg-gray-50 sticky top-0">
                      <TableRow className="my-table">
                        <TableHead>Date</TableHead>
                        <TableHead>Indent No</TableHead>
                        <TableHead>Particular</TableHead>
                        <TableHead>Name Of Item</TableHead>
                        <TableHead>Indent Qty</TableHead>
                        <TableHead>Order Qty</TableHead>
                        <TableHead>Balance Qty</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due On</TableHead>
                        <TableHead>Over Due</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {indentlist?.map((val)=><TableRow >
                                              <TableCell >{formchagedate(val.indent_date)}</TableCell>
                                              <TableCell >{val.indentvoucherno}</TableCell>
                                              <TableCell  colSpan={8}>
                      
                                         <Table className="min-w-full">
                                         
                                          <TableBody>
                                            {val.data.map((valll)=>
                                            <TableRow>
                                             <TableCell >{vendorlist?.[productlist[valll.product_id]?.preferredSupplier]?.name || ""}</TableCell>
                                             <TableCell >{productlist?.[valll.product_id]?.name || ""}</TableCell>
                                             <TableCell >{valll?.indent_qty || ""}</TableCell>
                                             <TableCell >{productlist?.[valll.product_id]?.effectivedate[0]?._amount || ""}</TableCell>
                                             <TableCell >{productlist?.[valll.product_id]?.effectivedate[0]?._amount*valll?.indent_qty}</TableCell>
                                             <TableCell ></TableCell>
                                             <TableCell ></TableCell>
                                             <TableCell  >
                                            
                                             
                                             
                                             </TableCell>
                      
                                             </TableRow>
                                            )}
                                          </TableBody>
                                          </Table>
                                              </TableCell>
                                             
                                            </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startItem} to {endItem} of {totalItems} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                  <div className="flex items-center space-x-1">
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
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}