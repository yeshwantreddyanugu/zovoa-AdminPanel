
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddTemplateSection from '@/components/website/AddTemplateSection';
import ManageTemplatesSection from '@/components/website/ManageTemplatesSection';
import WebsiteFormsSection from '@/components/website/WebsiteFormsSection';
import { useNavigate } from "react-router-dom";

const WebsiteDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add-template');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative">
          {/* Top-right back button */}
          <div className="absolute top-0 right-0">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg shadow-lg hover:bg-gray-800 active:translate-y-[2px] transition"
            >
              ← Back
            </button>

          </div>

          {/* Title and subtitle */}
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Website Management Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage website templates and user submissions
          </p>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="add-template" className="text-sm font-medium">
              Add Template
            </TabsTrigger>
            <TabsTrigger value="manage-templates" className="text-sm font-medium">
              Manage Templates
            </TabsTrigger>
            <TabsTrigger value="website-forms" className="text-sm font-medium">
              Website Forms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add-template" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Template</CardTitle>
              </CardHeader>
              <CardContent>
                <AddTemplateSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage-templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <ManageTemplatesSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="website-forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Form Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <WebsiteFormsSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WebsiteDashboard;
