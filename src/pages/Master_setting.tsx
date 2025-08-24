import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import Accounting_Group from "@/pages/Accounting_Master/accounting_groups";
// import Customer_data from '@/pages/Accounting_Master/customers';
import { CustomersPage } from "@/pages/Accounting_Master/customers";
import { Vendors } from "@/pages/Accounting_Master/vendors";
import Accounting_ledgers from "@/pages/Accounting_Master/accounting_ledgers";
import { TransactionType } from "./TransactionType";

export default function GeneralSettings() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Accounting Master
          </h1>
          <div className="flex space-x-2 text-sm text-gray-500 mt-2">
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-700">Accounting Master</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="transactiontype" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactiontype">Transaction Type</TabsTrigger>
          <TabsTrigger value="accountinggroup">Accounting Group</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
          <TabsTrigger value="accountingledger">Accounting ledger</TabsTrigger>
        </TabsList>

        <div className="mt-6 border rounded-lg p-6">
          <TabsContent value="transactiontype">
            <TransactionType />
          </TabsContent>
          <TabsContent value="accountinggroup">
            <Accounting_Group />
          </TabsContent>
          <TabsContent value="customer">
            <CustomersPage />
          </TabsContent>
          <TabsContent value="vendor">
            <Vendors />
          </TabsContent>
          <TabsContent value="accountingledger">
            <Accounting_ledgers />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
