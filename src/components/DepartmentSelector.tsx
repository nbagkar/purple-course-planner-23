
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DepartmentSelectorProps {
  departments: string[];
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  disabled?: boolean;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  departments,
  selectedDepartment,
  onDepartmentChange,
  disabled = false
}) => {
  return (
    <Card className="bg-gradient-to-br from-nyu-purple/5 to-nyu-purple/10">
      <CardHeader>
        <CardTitle className="text-nyu-purple">Select Department</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedDepartment}
          onValueChange={onDepartmentChange}
          disabled={disabled || departments.length === 0}
        >
          <SelectTrigger className="w-full bg-white/70 backdrop-blur-sm border-nyu-purple/20 hover:border-nyu-purple/50 transition-colors">
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent className="bg-white/80 backdrop-blur-lg border border-nyu-purple/20 shadow-lg">
            <SelectGroup>
              {departments.map((department) => (
                <SelectItem 
                  key={department} 
                  value={department}
                  className="hover:bg-nyu-purple/10 focus:bg-nyu-purple/20 transition-colors"
                >
                  {department}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        {departments.length === 0 && !disabled && (
          <p className="mt-2 text-sm text-muted-foreground">
            Please upload course data first to see available departments.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentSelector;
