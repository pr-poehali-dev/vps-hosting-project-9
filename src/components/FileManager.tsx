import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
}

interface FileManagerProps {
  serverName: string;
  serverId: string;
  onClose: () => void;
}

const FileManager = ({ serverName, serverId, onClose }: FileManagerProps) => {
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [files, setFiles] = useState<FileItem[]>([
    { name: '..', type: 'folder', modified: '' },
    { name: 'www', type: 'folder', modified: '2024-12-01 14:30' },
    { name: 'logs', type: 'folder', modified: '2024-12-02 10:15' },
    { name: 'config', type: 'folder', modified: '2024-11-28 09:22' },
    { name: 'backups', type: 'folder', modified: '2024-12-01 03:00' },
    { name: '.env', type: 'file', size: '2.4 KB', modified: '2024-11-30 16:45' },
    { name: 'package.json', type: 'file', size: '1.8 KB', modified: '2024-11-29 11:20' },
    { name: 'README.md', type: 'file', size: '5.2 KB', modified: '2024-11-25 14:10' },
    { name: 'server.log', type: 'file', size: '45.8 MB', modified: '2024-12-02 15:30' },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      if (file.name === '..') {
        const parts = currentPath.split('/').filter(Boolean);
        parts.pop();
        setCurrentPath('/' + parts.join('/'));
      } else {
        setCurrentPath(`${currentPath}/${file.name}`);
      }
      setSelectedFile(null);
    } else {
      setSelectedFile(file.name);
    }
  };

  const handleDownload = () => {
    if (selectedFile) {
      toast.success(`Скачивание ${selectedFile}...`);
    }
  };

  const handleUpload = () => {
    toast.info('Функция загрузки файлов будет доступна в следующей версии');
  };

  const handleDelete = () => {
    if (selectedFile) {
      toast.success(`Файл ${selectedFile} удален`);
      setFiles(files.filter(f => f.name !== selectedFile));
      setSelectedFile(null);
    }
  };

  const handleCreateFolder = () => {
    toast.info('Введите имя новой папки');
  };

  return (
    <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-800/50 h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Icon name="FolderOpen" size={16} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">File Manager - {serverName}</CardTitle>
              <div className="text-xs text-slate-400 font-mono mt-1">{currentPath}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Icon name="X" size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="p-3 border-b border-slate-800/50 flex items-center gap-2">
          <Input
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            className="flex-1 bg-slate-800/50 border-slate-700 text-white font-mono text-sm"
            placeholder="/path/to/directory"
          />
          <Button size="sm" variant="outline" className="border-slate-700" onClick={handleUpload}>
            <Icon name="Upload" size={14} className="mr-2" />
            Загрузить
          </Button>
          <Button size="sm" variant="outline" className="border-slate-700" onClick={handleCreateFolder}>
            <Icon name="FolderPlus" size={14} className="mr-2" />
            Создать папку
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="space-y-1">
              {files.map((file, i) => (
                <div
                  key={i}
                  onClick={() => handleFileClick(file)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedFile === file.name
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center ${
                      file.type === 'folder' ? 'bg-blue-500/20' : 'bg-slate-700/50'
                    }`}
                  >
                    <Icon
                      name={file.type === 'folder' ? 'Folder' : 'FileText'}
                      size={16}
                      className={file.type === 'folder' ? 'text-blue-400' : 'text-slate-400'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">{file.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      {file.size && <span>{file.size}</span>}
                      {file.modified && <span>{file.modified}</span>}
                    </div>
                  </div>
                  {file.type === 'file' && (
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                      {file.name.split('.').pop()?.toUpperCase()}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {selectedFile && (
          <div className="p-3 border-t border-slate-800/50 flex items-center gap-2">
            <span className="text-sm text-slate-400 flex-1">Выбран: {selectedFile}</span>
            <Button size="sm" variant="outline" className="border-slate-700" onClick={handleDownload}>
              <Icon name="Download" size={14} className="mr-2" />
              Скачать
            </Button>
            <Button size="sm" variant="outline" className="border-red-700 text-red-400 hover:bg-red-500/20" onClick={handleDelete}>
              <Icon name="Trash2" size={14} className="mr-2" />
              Удалить
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileManager;
