
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const AddTemplateSection = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    demoUrl: '',
    tags: '',
    price: '',
    nicheId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const Base_url = 'https://7154-2401-4900-889d-f550-794e-e476-7486-f3b3.ngrok-free.app';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail,
      demoUrl: formData.demoUrl,
      tags: formData.tags.trim(), // already comma-separated string
      price: parseFloat(formData.price) || 0,
      nicheId: formData.nicheId.trim(), // must be a valid slug
    };

    console.log('📤 Submitting payload:', payload); // debug log

    try {
      const response = await fetch(`${Base_url}/api/website-templets/save/templet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text(); // for debugging

      if (response.ok) {
        const responseData = JSON.parse(responseText);
        console.log('✅ Success response:', responseData);

        toast({
          title: "Success",
          description: "Template saved successfully!",
        });

        setFormData({
          title: '',
          description: '',
          thumbnail: '',
          demoUrl: '',
          tags: '',
          price: '',
          nicheId: '',
        });
      } else {
        throw new Error(`Failed to save template. Server says: ${responseText}`);
      }
    } catch (error) {
      console.error('❌ Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter template title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nicheId">Niche ID</Label>
          <Input
            id="nicheId"
            name="nicheId"
            type="string"
            value={formData.nicheId}
            onChange={handleInputChange}
            placeholder="Enter niche ID"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail URL</Label>
          <Input
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            placeholder="Enter thumbnail URL"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input
            id="demoUrl"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleInputChange}
            placeholder="Enter demo URL"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Enter tags (comma separated)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter template description"
          rows={4}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full md:w-auto"
      >
        {isLoading ? 'Saving...' : 'Save Template'}
      </Button>
    </form>
  );
};

export default AddTemplateSection;
