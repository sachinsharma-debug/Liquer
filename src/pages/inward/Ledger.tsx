import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { BASE_URL } from '@/api/BaseUrl';

interface Ledger {
  _id: string;
  Name: string;
  Parent: string;
  ALIAS: string;
  OpeningBalance: string;
  MAilingName?: string;
  StateName?: string;
  CountryName?: string;
  PinCode?: string;
}

export default function LedgerManagement() {
  const { toast } = useToast();
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Current ledger states
  const [ledgerToDelete, setLedgerToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLedgerId, setCurrentLedgerId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Omit<Ledger, '_id'>>({
    Name: '',
    Parent: 'Primary',
    ALIAS: '0',
    OpeningBalance: '0.00',
    MAilingName: '',
    StateName: '',
    CountryName: '',
    PinCode: ''
  });

  // Available parent groups
  const parentGroups = [
    'Primary',
    'Cash-in-Hand',
    'Sundry Debtors',
    'Sundry Creditors',
    'Bank Accounts',
    'Direct Expenses',
    'Indirect Expenses',
    'Direct Income',
    'Indirect Income'
  ];

  // Fetch all ledgers
  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}ledger_list`);
        if (!response.ok) {
          throw new Error('Failed to fetch ledgers');
        }
        const data = await response.json();
        setLedgers(data.data || []);
      } catch (error: any) {
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

    fetchLedgers();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Open modal for creating new ledger
  const handleCreateLedger = () => {
    setCurrentLedgerId(null);
    setIsEditMode(false);
    setFormData({
      Name: '',
      Parent: 'Primary',
      ALIAS: '0',
      OpeningBalance: '0.00',
      MAilingName: '',
      StateName: '',
      CountryName: '',
      PinCode: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing ledger
  const handleEditLedger = (ledger: Ledger) => {
    setCurrentLedgerId(ledger._id);
    setIsEditMode(true);
    setFormData({
      Name: ledger.Name,
      Parent: ledger.Parent,
      ALIAS: ledger.ALIAS,
      OpeningBalance: ledger.OpeningBalance,
      MAilingName: ledger.MAilingName || '',
      StateName: ledger.StateName || '',
      CountryName: ledger.CountryName || '',
      PinCode: ledger.PinCode || ''
    });
    setIsModalOpen(true);
  };

  // Open confirmation modal for deleting ledger
  const handleDeleteLedger = (id: string) => {
    setLedgerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode 
        ? `${BASE_URL}update_ledger/${currentLedgerId}`
        : `${BASE_URL}create_ledger`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isEditMode ? 'Failed to update ledger' : 'Failed to create ledger');
      }

      // Refresh the ledger list after successful operation
      const refreshResponse = await fetch(`${BASE_URL}ledger_list`);
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setLedgers(refreshData.data || []);
      }

      toast({
        title: 'Success',
        description: isEditMode ? 'Ledger updated successfully' : 'Ledger created successfully',
      });

      setIsModalOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm and execute ledger deletion
  const confirmDelete = async () => {
    if (!ledgerToDelete) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}delete_ledger/${ledgerToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ledger');
      }

      // Refresh the ledger list after successful deletion
      const refreshResponse = await fetch(`${BASE_URL}ledger_list`);
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setLedgers(refreshData.data || []);
      }

      toast({
        title: 'Success',
        description: 'Ledger deleted successfully',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setLedgerToDelete(null);
    }
  };

  if (isLoading && ledgers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading ledgers...</span>
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
        <h1 className="text-3xl font-bold text-gray-900">Ledger Management</h1>
        <Button onClick={handleCreateLedger}>
          <Plus className="mr-2 h-4 w-4" />
          Add Ledger
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ledger List</CardTitle>
        </CardHeader>
        <CardContent>
          {ledgers.length === 0 ? (
            <div className="text-center py-8">
              <p>No ledgers found</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={handleCreateLedger}
              >
                Create your first ledger
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent Group</TableHead>
                  <TableHead>Opening Balance</TableHead>
                  <TableHead>Mailing Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgers.map((ledger) => (
                  <TableRow key={ledger._id}>
                    <TableCell className="font-medium">{ledger.Name}</TableCell>
                    <TableCell>{ledger.Parent}</TableCell>
                    <TableCell>{ledger.OpeningBalance}</TableCell>
                    <TableCell>{ledger.MAilingName || '-'}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditLedger(ledger)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLedger(ledger._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Ledger Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Ledger' : 'Create New Ledger'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update the ledger details below' : 'Fill in the details to create a new ledger'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name*</Label>
                <Input
                  value={formData.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  placeholder="Enter ledger name"
                  required
                />
              </div>
              
              <div>
                <Label>Parent Group*</Label>
                <Select
                  value={formData.Parent}
                  onValueChange={(value) => handleInputChange('Parent', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent group" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Opening Balance</Label>
                <Input
                  type="number"
                  value={formData.OpeningBalance}
                  onChange={(e) => handleInputChange('OpeningBalance', e.target.value)}
                  placeholder="Enter opening balance"
                />
              </div>

              <div>
                <Label>ALIAS</Label>
                <Input
                  value={formData.ALIAS}
                  onChange={(e) => handleInputChange('ALIAS', e.target.value)}
                  placeholder="Enter ALIAS"
                />
              </div>

              <div>
                <Label>Mailing Name</Label>
                <Input
                  value={formData.MAilingName}
                  onChange={(e) => handleInputChange('MAilingName', e.target.value)}
                  placeholder="Enter mailing name"
                />
              </div>

              <div>
                <Label>State</Label>
                <Input
                  value={formData.StateName}
                  onChange={(e) => handleInputChange('StateName', e.target.value)}
                  placeholder="Enter state"
                />
              </div>

              <div>
                <Label>Country</Label>
                <Input
                  value={formData.CountryName}
                  onChange={(e) => handleInputChange('CountryName', e.target.value)}
                  placeholder="Enter country"
                />
              </div>

              <div>
                <Label>Pin Code</Label>
                <Input
                  value={formData.PinCode}
                  onChange={(e) => handleInputChange('PinCode', e.target.value)}
                  placeholder="Enter pin code"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Update' : 'Create'} Ledger
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the ledger.
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