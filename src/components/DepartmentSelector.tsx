
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
    <Card>
      <CardHeader>
        <CardTitle className="text-nyu-purple">Select Department</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedDepartment}
          onValueChange={onDepartmentChange}
          disabled={disabled || departments.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
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
