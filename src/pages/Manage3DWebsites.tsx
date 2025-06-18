
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddThreeDTemplateForm from '@/components/3dwebsite/AddThreeDTemplateForm';
import ThreeDTemplateTable from '@/components/3dwebsite/ThreeDTemplateTable';
import ThreeDFormsTable from '@/components/3dwebsite/ThreeDFormsTable';
import { useNavigate } from "react-router-dom";

const Manage3DWebsites: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Manage 3D Websites
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-black text-white text-sm rounded-lg shadow-lg hover:bg-gray-800 active:translate-y-[2px] transition"
          >
            ←&nbsp;Back
          </button>

        </div>

        <p className="text-muted-foreground">
          Create and manage 3D website templates, and view submitted forms.
        </p>



        <Tabs defaultValue="add-template" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add-template">Add 3D Template</TabsTrigger>
            <TabsTrigger value="manage-templates">Manage Templates</TabsTrigger>
            <TabsTrigger value="view-forms">View Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="add-template" className="space-y-4">
            <AddThreeDTemplateForm />
          </TabsContent>

          <TabsContent value="manage-templates" className="space-y-4">
            <ThreeDTemplateTable />
          </TabsContent>

          <TabsContent value="view-forms" className="space-y-4">
            <ThreeDFormsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Manage3DWebsites;
