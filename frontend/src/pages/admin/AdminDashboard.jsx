import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ services: 0, reservations: 0, clients: 0, earnings: 0 });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [servicesRes, reservationsRes, clientsRes] = await Promise.allSettled([
                    api.get('/api/admin/services'),
                    api.get('/api/admin/reservations'),
                    api.get('/api/admin/clients'),
                ]);
                
                const reservations = reservationsRes.status === 'fulfilled' ? (reservationsRes.value.data?.data || []) : [];
                
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                
                const monthlyEarnings = reservations.reduce((total, res) => {
                    const resDate = new Date(res.created_at || res.reservation_date);
                    if ((res.status === 'confirmed' || res.status === 'completed') && 
                        resDate.getMonth() === currentMonth && 
                        resDate.getFullYear() === currentYear) {
                        return total + (parseFloat(res.total_price) || 0);
                    }
                    return total;
                }, 0);

                // Calculate chart data (last 6 months)
                const monthsData = [];
                const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    monthsData.push({
                        month: monthNames[d.getMonth()],
                        monthIndex: d.getMonth(),
                        year: d.getFullYear(),
                        count: 0
                    });
                }

                reservations.forEach(res => {
                    const d = new Date(res.created_at || res.reservation_date);
                    const item = monthsData.find(m => m.monthIndex === d.getMonth() && m.year === d.getFullYear());
                    if (item) item.count++;
                });
                
                setChartData(monthsData);

                setStats({
                    services: servicesRes.status === 'fulfilled' ? (servicesRes.value.data?.data?.length || 0) : 0,
                    reservations: reservations.length,
                    clients: clientsRes.status === 'fulfilled' ? (clientsRes.value.data?.data?.length || 0) : 0,
                    earnings: monthlyEarnings,
                });
            } catch (e) { console.error(e); }
        };
        fetchStats();
    }, []);

    return (
        <>
            {/* Header */}
            <header className="flex justify-between items-center mb-stack-lg">
                <div>
                    <h2 className="font-headline-md text-headline-md text-primary">Dashboard Overview</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Bienvenido de vuelta. Aquí está el resumen de hoy.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-secondary-container rounded-full"></span>
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
                {/* Total Services */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">tour</span>
                        </div>
                    </div>
                    <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Total Servicios</h3>
                    <p className="font-headline-md text-headline-md text-primary font-bold">{stats.services}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
                {/* Total Reservations */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined">airplane_ticket</span>
                        </div>
                    </div>
                    <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Total Reservas</h3>
                    <p className="font-headline-md text-headline-md text-primary font-bold">{stats.reservations}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
                {/* Total Clients */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                    </div>
                    <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Total Clientes</h3>
                    <p className="font-headline-md text-headline-md text-primary font-bold">{stats.clients}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
                {/* Earnings */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-surface-tint/20 flex items-center justify-center text-surface-tint">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                    </div>
                    <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Ganancias del Mes</h3>
                    <p className="font-headline-md text-headline-md text-primary font-bold">
                        S/ {stats.earnings !== undefined ? stats.earnings.toFixed(2) : '0.00'}
                    </p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
            </div>

            {/* Chart & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-headline-sm text-headline-sm text-primary">Tendencias de Reservas</h3>
                        <select className="bg-surface border border-outline-variant text-on-surface text-sm rounded focus:ring-primary focus:border-primary block p-2">
                            <option>Esta Semana</option>
                            <option>Este Mes</option>
                            <option>Este Año</option>
                        </select>
                    </div>
                    <div className="flex-1 bg-surface rounded-lg border border-outline-variant flex items-end justify-between p-6 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                        {chartData.length > 0 ? chartData.map((data, idx) => {
                            const maxCount = Math.max(...chartData.map(d => d.count), 1);
                            const heightPercentage = Math.max((data.count / maxCount) * 100, 2); // Minimum 2% height for visibility
                            return (
                                <div key={idx} className="flex flex-col items-center gap-2 z-10 w-full h-full justify-end group">
                                    <span className="text-sm font-bold text-transparent group-hover:text-primary transition-colors">{data.count}</span>
                                    <div 
                                        className="w-full max-w-[48px] bg-primary/20 rounded-t-md relative transition-all duration-300 group-hover:bg-primary/40" 
                                        style={{ height: `${heightPercentage}%` }}
                                    >
                                        <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-md transition-all duration-500 origin-bottom" style={{ height: data.count > 0 ? '100%' : '0%' }}></div>
                                    </div>
                                    <span className="text-xs text-on-surface-variant font-medium mt-1">{data.month}</span>
                                </div>
                            );
                        }) : (
                            <div className="absolute inset-0 flex items-center justify-center z-10 text-on-surface-variant text-sm">
                                Cargando datos...
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-headline-sm text-headline-sm text-primary">Actividad Reciente</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-outline-variant/30"></div>
                        <div className="relative pl-12">
                            <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
                            <p className="font-label-md text-label-md text-on-surface">Sistema iniciado</p>
                            <p className="font-body-md text-sm text-on-surface-variant">Panel de administración activo</p>
                        </div>
                        <div className="relative pl-12">
                            <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                            <p className="font-label-md text-label-md text-on-surface">Base de datos conectada</p>
                            <p className="font-body-md text-sm text-on-surface-variant">MariaDB operativa</p>
                        </div>
                        <div className="relative pl-12">
                            <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-outline ring-4 ring-surface-container-lowest"></div>
                            <p className="font-label-md text-label-md text-on-surface">Sesión admin iniciada</p>
                            <p className="font-body-md text-sm text-on-surface-variant">Acceso concedido</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
