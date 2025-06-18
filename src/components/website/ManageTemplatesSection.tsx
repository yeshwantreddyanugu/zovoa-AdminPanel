import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';

interface Template {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  demoUrl: string;
  tags: string[] | string;
  price: number;
  nicheId: number;
  createdDate?: string;
}

const ManageTemplatesSection = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const Base_url = 'https://7154-2401-4900-889d-f550-794e-e476-7486-f3b3.ngrok-free.app';

  const fetchTemplates = async (niche: string) => {
    if (!niche) {
      console.warn("No niche provided, skipping fetch.");
      return;
    }

    setIsLoading(true);
    console.log(`Fetching templates for niche: ${niche}`);

    try {
      const response = await fetch(`${Base_url}/api/website-templets/get/templet/${niche}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Templates fetched successfully:", data);
        setTemplates(data);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch templates. Server responded with:", errorText);
        throw new Error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("Finished fetching templates.");
      setIsLoading(false);
    }
  };

  const handleNicheChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const niche = e.target.value;
    setSelectedNiche(niche);
    if (niche) {
      fetchTemplates(niche);
    } else {
      setTemplates([]);
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTemplate = async (updatedTemplate: Template) => {
    console.log("Sending updated template data:\n", JSON.stringify(updatedTemplate, null, 2));
    // Log the request body

    try {
      const response = await fetch(`${Base_url}/api/website-templets/update/templet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(updatedTemplate),
      });

      const responseData = await response.json(); // Parse the JSON response
      console.log("Server response data:", responseData); // Log the response

      if (response.ok) {
        toast({
          title: "Success",
          description: "Template updated successfully!",
        });
        setIsEditDialogOpen(false);
        setEditingTemplate(null);
        fetchTemplates(selectedNiche);
      } else {
        console.error("Failed to update template. Status:", response.status);
        throw new Error('Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleDeleteTemplate = async (templateId: number) => {
    toast({
      title: "Feature Not Available",
      description: "Delete functionality will be implemented when backend endpoint is ready.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <select
          id="niche"
          value={selectedNiche}
          onChange={(e) => handleNicheChange(e as any)} // Type-casting for compatibility
          className="max-w-md border border-input rounded-md px-3 py-2"
        >
          <option value="">Select a niche</option>
          <option value="coffee-shop">Coffee Shop</option>
          <option value="restaurant">Restaurant</option>
          <option value="portfolio">Portfolio</option>
          <option value="ecommerce">E-commerce</option>
        </select>

      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Loading templates...</div>
        </div>
      ) : templates.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Demo URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <img
                      src={template.thumbnail}
                      alt={template.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{template.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{template.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(template.tags)
                        ? template.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                        : typeof template.tags === "string"
                          ? template.tags.split(",").map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))
                          : (
                            <span className="text-xs text-muted-foreground italic">
                              No tags available
                            </span>
                          )}
                    </div>
                  </TableCell>
                  <TableCell>${template.price}</TableCell>
                  <TableCell>
                    <a
                      href={template.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Demo
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : selectedNiche ? (
        <div className="text-center py-8 text-muted-foreground">
          No templates found for this niche.
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Enter a niche to view templates.
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <EditTemplateForm
              template={editingTemplate}
              onUpdate={handleUpdateTemplate}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EditTemplateForm = ({
  template,
  onUpdate,
  onCancel
}: {
  template: Template;
  onUpdate: (template: Template) => void;
  onCancel: () => void;
}) => {
  const normalizedTags = Array.isArray(template.tags)
    ? template.tags
    : typeof template.tags === 'string'
      ? template.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

  const [formData, setFormData] = useState({
    ...template,
    tags: normalizedTags.join(', ')
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      tags: formData.tags.trim(), // ✅ Send as string
      price: parseFloat(formData.price.toString()) || 0
    });
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-price">Price</Label>
          <Input
            id="edit-price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-description">Description</Label>
        <textarea
          id="edit-description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full min-h-20 px-3 py-2 border border-input rounded-md"
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-tags">Tags (comma separated)</Label>
        <Input
          id="edit-tags"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Template</Button>
      </div>
    </form>
  );
};

export default ManageTemplatesSection;
