
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { mvpApi } from '@/services/mvpApi';
import { mvp3DApi } from '@/services/mvp3DApi';
import { useToast } from '@/hooks/use-toast';
import { ThreeDWebsiteTemplet, CreateThreeDTemplateRequest } from '@/types/mvp';

const ThreeDTemplateTable: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ThreeDWebsiteTemplet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<ThreeDWebsiteTemplet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<CreateThreeDTemplateRequest>({
    title: '',
    description: '',
    modelUrl: '',
    demoUrl: '',
    tags: '',
    price: 0,
    brandNicheId: '',
  });

  const fetchTemplates = async () => {
    if (!selectedNiche.trim()) return;
    
    setIsLoading(true);
    try {
      const fetchedTemplates = await mvp3DApi.getThreeDTemplates(selectedNiche);
      setTemplates(fetchedTemplates);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (template: ThreeDWebsiteTemplet) => {
    setEditingTemplate(template);
    setEditFormData({
      title: template.title,
      description: template.description,
      modelUrl: template.modelUrl,
      demoUrl: template.demoUrl,
      tags: template.tags,
      price: template.price,
      brandNicheId: template.brandNicheId,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      await mvp3DApi.saveThreeDTemplate(editFormData);
      toast({
        title: "Success",
        description: "Template updated successfully!",
      });
      setIsEditModalOpen(false);
      fetchTemplates(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update template",
        variant: "destructive",
      });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage 3D Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="niche">Brand Niche ID</Label>
              <Input
                id="niche"
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                placeholder="Enter brand niche ID"
              />
            </div>
            <Button onClick={fetchTemplates} disabled={isLoading || !selectedNiche.trim()}>
              {isLoading ? 'Loading...' : 'Fetch Templates'}
            </Button>
          </div>

          {templates.length === 0 && selectedNiche && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              No templates found for this niche.
            </div>
          )}

          {templates.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Model URL</TableHead>
                    <TableHead>Demo URL</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{template.description}</TableCell>
                      <TableCell>{template.tags}</TableCell>
                      <TableCell>${template.price}</TableCell>
                      <TableCell>
                        <a 
                          href={template.modelUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Model
                        </a>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={template.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Demo
                        </a>
                      </TableCell>
                      <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(template)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Template</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-brandNicheId">Brand Niche ID</Label>
                  <Input
                    id="edit-brandNicheId"
                    name="brandNicheId"
                    value={editFormData.brandNicheId}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-modelUrl">Model URL</Label>
                  <Input
                    id="edit-modelUrl"
                    name="modelUrl"
                    type="url"
                    value={editFormData.modelUrl}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-demoUrl">Demo URL</Label>
                  <Input
                    id="edit-demoUrl"
                    name="demoUrl"
                    type="url"
                    value={editFormData.demoUrl}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-tags">Tags</Label>
                  <Input
                    id="edit-tags"
                    name="tags"
                    value={editFormData.tags}
                    onChange={handleEditInputChange}
                    placeholder="Comma separated tags"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Template
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ThreeDTemplateTable;
