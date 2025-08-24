import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { BASE_URL } from '@/api/BaseUrl';

interface GRNItem {
  _id: string;
  productId: string;
  productName: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
}

interface GRN {
  _id: string;
  grnNumber: string;
  date: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  status: 'Pending' | 'Partial' | 'Complete' | 'Cancelled';
  items: GRNItem[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function GRNManagement() {
  const { toast } = useToast();
  const [grns, setGrns] = useState<GRN[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Current GRN states
  const [selectedGrn, setSelectedGrn] = useState<GRN | null>(null);
  const [grnToDelete, setGrnToDelete] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Omit<GRN, '_id'>>({
    grnNumber: '',
    date: new Date().toISOString().split('T')[0],
    poNumber: '',
    vendorId: '',
    vendorName: '',
    status: 'Pending',
    items: [],
    notes: ''
  });
  const [newItem, setNewItem] = useState<Omit<GRNItem, '_id'>>({
    productId: '',
    productName: '',
    quantityOrdered: 0,
    quantityReceived: 0,
    unitPrice: 0
  });

  // Fetch all GRNs
  useEffect(() => {
    const fetchGRNs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/grn`);
        if (!response.ok) {
          throw new Error('Failed to fetch GRNs');
        }
        const data = await response.json();
        setGrns(data || []);
      } catch (error) {
        setError(error.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGRNs();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof Omit<GRN, '_id'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle item input changes
  const handleItemChange = (field: keyof GRNItem, value: string | number, index?: number) => {
    if (index !== undefined) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else {
      setNewItem(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Add new item to form
  const handleAddItem = () => {
    if (newItem.productId && newItem.productName) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { 
          ...newItem, 
          _id: Date.now().toString() 
        }]
      }));
      setNewItem({
        productId: '',
        productName: '',
        quantityOrdered: 0,
        quantityReceived: 0,
        unitPrice: 0
      });
    }
  };

  // Remove item from form
  const handleRemoveItem = (_id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item._id !== _id)
    }));
  };

  // Open modal for creating new GRN
  const handleCreateGRN = () => {
    setFormData({
      grnNumber: '',
      date: new Date().toISOString().split('T')[0],
      poNumber: '',
      vendorId: '',
      vendorName: '',
      status: 'Pending',
      items: [],
      notes: ''
    });
    setIsCreateEditModalOpen(true);
  };

  // Open modal for editing existing GRN
  const handleEditGRN = (grn: GRN) => {
    setSelectedGrn(grn);
    setFormData({
      grnNumber: grn.grnNumber,
      date: grn.date,
      poNumber: grn.poNumber,
      vendorId: grn.vendorId,
      vendorName: grn.vendorName,
      status: grn.status,
      items: grn.items.map(item => ({
        ...item,
        _id: item._id
      })),
      notes: grn.notes || ''
    });
    setIsCreateEditModalOpen(true);
  };

  // Open modal for viewing GRN details
  const handleViewGRN = (grn: GRN) => {
    setSelectedGrn(grn);
    setIsViewModalOpen(true);
  };

  // Open confirmation modal for deleting GRN
  const handleDeleteGRN = (_id: string) => {
    setGrnToDelete(_id);
    setIsDeleteModalOpen(true);
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const method = selectedGrn ? 'PUT' : 'POST';
      const url = selectedGrn 
        ? `${BASE_URL}/grn/${selectedGrn._id}`
        : `${BASE_URL}/grn`;

      // Prepare the payload
      const payload = {
        grnNumber: formData.grnNumber,
        date: formData.date,
        poNumber: formData.poNumber,
        vendorId: formData.vendorId,
        vendorName: formData.vendorName,
        status: formData.status,
        items: formData.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantityOrdered: item.quantityOrdered,
          quantityReceived: item.quantityReceived,
          unitPrice: item.unitPrice
        })),
        notes: formData.notes
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(selectedGrn ? 'Failed to update GRN' : 'Failed to create GRN');
      }

      const result = await response.json();
      
      if (selectedGrn) {
        setGrns(grns.map(grn => grn._id === selectedGrn._id ? result : grn));
        toast({
          title: 'Success',
          description: 'GRN updated successfully',
        });
      } else {
        setGrns([...grns, result]);
        toast({
          title: 'Success',
          description: 'GRN created successfully',
        });
      }

      setIsCreateEditModalOpen(false);
      setSelectedGrn(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm and execute GRN deletion
  const confirmDelete = async () => {
    if (!grnToDelete) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/grn/${grnToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete GRN');
      }

      setGrns(grns.filter(grn => grn._id !== grnToDelete));
      toast({
        title: 'Success',
        description: 'GRN deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setGrnToDelete(null);
    }
  };

  // Calculate items received status
  const getItemsReceivedStatus = (grn: GRN) => {
    const totalOrdered = grn.items.reduce((sum, item) => sum + item.quantityOrdered, 0);
    const totalReceived = grn.items.reduce((sum, item) => sum + item.quantityReceived, 0);
    return `${totalReceived}/${totalOrdered}`;
  };

  if (isLoading && grns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading GRNs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Goods Receipt Notes (GRN)</h1>
        <Button onClick={handleCreateGRN}>Create GRN</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>GRN List</CardTitle>
        </CardHeader>
        <CardContent>
          {grns.length === 0 ? (
            <div className="text-center py-8">
              <p>No GRNs found</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={handleCreateGRN}
              >
                Create your first GRN
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GRN No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Items Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grns.map((grn) => (
                  <TableRow key={grn._id}>
                    <TableCell>{grn.grnNumber}</TableCell>
                    <TableCell>{new Date(grn.date).toLocaleDateString()}</TableCell>
                    <TableCell>{grn.poNumber}</TableCell>
                    <TableCell>{grn.vendorName}</TableCell>
                    <TableCell>{getItemsReceivedStatus(grn)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        grn.status === 'Complete' ? 'default' :
                        grn.status === 'Partial' ? 'secondary' :
                        grn.status === 'Pending' ? 'outline' : 'destructive'
                      }>
                        {grn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewGRN(grn)}
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditGRN(grn)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteGRN(grn._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View GRN Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>GRN Details</DialogTitle>
            <DialogDescription>
              Viewing details for GRN: {selectedGrn?.grnNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>GRN Number</Label>
              <Input value={selectedGrn?.grnNumber} readOnly />
            </div>
            <div>
              <Label>Date</Label>
              <Input value={selectedGrn?.date} readOnly />
            </div>
            <div>
              <Label>PO Number</Label>
              <Input value={selectedGrn?.poNumber} readOnly />
            </div>
            <div>
              <Label>Vendor ID</Label>
              <Input value={selectedGrn?.vendorId} readOnly />
            </div>
            <div>
              <Label>Vendor Name</Label>
              <Input value={selectedGrn?.vendorName} readOnly />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={selectedGrn?.status} readOnly />
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Input value={selectedGrn?.notes || ''} readOnly />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Items</h3>
            {selectedGrn?.items.length ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Ordered</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Unit Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedGrn.items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.productId}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantityOrdered}</TableCell>
                        <TableCell>{item.quantityReceived}</TableCell>
                        <TableCell>{item.unitPrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No items in this GRN</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit GRN Modal */}
      <Dialog open={isCreateEditModalOpen} onOpenChange={setIsCreateEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedGrn ? 'Edit GRN' : 'Create New GRN'}</DialogTitle>
            <DialogDescription>
              {selectedGrn ? 'Update the GRN details below' : 'Fill in the details to create a new GRN'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>GRN Number</Label>
              <Input
                value={formData.grnNumber}
                onChange={(e) => handleInputChange('grnNumber', e.target.value)}
                placeholder="Enter GRN number"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div>
              <Label>PO Number</Label>
              <Input
                value={formData.poNumber}
                onChange={(e) => handleInputChange('poNumber', e.target.value)}
                placeholder="Enter PO number"
              />
            </div>
            <div>
              <Label>Vendor ID</Label>
              <Input
                value={formData.vendorId}
                onChange={(e) => handleInputChange('vendorId', e.target.value)}
                placeholder="Enter vendor ID"
              />
            </div>
            <div>
              <Label>Vendor Name</Label>
              <Input
                value={formData.vendorName}
                onChange={(e) => handleInputChange('vendorName', e.target.value)}
                placeholder="Enter vendor name"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Input
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter any notes"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Items</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <Label>Product ID</Label>
                <Input
                  value={newItem.productId}
                  onChange={(e) => handleItemChange('productId', e.target.value)}
                  placeholder="Product ID"
                />
              </div>
              <div>
                <Label>Product Name</Label>
                <Input
                  value={newItem.productName}
                  onChange={(e) => handleItemChange('productName', e.target.value)}
                  placeholder="Product Name"
                />
              </div>
              <div>
                <Label>Qty Ordered</Label>
                <Input
                  type="number"
                  value={newItem.quantityOrdered}
                  onChange={(e) => handleItemChange('quantityOrdered', Number(e.target.value))}
                  placeholder="Ordered"
                />
              </div>
              <div>
                <Label>Qty Received</Label>
                <Input
                  type="number"
                  value={newItem.quantityReceived}
                  onChange={(e) => handleItemChange('quantityReceived', Number(e.target.value))}
                  placeholder="Received"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddItem} className="w-full">
                  Add Item
                </Button>
              </div>
            </div>

            {formData.items.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Ordered</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.productId}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantityOrdered}
                            onChange={(e) => handleItemChange('quantityOrdered', Number(e.target.value), index)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantityReceived}
                            onChange={(e) => handleItemChange('quantityReceived', Number(e.target.value), index)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange('unitPrice', Number(e.target.value), index)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedGrn ? 'Update' : 'Create'} GRN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the GRN.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}