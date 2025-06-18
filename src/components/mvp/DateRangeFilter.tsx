
import React from 'react';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-gray-400" />
      <Input
        type="date"
        placeholder="Start date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="flex-1"
      />
      <span className="text-gray-400">to</span>
      <Input
        type="date"
        placeholder="End date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
};

export default DateRangeFilter;
