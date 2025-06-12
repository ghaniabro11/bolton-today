// components/ActionBar.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

interface ActionBarProps {
  onCreateFolder: () => void;
  onUploadFile: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onCreateFolder,
  onUploadFile,
}) => {
  return (
    <Card className="mb-6 bg-sidebar">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Button variant="outline" onClick={onCreateFolder}>
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={onUploadFile}>
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};