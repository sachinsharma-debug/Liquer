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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Edit, Save, Plus, Loader2 } from "lucide-react";
import { BASE_URL, globalsearchcountry, globalsearchstate } from "@/api/BaseUrl";
import { Country, State } from "country-state-city";
import { useSelector, useDispatch } from 'react-redux'






interface Vendor {
  _id: string;
  name: string;
  group: { _id: string; name: string } | null;
  mailingName: string;
  country: string;
  state: string;
  address: string;
  pincode: string;
  mobile: string;
  email: string;
  isActive: boolean;
  Master_Id?: string;
  Alter_Id?: string;
}

interface Group {
  _id: string;
  name: string;
}

export function Vendors() {

  const companyid = useSelector((state) => state?.Store.companyid)
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [states, setStates] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    Master_Id: "",
    Alter_Id: "",
    name: "",
    group: "no-group",
    mailingName: "",
    country: "",
    state: "",
    address: "",
    pincode: "",
    mobile: "",
    email: "",
    isActive: true,
  });

  // Get all countries
  const countries = Country.getAllCountries();

  // Update states when country changes
  useEffect(() => {
    if (formData.country) {
      const countryCode = formData.country;
      const countryStates = State.getStatesOfCountry(countryCode);
      setStates(countryStates);
globalsearchstate(isDialogOpen,".statete",handleStateChange)
      // Reset state when country changes
      setFormData(prev => ({ ...prev, state: "" }));
    } else {
      setStates([]);
    }
  }, [formData.country]);


  

  useEffect(() => {
    // initialize select2 on the <select>
    // initialize select2


    globalsearchcountry(isDialogOpen, ".sachin", ".statete", handleCountryChange)



  }, [isDialogOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [vendorsRes, groupsRes] = await Promise.all([
        fetch(`${BASE_URL}vendor_list`, {
          method: "GET",
          credentials: "include"
        }),
        fetch(`${BASE_URL}accountig_group_list_data`, {
          method: "GET",
          credentials: "include"
        }),
      ]);

      const [vendorsData, groupsData] = await Promise.all([
        vendorsRes.json(),
        groupsRes.json(),
      ]);

      if (!vendorsRes.ok)
        throw new Error(vendorsData.message || "Failed to fetch vendors");
      if (!groupsRes.ok)
        throw new Error(groupsData.message || "Failed to fetch groups");

      const normalizedVendors = (vendorsData.data || []).map((v: any) => ({
        ...v,
        group:
          typeof v.group === "string"
            ? {
              _id: v.group,
              name:
                groupsData.data.find((g: any) => g._id === v.group)?.name ||
                "",
            }
            : v.group,
      }));

      setVendors(normalizedVendors);
      setGroups(groupsData.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyid]);

  const resetForm = () => {
    setFormData({
      Master_Id: "",
      Alter_Id: "",
      name: "",
      group: "no-group",
      mailingName: "",
      country: "",
      state: "",
      address: "",
      pincode: "",
      mobile: "",
      email: "",
      isActive: true,
    });
    setIsEditing(false);
    setCurrentId(null);
    setIsDialogOpen(false);
    setStates([]);
  };

  const handleEdit = (vendor: Vendor) => {
    setFormData({
      Master_Id: vendor.Master_Id || "",
      Alter_Id: vendor.Alter_Id || "",
      name: vendor.name,
      group: vendor.group?._id || "no-group",
      mailingName: vendor.mailingName,
      country: vendor.country,
      state: vendor.state,
      address: vendor.address,
      pincode: vendor.pincode,
      mobile: vendor.mobile,
      email: vendor.email,
      isActive: vendor.isActive,
    });
    setIsEditing(true);
    setCurrentId(vendor._id);
    setIsDialogOpen(true);

    // Load states for the vendor's country
    if (vendor.country) {
      const countryStates = State.getStatesOfCountry(vendor.country);
      setStates(countryStates);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    setFormData({
      ...formData,
      country: countryCode,
      state: "" // Reset state when country changes
    });
  };

  const handleStateChange = (stateName: string) => {
    setFormData({ ...formData, state: stateName });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return setError("Vendor Name is required");

    try {
      const url =
        isEditing && currentId
          ? `${BASE_URL}vendor_update/${currentId}`
          : `${BASE_URL}create_vendor`;

      const payload = {
        ...formData,
        Master_Id: formData.Master_Id || undefined,
        Alter_Id: formData.Alter_Id || undefined,
        group: formData.group === "no-group" ? undefined : formData.group,
      };

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Operation failed");

      await fetchData();
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const response = await fetch(`${BASE_URL}vendor_delete/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vendors Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Vendor" : "Create New Vendor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="Master_Id" className="text-xs w-32 text-right">
                    Master Id:
                  </Label>
                  <Input
                    id="Master_Id"
                    name="Master_Id"
                    placeholder="Master Id"
                    className="h-6 text-xs flex-1"
                    value={formData.Master_Id}
                    onChange={(e) =>
                      setFormData({ ...formData, Master_Id: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="Alter_Id" className="text-xs w-32 text-right">
                    Alternate Id:
                  </Label>
                  <Input
                    id="Alter_Id"
                    name="Alter_Id"
                    placeholder="Alternate Id"
                    className="h-6 text-xs flex-1"
                    value={formData.Alter_Id}
                    onChange={(e) =>
                      setFormData({ ...formData, Alter_Id: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="name" className="text-xs w-32 text-right">
                    Vendor Name *:
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. ABC Suppliers"
                    className="h-6 text-xs flex-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="group" className="text-xs w-32 text-right">
                    Group:
                  </Label>
                  <Select
                    value={formData.group}
                    onValueChange={(value) =>
                      setFormData({ ...formData, group: value })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="no-group">None</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group._id} value={group._id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="mailingName"
                    className="text-xs w-32 text-right"
                  >
                    Mailing Name:
                  </Label>
                  <Input
                    id="mailingName"
                    value={formData.mailingName}
                    onChange={(e) =>
                      setFormData({ ...formData, mailingName: e.target.value })
                    }
                    placeholder="Mailing Name"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="country" className="text-xs w-32 text-right">
                    Country:
                  </Label>
                  <select className=" sachin h-6 text-xs flex-1 "
                              onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    value={countries.find(c => c.name === formData.country)?.isoCode || ""}
                  >
                    <option>Select...</option>

                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}


                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="state" className="text-xs w-32 text-right">
                    State:
                  </Label>
                  <select className=" statete h-6 text-xs flex-1 "
                    onChange={(e) => {
                      handleStateChange(e.target.value)
                    }} value={states.find(s => s.name === formData.state)?.isoCode || ""}
                  // disabled={!formData.clientCountry}
                  >
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="address" className="text-xs w-32 text-right">
                    Address:
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Address"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="pincode" className="text-xs w-32 text-right">
                    Pincode:
                  </Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    placeholder="Pincode"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="mobile" className="text-xs w-32 text-right">
                    Mobile:
                  </Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    placeholder="Mobile"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="email" className="text-xs w-32 text-right">
                    Email:
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Email"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
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
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
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
          <CardTitle>Vendors List</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No vendors found. Create your first vendor above.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden flex-1">
              <div className="h-[380px] overflow-auto">
                <Table className="min-w-full">
                  <TableHeader className="bg-gray-50 sticky top-0">
                    <TableRow>
                      <TableHead>Master ID</TableHead>
                      <TableHead>Alternate ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor._id}>
                        <TableCell>{vendor.Master_Id || "-"}</TableCell>
                        <TableCell>{vendor.Alter_Id || "-"}</TableCell>
                        <TableCell className="font-medium">
                          {vendor.name}
                        </TableCell>
                        <TableCell>{vendor.group?.name || "-"}</TableCell>
                        <TableCell>{vendor.email || "-"}</TableCell>
                        <TableCell>{vendor.mobile || "-"}</TableCell>
                        <TableCell>
                          {vendor.country ?
                            countries.find(c => c.isoCode === vendor.country)?.name || vendor.country
                            : "-"}
                        </TableCell>
                        <TableCell>{vendor.state || "-"}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vendor.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {vendor.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(vendor)}
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(vendor._id)}
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
    </div>
  );
}