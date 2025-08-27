import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, Save, Plus } from 'lucide-react';
import { BASE_URL } from '@/api/BaseUrl';

interface AccountingLedger {
  _id: string;
  name: string;
  
  groupId: string;
  isActive: boolean;
}

interface Account {
  _id: string;
  name: string;
  code: string;
}

interface AccountingGroup {
  _id: string;
  name: string;
  code: string;
}

interface ApiResponse {
  status: number;
  message: string;
  data: any[];
}

export default function AccountingLedgersPage() {
  const [ledgers, setLedgers] = useState<AccountingLedger[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [groups, setGroups] = useState<AccountingGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<AccountingLedger, '_id'>>({
    name: '',
  
  
    groupId: '',
  
    isActive: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch ledgers
      const ledgersResponse = await fetch(`${BASE_URL}accountingledger`);
      const ledgersResult: ApiResponse = await ledgersResponse.json();
      if (!ledgersResponse.ok || ledgersResult.status !== 200) {
        throw new Error(ledgersResult.message || 'Failed to fetch accounting ledgers');
      }

      // // Fetch accounts
      // const accountsResponse = await fetch(`${BASE_URL}account`);
      // const accountsResult: ApiResponse = await accountsResponse.json();
      // if (!accountsResponse.ok || accountsResult.status !== 200) {
      //   throw new Error(accountsResult.message || 'Failed to fetch accounts');
      // }

      // Fetch groups
      const groupsResponse = await fetch(`${BASE_URL}accountig_group_list`);
      const groupsResult: ApiResponse = await groupsResponse.json();
      if (!groupsResponse.ok || groupsResult.status !== 200) {
        throw new Error(groupsResult.message || 'Failed to fetch accounting groups');
      }




      

      setLedgers([...ledgersResult.data || []]);
      // setAccounts(accountsResult.data || []);
      setGroups([...groupsResult.data || []]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
    
      groupId: '',
    
      isActive: true
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.groupId) {
      setError('All fields are required');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        
  
        groupId: formData.groupId,
        
        isActive: formData.isActive
      };




     
      let url = `${BASE_URL}accountingledger`;
      let method: 'POST' | 'PUT' = 'POST';

      if (isEditing && currentId) {
        url = `${BASE_URL}accountingledger/${currentId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.status !== 200) {
        throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'create'} accounting ledger`);
      }

      await fetchData();
      resetForm();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleEdit = (ledger: AccountingLedger) => {
    setFormData({
      name: ledger.name,
      
      groupId: ledger.groupId._id,
    
      isActive: ledger.isActive
    });
    setIsEditing(true);
    setCurrentId(ledger._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this accounting ledger?')) {
      try {
        const response = await fetch(`${BASE_URL}accountingledger/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok || result.status !== 200) {
          throw new Error(result.message || 'Failed to delete accounting ledger');
        }

        await fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Accounting Ledgers</h1>

      {/* {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          Error: {error}
        </div>
      )} */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {isEditing ? 'Edit Accounting Ledger' : 'Add New Accounting Ledger'}
            {isEditing && (
              <Button variant="ghost" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" /> Add New
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Ledger Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Cash in Bank"
                  required
                />
              </div>
              {/* <div>
                <Label htmlFor="code">Ledger Code*</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="e.g. CB-001"
                  required
                />
              </div> */}
              {/* <div>
                <Label htmlFor="accountId">Account*</Label>
                <select
                  id="accountId"
                  name="accountId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.accountId}
                  onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                  required
                >
                  <option value="">Select Account</option>
                  {accounts.map(account => (
                    <option key={account._id} value={account._id}>
                      {account.name} ({account.code})
                    </option>
                  ))}
                </select>
              </div> */}
              <div>
                <Label htmlFor="groupId">Group*</Label>
                <select
                  id="groupId"
                  name="groupId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.groupId}
                  onChange={(e) => setFormData({...formData, groupId: e.target.value})}
                  required
                >
                  <option value="">Select Group</option>
                  {groups.map(group => (
                    <option key={group._id} value={group._id}>
                      {group.name} ({group.code})
                    </option>
                  ))}
                </select>
              </div>
              {/* <div>
                <Label htmlFor="openingBalance">Opening Balance</Label>
                <Input
                  id="openingBalance"
                  name="openingBalance"
                  type="number"
                  value={formData.openingBalance}
                  onChange={(e) => setFormData({...formData, openingBalance: Number(e.target.value)})}
                  placeholder="0.00"
                />
              </div> */}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant={formData.isActive ? 'default' : 'outline'}
                onClick={() => {
                  setFormData({...formData, isActive: !formData.isActive})}
                }
              >
                {formData.isActive ? 'Active' : 'Inactive'}
              </Button>

              <div className="flex-1" />

              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  'Processing...'
                ) : isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Update Ledger
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" /> Add Ledger
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Accounting Ledgers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading ledgers...</div>
          ) : ledgers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No ledgers found. Add your first ledger above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>Code</TableHead> */}
                  <TableHead>Name</TableHead>
                  {/* <TableHead>Account</TableHead> */}
                  <TableHead>Group</TableHead>
                  {/* <TableHead>Opening Balance</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgers.map((ledger) => {
        
                  const group = groups.find(g => g._id === ledger.groupId);
                  return (
                    <TableRow key={ledger._id}>
                
                      <TableCell>{ledger.name}</TableCell>
                  
                      <TableCell>
                        {ledger.groupId.name}
                      </TableCell>
                     
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          ledger.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ledger.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(ledger)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(ledger._id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}