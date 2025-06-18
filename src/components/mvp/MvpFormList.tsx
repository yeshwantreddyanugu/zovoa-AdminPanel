
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, User, Eye, CheckCircle, XCircle, DollarSign, RefreshCw, ExternalLink } from 'lucide-react';
import { MvpFormDto } from '../../types/mvp';

interface MvpFormListProps {
  forms: MvpFormDto[];
  onFormSelect: (form: MvpFormDto) => void;
  onRefresh?: () => void;
}

const MvpFormList: React.FC<MvpFormListProps> = ({ forms, onFormSelect, onRefresh }) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (forms.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No MVP requests found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {forms.length} MVP Request{forms.length !== 1 ? 's' : ''}
        </h2>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      {forms.map((form) => (
        <Card key={form.requestId} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  {form.title}
                  {form.demoUrl && (
                    <a 
                      href={form.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {form.requestId} | id:{form.id}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {form.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(form.createdAt)}
                  </div>
                  {form.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {form.assignedTo}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">{formatCurrency(form.price)}</span>
                  <span>•</span>
                  <span>{form.platform}</span>
                  <span>•</span>
                  <span>{form.targetAudience}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(form.status)}>
                  {form.status === 'Submitted' && '🟡'}
                  {form.status === 'In Progress' && '🔵'}
                  {form.status === 'Completed' && '🟢'}
                  {form.status}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(form.priority)}>
                  {form.priority}
                </Badge>
                <Badge className={form.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {form.isPaid ? (
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
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {form.status !== 'Submitted' && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="text-gray-600">{form.progress}%</span>
                </div>
                <Progress value={form.progress} className="h-2" />
                {form.nextMilestone && (
                  <p className="text-xs text-gray-500 mt-1">
                    Next: {form.nextMilestone}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Contact</p>
                <p className="text-sm text-gray-600">{form.contactEmail}</p>
              </div>
              {form.estimatedCompletion && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Est. Completion</p>
                  <p className="text-sm text-gray-600">{formatDate(form.estimatedCompletion)}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 flex-1 mr-4">
                {form.description.length > 120 
                  ? `${form.description.substring(0, 120)}...` 
                  : form.description
                }
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onFormSelect(form)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MvpFormList;
