// utils/fileUtils.ts
import { Archive, File, Folder, Image, Music, Video } from 'lucide-react';

export const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (item: any) => {
  if (item?.isDirectory) {
    return <Folder className="h-20 w-20 text-blue-500" />;
  }

  switch (item?.fileType) {
    case 'image':
      return <Image className="h-20 w-20 text-green-500" />;
    case 'video':
      return <Video className="h-20 w-20 text-red-500" />;
    case 'audio':
      return <Music className="h-20 w-20 text-purple-500" />;
    case 'archive':
      return <Archive className="h-20 w-20 text-orange-500" />;
    default:
      return <File className="h-20 w-20 text-gray-500" />;
  }
};

