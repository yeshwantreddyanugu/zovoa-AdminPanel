
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, Plus, Search, DollarSign, Users, TrendingUp } from 'lucide-react';
import MvpFormList from '../components/mvp/MvpFormList';
import MvpFormDetail from '../components/mvp/MvpFormDetail';
import DateRangeFilter from '../components/mvp/DateRangeFilter';
import { MvpFormDto, ApiFilters } from '../types/mvp';
import { mvpApi } from '../services/mvpApi';
import { useNavigate } from 'react-router-dom';


const MvpDashboard = () => {
  const [selectedForm, setSelectedForm] = useState<MvpFormDto | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [mvpForms, setMvpForms] = useState<MvpFormDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();


  // Filters
  const [filters, setFilters] = useState<ApiFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    isPaid: undefined,
    startDate: '',
    endDate: ''
  });

  const loadMvps = async () => {
    try {
      setLoading(true);

      // Create clean filters object
      const apiFilters: ApiFilters = {};
      if (filters.search) apiFilters.search = filters.search;
      if (filters.status !== 'all') apiFilters.status = filters.status;
      if (filters.priority !== 'all') apiFilters.priority = filters.priority;
      if (filters.assignedTo !== 'all') {
        apiFilters.assignedTo = filters.assignedTo === 'unassigned' ? null : filters.assignedTo;
      }
      if (filters.isPaid !== undefined) apiFilters.isPaid = filters.isPaid;
      if (filters.startDate) apiFilters.startDate = filters.startDate;
      if (filters.endDate) apiFilters.endDate = filters.endDate;

      const response = await mvpApi.fetchMvps(apiFilters);

      // Ensure we always have an array, even if empty
      setMvpForms(Array.isArray(response.data) ? response.data : []);
      setTotalCount(response.total || 0);
    } catch (error) {
      console.error('Failed to load MVPs:', error);
      // Set empty arrays on error
      setMvpForms([]);
      setTotalCount(0);
      // Fallback to mock data for development if needed
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockData: MvpFormDto[] = [
      {
        requestId: 'MVP-001',
        id: 4,
        title: 'E-commerce Mobile App',
        type: 'SaaS',
        description: 'A comprehensive e-commerce platform for mobile devices with advanced features',
        targetAudience: 'Young professionals aged 25-35',
        platform: 'Mobile',
        prompt: 'Create a modern e-commerce app with payment integration',
        contactEmail: 'client@example.com',
        contactPhone: '+1234567890',
        price: 5000,
        isPaid: true,
        assignedTo: 'John Doe',
        priority: 'High',
        status: 'In Progress',
        progress: 65,
        estimatedCompletion: '2024-03-15',
        nextMilestone: 'Backend Development',
        demoUrl: 'https://demo.example.com',
        live_url: null,
        pdfUrl: '/docs/mvp-001.pdf',
        createdAt: '2024-01-15T10:30:00Z',
        lastUpdated: '2024-01-20T14:15:00Z',
        milestones: [
          { title: 'Project Setup', notes: 'Initial project configuration', dueDate: '2024-01-20', completed: true },
          { title: 'UI Design', notes: 'Complete UI/UX design', dueDate: '2024-02-05', completed: true },
          { title: 'Backend Development', notes: 'API and database setup', dueDate: '2024-02-20', completed: false }
        ],
        activities: [
          { message: 'Project assigned to John Doe', timestamp: '2024-01-15T10:30:00Z' },
          { message: 'Progress updated to 65%', timestamp: '2024-01-20T14:15:00Z' }
        ],
        files: [
          { filename: 'requirements.pdf', url: '/files/req-001.pdf' },
          { filename: 'wireframes.fig', url: '/files/wireframes-001.fig' }
        ]
      },
      {
        requestId: 'MVP-002',
        id: 5,
        title: 'Task Management Web App',
        type: 'Web App',
        description: 'A simple task management solution for small teams',
        targetAudience: 'Small businesses',
        platform: 'Web',
        prompt: 'Build a task management system with team collaboration',
        contactEmail: 'startup@example.com',
        contactPhone: '+1987654321',
        price: 3000,
        isPaid: false,
        assignedTo: null,
        priority: 'Medium',
        status: 'Submitted',
        progress: 0,
        estimatedCompletion: null,
        nextMilestone: null,
        demoUrl: null,
        live_url: null,
        pdfUrl: null,
        createdAt: '2024-01-18T09:15:00Z',
        lastUpdated: '2024-01-18T09:15:00Z',
        milestones: [],
        activities: [
          { message: 'Form submitted', timestamp: '2024-01-18T09:15:00Z' }
        ],
        files: []
      }
    ];

    setMvpForms(mockData);
    setTotalCount(mockData.length);
  };

  useEffect(() => {
    loadMvps();
  }, [filters]);

  const handleFormSelect = (form: MvpFormDto) => {
    setSelectedForm(form);
    setActiveTab('detail');
  };

  const handleBackToList = () => {
    setActiveTab('list');
    setSelectedForm(null);
  };

  const handleFormUpdate = (updatedForm: MvpFormDto) => {
    setSelectedForm(updatedForm);
    setMvpForms(prev => prev.map(form =>
      form.requestId === updatedForm.requestId ? updatedForm : form
    ));
  };

  const updateFilters = (key: keyof ApiFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      assignedTo: 'all',
      isPaid: undefined,
      startDate: '',
      endDate: ''
    });
  };

  // Calculate stats
  const stats = {
    total: totalCount,
    submitted: mvpForms?.filter(f => f.status === 'Submitted').length || 0,
    inProgress: mvpForms?.filter(f => f.status === 'In Progress').length || 0,
    completed: mvpForms?.filter(f => f.status === 'Completed').length || 0,
    paid: mvpForms?.filter(f => f.isPaid).length || 0,
    unpaid: mvpForms?.filter(f => !f.isPaid).length || 0,
    totalRevenue: mvpForms?.filter(f => f.isPaid).reduce((sum, f) => sum + (f.price || 0), 0) || 0
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MVP requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MVP Development Dashboard</h1>
          <p className="text-gray-600">Manage and track MVP development requests through their entire lifecycle</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Submitted</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.submitted}</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">🟡</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">🟢</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Projects</p>
                  <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {activeTab !== 'detail' && (
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="list">MVP Requests ({mvpForms.length})</TabsTrigger>
              <TabsTrigger value="website" onClick={(e) =>{  e.preventDefault(); navigate('/dashboard')}}>
                Website Request
              </TabsTrigger>
              <TabsTrigger value="3d" onClick={(e) => { e.preventDefault(); navigate('/manage-3d-websites')}}>
                3D Website Request
              </TabsTrigger>
            </TabsList>
          )}


          <TabsContent value="list" className="space-y-6">
            {/* Advanced Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters & Search
                  </CardTitle>
                  <Button variant="outline" onClick={clearFilters} size="sm">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by title, ID, or email..."
                      value={filters.search}
                      onChange={(e) => updateFilters('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filters.status} onValueChange={(value) => updateFilters('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.priority} onValueChange={(value) => updateFilters('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.assignedTo} onValueChange={(value) => updateFilters('assignedTo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    value={filters.isPaid === undefined ? 'all' : filters.isPaid ? 'paid' : 'unpaid'}
                    onValueChange={(value) => updateFilters('isPaid', value === 'all' ? undefined : value === 'paid')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payment Status</SelectItem>
                      <SelectItem value="paid">Paid Only</SelectItem>
                      <SelectItem value="unpaid">Unpaid Only</SelectItem>
                    </SelectContent>
                  </Select>

                  <DateRangeFilter
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    onStartDateChange={(date) => updateFilters('startDate', date)}
                    onEndDateChange={(date) => updateFilters('endDate', date)}
                  />
                </div>
              </CardContent>
            </Card>

            <MvpFormList
              forms={mvpForms}
              onFormSelect={handleFormSelect}
              onRefresh={loadMvps}
            />
          </TabsContent>

          <TabsContent value="detail">
            {selectedForm && (
              <MvpFormDetail
                form={selectedForm}
                onBack={handleBackToList}
                onUpdate={handleFormUpdate}
                onRefresh={loadMvps}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MvpDashboard;
