import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Download, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AnalyticsReports() {
  const { toast } = useToast();

  const reportTypes = [
    {
      title: 'Inventory Report',
      description: 'Current stock levels and valuation',
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Sales Report',
      description: 'Sales performance and trends',
      icon: FileText,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Purchase Report',
      description: 'Purchase orders and vendor analysis',
      icon: Calendar,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Financial Report',
      description: 'P&L, balance sheet, and cash flow',
      icon: Download,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const [formData, setFormData] = useState({
    date: "",
    indentNo: "",
    nameOfItem: "",
    depotName: "",
    supplierName: "",
    indentQty1: "",
    uom1: "",
    indentQty2: "",
    uom2: "",
    rate: "",
    amount: "",
    dueOn: "",
    overDue: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "Generating Report",
      description: `${reportType} is being generated. You will be notified when it's ready.`,
    });
  };

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Downloading Report",
      description: `${reportName} is being downloaded.`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
      <form className="grid grid-cols-2 gap-6 p-6 bg-white rounded-lg shadow">
      {/* Company Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
          Company Name
        </Label>
        <Input
          id="companyName"
          placeholder="Enter company name"
          className="h-10 border border-gray-300 rounded-md px-3"
        />
      </div>
      </form>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <Card 
            key={report.title} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleGenerateReport(report.title)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${report.color}`}>
                  <report.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-gray-500">{report.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Monthly Inventory Report</h4>
                <p className="text-sm text-gray-500">Generated on Jan 15, 2024</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownloadReport('Monthly Inventory Report')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Sales Performance Q4</h4>
                <p className="text-sm text-gray-500">Generated on Jan 10, 2024</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownloadReport('Sales Performance Q4')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
