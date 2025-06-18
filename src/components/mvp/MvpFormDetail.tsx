
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";


import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Download,
  ExternalLink,
  Plus,
  Clock,
  FileText,
  Save,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { MvpFormDto, Milestone, Activity } from '../../types/mvp';
import { mvpApi } from '../../services/mvpApi';
import { Toast } from '@radix-ui/react-toast';

interface MvpFormDetailProps {
  form: MvpFormDto;
  onBack: () => void;
  onUpdate: (form: MvpFormDto) => void;
  onRefresh?: () => void;
}

const MvpFormDetail: React.FC<MvpFormDetailProps> = ({ form, onBack, onUpdate, onRefresh }) => {
  
  const [editedForm, setEditedForm] = useState<MvpFormDto>({
    ...form,
    files: form.files || [], // Already present in your code
    milestones: form.milestones || [], // Add this
    activities: form.activities || [] // Add this
  });
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    notes: '',
    dueDate: '',
    completed: false
  });
  const [newActivity, setNewActivity] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update basic form data
      await mvpApi.updateMvp(editedForm.requestId, {
        title: editedForm.title,
        id: editedForm.id,
        description: editedForm.description,
        platform: editedForm.platform,
        priority: editedForm.priority,
        targetAudience: editedForm.targetAudience,
        estimatedCompletion: editedForm.estimatedCompletion,
        demoUrl: editedForm.demoUrl,
        live_url: editedForm.live_url
      });

      // Update progress if changed
      if (editedForm.progress !== form.progress) {
        await mvpApi.updateProgress(Number(editedForm.requestId.replace(/\D/g, '')), editedForm.progress);
      }

      // Update assignment if changed
      if (editedForm.assignedTo !== form.assignedTo) {
        await mvpApi.assignUser(editedForm.requestId, editedForm.assignedTo);
      }

      // Update form with new lastUpdated timestamp
      const updatedForm = {
        ...editedForm,
        lastUpdated: new Date().toISOString()
      };

      onUpdate(updatedForm);

      console.log('MVP updated successfully');
    } catch (error) {
      console.error('Failed to save MVP:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLinks = async () => {
    try {
      setSaving(true);
      const { id, live_url, demoUrl } = editedForm;

      // Make the API call
      const response = await fetch(`https://zovoaapi.lytortech.com/api/mvp/${id}/update-urls`, {
        method: 'POST', // or 'PUT' depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          live: live_url,
          demo: demoUrl
        })
        // Include body if your API requires it
        // body: JSON.stringify({ anyAdditionalData: 'value' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update links');
      }

      // Handle successful response
      const data = await response.json();
      console.log('Links updated successfully:', data);
      toast({
        title: "Success",
        description: "Links updated successfully",
        variant: "default",
      });

      // Update your local state if needed
      // onUpdate(data); // If you have a callback function

    } catch (error) {
      console.error('Error updating links:', error);
      toast({
        title: "Error",
        description: "Failed to update links",
        variant: "destructive",
      });
      // Optionally show error to user
    } finally {
      setSaving(false);
    }
  };


  const progressUpdate = async (id: number, progress: number) => {
    try {
      console.log('Calling updateProgress with:', { id, progress });
      await mvpApi.updateProgress(id, progress);
      console.log('Progress update completed.');
      toast({
        title: "Success",
        description: "Progress Bar updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error in progressUpdate:', error);
      toast({
        title: "Error",
        description: "Failed to update progress Bar",
        variant: "destructive",
      });
    }
  };


  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    const newStatus = newProgress === 100 ? 'Completed' : newProgress > 0 ? 'In Progress' : 'Submitted';

    setEditedForm({
      ...editedForm,
      progress: newProgress,
      status: newStatus
    });
  };

  const addMilestone = async () => {
    if (newMilestone.title && newMilestone.dueDate) {
      try {
        setSaving(true);
        // Include completed status in the API call
        await mvpApi.addMilestone(editedForm.id, {
          title: newMilestone.title,
          notes: newMilestone.notes,
          dueDate: newMilestone.dueDate,
          completed: newMilestone.completed
        });

        const milestone: Milestone = {
          ...newMilestone
        };

        const updatedForm = {
          ...editedForm,
          milestones: [...editedForm.milestones, milestone],
          lastUpdated: new Date().toISOString()
        };

        setEditedForm(updatedForm);
        onUpdate(updatedForm);
        setNewMilestone({ title: '', notes: '', dueDate: '', completed: false });

        console.log('Milestone added successfully');
      } catch (error) {
        console.error('Failed to add milestone:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const addActivity = async () => {
    if (newActivity.trim()) {
      try {
        setSaving(true);
        await mvpApi.addActivity(editedForm.requestId, newActivity);

        const activity: Activity = {
          message: newActivity,
          timestamp: new Date().toISOString()
        };

        const updatedForm = {
          ...editedForm,
          activities: [activity, ...editedForm.activities],
          lastUpdated: new Date().toISOString()
        };

        setEditedForm(updatedForm);
        onUpdate(updatedForm);
        setNewActivity('');

        console.log('Activity added successfully');
      } catch (error) {
        console.error('Failed to add activity:', error);
      } finally {
        setSaving(false);
      }
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
              <div>
                <CardTitle className="text-xl">{editedForm.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="font-mono">
                    {editedForm.requestId} <span className="text-gray-400">|</span> id: {editedForm.id}
                  </span>
                  <Badge variant="outline">{editedForm.type}</Badge>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatCurrency(editedForm.price)}
                  </span>
                </div>
              </div>

            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(editedForm.status)}>
                {editedForm.status === 'Submitted' && '🟡'}
                {editedForm.status === 'In Progress' && '🔵'}
                {editedForm.status === 'Completed' && '🟢'}
                {editedForm.status}
              </Badge>
              <Badge className={editedForm.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {editedForm.isPaid ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Paid
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Unpaid
                  </>
                )}
              </Badge>
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="files">Files & Links</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input
                      value={editedForm.title}
                      onChange={(e) => setEditedForm({ ...editedForm, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Input
                      value={editedForm.type}
                      onChange={(e) => setEditedForm({ ...editedForm, type: e.target.value })}
                      placeholder="e.g., SaaS, Web App, Mobile App"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Textarea
                      rows={4}
                      value={editedForm.description}
                      onChange={(e) => setEditedForm({ ...editedForm, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Prompt</label>
                    <Textarea
                      rows={3}
                      value={editedForm.prompt}
                      onChange={(e) => setEditedForm({ ...editedForm, prompt: e.target.value })}
                      placeholder="Original user request/prompt"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                      <Select
                        value={editedForm.platform}
                        onValueChange={(value) => setEditedForm({ ...editedForm, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web">Web</SelectItem>
                          <SelectItem value="Mobile">Mobile</SelectItem>
                          <SelectItem value="Desktop">Desktop</SelectItem>
                          <SelectItem value="Cross-platform">Cross-platform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <Select
                        value={editedForm.priority}
                        onValueChange={(value) => setEditedForm({ ...editedForm, priority: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <Input
                      value={editedForm.targetAudience}
                      onChange={(e) => setEditedForm({ ...editedForm, targetAudience: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={editedForm.contactEmail}
                      onChange={(e) => setEditedForm({ ...editedForm, contactEmail: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input
                      value={editedForm.contactPhone}
                      onChange={(e) => setEditedForm({ ...editedForm, contactPhone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Price</label>
                    <Input
                      type="number"
                      value={editedForm.price}
                      onChange={(e) => setEditedForm({ ...editedForm, price: Number(e.target.value) })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timestamps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(editedForm.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Updated</p>
                    <p className="text-sm text-gray-600">{formatDate(editedForm.lastUpdated)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setEditedForm(form)}>
              Reset Changes
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment & Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <Select
                    value={editedForm.assignedTo || 'unassigned'}
                    onValueChange={(value) => setEditedForm({ ...editedForm, assignedTo: value === 'unassigned' ? null : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Progress ({editedForm.progress}%)
                  </label>
                  <Slider
                    value={[editedForm.progress]}
                    onValueChange={handleProgressChange}
                    max={100}
                    step={5}
                    className="w-full mb-4"
                  />
                  <Progress value={editedForm.progress} className="h-3" />
                  <p className="text-xs text-gray-500 mt-2">
                    Status automatically updates to "Completed" at 100%
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Completion</label>
                  <Input
                    type="date"
                    value={editedForm.estimatedCompletion || ''}
                    onChange={(e) => setEditedForm({ ...editedForm, estimatedCompletion: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Milestone</label>
                  <Input
                    value={editedForm.nextMilestone || ''}
                    onChange={(e) => setEditedForm({ ...editedForm, nextMilestone: e.target.value })}
                    placeholder="What's the next major milestone?"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Current Status</span>
                    <Badge className={getStatusColor(editedForm.status)}>
                      {editedForm.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Status automatically updates based on progress percentage
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Payment Status</span>
                    <Badge className={editedForm.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {editedForm.isPaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Payment status is managed through the payment system
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Priority Level</span>
                    <Badge variant="outline" className={
                      editedForm.priority === 'High' ? 'bg-red-100 text-red-800' :
                        editedForm.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                    }>
                      {editedForm.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    High priority projects get faster turnaround
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => progressUpdate(editedForm.id, editedForm.progress)}
              disabled={saving}
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Progress
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Milestones ({editedForm.milestones.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {editedForm.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={`h-3 w-3 rounded-full mt-1 ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{milestone.title}</p>
                        {milestone.notes && (
                          <p className="text-xs text-gray-600 mt-1">{milestone.notes}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Due: {milestone.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <Input
                    placeholder="Milestone title"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Milestone notes (optional)"
                    value={newMilestone.notes}
                    onChange={(e) => setNewMilestone({ ...newMilestone, notes: e.target.value })}
                    rows={2}
                  />
                  <Input
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  />
                  {/* New checkbox input for completed status */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newMilestone.completed || false}
                      onChange={(e) => setNewMilestone({ ...newMilestone, completed: e.target.checked })}
                      className="form-checkbox h-4 w-4 text-green-600"
                    />
                    <span className="text-sm text-gray-700">Completed</span>
                  </label>

                  <Button onClick={addMilestone} size="sm" className="w-full" disabled={saving}>
                    {saving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Milestone
                  </Button>
                </div>
              </CardContent>


            </Card>

            {/* Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activity Log ({editedForm.activities.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {editedForm.activities.map((activity, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <Textarea
                    placeholder="Add activity note..."
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={addActivity} size="sm" className="w-full" disabled={saving}>
                    {saving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Demo URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={editedForm.demoUrl || ''}
                      onChange={(e) => setEditedForm({ ...editedForm, demoUrl: e.target.value })}
                      placeholder="https://demo.example.com"
                    />
                    {editedForm.demoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={editedForm.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={editedForm.live_url || ''}
                      onChange={(e) => setEditedForm({ ...editedForm, live_url: e.target.value })}
                      placeholder="https://app.example.com"
                    />
                    {editedForm.live_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={editedForm.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {editedForm.pdfUrl && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Project PDF</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={editedForm.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files ({editedForm.files.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {editedForm.files.length > 0 ? (
                  <div className="space-y-3">
                    {editedForm.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{file.filename}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No files uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleLinks} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Links
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Payment Status</span>
                    <Badge className={editedForm.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {editedForm.isPaid ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Paid
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Unpaid
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Payment status is managed through the integrated payment system
                  </p>
                  <div className="text-lg font-semibold">
                    {formatCurrency(editedForm.price)}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project Value:</span>
                      <span className="font-medium">{formatCurrency(editedForm.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={editedForm.isPaid ? 'text-green-600' : 'text-red-600'}>
                        {editedForm.isPaid ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span>Credit Card</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Note</h4>
                <p className="text-sm text-blue-800">
                  Payment status is automatically updated through the payment processing system.
                  Manual updates to payment status should be done through the dedicated payment management interface.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MvpFormDetail;
