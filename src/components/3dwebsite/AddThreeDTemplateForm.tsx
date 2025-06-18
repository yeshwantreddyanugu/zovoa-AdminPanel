
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mvpApi } from '@/services/mvpApi';
import { mvp3DApi } from '@/services/mvp3DApi';
import { useToast } from '@/hooks/use-toast';
import { CreateThreeDTemplateRequest } from '@/types/mvp';

const AddThreeDTemplateForm: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateThreeDTemplateRequest>({
    title: '',
    description: '',
    modelUrl: '',
    demoUrl: '',
    tags: '',
    price: 0,
    brandNicheId: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await mvp3DApi.saveThreeDTemplate(formData);
      toast({
        title: "Success",
        description: "3D Template saved successfully!",
      });
      // Reset form
      setFormData({
        title: '',
        description: '',
        modelUrl: '',
        demoUrl: '',
        tags: '',
        price: 0,
        brandNicheId: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add 3D Template</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="brandNicheId">Brand Niche ID</Label>
              <Input
                id="brandNicheId"
                name="brandNicheId"
                value={formData.brandNicheId}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modelUrl">Model URL</Label>
              <Input
                id="modelUrl"
                name="modelUrl"
                type="url"
                value={formData.modelUrl}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input
                id="demoUrl"
                name="demoUrl"
                type="url"
                value={formData.demoUrl}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Comma separated tags"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="1"
                // min="1"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Save Template'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddThreeDTemplateForm;
