import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import IntegrationSettings from "@/pages/inward/Integration";
import CompanySettings from "@/pages/Organization";
import DepotSettings from "@/pages/inward/Depot";
import BranchandDivision from "@/pages/BranchandDivision";

export default function GeneralSettings() {
  return (
    <div className="space-y-6 p-6 bg-white rounded-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
          <div className="flex space-x-2 text-sm text-gray-500 mt-2">
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-700">General Settings</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="integration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="depot">Depot</TabsTrigger>
          <TabsTrigger value="branch">Branch & Division</TabsTrigger>
        </TabsList>

        <div className="mt-6 border rounded-lg p-6">
          <TabsContent value="integration">
            <IntegrationSettings />
          </TabsContent>
          <TabsContent value="company">
            <CompanySettings />
          </TabsContent>
          <TabsContent value="depot">
            <DepotSettings />
          </TabsContent>
          <TabsContent value="branch">
            <BranchandDivision />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
