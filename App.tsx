
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Machine, WorkOrder, Status } from './types';
import { DashboardIcon, MachineIcon, WorkOrderIcon, LogoutIcon, PlusIcon, CloseIcon } from './components/Icons';

type Page = 'dashboard' | 'machines' | 'work_orders';

// MOCK DATA
const initialMachines: Machine[] = [
  { id: 1, code: 'CNC-001', name: 'Torno CNC', area: 'Usinagem' },
  { id: 2, code: 'P-005', name: 'Prensa Hidráulica', area: 'Estamparia' },
  { id: 3, code: 'S-002', name: 'Serra de Fita', area: 'Corte' },
  { id: 4, code: 'M-003', name: 'Fresadora Universal', area: 'Usinagem' },
];

const initialWorkOrders: WorkOrder[] = [
  { id: 1, number: 'OS-2024-05-001', product: 'Eixo Principal', quantity: 50, status: Status.Concluido, machine_id: 1 },
  { id: 2, number: 'OS-2024-05-002', product: 'Flange de Aço', quantity: 200, status: Status.EmProgresso, machine_id: 2 },
  { id: 3, number: 'OS-2024-05-003', product: 'Suporte de Alumínio', quantity: 120, status: Status.Pendente, machine_id: 4 },
  { id: 4, number: 'OS-2024-05-004', product: 'Barra de Aço 1045', quantity: 500, status: Status.Pendente, machine_id: 3 },
];

// Helper Components defined in the same file to keep it self-contained
// ====================================================================

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};


// LOGIN PAGE COMPONENT
// ====================================================================
interface LoginPageProps {
  onLogin: (email: string) => void;
}
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@intranet.local');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@intranet.local' && password === 'password') {
        onLogin(email);
      } else {
        setError('Credenciais inválidas. Use as credenciais padrão.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-surface p-8 rounded-lg shadow-2xl">
        <div className="text-center mb-8">
            <MachineIcon className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold text-text-primary mt-4">Gestão de Produção</h1>
            <p className="text-text-secondary">Acesse o painel da intranet</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-muted p-3 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@intranet.local"
            />
          </div>
          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-muted p-3 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="password"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MAIN APPLICATION LAYOUT COMPONENTS
// ====================================================================

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  userEmail: string;
}
const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, userEmail }) => {
    const navItemClasses = (page: Page) => 
        `flex items-center px-4 py-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
        currentPage === page ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface hover:text-text-primary'
        }`;
    
    return (
        <div className="w-64 bg-background border-r border-surface flex flex-col p-4">
            <div className="flex items-center mb-8 px-2">
                <MachineIcon className="w-10 h-10 text-primary" />
                <h1 className="text-2xl font-bold ml-2 text-text-primary">Produção</h1>
            </div>
            <nav className="flex-1">
                <div onClick={() => onNavigate('dashboard')} className={navItemClasses('dashboard')}>
                    <DashboardIcon className="w-6 h-6 mr-3" />
                    <span>Dashboard</span>
                </div>
                <div onClick={() => onNavigate('machines')} className={navItemClasses('machines')}>
                    <MachineIcon className="w-6 h-6 mr-3" />
                    <span>Máquinas</span>
                </div>
                <div onClick={() => onNavigate('work_orders')} className={navItemClasses('work_orders')}>
                    <WorkOrderIcon className="w-6 h-6 mr-3" />
                    <span>Ordens de Serviço</span>
                </div>
            </nav>
            <div className="mt-auto">
                <div className="px-4 py-3 border-t border-surface">
                    <p className="text-sm text-text-primary truncate">{userEmail}</p>
                    <p className="text-xs text-text-secondary">Admin</p>
                </div>
                <div onClick={onLogout} className="flex items-center px-4 py-3 mt-2 rounded-lg cursor-pointer text-text-secondary hover:bg-surface hover:text-red-500 transition-colors duration-200">
                    <LogoutIcon className="w-6 h-6 mr-3" />
                    <span>Sair</span>
                </div>
            </div>
        </div>
    );
};

interface HeaderProps {
    title: string;
    children?: React.ReactNode;
}
const Header: React.FC<HeaderProps> = ({ title, children }) => (
    <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary">{title}</h2>
        <div>{children}</div>
    </div>
);

// VIEW COMPONENTS (PAGES)
// ====================================================================

const DashboardView: React.FC<{ machines: Machine[], workOrders: WorkOrder[] }> = ({ machines, workOrders }) => {
    const activeOrders = workOrders.filter(o => o.status === Status.EmProgresso).length;
    const pendingOrders = workOrders.filter(o => o.status === Status.Pendente).length;
    
    return (
        <>
            <Header title="Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Máquinas" value={machines.length.toString()} />
                <StatCard title="Ordens em Progresso" value={activeOrders.toString()} />
                <StatCard title="Ordens Pendentes" value={pendingOrders.toString()} />
                <StatCard title="Total de Ordens" value={workOrders.length.toString()} />
            </div>
        </>
    );
};

const StatCard: React.FC<{title: string, value: string}> = ({title, value}) => (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
        <p className="text-sm text-text-secondary mb-2">{title}</p>
        <p className="text-4xl font-bold text-text-primary">{value}</p>
    </div>
);

const MachinesView: React.FC<{ machines: Machine[], onAddMachine: (machine: Omit<Machine, 'id'>) => void }> = ({ machines, onAddMachine }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMachine, setNewMachine] = useState({ code: '', name: '', area: '' });

    const handleSave = () => {
        if (newMachine.code && newMachine.name && newMachine.area) {
            onAddMachine(newMachine);
            setIsModalOpen(false);
            setNewMachine({ code: '', name: '', area: '' });
        }
    };
    
    return (
        <>
            <Header title="Máquinas">
                <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nova Máquina
                </button>
            </Header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machines.map(machine => (
                    <div key={machine.id} className="bg-surface p-5 rounded-lg shadow-lg">
                        <div className="flex justify-between items-start">
                           <div>
                                <h3 className="text-xl font-bold text-text-primary">{machine.name}</h3>
                                <p className="text-sm text-primary font-semibold">{machine.code}</p>
                           </div>
                           <span className="bg-background text-text-secondary text-xs font-semibold px-2.5 py-1 rounded-full">{machine.area}</span>
                        </div>
                    </div>
                ))}
            </div>
            <Modal title="Cadastrar Nova Máquina" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                 <div className="space-y-4">
                    <input type="text" placeholder="Código (ex: CNC-002)" value={newMachine.code} onChange={e => setNewMachine({...newMachine, code: e.target.value})} className="w-full bg-background border border-muted p-2 rounded text-text-primary" />
                    <input type="text" placeholder="Nome da Máquina" value={newMachine.name} onChange={e => setNewMachine({...newMachine, name: e.target.value})} className="w-full bg-background border border-muted p-2 rounded text-text-primary" />
                    <input type="text" placeholder="Área (ex: Usinagem)" value={newMachine.area} onChange={e => setNewMachine({...newMachine, area: e.target.value})} className="w-full bg-background border border-muted p-2 rounded text-text-primary" />
                    <button onClick={handleSave} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded">Salvar</button>
                </div>
            </Modal>
        </>
    );
};

const WorkOrdersView: React.FC<{ workOrders: WorkOrder[], machines: Machine[], onUpdateStatus: (id: number, status: Status) => void }> = ({ workOrders, machines, onUpdateStatus }) => {
    const getMachineName = useCallback((id: number) => {
        return machines.find(m => m.id === id)?.name || 'Desconhecida';
    }, [machines]);

    const statusColor: Record<Status, string> = {
        [Status.Pendente]: 'bg-yellow-500',
        [Status.EmProgresso]: 'bg-blue-500',
        [Status.Concluido]: 'bg-green-500',
        [Status.Cancelado]: 'bg-red-500',
    };

    return (
        <>
            <Header title="Ordens de Serviço" />
            <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-background">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Número</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Produto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Quantidade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Máquina</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-background">
                        {workOrders.map(order => (
                            <tr key={order.id} className="hover:bg-background/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{order.number}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{order.product}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{order.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{getMachineName(order.machine_id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => onUpdateStatus(order.id, e.target.value as Status)}
                                        className={`w-full p-1.5 rounded-md text-white border-none text-xs ${statusColor[order.status]} focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-white`}
                                    >
                                        {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

// MAIN APP COMPONENT
// ====================================================================

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  
  const [machines, setMachines] = useState<Machine[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    // Simulate loading initial data after login
    if (isAuthenticated) {
        setMachines(initialMachines);
        setWorkOrders(initialWorkOrders);
    }
  }, [isAuthenticated]);
  
  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
  };

  const handleAddMachine = (machineData: Omit<Machine, 'id'>) => {
    const newMachine: Machine = {
        id: Math.max(...machines.map(m => m.id), 0) + 1,
        ...machineData
    };
    setMachines(prev => [...prev, newMachine]);
  };

  const handleUpdateWorkOrderStatus = (id: number, status: Status) => {
    setWorkOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
  };

  const pageTitle = useMemo(() => {
    switch (currentPage) {
        case 'dashboard': return 'Dashboard';
        case 'machines': return 'Máquinas';
        case 'work_orders': return 'Ordens de Serviço';
        default: return 'Gestão de Produção';
    }
  }, [currentPage]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout} 
        userEmail={userEmail} 
      />
      <main className="flex-1 p-8 overflow-y-auto">
        {currentPage === 'dashboard' && <DashboardView machines={machines} workOrders={workOrders} />}
        {currentPage === 'machines' && <MachinesView machines={machines} onAddMachine={handleAddMachine} />}
        {currentPage === 'work_orders' && <WorkOrdersView workOrders={workOrders} machines={machines} onUpdateStatus={handleUpdateWorkOrderStatus} />}
      </main>
    </div>
  );
}

export default App;
