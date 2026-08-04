import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Bike,
    LogOut,
    Coffee,
    FolderTree,
    Calendar,
    Settings,
    MessageSquare,
    Wallet,
    User,
    Shield,
    History,
    Truck,
    UserCog,
    Mail,
    Menu,
    X
} from 'lucide-react';
import logo from '../assets/littleh-logo.png';

export default function Layout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { brand } = useParams();
    const b = brand || 'littleh';

    useEffect(() => {
        const allowedBrands = ['littleh', 'teasntrees'];
        if (brand && !allowedBrands.includes(brand)) {
            const currentPath = location.pathname;
            if (!currentPath.startsWith('/littleh')) {
                navigate(`/littleh${currentPath}`, { replace: true });
            }
        }
    }, [brand, navigate, location.pathname]);

    // Close mobile menu whenever route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: `/${b}` },
        { icon: FolderTree, label: 'Categories', path: `/${b}/categories` },
        { icon: Package, label: 'Products', path: `/${b}/products` },
        { icon: ShoppingCart, label: 'Orders', path: `/${b}/orders` },
        { icon: Bike, label: 'Riders', path: `/${b}/riders` },
        { icon: UserCog, label: 'Managers', path: `/${b}/managers` },
        { icon: Truck, label: 'Deliveries', path: `/${b}/deliveries` },
        { icon: Wallet, label: 'Payouts', path: `/${b}/payouts` },
        { icon: Users, label: 'Customers', path: `/${b}/customers` },
        { icon: Mail, label: 'Messages', path: `/${b}/messages` },
        { icon: MessageSquare, label: 'Reviews', path: `/${b}/reviews` },
        { icon: ShoppingCart, label: 'Cart Insights', path: `/${b}/cart-analytics` },
        { icon: Shield, label: 'All Accounts', path: `/${b}/users` },
        { icon: History, label: 'System Logs', path: `/${b}/activity-logs` },
        { icon: Settings, label: 'Settings', path: `/${b}/settings` },
        { icon: User, label: 'My Profile', path: `/${b}/profile` },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-bakery-bg flex flex-col lg:flex-row selection:bg-bakery-primary selection:text-white font-sans text-bakery-primary">
            {/* Mobile Header Bar */}
            <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-xl text-bakery-primary hover:bg-bakery-bg transition-colors"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6 text-bakery-primary" /> : <Menu className="w-6 h-6 text-bakery-primary" />}
                    </button>
                    <img src={logo} alt="LittleH Logo" className="h-9 w-auto object-contain" />
                </div>
                <span className="text-[10px] font-black text-bakery-primary uppercase tracking-widest bg-bakery-bg px-3 py-1 rounded-full border border-bakery-light">
                    {b.toUpperCase()}
                </span>
            </header>

            {/* Mobile Backdrop Overlay */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                bg-white border-r border-gray-100 flex flex-col z-50 transition-all duration-300 ease-in-out
                lg:w-80 lg:my-5 lg:ml-5 lg:rounded-[2.5rem] lg:shadow-2xl lg:shadow-gray-200/50 lg:h-[calc(100vh-40px)] lg:sticky lg:top-5 lg:translate-x-0
                fixed inset-y-0 left-0 w-72 sm:w-80 h-full rounded-r-[2rem] shadow-2xl
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Area */}
                <div className="p-6 lg:p-8 border-b border-gray-50 bg-white flex items-center justify-between lg:block">
                    <div className="flex flex-col items-center gap-2 w-full">
                        <img
                            src={logo}
                            alt="LittleH Logo"
                            className="h-16 lg:h-20 w-auto object-contain"
                        />
                        <p className="text-[10px] font-black text-bakery-primary font-playfair uppercase tracking-[0.25em]">Admin Portal</p>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 lg:p-6 flex-1 overflow-y-auto space-y-2 no-scrollbar">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-4 px-5 py-3.5 lg:px-6 lg:py-4 rounded-2xl transition-all group duration-300
                                    ${active
                                        ? 'bg-bakery-primary text-white shadow-xl shadow-bakery-accent/30 scale-[1.02]'
                                        : 'text-gray-400 hover:text-bakery-primary hover:bg-bakery-light hover:pl-7'
                                    }
                                `}
                            >
                                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-gray-400 group-hover:text-bakery-primary'}`} />
                                <span className="font-black uppercase text-[10px] tracking-[0.2em]">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 lg:p-6 border-t border-gray-50 bg-gray-50/30">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-5 py-3.5 lg:px-6 lg:py-4 rounded-2xl bg-red-50 text-red-500 transition-all hover:bg-red-600 hover:text-white group w-full hover:shadow-lg hover:shadow-red-200"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        <span className="font-black uppercase text-[10px] tracking-[0.2em]">Logout Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden overflow-y-auto min-h-screen lg:h-screen scroll-smooth">
                <div className="max-w-[1600px] mx-auto pb-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}