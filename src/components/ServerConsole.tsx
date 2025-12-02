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
    { text: `[СИСТЕМА] Подключение к серверу ${serverName}...`, type: 'output' },
    { text: `[СИСТЕМА] Соединение установлено`, type: 'success' },
    { text: `[СИСТЕМА] Сервер запущен`, type: 'success' },
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
        addLog('╔══════════ МЕНЮ ОПЕРАЦИЙ ══════════╗', 'output');
        addLog('║  1. restart - Перезагрузка сервера  ║', 'output');
        addLog('║  2. stop - Остановка сервера        ║', 'output');
        addLog('║  3. start - Запуск сервера          ║', 'output');
        addLog('║  4. status - Статус сервера         ║', 'output');
        addLog('║  5. players - Список игроков        ║', 'output');
        addLog('║  6. backup - Создать бэкап          ║', 'output');
        addLog('╚════════════════════════════════════╝', 'output');
        break;

      case 'restart':
        addLog('[СИСТЕМА] Инициирована перезагрузка...', 'output');
        addLog('[СИСТЕМА] Сохранение данных...', 'output');
        setServerStatus('stopped');
        setTimeout(() => {
          addLog('[СИСТЕМА] ✓ Данные сохранены', 'success');
          addLog('[СИСТЕМА] Остановка сервиса...', 'output');
          setTimeout(() => {
            addLog('[СИСТЕМА] ✓ Сервис остановлен', 'success');
            addLog('[СИСТЕМА] Запуск сервиса...', 'output');
            setTimeout(() => {
              addLog('[СИСТЕМА] ✓ Сервер успешно перезагружен', 'success');
              addLog('[СИСТЕМА] Все системы работают в штатном режиме', 'success');
              setServerStatus('running');
            }, 1500);
          }, 1000);
        }, 800);
        break;

      case 'stop':
        if (serverStatus === 'stopped') {
          addLog('[ОШИБКА] Сервер уже остановлен', 'error');
        } else {
          addLog('[СИСТЕМА] Инициирована остановка сервера...', 'output');
          addLog('[СИСТЕМА] Отключение игроков...', 'output');
          setTimeout(() => {
            addLog('[СИСТЕМА] ✓ Игроки отключены', 'success');
            addLog('[СИСТЕМА] Сохранение мира...', 'output');
            setTimeout(() => {
              addLog('[СИСТЕМА] ✓ Мир сохранён', 'success');
              addLog('[СИСТЕМА] ✓ Сервер успешно остановлен', 'success');
              setServerStatus('stopped');
            }, 1200);
          }, 1000);
        }
        break;

      case 'start':
        if (serverStatus === 'running') {
          addLog('[ОШИБКА] Сервер уже запущен', 'error');
        } else {
          addLog('[СИСТЕМА] Инициирован запуск сервера...', 'output');
          addLog('[СИСТЕМА] Загрузка конфигурации...', 'output');
          setTimeout(() => {
            addLog('[СИСТЕМА] ✓ Конфигурация загружена', 'success');
            addLog('[СИСТЕМА] Загрузка мира...', 'output');
            setTimeout(() => {
              addLog('[СИСТЕМА] ✓ Мир загружен', 'success');
              addLog('[СИСТЕМА] Запуск сетевого сервиса...', 'output');
              setTimeout(() => {
                addLog('[СИСТЕМА] ✓ Сервер успешно запущен', 'success');
                addLog('[СИСТЕМА] Сервер готов принимать подключения', 'success');
                setServerStatus('running');
              }, 1000);
            }, 1200);
          }, 800);
        }
        break;

      case 'status':
        addLog('╔═══════════ СТАТУС СЕРВЕРА ═══════════╗', 'output');
        addLog(`║ Состояние: ${serverStatus === 'running' ? '🟢 РАБОТАЕТ' : '🔴 ОСТАНОВЛЕН'}`, serverStatus === 'running' ? 'success' : 'error');
        addLog(`║ Время работы: ${Math.floor(Math.random() * 72)}ч ${Math.floor(Math.random() * 60)}м`, 'output');
        addLog(`║ CPU: ${Math.floor(Math.random() * 30 + 20)}%`, 'output');
        addLog(`║ RAM: ${Math.floor(Math.random() * 40 + 30)}% (${Math.floor(Math.random() * 8 + 4)}GB/16GB)`, 'output');
        addLog(`║ Игроков онлайн: ${Math.floor(Math.random() * 15)}/20`, 'output');
        addLog(`║ TPS: ${(Math.random() * 0.5 + 19.5).toFixed(1)}`, 'output');
        addLog('╚═══════════════════════════════════════╝', 'output');
        break;

      case 'logs':
        const now = new Date();
        addLog(`[${now.toLocaleTimeString()}] [INFO] Сервер запущен`, 'output');
        addLog(`[${now.toLocaleTimeString()}] [INFO] Загружен плагин: WorldGuard`, 'output');
        addLog(`[${now.toLocaleTimeString()}] [INFO] Загружен плагин: EssentialsX`, 'output');
        addLog(`[${now.toLocaleTimeString()}] [SUCCESS] Мир загружен успешно`, 'success');
        addLog(`[${now.toLocaleTimeString()}] [INFO] Сервер доступен на порту 25565`, 'output');
        break;

      case 'players':
        const playerCount = Math.floor(Math.random() * 8);
        addLog(`Игроков онлайн: ${playerCount}/20`, 'output');
        if (playerCount > 0) {
          const players = ['Steve', 'Alex', 'Notch', 'Herobrine', 'MinerPro', 'CrafterGod', 'BlockBuilder', 'RedstoneKing'];
          for (let i = 0; i < playerCount; i++) {
            addLog(`  ${i + 1}. ${players[i]} (${Math.floor(Math.random() * 200) + 50}ms)`, 'output');
          }
        } else {
          addLog('Нет игроков онлайн', 'output');
        }
        break;

      case 'backup':
        addLog('[BACKUP] Инициировано создание резервной копии...', 'output');
        setTimeout(() => {
          addLog('[BACKUP] Сохранение мира...', 'output');
          setTimeout(() => {
            addLog('[BACKUP] ✓ Резервная копия создана успешно', 'success');
            addLog(`[BACKUP] Размер: ${(Math.random() * 500 + 100).toFixed(2)} MB`, 'output');
          }, 2000);
        }, 1000);
        break;

      case 'help':
        addLog('╔═══════════ ДОСТУПНЫЕ КОМАНДЫ ═══════════╗', 'output');
        addLog('║  .op       - Меню операций                ║', 'output');
        addLog('║  start     - Запустить сервер             ║', 'output');
        addLog('║  stop      - Остановить сервер            ║', 'output');
        addLog('║  restart   - Перезагрузить сервер         ║', 'output');
        addLog('║  status    - Показать статус              ║', 'output');
        addLog('║  players   - Список игроков онлайн        ║', 'output');
        addLog('║  logs      - Просмотр системных логов     ║', 'output');
        addLog('║  backup    - Создать резервную копию      ║', 'output');
        addLog('║  clear     - Очистить консоль             ║', 'output');
        addLog('╚══════════════════════════════════════════╝', 'output');
        break;

      case 'clear':
        setLogs([
          { text: `[СИСТЕМА] Консоль очищена`, type: 'success' },
          { text: '', type: 'output' },
        ]);
        break;

      case '':
        break;

      default:
        if (cmd.startsWith('say ')) {
          const message = cmd.substring(4);
          addLog(`[СЕРВЕР] ${message}`, 'success');
        } else if (cmd.startsWith('tp ')) {
          addLog('[КОМАНДА] ✓ Телепортация выполнена', 'success');
        } else if (cmd.startsWith('give ')) {
          addLog('[КОМАНДА] ✓ Предмет выдан игроку', 'success');
        } else if (cmd.startsWith('kick ')) {
          const player = cmd.substring(5);
          addLog(`[КОМАНДА] ✓ Игрок ${player} кикнут с сервера`, 'success');
        } else if (cmd.startsWith('ban ')) {
          const player = cmd.substring(4);
          addLog(`[КОМАНДА] ✓ Игрок ${player} забанен`, 'success');
        } else {
          addLog(`[ОШИБКА] Команда не найдена: ${cmd}`, 'error');
          addLog('[СИСТЕМА] Введите "help" для списка команд', 'output');
        }
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