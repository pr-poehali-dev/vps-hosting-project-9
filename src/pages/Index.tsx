import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import ServerConsole from '@/components/ServerConsole';
import FileManager from '@/components/FileManager';

const Index = () => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  const servers = [
    { id: '1', name: 'Production API', status: 'active', cpu: 45, ram: 62, disk: 38, location: 'Frankfurt', ip: '185.22.134.45' },
    { id: '2', name: 'Frontend CDN', status: 'active', cpu: 28, ram: 41, disk: 22, location: 'Amsterdam', ip: '192.168.1.101' },
    { id: '3', name: 'Database Primary', status: 'warning', cpu: 78, ram: 85, disk: 64, location: 'London', ip: '10.0.0.55' },
    { id: '4', name: 'Analytics Server', status: 'active', cpu: 34, ram: 52, disk: 45, location: 'Paris', ip: '172.16.0.12' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 50) return 'bg-green-500';
    if (value < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard' },
    { id: 'servers', label: 'Серверы', icon: 'Server' },
    { id: 'analytics', label: 'Аналитика', icon: 'LineChart' },
    { id: 'monitoring', label: 'Мониторинг', icon: 'Activity' },
    { id: 'billing', label: 'Биллинг', icon: 'CreditCard' },
    { id: 'domains', label: 'Домены', icon: 'Globe' },
    { id: 'security', label: 'Безопасность', icon: 'Shield' },
    { id: 'co-owners', label: 'Сов.Владельцы', icon: 'Users' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
    { id: 'support', label: 'Поддержка', icon: 'MessageCircle' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
  ];

  const [activeNav, setActiveNav] = useState('dashboard');
  const [restartingServers, setRestartingServers] = useState<Set<string>>(new Set());
  const [stoppingServers, setStoppingServers] = useState<Set<string>>(new Set());
  const [startingServers, setStartingServers] = useState<Set<string>>(new Set());
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [selectedServerForConsole, setSelectedServerForConsole] = useState<{id: string, name: string} | null>(null);

  const handleRestart = (serverId: string, serverName: string) => {
    setRestartingServers(prev => new Set(prev).add(serverId));
    toast.loading(`Перезагрузка ${serverName}...`, { id: serverId });
    
    setTimeout(() => {
      setRestartingServers(prev => {
        const next = new Set(prev);
        next.delete(serverId);
        return next;
      });
      toast.success(`${serverName} успешно перезагружен`, { id: serverId });
    }, 3000);
  };

  const handleStop = (serverId: string, serverName: string) => {
    setStoppingServers(prev => new Set(prev).add(serverId));
    toast.loading(`Остановка ${serverName}...`, { id: `stop-${serverId}` });
    
    setTimeout(() => {
      setStoppingServers(prev => {
        const next = new Set(prev);
        next.delete(serverId);
        return next;
      });
      toast.success(`${serverName} остановлен`, { id: `stop-${serverId}` });
    }, 2000);
  };

  const handleStart = (serverId: string, serverName: string) => {
    setStartingServers(prev => new Set(prev).add(serverId));
    toast.loading(`Запуск ${serverName}...`, { id: `start-${serverId}` });
    
    setTimeout(() => {
      setStartingServers(prev => {
        const next = new Set(prev);
        next.delete(serverId);
        return next;
      });
      toast.success(`${serverName} успешно запущен`, { id: `start-${serverId}` });
    }, 2500);
  };

  const handleOpenConsole = (serverId: string, serverName: string) => {
    setSelectedServerForConsole({ id: serverId, name: serverName });
    setConsoleOpen(true);
  };

  const handleOpenFileManager = (serverId: string, serverName: string) => {
    setSelectedServerForConsole({ id: serverId, name: serverName });
    setFileManagerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 p-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">VPS Cloud</h1>
                <p className="text-xs text-slate-400">Управление серверами</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeNav === item.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <Icon name="Sparkles" size={24} className="text-purple-400 mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">Премиум план</h3>
            <p className="text-xs text-slate-400 mb-3">Безлимитные ресурсы для роста</p>
            <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Апгрейд
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Мониторинг системы</h2>
                <p className="text-slate-400">Отслеживайте производительность в реальном времени</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-green-500/30 text-green-400 px-4 py-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Все системы работают
                </Badge>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Создать сервер
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-blue-500/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-400">Активные серверы</CardTitle>
                    <Icon name="Server" size={20} className="text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{servers.length}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="TrendingUp" size={16} className="text-green-400" />
                    <span className="text-green-400">+2 за месяц</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-purple-500/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-400">Средняя загрузка CPU</CardTitle>
                    <Icon name="Cpu" size={20} className="text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">46%</div>
                  <Progress value={46} className="h-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-pink-500/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-400">Использование памяти</CardTitle>
                    <Icon name="MemoryStick" size={20} className="text-pink-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">60%</div>
                  <Progress value={60} className="h-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-orange-500/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-400">Объём данных</CardTitle>
                    <Icon name="HardDrive" size={20} className="text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">2.4 TB</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">из 5 TB</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="servers" className="space-y-6">
              <TabsList className="bg-slate-900/50 border border-slate-800/50">
                <TabsTrigger value="servers" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  <Icon name="Server" size={16} className="mr-2" />
                  Серверы
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                  <Icon name="Activity" size={16} className="mr-2" />
                  Производительность
                </TabsTrigger>
                <TabsTrigger value="network" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                  <Icon name="Network" size={16} className="mr-2" />
                  Сеть
                </TabsTrigger>
              </TabsList>

              <TabsContent value="servers" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {servers.map((server) => (
                    <Card
                      key={server.id}
                      className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedServer(server.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Icon name="Server" size={20} className="text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white">{server.name}</CardTitle>
                              <CardDescription className="text-xs font-mono">{server.ip}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(server.status)} animate-pulse`}></span>
                            <Badge variant="outline" className="border-slate-700 text-slate-300">
                              {server.location}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                              <Icon name="Cpu" size={14} />
                              CPU
                            </span>
                            <span className={`text-sm font-mono font-semibold ${server.cpu > 75 ? 'text-red-400' : server.cpu > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                              {server.cpu}%
                            </span>
                          </div>
                          <Progress value={server.cpu} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                              <Icon name="MemoryStick" size={14} />
                              RAM
                            </span>
                            <span className={`text-sm font-mono font-semibold ${server.ram > 75 ? 'text-red-400' : server.ram > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                              {server.ram}%
                            </span>
                          </div>
                          <Progress value={server.ram} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                              <Icon name="HardDrive" size={14} />
                              Диск
                            </span>
                            <span className={`text-sm font-mono font-semibold ${server.disk > 75 ? 'text-red-400' : server.disk > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                              {server.disk}%
                            </span>
                          </div>
                          <Progress value={server.disk} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-green-700 hover:bg-green-800 text-green-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStart(server.id, server.name);
                            }}
                            disabled={startingServers.has(server.id)}
                          >
                            <Icon name={startingServers.has(server.id) ? "Loader2" : "Play"} size={14} className={`mr-2 ${startingServers.has(server.id) ? 'animate-spin' : ''}`} />
                            {startingServers.has(server.id) ? 'Запуск...' : 'Start'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-700 hover:bg-red-800 text-red-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStop(server.id, server.name);
                            }}
                            disabled={stoppingServers.has(server.id)}
                          >
                            <Icon name={stoppingServers.has(server.id) ? "Loader2" : "Square"} size={14} className={`mr-2 ${stoppingServers.has(server.id) ? 'animate-spin' : ''}`} />
                            {stoppingServers.has(server.id) ? 'Стоп...' : 'Stop'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-blue-700 hover:bg-blue-800 text-blue-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestart(server.id, server.name);
                            }}
                            disabled={restartingServers.has(server.id)}
                          >
                            <Icon name={restartingServers.has(server.id) ? "Loader2" : "RotateCw"} size={14} className={`mr-2 ${restartingServers.has(server.id) ? 'animate-spin' : ''}`} />
                            {restartingServers.has(server.id) ? 'Restart...' : 'Restart'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-purple-700 hover:bg-purple-800 text-purple-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenConsole(server.id, server.name);
                            }}
                          >
                            <Icon name="Terminal" size={14} className="mr-2" />
                            Console
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-orange-700 hover:bg-orange-800 text-orange-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFileManager(server.id, server.name);
                            }}
                          >
                            <Icon name="FolderOpen" size={14} className="mr-2" />
                            Files
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-cyan-700 hover:bg-cyan-800 text-cyan-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`SFTP: sftp://root@${server.ip}:22`);
                            }}
                          >
                            <Icon name="Cable" size={14} className="mr-2" />
                            SFTP
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Анализ производительности</CardTitle>
                    <CardDescription>Детальная информация о загрузке системы за последние 24 часа</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="Zap" size={20} className="text-blue-400" />
                            <span className="text-sm text-slate-400">Пиковая нагрузка</span>
                          </div>
                          <div className="text-2xl font-bold text-white">89%</div>
                          <div className="text-xs text-slate-400 mt-1">14:23 сегодня</div>
                        </div>

                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="TrendingDown" size={20} className="text-green-400" />
                            <span className="text-sm text-slate-400">Минимальная нагрузка</span>
                          </div>
                          <div className="text-2xl font-bold text-white">12%</div>
                          <div className="text-xs text-slate-400 mt-1">03:45 сегодня</div>
                        </div>

                        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="Activity" size={20} className="text-purple-400" />
                            <span className="text-sm text-slate-400">Средняя нагрузка</span>
                          </div>
                          <div className="text-2xl font-bold text-white">46%</div>
                          <div className="text-xs text-slate-400 mt-1">за 24 часа</div>
                        </div>
                      </div>

                      <div className="h-64 flex items-end justify-between gap-2 p-4 rounded-lg bg-slate-800/30">
                        {[32, 45, 38, 55, 48, 62, 58, 71, 65, 52, 48, 56, 63, 58, 67, 72, 68, 54, 49, 42, 38, 35, 28, 24].map((value, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                              style={{
                                height: `${value}%`,
                                background: `linear-gradient(to top, hsl(199, 89%, 48%), hsl(262, 83%, 58%))`,
                              }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="network" className="space-y-4">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Сетевая активность</CardTitle>
                    <CardDescription>Входящий и исходящий трафик</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="flex items-center gap-3">
                            <Icon name="ArrowDown" size={24} className="text-green-400" />
                            <div>
                              <div className="text-sm text-slate-400">Входящий</div>
                              <div className="text-2xl font-bold text-white font-mono">245 MB/s</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <div className="flex items-center gap-3">
                            <Icon name="ArrowUp" size={24} className="text-blue-400" />
                            <div>
                              <div className="text-sm text-slate-400">Исходящий</div>
                              <div className="text-2xl font-bold text-white font-mono">187 MB/s</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Трафик за сегодня</span>
                          <span className="text-white font-mono">12.4 GB</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Трафик за неделю</span>
                          <span className="text-white font-mono">86.2 GB</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Трафик за месяц</span>
                          <span className="text-white font-mono">342 GB</span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-slate-700">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Активные подключения</span>
                            <span className="text-green-400 font-semibold">1,247</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {activeNav === 'analytics' && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Аналитика серверов</CardTitle>
                  <CardDescription>Статистика использования ресурсов за последний месяц</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                      <Icon name="TrendingUp" size={32} className="text-blue-400 mb-3" />
                      <div className="text-3xl font-bold text-white mb-2">1,248</div>
                      <div className="text-sm text-slate-400">Всего запросов</div>
                      <div className="text-xs text-green-400 mt-2">+18% за неделю</div>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                      <Icon name="Clock" size={32} className="text-purple-400 mb-3" />
                      <div className="text-3xl font-bold text-white mb-2">98.7%</div>
                      <div className="text-sm text-slate-400">Uptime</div>
                      <div className="text-xs text-green-400 mt-2">Отличная стабильность</div>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20">
                      <Icon name="Zap" size={32} className="text-pink-400 mb-3" />
                      <div className="text-3xl font-bold text-white mb-2">42ms</div>
                      <div className="text-sm text-slate-400">Средний отклик</div>
                      <div className="text-xs text-green-400 mt-2">-5ms за неделю</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeNav === 'billing' && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Биллинг</CardTitle>
                  <CardDescription>Информация о тарифе и платежах</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Текущий баланс</div>
                          <div className="text-4xl font-bold text-white">$245.00</div>
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Icon name="Plus" size={16} className="mr-2" />
                          Пополнить
                        </Button>
                      </div>
                      <div className="text-xs text-slate-400">Следующее списание: 15 декабря 2024</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-2">Расход за месяц</div>
                        <div className="text-2xl font-bold text-white mb-1">$128.50</div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-2">Прогноз на месяц</div>
                        <div className="text-2xl font-bold text-white mb-1">$198.00</div>
                        <Progress value={82} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeNav === 'domains' && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Домены для Minecraft серверов</CardTitle>
                      <CardDescription>Подключите домен к вашему серверу</CardDescription>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => toast.success('Введите домен и выберите сервер')}>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить домен
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { domain: 'mc.craftplay.ru', server: 'minecraft-01', port: 25565, status: 'active', ssl: true, ip: '185.22.134.45', players: 12 },
                      { domain: 'play.minecity.net', server: 'minecraft-02', port: 25566, status: 'active', ssl: true, ip: '192.168.1.101', players: 8 },
                      { domain: 'srv.blockworld.com', server: 'minecraft-03', port: 25565, status: 'active', ssl: true, ip: '10.0.0.55', players: 5 },
                    ].map((domain, i) => (
                      <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                              <Icon name="Gamepad2" size={24} className="text-white" />
                            </div>
                            <div>
                              <div className="text-white font-semibold text-lg">{domain.domain}</div>
                              <div className="text-xs text-slate-400 font-mono">{domain.ip}:{domain.port}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {domain.ssl && (
                              <Badge variant="outline" className="border-green-500/30 text-green-400">
                                <Icon name="Lock" size={12} className="mr-1" />
                                SSL
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                              <Icon name="Users" size={12} className="mr-1" />
                              {domain.players} игроков
                            </Badge>
                            <Badge variant="outline" className="border-green-500/30 text-green-400">Активен</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Icon name="Server" size={14} />
                          <span>Сервер: {domain.server}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" className="border-slate-700" onClick={() => {
                            navigator.clipboard.writeText(domain.domain);
                            toast.success('Адрес скопирован в буфер обмена');
                          }}>
                            <Icon name="Copy" size={14} className="mr-2" />
                            Копировать адрес
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-700">
                            <Icon name="Settings" size={14} className="mr-2" />
                            Настроить DNS
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-700 text-red-400 hover:bg-red-500/20">
                            <Icon name="Unlink" size={14} className="mr-2" />
                            Отвязать
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-blue-400 mt-1" />
                      <div>
                        <div className="text-white font-semibold mb-1">Как подключить домен к Minecraft серверу?</div>
                        <div className="text-sm text-slate-300 space-y-1">
                          <p>1. Добавьте A-запись в DNS: {'{'}ваш_домен{'}'} → {'{'}IP_сервера{'}'}</p>
                          <p>2. Добавьте SRV-запись: _minecraft._tcp.{'{'}ваш_домен{'}'} → {'{'}IP_сервера{'}'}:{'{'}порт{'}'}</p>
                          <p>3. Подождите 5-15 минут пока DNS обновится</p>
                          <p>4. Подключайтесь через: {'{'}ваш_домен{'}'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeNav === 'co-owners' && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Совладельцы</CardTitle>
                      <CardDescription>Управление доступом к серверам</CardDescription>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => toast.info('Введите email пользователя для приглашения')}>
                      <Icon name="UserPlus" size={16} className="mr-2" />
                      Пригласить
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Иван Петров', email: 'ivan@example.com', role: 'admin', servers: ['minecraft-01', 'minecraft-02'], status: 'active', avatar: 'И' },
                      { name: 'Мария Смирнова', email: 'maria@example.com', role: 'moderator', servers: ['minecraft-02'], status: 'active', avatar: 'М' },
                      { name: 'Алексей Козлов', email: 'alexey@example.com', role: 'viewer', servers: ['minecraft-01'], status: 'pending', avatar: 'А' },
                    ].map((user, i) => (
                      <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl text-white font-bold">
                              {user.avatar}
                            </div>
                            <div>
                              <div className="text-white font-semibold">{user.name}</div>
                              <div className="text-sm text-slate-400">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={user.status === 'active' ? 'border-green-500/30 text-green-400' : 'border-yellow-500/30 text-yellow-400'}>
                              {user.status === 'active' ? 'Активен' : 'Ожидание'}
                            </Badge>
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                              {user.role === 'admin' ? 'Администратор' : user.role === 'moderator' ? 'Модератор' : 'Наблюдатель'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs text-slate-400">Доступ к серверам:</span>
                          {user.servers.map((server, idx) => (
                            <Badge key={idx} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                              {server}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-slate-700">
                            <Icon name="Settings" size={14} className="mr-2" />
                            Настроить права
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-700">
                            <Icon name="Server" size={14} className="mr-2" />
                            Изменить серверы
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-700 text-red-400 hover:bg-red-500/20">
                            <Icon name="UserMinus" size={14} className="mr-2" />
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeNav === 'settings' && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Настройки API и SFTP</CardTitle>
                  <CardDescription>Управление доступом и безопасностью</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Icon name="Key" size={24} className="text-blue-400" />
                          <div>
                            <div className="text-lg font-semibold text-white">API Ключ</div>
                            <div className="text-sm text-slate-400">Используйте для доступа к API</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-slate-700" onClick={() => {
                          const key = 'sk_' + Math.random().toString(36).substr(2, 32);
                          navigator.clipboard.writeText(key);
                          toast.success('Новый API ключ скопирован');
                        }}>
                          <Icon name="RefreshCw" size={14} className="mr-2" />
                          Пересоздать
                        </Button>
                      </div>
                      <div className="p-3 rounded bg-slate-900/50 border border-slate-700 font-mono text-sm text-slate-300 flex items-center justify-between">
                        <span className="blur-sm hover:blur-none transition-all cursor-pointer select-all">sk_7f9a8b3c2d1e0f4g5h6i7j8k9l0m1n2o</span>
                        <Button size="sm" variant="ghost" onClick={() => {
                          navigator.clipboard.writeText('sk_7f9a8b3c2d1e0f4g5h6i7j8k9l0m1n2o');
                          toast.success('API ключ скопирован');
                        }}>
                          <Icon name="Copy" size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Icon name="Cable" size={24} className="text-cyan-400" />
                          <div>
                            <div className="text-lg font-semibold text-white">SFTP Доступ</div>
                            <div className="text-sm text-slate-400">Настройки подключения к файлам</div>
                          </div>
                        </div>
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700" onClick={() => toast.info('Инструкция по SFTP отправлена на email')}>
                          <Icon name="Download" size={14} className="mr-2" />
                          Инструкция
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                          <div className="text-xs text-slate-500 mb-1">Хост</div>
                          <div className="font-mono text-sm text-slate-300 flex items-center justify-between">
                            <span>sftp.vpscloud.io</span>
                            <Button size="sm" variant="ghost" onClick={() => {
                              navigator.clipboard.writeText('sftp.vpscloud.io');
                              toast.success('Хост скопирован');
                            }}>
                              <Icon name="Copy" size={14} />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                          <div className="text-xs text-slate-500 mb-1">Порт</div>
                          <div className="font-mono text-sm text-slate-300">22</div>
                        </div>
                        <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                          <div className="text-xs text-slate-500 mb-1">Логин</div>
                          <div className="font-mono text-sm text-slate-300">root</div>
                        </div>
                        <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                          <div className="text-xs text-slate-500 mb-1">Пароль</div>
                          <div className="font-mono text-sm text-slate-300 blur-sm hover:blur-none transition-all cursor-pointer">P@ssw0rd!2024</div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 rounded bg-blue-500/10 border border-blue-500/30">
                        <div className="text-sm text-slate-300">
                          <strong className="text-blue-400">Рекомендуемые клиенты:</strong> FileZilla, WinSCP, Cyberduck
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-3 mb-4">
                        <Icon name="Shield" size={24} className="text-green-400" />
                        <div>
                          <div className="text-lg font-semibold text-white">IP Whitelist</div>
                          <div className="text-sm text-slate-400">Ограничьте доступ по IP адресам</div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-3">
                        {['185.22.134.45', '192.168.1.0/24'].map((ip, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-700">
                            <span className="font-mono text-sm text-slate-300">{ip}</span>
                            <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20">
                              <Icon name="X" size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-700 w-full">
                        <Icon name="Plus" size={14} className="mr-2" />
                        Добавить IP адрес
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeNav === 'profile' && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Профиль</CardTitle>
                  <CardDescription>Настройки аккаунта</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl text-white font-bold">
                        A
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white mb-1">Admin User</div>
                        <div className="text-sm text-slate-400">admin@example.com</div>
                        <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30">Premium Plan</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-1">Серверов</div>
                        <div className="text-2xl font-bold text-white">4</div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-1">Доменов</div>
                        <div className="text-2xl font-bold text-white">3</div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-1">Дата регистрации</div>
                        <div className="text-lg font-semibold text-white">15.11.2024</div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-1">Статус</div>
                        <div className="text-lg font-semibold text-green-400">Активен</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <Dialog open={consoleOpen} onOpenChange={setConsoleOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedServerForConsole && (
            <ServerConsole
              serverName={selectedServerForConsole.name}
              serverId={selectedServerForConsole.id}
              onClose={() => setConsoleOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={fileManagerOpen} onOpenChange={setFileManagerOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedServerForConsole && (
            <FileManager
              serverName={selectedServerForConsole.name}
              serverId={selectedServerForConsole.id}
              onClose={() => setFileManagerOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;