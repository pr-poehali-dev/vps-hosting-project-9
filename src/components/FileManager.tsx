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
  const [currentPath, setCurrentPath] = useState('/minecraft/server');
  const [viewMode, setViewMode] = useState<'list' | 'code'>('list');
  const [fileContent, setFileContent] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>([
    { name: '..', type: 'folder', modified: '' },
    { name: 'minecraft', type: 'folder', modified: '2024-12-01 14:30' },
    { name: 'plugins', type: 'folder', modified: '2024-12-02 10:15' },
    { name: 'world', type: 'folder', modified: '2024-11-28 09:22' },
    { name: 'logs', type: 'folder', modified: '2024-12-02 15:45' },
    { name: 'backups', type: 'folder', modified: '2024-12-01 03:00' },
    { name: 'server.properties', type: 'file', size: '4.2 KB', modified: '2024-11-30 16:45' },
    { name: 'eula.txt', type: 'file', size: '156 B', modified: '2024-11-29 11:20' },
    { name: 'whitelist.json', type: 'file', size: '892 B', modified: '2024-11-25 14:10' },
    { name: 'server.jar', type: 'file', size: '45.8 MB', modified: '2024-12-02 15:30' },
    { name: 'ops.json', type: 'file', size: '512 B', modified: '2024-12-01 12:00' },
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
      setViewMode('list');
    } else {
      setSelectedFile(file.name);
    }
  };

  const handleViewFile = () => {
    if (selectedFile) {
      const mockContent = `# ${selectedFile}\n\n# Конфигурация сервера\nserver-port=25565\nmax-players=20\ngamemode=survival\ndifficulty=normal\n\n# Настройки мира\nlevel-name=world\nlevel-seed=\nlevel-type=default\n\n# Производительность\nview-distance=10\nsimulation-distance=10`;
      setFileContent(mockContent);
      setViewMode('code');
      toast.success(`Открыт файл: ${selectedFile}`);
    }
  };

  const handleDownload = () => {
    if (selectedFile) {
      toast.success(`Скачивание ${selectedFile}...`);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast.success(`Загружен файл: ${file.name}`);
        const newFile: FileItem = {
          name: file.name,
          type: 'file',
          size: `${(file.size / 1024).toFixed(1)} KB`,
          modified: new Date().toLocaleString('ru-RU')
        };
        setFiles([...files, newFile]);
      }
    };
    input.click();
  };

  const handleDelete = () => {
    if (selectedFile) {
      toast.success(`Файл ${selectedFile} удален`);
      setFiles(files.filter(f => f.name !== selectedFile));
      setSelectedFile(null);
    }
  };

  const handleCreateFolder = () => {
    const folderName = prompt('Введите имя новой папки:');
    if (folderName) {
      const newFolder: FileItem = {
        name: folderName,
        type: 'folder',
        modified: new Date().toLocaleString('ru-RU')
      };
      setFiles([...files, newFolder]);
      toast.success(`Папка "${folderName}" создана`);
    }
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
          {viewMode === 'code' ? (
            <Button size="sm" variant="outline" className="border-slate-700" onClick={() => setViewMode('list')}>
              <Icon name="List" size={14} className="mr-2" />
              Список
            </Button>
          ) : (
            <>
              <Button size="sm" variant="outline" className="border-slate-700" onClick={handleUpload}>
                <Icon name="Upload" size={14} className="mr-2" />
                Загрузить
              </Button>
              <Button size="sm" variant="outline" className="border-slate-700" onClick={handleCreateFolder}>
                <Icon name="FolderPlus" size={14} className="mr-2" />
                Папка
              </Button>
            </>
          )}
        </div>

        {viewMode === 'code' ? (
          <ScrollArea className="flex-1 p-4 bg-slate-950">
            <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">{fileContent}</pre>
          </ScrollArea>
        ) : (
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
        )}

        {selectedFile && viewMode === 'list' && (
          <div className="p-3 border-t border-slate-800/50 flex items-center gap-2">
            <span className="text-sm text-slate-400 flex-1">Выбран: {selectedFile}</span>
            <Button size="sm" variant="outline" className="border-green-700 text-green-400 hover:bg-green-500/20" onClick={handleViewFile}>
              <Icon name="Eye" size={14} className="mr-2" />
              Просмотр
            </Button>
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