import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { mvp3DApi } from '@/services/mvp3DApi';
import { useToast } from '@/hooks/use-toast';
import { ThreeDWebsiteForm, PaginationResponse } from '@/types/mvp';

const ThreeDFormsTable: React.FC = () => {
  const { toast } = useToast();
  const [allForms, setAllForms] = useState<ThreeDWebsiteForm[]>([]);
  const [displayedForms, setDisplayedForms] = useState<ThreeDWebsiteForm[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse<ThreeDWebsiteForm> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState({
    uid: '',
    templateId: '',
    searchTerm: '',
  });
  const [selectedForm, setSelectedForm] = useState<ThreeDWebsiteForm | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const fetchForms = async (page: number = 0, size: number = 5) => {
    setIsLoading(true);
    try {
      const response = await mvp3DApi.getThreeDForms(page, size);
      console.log("API response:", response);
      
      // Handle both array response and paginated response
      if (Array.isArray(response)) {
        // If response is an array, create a pagination structure
        setAllForms(response);
        setDisplayedForms(response);
        setPagination({
          content: response,
          number: page,
          size: size,
          totalElements: response.length,
          totalPages: Math.ceil(response.length / size),
        });
      } else {
        // Assume it's already paginated
        setAllForms(response.content);
        setDisplayedForms(response.content);
        setPagination(response);
      }
      setCurrentPage(page);
      setFiltersApplied(false); // Reset filters when new data is fetched
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch forms',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms(0, pageSize);
  }, [pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < (pagination?.totalPages || 0)) {
      fetchForms(newPage, pageSize);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = allForms.filter(form => {
      const matchesUid = !filters.uid || (form.uid && form.uid.toLowerCase().includes(filters.uid.toLowerCase()));
      const matchesTemplateId = !filters.templateId || (form.templet_id && form.templet_id.toLowerCase().includes(filters.templateId.toLowerCase()));
      const matchesSearch =
        !filters.searchTerm ||
        (form.name && form.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (form.email && form.email.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (form.number && form.number.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      return matchesUid && matchesTemplateId && matchesSearch;
    });

    setDisplayedForms(filtered);
    setFiltersApplied(true);
    
    // Update pagination for filtered results
    setPagination(prev => prev ? {
      ...prev,
      content: filtered,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
    } : null);
  };

  const resetFilters = () => {
    setDisplayedForms(allForms);
    setFilters({
      uid: '',
      templateId: '',
      searchTerm: '',
    });
    setFiltersApplied(false);
    
    // Reset pagination to original state
    setPagination(prev => prev ? {
      ...prev,
      content: allForms,
      totalElements: allForms.length,
      totalPages: Math.ceil(allForms.length / pageSize),
    } : null);
  };

  const handleViewClick = (form: ThreeDWebsiteForm) => {
    setSelectedForm(form);
    setIsViewModalOpen(true);
  };

  return (
    <Card className="shadow-lg border rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">3D Website Form Submissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="uid-filter">UID</Label>
            <Input id="uid-filter" name="uid" value={filters.uid} onChange={handleFilterChange} placeholder="Enter UID" />
          </div>
          <div>
            <Label htmlFor="template-filter">Template ID</Label>
            <Input id="template-filter" name="templateId" value={filters.templateId} onChange={handleFilterChange} placeholder="Enter Template ID" />
          </div>
          <div>
            <Label htmlFor="search-filter">Search</Label>
            <Input id="search-filter" name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Name, Email, Phone..." />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="page-size">Page Size</Label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <Button onClick={applyFilters} className="h-10">
              Apply Filters
            </Button>
            {filtersApplied && (
              <Button variant="outline" onClick={resetFilters} className="h-10">
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Header & Pagination Info */}
        <div className="flex justify-between items-center">
          <Button onClick={() => fetchForms(0, pageSize)} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
          {pagination && (
            <div className="text-sm text-muted-foreground">
              Showing {displayedForms.length > 0 ? currentPage * pageSize + 1 : 0} to {Math.min((currentPage + 1) * pageSize, displayedForms.length)} of {displayedForms.length} entries
              {filtersApplied && ' (filtered)'}
            </div>
          )}
        </div>

        {/* Table or Status */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading forms...</div>
        ) : displayedForms.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {filtersApplied ? 'No forms match your filters' : 'No forms found'}
          </div>
        ) : (
          <div className="overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Template ID</TableHead>
                  <TableHead>UID</TableHead>
                  <TableHead>Website ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedForms.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((form) => (
                  <TableRow key={form.id ?? `${form.uid}-${form.createdAt}`}>
                    <TableCell className="font-medium">{form.name || 'N/A'}</TableCell>
                    <TableCell>{form.number || 'N/A'}</TableCell>
                    <TableCell>{form.email || 'N/A'}</TableCell>
                    <TableCell>{form.templet_id || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-xs">{form.uid || 'N/A'}</TableCell>
                    <TableCell>{form.website_id || 'N/A'}</TableCell>
                    <TableCell>{form.createdAt ? new Date(form.createdAt).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewClick(form)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Controls */}
        {displayedForms.length > 0 && (
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 0} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            >
              Previous
            </Button>
            {Array.from({ length: Math.ceil(displayedForms.length / pageSize) }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage >= Math.ceil(displayedForms.length / pageSize) - 1} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(displayedForms.length / pageSize) - 1))}
            >
              Next
            </Button>
          </div>
        )}

        {/* Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Form Details</DialogTitle>
            </DialogHeader>
            {selectedForm && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name</Label><div>{selectedForm.name || 'N/A'}</div></div>
                  <div><Label>Phone</Label><div>{selectedForm.number || 'N/A'}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Email</Label><div>{selectedForm.email || 'N/A'}</div></div>
                  <div><Label>Template ID</Label><div>{selectedForm.templet_id || 'N/A'}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>UID</Label><div className="font-mono">{selectedForm.uid || 'N/A'}</div></div>
                  <div><Label>Website ID</Label><div>{selectedForm.website_id || 'N/A'}</div></div>
                </div>
                <div><Label>Created Date</Label><div>{selectedForm.createdAt ? new Date(selectedForm.createdAt).toLocaleString() : 'N/A'}</div></div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ThreeDFormsTable;