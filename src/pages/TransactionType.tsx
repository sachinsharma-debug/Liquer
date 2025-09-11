import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Trash2, Edit, Save, Plus, Loader2 } from "lucide-react";
import { BASE_URL } from "@/api/BaseUrl";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import * as Rselect from "react-select"

interface TransactionType {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  masterId?: string;
  alternateId?: string;
  voucherType?: string;
  activateVoucherType?: boolean;
  voucherNumberingMethod?: string;
  preventDuplicate?: boolean;
  voucherTypealteration:Object,
  additionalNumberingMethod?: boolean;
}

export function TransactionType() {
  // console.log(,"ksjfdksajdk ")
  const [isNumberingModalOpen, setIsNumberingModalOpen] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
const [voucherTypealteration,setVouchertypealteration]=useState({
 starting_number:"",
width_of_numerical_part:"",
prefill_with_zero:"",
restarting_numbering:[{applicable_from:"",starting_number:"",periodicity:""}],
prefix_details:[{applicable_from:"",particulars:""}],
suffix_details:[{applicable_from:"",particulars:""}],
})
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    masterId: "",
    alternateId: "",
    name: "",
    voucherType: "",
    activateVoucherType: true,
    voucherNumberingMethod: "",
    preventDuplicate: false,
    additionalNumberingMethod: false,
    voucherTypealteration:{},
    isActive: true,
  });

  const fetchTransactionTypes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}getTransactionTypes`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch transaction types");
      }

      setTransactionTypes(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to load transaction types",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionTypes();
  }, []);

  const resetForm = () => {
    setFormData({
      masterId: "",
      alternateId: "",
      name: "",
      voucherType: "",
      activateVoucherType: true,
      voucherNumberingMethod: "",
      preventDuplicate: false,
      additionalNumberingMethod: false,
      voucherTypealteration:{},
      isActive: true,
    });
    setIsEditing(false);
    setCurrentId(null);
    setIsDialogOpen(false);
    setError(null);
  };


  console.log(voucherTypealteration)



  const handleEdit = (transactionType: TransactionType) => {
    
   setVouchertypealteration((transactionType.additionalNumberingMethod?transactionType.voucherTypealteration:{}))

    setFormData({
      masterId: transactionType.masterId || "",
      alternateId: transactionType.alternateId || "",
      name: transactionType.name,
      voucherType: transactionType.voucherType || "",
      activateVoucherType: transactionType.activateVoucherType ?? true,
      voucherNumberingMethod: transactionType.voucherNumberingMethod || "",
      preventDuplicate: transactionType.preventDuplicate ?? false,
      additionalNumberingMethod:transactionType.additionalNumberingMethod ?? false,
      voucherTypealteration:transactionType.additionalNumberingMethod?transactionType.voucherTypealteration:{},
      isActive: transactionType.isActive,
    });
    setIsEditing(true);
    setCurrentId(transactionType._id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    if (!formData.name) {
      setError("Transaction type name is required");
      toast({
        title: "Validation Error",
        description: "Transaction type name is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      const url = isEditing && currentId
        ? `${BASE_URL}updateTransactionType/${currentId}`
        : `${BASE_URL}createTransactionType`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Operation failed");
      }

      toast({
        title: "Success",
        description: isEditing
          ? "Transaction type updated successfully"
          : "Transaction type created successfully",
      });

      await fetchTransactionTypes();
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm("Are you sure you want to delete this transaction type?")
    )
      return;

    try {
      const response = await fetch(`${BASE_URL}deleteTransactionType/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      toast({
        title: "Success",
        description: "Transaction type deleted successfully",
      });

      await fetchTransactionTypes();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const filteredTransactionTypes = transactionTypes.filter((transactionType) =>
    transactionType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  function funaddnew(type){
    switch(type){
      case "restarting_numbering":
                              voucherTypealteration.restarting_numbering.push({applicable_from:"",starting_number:"",periodicity:""})
       break;
     case "prefix_details":
     voucherTypealteration.prefix_details.push({applicable_from:"",particulars:""})
       break;
        case "suffix_details":
     voucherTypealteration.suffix_details.push({applicable_from:"",particulars:""})
       break;
    default:
      console.log("")
    
 }                          
                              
                              setVouchertypealteration({...voucherTypealteration})
  }


           function fundelete(i,type){
                              voucherTypealteration[type].splice(i,1)
                               setVouchertypealteration({...voucherTypealteration})
          }



          let  vouchertypelist=[ {value:"credit-note",label:"Credit Note"},
                            {value:"debit-note",label:"Debit Note"},
                            {value:"material-out",label:"Material Out"},
                            {value:"physical-stock",label:"Physical Stock"},
                            {value:"purchase",label:"Purchase"},
                            {value:"purchase-order",label:"Purchase Order"},
                            {value:"receipt",label:"Receipt"},
                            {value:"receipt-note",label:"Receipt Note"},
                            {value:"sales",label:"Sales"},
                            {value:"sales-order",label:"Sales Order"},
                            {value:"indent",label:"Indent"},
                            {value:"stock-journal",label:"Stock Journal"},
                            ]


                            // console.log(formData);


  return (
    <div className="space-y-6 h-full flex flex-col">
      <style type="text/css">
      {
        `
        
        .selectbox__control {
        
        min-width:300px;


        }
        
        `
      }

      </style>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Transaction Type Management
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Transaction Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Transaction Type" : "Create New Transaction Type"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Basic Details</h3>
                  <div className="space-y-3">
                     <div className="flex items-center gap-2">
                       <Label
                        htmlFor="masterId"
                        className="text-xs w-32 text-right"
                      >
                        Master Id:
                      </Label>
                      <Input
                        id="masterId"
                        name="masterId"
                        placeholder="Master Id"
                        className="h-6 text-xs flex-1"
                        value={formData.masterId}
                        onChange={(e) =>
                          setFormData({ ...formData, masterId: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="alterId"
                        className="text-xs w-32 text-right"
                      >
                        Alter Id:
                      </Label>
                      <Input
                        id="alterId"
                        name="alterId"
                        placeholder="Alter Id"
                        className="h-6 text-xs flex-1"
                        value={formData.alterId}
                        onChange={(e) =>
                          setFormData({ ...formData, alterId: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="name" className="text-xs w-32 text-right">
                        Name *:
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. Purchase Transaction"
                        className="h-6 text-xs flex-1"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="voucherType"
                        className="text-xs w-32 text-right"
                      >
                        Type of Voucher:
                      </Label>
                      <Rselect.default options={vouchertypelist}  
                      className=" max-h-[200px] "
                      classNamePrefix="selectbox"



                      
                      value={vouchertypelist.filter((val)=>val.value==formData.voucherType)[0] || {value:"",label:"Select voucher type"}}
                      onChange={(e)=>{
                          setFormData({ ...formData, voucherType: e.value })

                      }}
                        />
                      {/* <Select
                       
                      >
                        <SelectTrigger className="h-6 text-xs flex-1">
                          <SelectValue placeholder="Select voucher type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          <SelectItem value="credit-note">
                            
                            
                          </SelectItem>
                          <SelectItem value="debit-note">Debit Note</SelectItem>
                          <SelectItem value="delivery-note">
                            Delivery Note
                          </SelectItem>
                          <SelectItem value="material-out">
                            Material Out
                          </SelectItem>
                          <SelectItem value="physical-stock">
                            Physical Stock
                          </SelectItem>
                          <SelectItem value="purchase">Purchase</SelectItem>
                          <SelectItem value="purchase-order">
                            Purchase Order
                          </SelectItem>
                          <SelectItem value="receipt">Receipt</SelectItem>
                          <SelectItem value="receipt-note">
                            Receipt Note
                          </SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="sales-order">
                            Sales Order
                          </SelectItem>
                          <SelectItem value="indent">Indent</SelectItem>
                          <SelectItem value="stock-journal">
                            Stock Journal
                          </SelectItem>
                        </SelectContent>
                      </Select> */}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="activateVoucherType"
                        className="text-xs w-32 text-right"
                      >
                        Activate Voucher Type:
                      </Label>
                      <div className="flex-1">
                        <input
                          type="checkbox"
                          id="activateVoucherType"
                          checked={formData.activateVoucherType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              activateVoucherType: e.target.checked,
                            })
                          }
                          className="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="voucherNumberingMethod"
                        className="text-xs w-32 text-right"
                      >
                        Voucher Numbering:
                      </Label>
                      <Select
                        value={formData.voucherNumberingMethod}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            voucherNumberingMethod: value,
                          })
                        }
                      >
                        <SelectTrigger className="h-6 text-xs flex-1">
                          <SelectValue placeholder="Select numbering method" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="automatic-manual-override">
                            Automatic (Manual Override)
                          </SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="multi-user-auto">
                            Multi-user Auto
                          </SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.voucherNumberingMethod === "manual" && (
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="preventDuplicate"
                          className="text-xs w-32 text-right"
                        >
                          Prevent Duplicate:
                        </Label>
                        <Select
                          value={formData.preventDuplicate ? "yes" : "no"}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              preventDuplicate: value === "yes",
                            })
                          }
                        >
                          <SelectTrigger className="h-6 text-xs flex-1">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {/* Other form inputs... */}

                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-32 text-right">
                        Set/Alter Additional Numbering Method:
                      </Label>
                      <Select
                        value={formData.additionalNumberingMethod ? "yes" : "no"}
                        onValueChange={(value) => {
                          const isYes = value === "yes";
                          setFormData({
                            ...formData,
                            additionalNumberingMethod: isYes,
                          });
                          if (isYes) setIsNumberingModalOpen(true);
                        }}
                      >
                        <SelectTrigger className="h-6 text-xs flex-1">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Right column content (e.g., print) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Print</h3>
                  <div className="text-xs text-gray-500 italic">
                    Print configuration options will be available here.
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Update
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Create
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Transaction Types</CardTitle>
            <div className="w-full md:w-1/3">
              <Input
                type="text"
                placeholder="Search transaction types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mr-2" />
              <span>Loading transaction types...</span>
            </div>
          ) : filteredTransactionTypes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm
                ? "No matching transaction types found"
                : "No transaction types found. Create your first transaction type above."}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden flex-1">
              <div className="h-[380px] overflow-auto">
                <Table className="min-w-full">
                  <TableHeader className="bg-gray-50 sticky top-0">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Master ID</TableHead>
                      <TableHead>Alternate ID</TableHead>
                      <TableHead>Voucher Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactionTypes.map((transactionType) => (
                      <TableRow key={transactionType._id}>
                        <TableCell className="font-medium">
                          {transactionType.name}
                        </TableCell>
                        <TableCell>
                          {transactionType.masterId || "-"}
                        </TableCell>
                        <TableCell>
                          {transactionType.alternateId || "-"}
                        </TableCell>
                        <TableCell>
                          {transactionType.voucherType || "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transactionType.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {transactionType.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatDate(transactionType.createdAt)}
                        </TableCell>
                        <TableCell>
                          {formatDate(transactionType.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(transactionType)}
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(transactionType._id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isNumberingModalOpen} onOpenChange={setIsNumberingModalOpen}>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Voucher Type Alteration </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="w-40 text-right text-xs">Starting Number</Label>
                <Input placeholder="e.g. INV-" className="h-6 text-xs flex-1"
                 value={voucherTypealteration.starting_number}
                
                onChange={(e)=>{
                   voucherTypealteration.starting_number=e.target.value
                   setVouchertypealteration({...voucherTypealteration})

                }}/>
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-40 text-right text-xs">Width of Numerical Part</Label>
                <Input placeholder="e.g. 1000" className="h-6 text-xs flex-1" 
                value={voucherTypealteration.width_of_numerical_part}
                   onChange={(e)=>{
                    voucherTypealteration.width_of_numerical_part=e.target.value
                   setVouchertypealteration({...voucherTypealteration})


                   }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="preventDuplicate" className="text-xs w-40 text-right">
                  Prefill with zero
                </Label>
                <Select 
                value={formData.preventDuplicate ? "yes" : "no"} 
                onValueChange={(value) =>{ 
                  
                  setFormData({ ...formData, preventDuplicate: value === "yes",})
                      voucherTypealteration.prefill_with_zero =value
                      setVouchertypealteration({...voucherTypealteration})
                }}>
                  <SelectTrigger className="h-6 text-xs flex-1">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-x-2  border-t mt-4">
              <div className="row pb-5">
                <div className="col-4 border-r">
                  <div className="text-center py-3">Restart Numbering</div>
                  <div className="d-flex justify-content-between border-t border-b py-2">
                    <div>Applicable From</div>
                    <div>Starting Number</div>
                    <div>Periodicity</div>
                  </div>


              {voucherTypealteration.restarting_numbering.map((val,i)=><>
                  <div className="d-flex justify-content-between mt-3">
                    <div><Input  className="h-6 text-xs"  value={val.applicable_from} 
                  
                    onChange={(e)=>{
                        voucherTypealteration.restarting_numbering[i].applicable_from=e.target.value
                        setVouchertypealteration({...voucherTypealteration})

                    }}
                    
                    
                    /></div>
                    <div><Input  className="h-6 text-xs" 
                     value={val.starting_number} 
                  
                    onChange={(e)=>{
                        voucherTypealteration.restarting_numbering[i].starting_number=e.target.value
                        setVouchertypealteration({...voucherTypealteration})

                    }}
                    
                    /></div>
                    <div>
                      <Select    
                            onValueChange={(valuee)=>{
                                voucherTypealteration.restarting_numbering[i].starting_number =valuee
                               setVouchertypealteration({...voucherTypealteration})

                            }}

                            value={ voucherTypealteration.restarting_numbering[i].starting_number}
                      
                      >
                        <SelectTrigger className="h-6 text-xs flex-1">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yearly</SelectItem>
                          <SelectItem value="no">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="my-auto" style={{marginLeft: "4px"}}><img 
                    
                    src={"/src/Assets/"+(i+1==voucherTypealteration.restarting_numbering.length?"add.png":"minus.png")} 
                    
                    
                    width={30}
                        
                        onClick={()=>{
                          i+1==voucherTypealteration.restarting_numbering.length?funaddnew("restarting_numbering"): fundelete(i,"restarting_numbering")
                        }}

                        


                    /></div>
                  </div>
                  </>)}




                </div>






                <div className="col-4 border-r">
                  <div className="text-center py-3">Prefix Details</div>
                  <div className="d-flex justify-content-between border-t border-b py-2">
                    <div>Applicable From</div>
                    <div>Particulars</div>
                  </div>




                  {voucherTypealteration.prefix_details.map((val,i)=><>
                  
                  
                
                  <div className="d-flex justify-content-between mt-3">
                    <div><Input  className="h-6 text-xs" 
                    
                     value={val.applicable_from} 
                  
                    onChange={(e)=>{
                        voucherTypealteration.prefix_details[i].applicable_from=e.target.value
                        setVouchertypealteration({...voucherTypealteration})

                    }}
                    
                    
                    
                    /></div>
                    <div><Input  className="h-6 text-xs"  
                    
                     value={val.particulars} 
                  
                    onChange={(e)=>{
                        voucherTypealteration.prefix_details[i].particulars=e.target.value
                        setVouchertypealteration({...voucherTypealteration})

                    }}
                    
                    
                    /></div>
                    <div className="my-auto" style={{marginLeft: "4px"}}><img 
                    
                    
                    src={"/src/Assets/"+(i+1==voucherTypealteration.prefix_details.length?"add.png":"minus.png")} 
                    
                    
                    
                     onClick={()=>{
                          i+1==voucherTypealteration.prefix_details.length?funaddnew("prefix_details"): fundelete(i,"prefix_details")
                        }}

                    
                    
                    width={24}
                    
                     
                    
                    /></div>
                  </div>
                    </>)}





                </div>
                <div className="col-4 border-r">
                  <div className="text-center py-3">Suffix Details</div>
                  <div className="d-flex justify-content-between border-t border-b py-2">
                    <div>Applicable From</div>
                    <div>Particulars</div>
                  </div>





                  {voucherTypealteration.suffix_details.map((val,i)=><>


                  <div className="d-flex justify-content-between mt-3">
                    <div><Input  className="h-6 text-xs"  
                    
                     value={val.applicable_from} 
                  
                    onChange={(e)=>{
                        voucherTypealteration.suffix_details[i].applicable_from=e.target.value
                        setVouchertypealteration({...voucherTypealteration})

                    }}
                    
                    
                    /></div>
                    <div><Input  className="h-6 text-xs"
                    
                     value={val.particulars} 
                  
                    onChange={(e)=>{
                        voucherTypealteration.suffix_details[i].particulars=e.target.value
                        setVouchertypealteration({...voucherTypealteration})

                    }}
                    
                    
                    
                    /></div>
                    <div className="my-auto" style={{marginLeft: "4px"}}><img
                    
                    src={"/src/Assets/"+(i+1==voucherTypealteration.suffix_details.length?"add.png":"minus.png")} 
                    
                    
                    onClick={()=>{
                          i+1==voucherTypealteration.suffix_details.length?funaddnew("suffix_details"): fundelete(i,"suffix_details")
                        }}
                    
                    width={24}
                     
                       
                    
                    />
                    </div>
                  </div>
                  </>)}





                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => {
                
                 setFormData({ ...formData, additionalNumberingMethod: false,})
                
                setIsNumberingModalOpen(false)}}>
                Cancel
              </Button>
              <Button onClick={() => { 

                          formData.voucherTypealteration=(isNumberingModalOpen?voucherTypealteration:{})
                
                
                setIsNumberingModalOpen(false)}
                }>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}