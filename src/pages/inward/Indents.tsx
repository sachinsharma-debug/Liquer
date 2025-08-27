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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export default function Indents() {
  const { toast } = useToast();
  const [indents, setIndents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentIndent, setCurrentIndent] = useState({
    indent_date: new Date().toISOString().split('T')[0],
    depot_id: '',
    product_id: '',
    pack_size: '',
    indent_qty: 0,
    status: 'draft'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [viewingIndent, setViewingIndent] = useState(null);

  // Fetch indents from API
  const fetchIndents = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${BASE_URL}indent_list?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.data && Array.isArray(data.data)) {
        setIndents(data.data);
        setTotalItems(data.total || data.data.length);
      } else {
        setIndents([]);
        setTotalItems(0);
        throw new Error(data.message || 'No data found');
      }

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
        ? `${BASE_URL}/update_indent/${currentIndent.id}`
        : '${BASE_URL}/create_indent';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        indent_date: currentIndent.indent_date,
        depot_id: currentIndent.depot_id,
        product_id: currentIndent.product_id,
        pack_size: currentIndent.pack_size,
        indent_qty: Number(currentIndent.indent_qty),
        status: currentIndent.status
      };

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
    setCurrentIndent({
      id: indent._id || indent.id,
      indent_date: indent.indent_date || indent.sofDate?.split('T')[0],
      depot_id: indent.depot_id || indent.depot,
      product_id: indent.product_id || indent.productName,
      pack_size: indent.pack_size || indent.packSize,
      indent_qty: indent.indent_qty || indent.indentQty,
      status: indent.status || 'draft'
    });
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
        `${BASE_URL}/delete_indent/${id}`,
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






  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = localStorage.getItem('authToken');
      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel columns to API fields with better parsing and validation
        const mappedData = jsonData.map((item) => {

          let indentDateRaw = item['SOF DATE'];
          let indentDate = new Date(indentDateRaw);

          // If date is invalid or empty string, set to empty string to filter out later
          if (!indentDateRaw || isNaN(indentDate.getTime())) {
            indentDate = null;
          }

          const indent_date = indentDate ? indentDate.toISOString().split('T')[0] : '';

          // Parse indent_qty safely
          const indent_qty = Number(item['Indent QTY(In Case)']);
          const qty = isNaN(indent_qty) ? 0 : indent_qty;

          // Clean pack size - handle empty strings and normalize
          const rawPackSize = item['Pack Size']?.toString().trim() || '';
          const pack_size = rawPackSize === '000 ML' ? '' : rawPackSize;

          return {
            soft_date: item['SOF DATE'],
            // sofNo:item['SOF NO'],
            depot_id: (item['Depot'] || '').toString().trim(),
            product_id: (item['Product Name'] || '').toString().trim(),
            pack_size,
            indent_qty: qty,
            status: 'pending',
          };
        });

        // console.log('Mapped Data:', mappedData);

        const validData = mappedData.filter(item => {
          // Validation based on sample data - pack_size can be empty for some products
          const valid =
            item.depot_id &&
            item.product_id &&
            item.soft_date &&
            // item.sofNo &&
            (item.pack_size || item.product_id.includes("20000 ML")) && // Some products don't need pack_size
            !isNaN(item.indent_qty); // Only validate that it's a number (can be 0)

          if (!valid) {
            console.warn('Filtered out invalid row:', item);
          }
          return valid;
        });

        console.log('Valid Data:', validData);

        if (validData.length === 0) {
          throw new Error('No valid indents found in the Excel file');
        }

        // Confirmation before import
        if (confirm(`Import ${validData.length} indents?`)) {
          setLoading(true);
          const response = await fetch(
            '${BASE_URL}/import_indents_excel',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ indents: validData }),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || 'Import failed');
          }

          toast({
            title: "Import Successful",
            description: `${validData.length} indents imported successfully`,
          });

          // Reset file input
          e.target.value = '';

          fetchIndents();
          setCurrentPage(1);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      toast({
        title: "Import Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setCurrentIndent({
      indent_date: new Date().toISOString().split('T')[0],
      depot_id: '',
      product_id: '',
      pack_size: '',
      indent_qty: 0,
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
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Indents Management</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" className="btn-primary btn" onClick={() => setIsDialogOpen1(true)}>Import</button>
          <Dialog open={isDialogOpen1} onOpenChange={setIsDialogOpen1}>
            <DialogContent style={{ display: 'block' }}>
              <DialogHeader>
                <DialogTitle>Import</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2 mt-3 border-t pt-3">
                <Label htmlFor="minStockLevel" className="text-xs w-40 text-start">
                  File Path :
                </Label>
                <Input
                  id="minStockLevel"
                  type="text"
                  min="0"
                  className="h-6 text-xs flex-1"
                />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Label htmlFor="myfile" className='text-xs w-40 text-start'>Select a file:</Label>
                <input className='text-xs ' type="file" id="myfile" name="myfile" />
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
                />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Label htmlFor="standardRate" className="text-xs w-60">
                  Preview Import Summary :
                </Label>
                <Select>
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
                  Backup Company Data Before Import :
                </Label>
                <Select>
                  <SelectTrigger className="h-6 text-xs ">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)} disabled={loading}>
                Create Indent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-[1200px]" style={{maxHeight:600,overflowY:'auto'}}>
              <DialogHeader className='border-b pb-3'>
                <DialogTitle className='d-flex justify-content-between'>
                  <div>New Indent</div>
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
                      style={{ marginLeft: 25}}
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
                    />
                  </div>
                </div>
              </div>

              <div className='d-flex mb-5 pb-5'>
                <div className=''>
                  <div className='border-b pb-3' style={{width:50}}>Sl No.</div>
                  <div className='pt-3'>1</div>
                </div>
                <div>
                  <div className='border-b px-3 pb-3'>Depot</div>
                  <div className='px-3 pt-3'>
                    <Input
                      id="Depot"
                      name="Depot"
                      type="text"
                      className=" text-xs h-6"
                    />
                  </div>
                </div>
                <div>
                  <div className='border-b pb-3'>Product Name</div>
                  <div className='pt-3'>
                    <Input
                      id="Depot"
                      name="Depot"
                      type="text"
                      className=" text-xs h-6"
                    />
                  </div>
                </div>
                <div>
                  <div className='border-b px-3 pb-3'>Pack Size</div>
                  <div className='px-3 pt-3'>
                    <Input
                      id="Depot"
                      name="Depot"
                      type="text"
                      className=" text-xs h-6"
                    />
                  </div>
                </div>
                <div>
                  <div className='border-b pb-3'>Qty</div>
                  <div className='pt-3'>
                    <Input
                      id="Depot"
                      name="Depot"
                      type="text"
                      className=" text-xs h-6"
                    />
                  </div>
                </div>
                <div>
                  <div className='border-b px-3 pb-3'>Uom1</div>
                  <div className='px-3 pt-3'>
                    <Input
                      id="Depot"
                      name="Depot"
                      type="text"
                      className=" text-xs h-6"
                    />
                  </div>
                </div>
                <div>
                  <div className='border-b pb-3'>Qty</div>
                  <div className='pt-3'>
                    <Input
                      id="Depot"
                      name="Depot"
                      type="text"
                      className=" text-xs h-6"
                    />
                  </div>
                </div>
                <div>
                  <div className='border-b px-3 pb-3'>Uom</div>
                  <div className='px-3 pt-3'>
                    <Input
                      id="Depot"
                      name="Depot"
                      type="text"
                      className=" text-xs h-6"
                    />
                  </div>
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
                      <td className="p-2">{indent.indent_date || indent.sofDate?.split('T')[0]}</td>
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