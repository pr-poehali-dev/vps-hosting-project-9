import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface ConsoleLog {
  text: string;
  type: 'command' | 'output' | 'error' | 'success';
}

interface ServerConsoleProps {
  serverName: string;
  serverId: string;
  onClose: () => void;
}

const ServerConsole = ({ serverName, serverId, onClose }: ServerConsoleProps) => {
  const [logs, setLogs] = useState<ConsoleLog[]>([
    { text: `Welcome to ${serverName} Console`, type: 'success' },
    { text: 'Available commands: .op, restart, stop, help', type: 'output' },
    { text: '', type: 'output' },
  ]);
  const [command, setCommand] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [serverStatus, setServerStatus] = useState<'running' | 'stopped'>('running');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text: string, type: ConsoleLog['type'] = 'output') => {
    setLogs(prev => [...prev, { text, type }]);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    
    addLog(`$ ${cmd}`, 'command');

    switch (trimmed) {
      case '.op':
        addLog('Server Operations Menu:', 'output');
        addLog('  1. restart - Restart the server', 'output');
        addLog('  2. stop - Stop the server', 'output');
        addLog('  3. status - Check server status', 'output');
        addLog('  4. logs - View system logs', 'output');
        break;

      case 'restart':
        addLog('Restarting server...', 'output');
        setServerStatus('stopped');
        setTimeout(() => {
          addLog('Server stopped.', 'success');
          addLog('Starting server...', 'output');
          setTimeout(() => {
            addLog('Server started successfully.', 'success');
            setServerStatus('running');
          }, 1500);
        }, 1000);
        break;

      case 'stop':
        if (serverStatus === 'stopped') {
          addLog('Server is already stopped.', 'error');
        } else {
          addLog('Stopping server...', 'output');
          setTimeout(() => {
            addLog('Server stopped successfully.', 'success');
            setServerStatus('stopped');
          }, 1000);
        }
        break;

      case 'start':
        if (serverStatus === 'running') {
          addLog('Server is already running.', 'error');
        } else {
          addLog('Starting server...', 'output');
          setTimeout(() => {
            addLog('Server started successfully.', 'success');
            setServerStatus('running');
          }, 1000);
        }
        break;

      case 'status':
        addLog(`Server Status: ${serverStatus === 'running' ? 'Running' : 'Stopped'}`, serverStatus === 'running' ? 'success' : 'error');
        addLog(`Uptime: 15 days 7 hours`, 'output');
        addLog(`Memory: 4.2GB / 8GB`, 'output');
        addLog(`CPU Load: 45%`, 'output');
        break;

      case 'logs':
        addLog('[2024-12-02 15:23:45] System started', 'output');
        addLog('[2024-12-02 15:24:12] Database connected', 'output');
        addLog('[2024-12-02 15:25:01] API listening on port 8080', 'output');
        addLog('[2024-12-02 15:30:22] Health check passed', 'success');
        break;

      case 'help':
        addLog('Available commands:', 'output');
        addLog('  .op - Open operations menu', 'output');
        addLog('  restart - Restart the server', 'output');
        addLog('  stop - Stop the server', 'output');
        addLog('  start - Start the server', 'output');
        addLog('  status - Check server status', 'output');
        addLog('  logs - View system logs', 'output');
        addLog('  clear - Clear console', 'output');
        addLog('  help - Show this help message', 'output');
        break;

      case 'clear':
        setLogs([
          { text: `Welcome to ${serverName} Console`, type: 'success' },
          { text: 'Type "help" for available commands', type: 'output' },
        ]);
        break;

      case '':
        break;

      default:
        addLog(`Command not found: ${cmd}`, 'error');
        addLog('Type "help" for available commands', 'output');
    }

    addLog('', 'output');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command);
      setCommand('');
    }
  };

  return (
    <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-800/50 h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Icon name="Terminal" size={16} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Console - {serverName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${serverStatus === 'running' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                <span className="text-xs text-slate-400 font-mono">
                  {serverStatus === 'running' ? 'Running' : 'Stopped'}
                </span>
              </div>
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
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="font-mono text-sm space-y-1">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`${
                  log.type === 'command'
                    ? 'text-blue-400 font-semibold'
                    : log.type === 'error'
                    ? 'text-red-400'
                    : log.type === 'success'
                    ? 'text-green-400'
                    : 'text-slate-300'
                }`}
              >
                {log.text}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-slate-800/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 font-mono font-semibold">
                $
              </span>
              <Input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter command..."
                className="bg-slate-800/50 border-slate-700 text-white pl-8 font-mono"
                autoFocus
              />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Icon name="Send" size={16} />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerConsole;
