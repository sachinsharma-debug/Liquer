// Inventory=============================
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BASE_URL } from '@/api/BaseUrl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Loader2 } from 'lucide-react';

interface Product {
  _id?: string;
  id: string;
  Name: string;
  Parent: string;
  Unit: string;
  Master_Id: string;
  Alter_Id: string;
  Category: string;
  GstApplicable: string;
  Item_Code: string;
  ALIAS: string;
  GST: string;
  CostingMethod: string;
  ValuationMethod: string;
  BaseUnit: string;
  AdditionalUnit: string;
  IsBatchWiseOn: string;
  IsCostTrackingOn: string;
  IgnoreNegativeStock: string;
  TreatSalesAsManufactured: string;
  HasMfgDate: string;
  OpeningBalance: string;
  OpeningValue: string;
  OpeningRate: string;
  ClosingBalance: string;
  InwardQuantity: string;
  OutwardQuantity: string;
  ClosingValue: string;
  OutwardValue: string;
  ClosingRate: string;
  LastSaleDate: string;
  LastSaleParty: string;
  LastSalePrice: string;
  LastSaleQty: string;
  Consumption: string;
}

export default function Inventory() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: "",
    Name: "",
    Parent: "Primary",
    Unit: "",
    Master_Id: "",
    Alter_Id: "",
    Category: "Primary",
    GstApplicable: "Applicable",
    Item_Code: "",
    ALIAS: "",
    GST: "0",
    CostingMethod: "Std. Cost",
    ValuationMethod: "Std. Price",
    BaseUnit: "",
    AdditionalUnit: "Not Applicable",
    IsBatchWiseOn: "No",
    IsCostTrackingOn: "No",
    IgnoreNegativeStock: "No",
    TreatSalesAsManufactured: "No",
    HasMfgDate: "No",
    OpeningBalance: "",
    OpeningValue: "",
    OpeningRate: "",
    ClosingBalance: "",
    InwardQuantity: "",
    OutwardQuantity: "",
    ClosingValue: "",
    OutwardValue: "",
    ClosingRate: "",
    LastSaleDate: "",
    LastSaleParty: "",
    LastSalePrice: "",
    LastSaleQty: "",
    Consumption: ""
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}item`,{
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.data || []);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch products",
          action: <ToastAction altText="Try again" onClick={fetchProducts}>Try again</ToastAction>,
        });
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (field: keyof Product, value: string) => {
    setCurrentProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (isEditMode) {
        // Update existing product
        const response = await fetch(`${BASE_URL}item/${currentProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentProduct),
             credentials: "include",
        });

      
        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        const updatedProduct = await response.json();
        setProducts(products.map(p => 
          p._id === updatedProduct.data._id ? updatedProduct.data : p
        ));
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Add new product
        const response = await fetch(`${BASE_URL}item`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentProduct),
             credentials: "include",

        });

        if (!response.ok) {
          throw new Error('Failed to add product');
        }

        const newProduct = await response.json();
        setProducts([...products, newProduct.data]);
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`${BASE_URL}item/${productToDelete}`, {
        method: 'DELETE',
             credentials: "include",

      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p._id !== productToDelete));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      id: "",
      Name: "",
      Parent: "Primary",
      Unit: "",
      Master_Id: "",
      Alter_Id: "",
      Category: "Primary",
      GstApplicable: "Applicable",
      Item_Code: "",
      ALIAS: "",
      GST: "0",
      CostingMethod: "Std. Cost",
      ValuationMethod: "Std. Price",
      BaseUnit: "",
      AdditionalUnit: "Not Applicable",
      IsBatchWiseOn: "No",
      IsCostTrackingOn: "No",
      IgnoreNegativeStock: "No",
      TreatSalesAsManufactured: "No",
      HasMfgDate: "No",
      OpeningBalance: "",
      OpeningValue: "",
      OpeningRate: "",
      ClosingBalance: "",
      InwardQuantity: "",
      OutwardQuantity: "",
      ClosingValue: "",
      OutwardValue: "",
      ClosingRate: "",
      LastSaleDate: "",
      LastSaleParty: "",
      LastSalePrice: "",
      LastSaleQty: "",
      Consumption: ""
    });
    setIsEditMode(false);
  };

  const filteredProducts = products.filter(product =>
    product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Item_Code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
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
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Product</Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search products by name or item code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p>No products found</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setIsDialogOpen(true)}
              >
                Add your first product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Opening Balance</TableHead>
                  <TableHead>Closing Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.Item_Code}</TableCell>
                    <TableCell>{product.Name}</TableCell>
                    <TableCell>{product.Category}</TableCell>
                    <TableCell>{product.Unit}</TableCell>
                    <TableCell>{product.OpeningBalance}</TableCell>
                    <TableCell>{product.ClosingBalance}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">In Stock</Badge>
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(product._id!)}
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update the product details below"
                : "Fill in the details to add a new product"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Enter product name"
                value={currentProduct.Name}
                onChange={(e) => handleInputChange("Name", e.target.value)}
              />
            </div>

            <div>
              <Label>Parent</Label>
              <Input
                placeholder="Enter parent"
                value={currentProduct.Parent}
                onChange={(e) => handleInputChange("Parent", e.target.value)}
              />
            </div>

            <div>
              <Label>Unit</Label>
              <Input
                placeholder="Enter unit"
                value={currentProduct.Unit}
                onChange={(e) => handleInputChange("Unit", e.target.value)}
              />
            </div>

            <div>
              <Label>Master ID</Label>
              <Input
                placeholder="Enter master ID"
                value={currentProduct.Master_Id}
                onChange={(e) => handleInputChange("Master_Id", e.target.value)}
              />
            </div>

            <div>
              <Label>Alter ID</Label>
              <Input
                placeholder="Enter alter ID"
                value={currentProduct.Alter_Id}
                onChange={(e) => handleInputChange("Alter_Id", e.target.value)}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                placeholder="Enter category"
                value={currentProduct.Category}
                onChange={(e) => handleInputChange("Category", e.target.value)}
              />
            </div>

            <div>
              <Label>GST Applicable</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={currentProduct.GstApplicable}
                onChange={(e) => handleInputChange("GstApplicable", e.target.value)}
              >
                <option>Applicable</option>
                <option>Not Applicable</option>
              </select>
            </div>

            <div>
              <Label>Item Code</Label>
              <Input
                placeholder="Enter item code"
                value={currentProduct.Item_Code}
                onChange={(e) => handleInputChange("Item_Code", e.target.value)}
              />
            </div>

            <div>
              <Label>ALIAS</Label>
              <Input
                placeholder="Enter alias"
                value={currentProduct.ALIAS}
                onChange={(e) => handleInputChange("ALIAS", e.target.value)}
              />
            </div>

            <div>
              <Label>GST %</Label>
              <Input
                placeholder="Enter GST percentage"
                value={currentProduct.GST}
                onChange={(e) => handleInputChange("GST", e.target.value)}
              />
            </div>

            <div>
              <Label>Costing Method</Label>
              <Input
                placeholder="Enter costing method"
                value={currentProduct.CostingMethod}
                onChange={(e) => handleInputChange("CostingMethod", e.target.value)}
              />
            </div>

            <div>
              <Label>Valuation Method</Label>
              <Input
                placeholder="Enter valuation method"
                value={currentProduct.ValuationMethod}
                onChange={(e) => handleInputChange("ValuationMethod", e.target.value)}
              />
            </div>

            <div>
              <Label>Base Unit</Label>
              <Input
                placeholder="Enter base unit"
                value={currentProduct.BaseUnit}
                onChange={(e) => handleInputChange("BaseUnit", e.target.value)}
              />
            </div>

            <div>
              <Label>Additional Unit</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={currentProduct.AdditionalUnit}
                onChange={(e) => handleInputChange("AdditionalUnit", e.target.value)}
              >
                <option>Not Applicable</option>
                <option>Applicable</option>
              </select>
            </div>

            <div>
              <Label>Is Batch Wise On</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={currentProduct.IsBatchWiseOn}
                onChange={(e) => handleInputChange("IsBatchWiseOn", e.target.value)}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div>
              <Label>Is Cost Tracking On</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={currentProduct.IsCostTrackingOn}
                onChange={(e) => handleInputChange("IsCostTrackingOn", e.target.value)}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div>
              <Label>Ignore Negative Stock</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={currentProduct.IgnoreNegativeStock}
                onChange={(e) => handleInputChange("IgnoreNegativeStock", e.target.value)}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div>
              <Label>Treat Sales As Manufactured</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={currentProduct.TreatSalesAsManufactured}
                onChange={(e) => handleInputChange("TreatSalesAsManufactured", e.target.value)}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div>
              <Label>Has Mfg Date</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={currentProduct.HasMfgDate}
                onChange={(e) => handleInputChange("HasMfgDate", e.target.value)}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div>
              <Label>Opening Balance</Label>
              <Input
                placeholder="Enter opening balance"
                value={currentProduct.OpeningBalance}
                onChange={(e) => handleInputChange("OpeningBalance", e.target.value)}
              />
            </div>

            <div>
              <Label>Opening Value</Label>
              <Input
                placeholder="Enter opening value"
                value={currentProduct.OpeningValue}
                onChange={(e) => handleInputChange("OpeningValue", e.target.value)}
              />
            </div>

            <div>
              <Label>Opening Rate</Label>
              <Input
                placeholder="Enter opening rate"
                value={currentProduct.OpeningRate}
                onChange={(e) => handleInputChange("OpeningRate", e.target.value)}
              />
            </div>

            <div>
              <Label>Closing Balance</Label>
              <Input
                placeholder="Enter closing balance"
                value={currentProduct.ClosingBalance}
                onChange={(e) => handleInputChange("ClosingBalance", e.target.value)}
              />
            </div>

            <div>
              <Label>Inward Quantity</Label>
              <Input
                placeholder="Enter inward quantity"
                value={currentProduct.InwardQuantity}
                onChange={(e) => handleInputChange("InwardQuantity", e.target.value)}
              />
            </div>

            <div>
              <Label>Outward Quantity</Label>
              <Input
                placeholder="Enter outward quantity"
                value={currentProduct.OutwardQuantity}
                onChange={(e) => handleInputChange("OutwardQuantity", e.target.value)}
              />
            </div>

            <div>
              <Label>Closing Value</Label>
              <Input
                placeholder="Enter closing value"
                value={currentProduct.ClosingValue}
                onChange={(e) => handleInputChange("ClosingValue", e.target.value)}
              />
            </div>

            <div>
              <Label>Outward Value</Label>
              <Input
                placeholder="Enter outward value"
                value={currentProduct.OutwardValue}
                onChange={(e) => handleInputChange("OutwardValue", e.target.value)}
              />
            </div>

            <div>
              <Label>Closing Rate</Label>
              <Input
                placeholder="Enter closing rate"
                value={currentProduct.ClosingRate}
                onChange={(e) => handleInputChange("ClosingRate", e.target.value)}
              />
            </div>

            <div>
              <Label>Last Sale Date</Label>
              <Input
                placeholder="Enter last sale date"
                value={currentProduct.LastSaleDate}
                onChange={(e) => handleInputChange("LastSaleDate", e.target.value)}
              />
            </div>

            <div>
              <Label>Last Sale Party</Label>
              <Input
                placeholder="Enter last sale party"
                value={currentProduct.LastSaleParty}
                onChange={(e) => handleInputChange("LastSaleParty", e.target.value)}
              />
            </div>

            <div>
              <Label>Last Sale Price</Label>
              <Input
                placeholder="Enter last sale price"
                value={currentProduct.LastSalePrice}
                onChange={(e) => handleInputChange("LastSalePrice", e.target.value)}
              />
            </div>

            <div>
              <Label>Last Sale Qty</Label>
              <Input
                placeholder="Enter last sale quantity"
                value={currentProduct.LastSaleQty}
                onChange={(e) => handleInputChange("LastSaleQty", e.target.value)}
              />
            </div>

            <div>
              <Label>Consumption</Label>
              <Input
                placeholder="Enter consumption"
                value={currentProduct.Consumption}
                onChange={(e) => handleInputChange("Consumption", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update" : "Add"} Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}