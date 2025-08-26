import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import Accounting_Group from "@/pages/Accounting_Master/accounting_groups";
// import Customer_data from '@/pages/Accounting_Master/customers';
import { CustomersPage } from "@/pages/Accounting_Master/customers";
import { Vendors } from "@/pages/Accounting_Master/vendors";
import Accounting_ledgers from "@/pages/Accounting_Master/accounting_ledgers";
import IndentRegister from "./IndentRegister";
import IndentVoucherPending from "./IndentVoucherPending";
import IndentVoucherClosed from "./IndentVoucherClosed";
import IndentVoucherPreClosed from "./IndentVoucherPreClosed";
// import { TransactionType } from "./TransactionType";

export default function IndentReport() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Indent Reports
          </h1>
        </div>
      </div>

      <Tabs defaultValue="transactiontype" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="IndentRegister">Indent Voucher Register</TabsTrigger>
          <TabsTrigger value="IndentVoucherPending">Indent Voucher Pending</TabsTrigger>
          <TabsTrigger value="IndentVoucherClosed">Indent Voucher Closed</TabsTrigger>
          <TabsTrigger value="IndentVoucherPreClosed">Indent Voucher Pre-Close</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="IndentRegister">
            <IndentRegister/>
          </TabsContent>
          <TabsContent value="IndentVoucherPending">
            <IndentVoucherPending/>
          </TabsContent>
          <TabsContent value="IndentVoucherClosed">
            <IndentVoucherClosed/>
          </TabsContent>
          <TabsContent value="IndentVoucherPreClosed">
            <IndentVoucherPreClosed/>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
