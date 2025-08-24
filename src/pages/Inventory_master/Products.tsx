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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Edit, Save, Plus, Loader2, Calendar } from "lucide-react";
import { BASE_URL } from "@/api/BaseUrl";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

interface Category {
  _id: string;
  name: string;
  parentCategory?: string;
  categoryName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Unit {
  _id: string;
  symbol: string;
  decimalPlaces: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Supplier {
  _id: string;
  name: string;
}

interface Depot {
  _id: string;
  Name: string;
}

interface Group {
  _id: string;
  name: string;
  parentGroupName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  group?: Group;
  type: string;
  subType: string;
  origin: string;
  alcoholPercentage: number;
  volume: number;
  unit: Unit;
  altUnit?: Unit;
  stock: number;
  minStockLevel: number;
  preferredSupplier?: Supplier;
  costingInfo: boolean;
  declaredPrice: number;
  margin: number;
  sellingPrice: number;
  mrp: number;
  roundOff: number;
  finalPrice: number;
  reorderLevels: {
    depot: string;
    quantity: number;
    altQuantity: number;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Allocation {
  godown: string;
  quantity: number;
  rate: number;
  amount: number;
  cases?: number;
}

interface ProductAllocation {
  productId: string;
  productName: string;
  category: string;
  unit: string;
  altUnit?: string;
  conversion?: string;
  openingBalance: {
    quantity: number;
    cases?: number;
    rate: number;
    value: number;
  };
  totalAllocated: number;
  allocations: Allocation[];
}

export function ProductPage() {
  const [openingBalance, setOpeningBalance] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsDialogOpen(true);
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [depots, setDepots] = useState<Depot[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productAllocations, setProductAllocations] = useState<
    ProductAllocation[]
  >([]);
  const [selectedProductForAllocation, setSelectedProductForAllocation] =
    useState<string | null>(null);
  const [standardRateDialogOpen, setStandardRateDialogOpen] = useState(false);
  const [ratePeriodDialogOpen, setRatePeriodDialogOpen] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ratePeriods, setRatePeriods] = useState<
    Array<{
      effectiveDate: string;
      endDate: string;
    }>
  >([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    masterId: "",
    alterId: "",
    name: "",
    description: "",
    category: "",
    group: "",
    brand: "",
    type: "",
    subType: "",
    origin: "",
    alcoholPercentage: 0,
    volume: 0,
    standardRate: "",
    unit: "",
    altUnit: "",
    altUnitQuantity: "" as string | number,
    conversionRatio: "" as string | number,
    stock: 0,
    minStockLevel: 0,
    preferredSupplier: "",
    costingInfo: false,
    declaredPrice: 0,
    margin: 0,
    sellingPrice: 0,
    mrp: 0,
    roundOff: 0,
    finalPrice: 0,
    reorderLevels: [] as Array<{
      depot: string;
      quantity: number;
      altQuantity: number;
    }>,
    isActive: true,
  });

  const productTypes = [
    "Beer",
    "Wine",
    "Vodka",
    "GIN",
    "Rum",
    "Whiskey",
    "Other",
  ];

  const productOrigins = ["Not applicable", "CS", "FL", "IML"];

  const beerSubTypes = ["Ales", "Lagers"];

  const wineSubTypes = ["Red", "White", "Rose", "Sparkling", "Fortified"];

  const whiskeySubTypes = [
    "Rye",
    "Canadian",
    "Japanese",
    "Bourbon",
    "Tennesse",
    "Irish",
    "Scotch",
    "Blended",
    "Single Malt",
  ];

  const ginSubTypes = [
    "London Dry Gin",
    "Plymouth Gin",
    "Old Tom Gin",
    "Navy Strength Gin",
    "New Western Dry Gin",
    "Genever (Dutch Gin)",
    "Barrel-Aged Gin",
    "Sloe Gin",
    "Fruit-Infused Gin",
    "Botanical Gins",
    "Flavored Gins",
    "Organic Gin",
  ];

  const rumSubTypes = [
    "White Rum",
    "Gold Rum",
    "Dark Rum",
    "Overproof Rum",
    "Navy Rum",
    "Single cask Rum",
    "XO Rum",
    "Solera",
    "Rhum Agricole",
    "Cachaça",
    "Batavia Arrack",
  ];

  const vodkaSubTypes = [
    "Rye Vodka",
    "Fruit Vodka",
    "Corn Vodka",
    "Potato Vodka",
    "Molasses Vodka",
    "Flavored Vodka",
    "Russian Vodka",
    "American Vodka",
    "Polish Vodka",
  ];

  const getSubTypes = (type: string) => {
    switch (type) {
      case "Beer":
        return beerSubTypes;
      case "Wine":
        return wineSubTypes;
      case "Whiskey":
        return whiskeySubTypes;
      case "GIN":
        return ginSubTypes;
      case "Rum":
        return rumSubTypes;
      case "Vodka":
        return vodkaSubTypes;
      default:
        return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        productsRes,
        categoriesRes,
        unitsRes,
        suppliersRes,
        depotsRes,
        groupsRes,
      ] = await Promise.all([
        fetch(`${BASE_URL}product_list`),
        fetch(`${BASE_URL}stockcategory_list`),
        fetch(`${BASE_URL}stockunit_list`),
        fetch(`${BASE_URL}vendor_list`),
        fetch(`${BASE_URL}get_depot`),
        fetch(`${BASE_URL}stockgroup_list`),
      ]);

      const [
        productsData,
        categoriesData,
        unitsData,
        suppliersData,
        depotsData,
        groupsData,
      ] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        unitsRes.json(),
        suppliersRes.json(),
        depotsRes.json(),
        groupsRes.json(),
      ]);

      if (!productsRes.ok)
        throw new Error(productsData.message || "Failed to fetch products");
      if (!categoriesRes.ok)
        throw new Error(categoriesData.message || "Failed to fetch categories");
      if (!unitsRes.ok)
        throw new Error(unitsData.message || "Failed to fetch units");
      if (!suppliersRes.ok)
        throw new Error(suppliersData.message || "Failed to fetch suppliers");
      if (!depotsRes.ok)
        throw new Error(depotsData.message || "Failed to fetch depots");
      if (!groupsRes.ok)
        throw new Error(groupsData.message || "Failed to fetch groups");

      setProducts(productsData.data || []);
      setCategories(categoriesData.data || []);
      setUnits(unitsData.data || []);
      setSuppliers(suppliersData.data || []);
      setDepots(depotsData.data || []);
      setGroups(groupsData.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchProductAllocations = async (productId: string) => {
    try {
      // Mock data based on the PNG
      const mockAllocation: ProductAllocation = {
        productId: productId,
        productName: "12 Horses Whisky 375 ML",
        category: "Herald Beverages Pvt. Ltd.",
        unit: "BOTTLE",
        altUnit: "CASE",
        conversion: "1 CASE = 24 BOTTLE",
        openingBalance: {
          quantity: 25,
          cases: 10,
          rate: 1.75,
          value: 131652.0,
        },
        totalAllocated: 2544,
        allocations: [
          {
            godown: "Clonthag III. Depot",
            quantity: 1000,
            cases: 45,
            rate: 1.75,
            amount: 5890.0,
          },
          {
            godown: "Habra IML Depot",
            quantity: 19,
            cases: 15,
            rate: 1.75,
            amount: 47196.0,
          },
          {
            godown: "Asamol IML Depot",
            quantity: 52,
            cases: 15,
            rate: 1.75,
            amount: 28566.0,
          },
        ],
      };

      setProductAllocations([mockAllocation]);
      setSelectedProductForAllocation(productId);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch product allocations",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      masterId: "",
      alterId: "",
      name: "",
      description: "",
      category: "",
      group: "",
      brand: "",
      type: "",
      subType: "",
      origin: "",
      alcoholPercentage: 0,
      volume: 0,
      standardRate: "",
      unit: "",
      altUnit: "",
      altUnitQuantity: "",
      conversionRatio: "",
      stock: 0,
      minStockLevel: 0,
      preferredSupplier: "",
      costingInfo: false,
      declaredPrice: 0,
      margin: 0,
      sellingPrice: 0,
      mrp: 0,
      roundOff: 0,
      finalPrice: 0,
      reorderLevels: [],
      isActive: true,
    });
    setIsEditing(false);
    setCurrentId(null);
    setEffectiveDate("");
    setEndDate("");
    setRatePeriods([]);
  };

  const startAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const startEdit = (product: Product) => {
    setFormData({
      masterId: (product as any).masterId || "",
      alterId: (product as any).alterId || "",
      name: product.name,
      description: product.description,
      category: product.category._id,
      group: product.group?._id || "",
      brand: (product as any).brand || "",
      type: product.type,
      subType: product.subType,
      origin: product.origin,
      alcoholPercentage: product.alcoholPercentage,
      volume: product.volume,
      standardRate: (product as any).standardRate || "",
      unit: product.unit._id,
      altUnit: product.altUnit?._id || "",
      altUnitQuantity: (product as any).altUnitQuantity || "",
      conversionRatio: (product as any).conversionRatio || "",
      stock: product.stock,
      minStockLevel: product.minStockLevel,
      preferredSupplier: product.preferredSupplier?._id || "",
      costingInfo: product.costingInfo,
      declaredPrice: product.declaredPrice,
      margin: product.margin,
      sellingPrice: product.sellingPrice,
      mrp: product.mrp,
      roundOff: product.roundOff,
      finalPrice: product.finalPrice,
      reorderLevels: product.reorderLevels || [],
      isActive: product.isActive,
    });
    setIsEditing(true);
    setCurrentId(product._id);
    setDialogOpen(true);
  };

  const cancelForm = () => {
    setDialogOpen(false);
    setStandardRateDialogOpen(false);
    setRatePeriodDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.category ||
      !formData.unit ||
      !formData.type
    ) {
      setError("Required fields are missing");
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const url =
        isEditing && currentId
          ? `${BASE_URL}product_update/${currentId}`
          : `${BASE_URL}product_create`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Operation failed");

      toast({
        title: "Success",
        description: isEditing
          ? "Product updated successfully"
          : "Product created successfully",
      });

      await fetchData();
      cancelForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Operation failed",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(`${BASE_URL}product_delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Delete failed",
        variant: "destructive",
      });
    }
  };

  const addReorderLevel = () => {
    setFormData({
      ...formData,
      reorderLevels: [
        ...formData.reorderLevels,
        { depot: "", quantity: 0, altQuantity: 0 },
      ],
    });
  };

  const updateReorderLevel = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedLevels = [...formData.reorderLevels];
    updatedLevels[index] = {
      ...updatedLevels[index],
      [field]: typeof value === "string" ? value : Number(value),
    };
    setFormData({ ...formData, reorderLevels: updatedLevels });
  };

  const removeReorderLevel = (index: number) => {
    const updatedLevels = formData.reorderLevels.filter((_, i) => i !== index);
    setFormData({ ...formData, reorderLevels: updatedLevels });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const ProductAllocationView = ({
    allocation,
  }: {
    allocation: ProductAllocation;
  }) => {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Product Allocation: {allocation.productName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Under Category</Label>
                <p>{allocation.category}</p>
              </div>
              <div>
                <Label>Units</Label>
                <p>{allocation.unit}</p>
              </div>
              {allocation.altUnit && (
                <div>
                  <Label>Alternate units</Label>
                  <p>{allocation.altUnit}</p>
                </div>
              )}
              {allocation.conversion && (
                <div>
                  <Label>Conversion</Label>
                  <p>{allocation.conversion}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Label>Opening Balance</Label>
              <div className="flex items-center gap-2">
                <span>
                  Quantity: {allocation.openingBalance.quantity}{" "}
                  {allocation.unit}
                </span>
                {allocation.openingBalance.cases && (
                  <span>
                    ({allocation.openingBalance.cases} {allocation.altUnit})
                  </span>
                )}
                <span>
                  Rate per: ${allocation.openingBalance.rate} /{" "}
                  {allocation.unit}
                </span>
                <span>
                  Value: {allocation.openingBalance.value.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Label>
                Allocations: {allocation.totalAllocated} {allocation.unit}
              </Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Godown</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate per</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocation.allocations.map((alloc, index) => (
                    <TableRow key={index}>
                      <TableCell>{alloc.godown}</TableCell>
                      <TableCell>
                        {alloc.quantity} {allocation.unit}
                        {alloc.cases && (
                          <span className="text-muted-foreground">
                            {" "}
                            ({alloc.cases} {allocation.altUnit})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        ${alloc.rate} / {allocation.unit}
                      </TableCell>
                      <TableCell>${alloc.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={startAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-6">
              {/* Basic Information Section */}
              <div className="flex-1 space-y-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
                  Basic
                </h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor="masterId" className="text-xs w-32 text-right">
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
                  <Label htmlFor="alterId" className="text-xs w-32 text-right">
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
                    placeholder="Product name"
                    className="h-6 text-xs flex-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="category" className="text-xs w-32 text-right">
                    Category *:
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="group" className="text-xs w-32 text-right">
                    Group:
                  </Label>
                  <Select
                    value={formData.group || "none"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        group: value === "none" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="none">None</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group._id} value={group._id}>
                          {group.name}{" "}
                          {group.parentGroupName
                            ? `(${group.parentGroupName})`
                            : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="unit" className="text-xs w-32 text-right">
                    Unit *:
                  </Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) =>
                      setFormData({ ...formData, unit: value })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {units
                        .filter((unit) => unit._id !== formData.altUnit)
                        .map((unit) => (
                          <SelectItem key={unit._id} value={unit._id}>
                            {unit.symbol}{" "}
                            {unit.decimalPlaces
                              ? `(${unit.decimalPlaces} decimals)`
                              : ""}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="altUnit" className="text-xs w-32 text-right">
                    Alternate Unit:
                  </Label>
                  <Select
                    value={formData.altUnit || "none"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        altUnit: value === "none" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select alternate unit" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="none">None</SelectItem>
                      {units
                        .filter((unit) => unit._id !== formData.unit)
                        .map((unit) => (
                          <SelectItem key={unit._id} value={unit._id}>
                            {unit.symbol}{" "}
                            {unit.decimalPlaces
                              ? `(${unit.decimalPlaces} decimals)`
                              : ""}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.altUnit && formData.altUnit !== "none" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-32 text-right text-gray-500">
                        e.g: 1 case = 24 bottle
                      </Label>
                      <div className="flex-1"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="conversionRatio"
                        className="text-xs w-32 text-right"
                      >
                        where:
                      </Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="number"
                          min="0"
                          value={formData.altUnitQuantity || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                              ...formData,
                              altUnitQuantity: value ? parseInt(value) : "",
                            });
                          }}
                          className="h-6 text-xs w-24 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          placeholder="1"
                        />
                        <span className="text-xs font-medium">
                          {units.find((u) => u._id === formData.altUnit)
                            ?.symbol || "CASE"}
                        </span>
                        <span className="text-xs">=</span>
                        <Input
                          id="conversionRatio"
                          type="number"
                          min="0"
                          value={formData.conversionRatio || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                              ...formData,
                              conversionRatio: value ? parseInt(value) : "",
                            });
                          }}
                          className="h-6 text-xs w-24 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          placeholder="24"
                        />
                        <span className="text-xs font-medium">
                          {units.find((u) => u._id === formData.unit)?.symbol ||
                            "BOTTLE"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="preferredSupplier"
                    className="text-xs w-32 text-right"
                  >
                    Preferred Supplier:
                  </Label>
                  <Select
                    value={formData.preferredSupplier || "none"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        preferredSupplier: value === "none" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select preferred supplier" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="none">None</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="description"
                    className="text-xs w-32 text-right"
                  >
                    Description:
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Product description"
                    className="text-xs flex-1"
                    rows={2}
                  />
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-gray-200"></div>

              {/* Additional Information Section */}
              <div className="flex-1 space-y-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
                  Additional Info
                </h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor="brand" className="text-xs w-32 text-right">
                    Brand:
                  </Label>
                  <Input
                    id="brand"
                    value={formData.brand || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="Brand name"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="type" className="text-xs w-32 text-right">
                    Type *:
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        type: value,
                        subType: "", // Reset subtype when type changes
                      })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.type && getSubTypes(formData.type).length > 0 && (
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="subType"
                      className="text-xs w-32 text-right"
                    >
                      Sub Type:
                    </Label>
                    <Select
                      value={formData.subType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subType: value })
                      }
                    >
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Select sub type" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubTypes(formData.type).map((subType) => (
                          <SelectItem key={subType} value={subType}>
                            {subType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Label htmlFor="origin" className="text-xs w-32 text-right">
                    Origin:
                  </Label>
                  <Select
                    value={formData.origin}
                    onValueChange={(value) =>
                      setFormData({ ...formData, origin: value })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {productOrigins.map((origin) => (
                        <SelectItem key={origin} value={origin}>
                          {origin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="alcoholPercentage"
                    className="text-xs w-32 text-right"
                  >
                    Alcohol %:
                  </Label>
                  <Input
                    id="alcoholPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.alcoholPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        alcoholPercentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="volume" className="text-xs w-32 text-right">
                    Volume (ml):
                  </Label>
                  <Input
                    id="volume"
                    type="number"
                    min="0"
                    value={formData.volume}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        volume: parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="standardRate"
                    className="text-xs w-32 text-right"
                  >
                    Standard Rate:
                  </Label>
                  <Select
                    value={formData.standardRate}
                    onValueChange={(value) => {
                      setFormData({ ...formData, standardRate: value });
                      if (value === "yes") {
                        setStandardRateDialogOpen(true);
                      }
                    }}
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select standard rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="stock" className="text-xs w-32 text-right">
                    Current Stock:
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="minStockLevel"
                    className="text-xs w-32 text-right"
                  >
                    Min Stock Level:
                  </Label>
                  <Input
                    id="minStockLevel"
                    type="number"
                    min="0"
                    value={formData.minStockLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minStockLevel: parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-6 text-xs flex-1"
                  />
                </div>
                
                {/* <div className="flex items-center gap-2">
                  <Label htmlFor="isActive" className="text-xs w-32 text-right">
                    Active:
                  </Label>
                  <div className="flex-1">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div> */}

                
                  
              </div>
            </div>
                  <div className="row">

                      {/* Opening balance dialog */}
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Opening Balance Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 border-t pt-2">
                              <Label htmlFor="minStockLevel" className="text-xs w-32 text-right">
                                Allocations Of:
                              </Label>
                              <Input
                                id="minStockLevel"
                                type="text"
                                min="0"
                                value={openingBalance}
                                onChange={(e) => setOpeningBalance(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-6 text-xs flex-1"
                              />
                            </div>

                            <div className="flex items-center gap-2 pb-2 border-b">
                              <Label htmlFor="minStockLevel" className="text-xs w-32 text-right">
                                For:
                              </Label>
                              <Input
                                id="minStockLevel"
                                type="text"
                                min="0"
                                value={openingBalance}
                                onChange={(e) => setOpeningBalance(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-6 text-xs flex-1"
                              />
                            </div>

                              <div className="grid grid-cols-5 gap-2 text-xs font-medium mt-0 text-gray-600 py-2 border-b">
                                <div>Godown</div>
                                <div></div>
                                <div>Quantity</div>
                                <div className="text-center">Rate</div>
                                <div className="text-center">Amount</div>
                              </div>
                              <div className="grid grid-cols-5 gap-2 items-center">

                                <Input
                                  type="text"
                                  className="h-6 text-xs text-center"
                                style={{width: '175px'}}
                                />
                                <div></div>
                                <Input
                                  type="text"
                                  className="h-6 text-xs text-center"
                                />
                                <Input
                                  type="text"
                                  className="h-6 text-xs text-center"
                                />
                                <Input
                                  type="text"
                                  className="h-6 text-xs text-center"
                                />
                              </div>
                          </div>
                          <div className="flex justify-end pt-4 border-t">
                            <Button >Save</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                        <div className="flex mt-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="minStockLevel" className="text-xs w-32 text-right">
                              Opening Balance
                            </Label>
                            <Input
                              id="minStockLevel"
                              type="text"
                              min="0"
                              value={openingBalance}
                              onChange={(e) => setOpeningBalance(e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="h-6 text-xs flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="minStockLevel" className="text-xs w-32 text-right">
                              Rate
                            </Label>
                            <Input
                              id="minStockLevel"
                              type="text"
                              min="0"
                              className="h-6 text-xs flex-1"
                              
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="minStockLevel" className="text-xs w-32 text-right">
                              Value
                            </Label>
                            <Input
                              id="minStockLevel"
                              type="text"
                              min="0"
                              className="h-6 text-xs flex-1"
                              // style={{width: '100px'}}
                            />
                          </div>
                        </div>
                  </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={cancelForm}>
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
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Standard Rate Effective Date Dialog */}
      <Dialog
        open={standardRateDialogOpen}
        onOpenChange={setStandardRateDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Effective Date</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="effectiveDate" className="text-sm w-32">
                Select Date:
              </Label>
              <Input
                id="effectiveDate"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStandardRateDialogOpen(false);
                  setFormData({ ...formData, standardRate: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (effectiveDate) {
                    setStandardRateDialogOpen(false);
                    setRatePeriodDialogOpen(true);
                  } else {
                    toast({
                      title: "Error",
                      description: "Please select an effective date",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!effectiveDate}
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rate Period Configuration Dialog */}
      <Dialog
        open={ratePeriodDialogOpen}
        onOpenChange={setRatePeriodDialogOpen}
      >
        <DialogContent className="max-w-3xl" style={{height:'600px',overflowY:'auto'}}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Price Configuration</DialogTitle>
              <div className="p-2 bg-gray-50 rounded text-xs">
                <span className="text-xs font-medium text-gray-600">
                  Current:{" "}
                  {effectiveDate
                    ? new Date(effectiveDate).toLocaleDateString()
                    : "Not set"}
                </span>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            {/* Display existing rate periods */}
            {ratePeriods.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Existing Price Periods:
                </Label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {ratePeriods.map((period, index) => (
                    <div
                      key={index}
                      className="p-2 bg-blue-50 rounded text-xs flex justify-between items-center"
                    >
                      <span>
                        {new Date(period.effectiveDate).toLocaleDateString()} to{" "}
                        {period.endDate
                          ? new Date(period.endDate).toLocaleDateString()
                          : "ongoing"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                        onClick={() => {
                          const updatedPeriods = ratePeriods.filter(
                            (_, i) => i !== index
                          );
                          setRatePeriods(updatedPeriods);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Label htmlFor="unit" className="text-sm w-32">
                Unit *:
              </Label>
              <Select
                value={formData.unit}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit: value })
                }
              >
                <SelectTrigger className="h-6 text-xs flex-1">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {units
                    .filter((unit) => unit._id !== formData.altUnit)
                    .map((unit) => (
                      <SelectItem key={unit._id} value={unit._id}>
                        {unit.symbol}{" "}
                        {unit.decimalPlaces
                          ? `(${unit.decimalPlaces} decimals)`
                          : ""}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="altUnit" className="text-sm w-32">
                Alternate Unit:
              </Label>
              <Select
                value={formData.altUnit || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    altUnit: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="h-6 text-xs flex-1">
                  <SelectValue placeholder="Select alternate unit" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="none">None</SelectItem>
                  {units
                    .filter((unit) => unit._id !== formData.unit)
                    .map((unit) => (
                      <SelectItem key={unit._id} value={unit._id}>
                        {unit.symbol}{" "}
                        {unit.decimalPlaces
                          ? `(${unit.decimalPlaces} decimals)`
                          : ""}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Horizontal divider lines */}
            <div className="border-t border-gray-400"></div>
            <div className="border-t border-gray-400"></div>

            {/* Pricing Configuration */}
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 pb-2 border-b">
                <div>Description</div>
                <div>Formula</div>
                <div className="text-center">Rate</div>
                <div className="text-center">Amount</div>
                <div className="text-center">Remarks</div>
              </div>

              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs text-gray-700">Base Price</div>

                <Select>
                  <SelectTrigger className="h-6 text-xs flex-1">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Not Applicable</SelectItem>
                    <SelectItem value="no">Percentage</SelectItem>
                    <SelectItem value="no">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input placeholder="Remarks" className="h-6 text-xs" />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs text-gray-700">
                  <Select>
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">End Of List</SelectItem>
                      <SelectItem value="no">1</SelectItem>
                      <SelectItem value="no">2</SelectItem>
                    </SelectContent>
                  </Select>

                </div>

                <Select>
                  <SelectTrigger className="h-6 text-xs flex-1">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Not Applicable</SelectItem>
                    <SelectItem value="no">Percentage</SelectItem>
                    <SelectItem value="no">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input placeholder="Remarks" className="h-6 text-xs" />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs text-gray-700">
                  <Select>
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">End Of List</SelectItem>
                      <SelectItem value="no">1</SelectItem>
                      <SelectItem value="no">2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select>
                  <SelectTrigger className="h-6 text-xs flex-1">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Not Applicable</SelectItem>
                    <SelectItem value="no">Percentage</SelectItem>
                    <SelectItem value="no">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input placeholder="Remarks" className="h-6 text-xs" />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center border-t border-b py-2">
                <div className="text-xs text-gray-700"><strong>Landed Cost</strong></div>
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs text-gray-700">Distributer</div>

                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input placeholder="Remarks" className="h-6 text-xs" />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center border-t border-b py-2">
                <div className="text-xs text-gray-700"><strong>Whole sale price</strong></div>
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs text-gray-700">BEVCO Margin</div>

                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input placeholder="Remarks" className="h-6 text-xs" />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center border-t border-b py-2">
                <div className="text-xs text-gray-700"><strong>Retail Price</strong></div>
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs text-gray-700">Retail Margin</div>

                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input placeholder="Remarks" className="h-6 text-xs" />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs text-gray-700">Special Purpose Levy</div>

                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input placeholder="Remarks" className="h-6 text-xs" />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center border-t pt-2">
                <div className="text-xs text-gray-700"><strong>MRP</strong></div>
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs text-gray-700"><strong>Round Off</strong></div>
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-6 text-xs text-center"
                  step="0.01"
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
              </div>

              <div className="grid grid-cols-5 gap-2 items-center border-b pb-2">
                <div className="text-xs text-gray-700"><strong>Final MRP</strong></div>
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
                <Input
                  type="number"
                  className="h-6 text-xs text-center"
                  disabled
                />
              </div>
              
            </div>

            <div className="flex justify-between space-x-3">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRatePeriodDialogOpen(false);
                    setStandardRateDialogOpen(true);
                  }}
                >
                  Back
                </Button>
              </div>
              <Button
                type="button"
                onClick={() => {
                  // Add current period if there's an effective date
                  if (effectiveDate) {
                    const newPeriod = {
                      effectiveDate: effectiveDate,
                      endDate: endDate,
                    };
                    setRatePeriods([newPeriod, ...ratePeriods]);
                  }

                  setRatePeriodDialogOpen(false);
                  const totalPeriods =
                    ratePeriods.length + (effectiveDate ? 1 : 0);
                  toast({
                    title: "Success",
                    description: `Standard rate configuration completed with ${totalPeriods} period(s)`,
                  });
                }}
              >
                Finish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Products List</CardTitle>
            <div className="w-full md:w-1/3">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No matching products found" : "No products found"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sub Type</TableHead>
                    <TableHead>Alcohol %</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.group?.name || "-"}</TableCell>
                      <TableCell>{product.type}</TableCell>
                      <TableCell>{product.subType || "-"}</TableCell>
                      <TableCell>{product.alcoholPercentage}%</TableCell>
                      <TableCell>{product.volume}ml</TableCell>
                      <TableCell>
                        <span
                          className={
                            product.stock <= product.minStockLevel
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchProductAllocations(product._id)}
                          >
                            Allocations
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedProductForAllocation && productAllocations.length > 0 && (
        <ProductAllocationView allocation={productAllocations[0]} />
      )}
    </div>
  );
}
