import React from 'react';
import {
    LayoutDashboard, ShoppingCart, Package, Users2, LineChart as LineChartIcon,
    Settings, LogOut, Feather, Users // Added Users icon for "My Network"
} from 'lucide-react';

// Reusable NavItem component for cleaner code
const NavItem = ({ item, isActive, onClick }) => (
    <a
        key={item.label}
        href="#"
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
            isActive ? 'bg-pink-600/20 text-pink-400 font-semibold' : 'hover:bg-gray-800/50'
        }`}
    >
        <item.icon size={20} />
        <span>{item.label}</span>
    </a>
);

const Sidebar = ({ activePage, setActivePage }) => {
    // Moved arrays outside the component to prevent re-creation on every render
    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard" },
        { icon: ShoppingCart, label: "Products" },
        { icon: Package, label: "Orders" },
        { icon: Users2, label: "Customers" },
        { icon: LineChartIcon, label: "Analytics" },
        { icon: Users, label: "My Network" }, // New Item Added Here
    ];
    const bottomItems = [
        { icon: Settings, label: "Settings" },
        { icon: LogOut, label: "Logout" }
    ];

    return (
        <aside className="w-64 bg-[#1E0B38] text-gray-300 flex-shrink-0 flex-col p-4 border-r border-fuchsia-800/30 hidden md:flex">
            <a href="#" className="flex items-center gap-2 text-2xl font-bold text-white text-center mb-10 px-2">
                <Feather className="text-pink-500" />
                Seller<span className="text-pink-500">CraftSathi</span>
            </a>
            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map(item => (
                    <NavItem
                        key={item.label}
                        item={item}
                        isActive={activePage === item.label}
                        onClick={() => setActivePage(item.label)}
                    />
                ))}
            </nav>
            <div className="flex flex-col gap-2">
                {bottomItems.map(item => (
                     <a key={item.label} href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-gray-800/50">
                        <item.icon size={20} /> <span>{item.label}</span>
                    </a>
                ))}
            </div>
        </aside>
    );
};

// Wrap with React.memo for performance optimization
export default React.memo(Sidebar);