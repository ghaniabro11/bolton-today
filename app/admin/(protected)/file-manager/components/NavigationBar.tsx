// components/NavigationBar.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Search } from 'lucide-react';

interface NavigationBarProps {
  currentPath: string;
  searchTerm: string;
  onNavigateUp: () => void;
  onSearchChange: (term: string) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentPath,
  searchTerm,
  onNavigateUp,
  onSearchChange,
}) => {
  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <Card className="mb-6 bg-sidebar">
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateUp}
              disabled={!currentPath}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
              <span>Root</span>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <span>/</span>
                  <span className="font-medium">{crumb}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
