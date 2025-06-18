
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Eye } from 'lucide-react';

interface WebsiteForm {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  templetId: number;
  uid: string;
  createdDate?: string;
  // Add other fields that might be in the DTO
  [key: string]: any;
}

const WebsiteFormsSection = () => {
  const [forms, setForms] = useState<WebsiteForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const Base_url = 'https://7154-2401-4900-889d-f550-794e-e476-7486-f3b3.ngrok-free.app';

  // Filters
  const [filters, setFilters] = useState({
    uid: '',
    templetId: '',
    searchTerm: ''
  });

  // View modal
  const [selectedForm, setSelectedForm] = useState<WebsiteForm | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { toast } = useToast();

  const fetchForms = async (page = 0) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
      });

      // Add filters if they exist
      if (filters.uid) params.append('uid', filters.uid);
      if (filters.templetId) params.append('templetId', filters.templetId);
      if (filters.searchTerm) params.append('search', filters.searchTerm);

      const response = await fetch(`${Base_url}/api/website-forms?${params}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
           "ngrok-skip-browser-warning": "true"
          
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched forms data:', data);

        // Handle different response structures
        if (data.content) {
          // Spring Boot Pageable response
          setForms(data.content);
          setTotalPages(data.totalPages);
          setCurrentPage(data.number);
        } else if (Array.isArray(data)) {
          // Simple array response
          setForms(data);
          setTotalPages(1);
          setCurrentPage(0);
        } else {
          setForms([]);
          setTotalPages(0);
        }
      } else {
        throw new Error('Failed to fetch forms');
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch forms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms(0);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    setCurrentPage(0);
    fetchForms(0);
  };

  const clearFilters = () => {
    setFilters({
      uid: '',
      templetId: '',
      searchTerm: ''
    });
    setCurrentPage(0);
    fetchForms(0);
  };

  const handleViewForm = (form: WebsiteForm) => {
    setSelectedForm(form);
    setIsViewDialogOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchForms(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-muted/50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="uid-filter">Filter by UID</Label>
            <Input
              id="uid-filter"
              value={filters.uid}
              onChange={(e) => handleFilterChange('uid', e.target.value)}
              placeholder="Enter UID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="templet-filter">Filter by Template ID</Label>
            <Input
              id="templet-filter"
              value={filters.templetId}
              onChange={(e) => handleFilterChange('templetId', e.target.value)}
              placeholder="Enter Template ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-filter">Search</Label>
            <Input
              id="search-filter"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Search by name, phone, or email"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={applyFilters}>
            <Search className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Forms Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Loading forms...</div>
        </div>
      ) : forms.length > 0 ? (
        <div className="space-y-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Template ID</TableHead>
                  <TableHead>UID</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell>{form.phoneNumber}</TableCell>
                    <TableCell>{form.email}</TableCell>
                    <TableCell>{form.templetId}</TableCell>
                    <TableCell className="font-mono text-sm">{form.uid}</TableCell>
                    <TableCell>
                      {form.createdDate ? new Date(form.createdDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewForm(form)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>

              <span className="flex items-center px-4">
                Page {currentPage + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={currentPage >= totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No forms found. Try adjusting your filters.
        </div>
      )}

      {/* View Form Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Form Details</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedForm.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Phone Number</Label>
                  <p className="text-sm text-muted-foreground">{selectedForm.phoneNumber}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedForm.email}</p>
                </div>
                <div>
                  <Label className="font-semibold">Template ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedForm.templetId}</p>
                </div>
                <div>
                  <Label className="font-semibold">UID</Label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedForm.uid}</p>
                </div>
                <div>
                  <Label className="font-semibold">Created Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedForm.createdDate ? new Date(selectedForm.createdDate).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Display any additional fields */}
              <div className="border-t pt-4">
                <Label className="font-semibold">Additional Information</Label>
                <pre className="text-sm text-muted-foreground bg-muted p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(selectedForm, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteFormsSection;
