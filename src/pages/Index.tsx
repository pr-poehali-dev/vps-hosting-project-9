import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

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
    { id: 'support', label: 'Поддержка', icon: 'MessageCircle' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
  ];

  const [activeNav, setActiveNav] = useState('dashboard');
  const [restartingServers, setRestartingServers] = useState<Set<string>>(new Set());

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

  const handleOpenConsole = (serverName: string, ip: string) => {
    toast.info(`Открываю консоль ${serverName} (${ip})...`);
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
                            className="border-slate-700 hover:bg-slate-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenConsole(server.name, server.ip);
                            }}
                          >
                            <Icon name="Terminal" size={14} className="mr-2" />
                            Консоль
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-700 hover:bg-slate-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestart(server.id, server.name);
                            }}
                            disabled={restartingServers.has(server.id)}
                          >
                            <Icon name={restartingServers.has(server.id) ? "Loader2" : "RotateCw"} size={14} className={`mr-2 ${restartingServers.has(server.id) ? 'animate-spin' : ''}`} />
                            {restartingServers.has(server.id) ? 'Перезагрузка...' : 'Рестарт'}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;