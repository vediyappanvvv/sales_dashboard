import { LayoutDashboard, Users, Briefcase, BarChart3, Settings, LogOut, Menu } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen, active, setActive }) {
  const menus = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Leads", icon: Users },
    { name: "Deals", icon: Briefcase },
    { name: "Reports", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ];

  return (
    <div className={`${isOpen ? "w-64" : "w-20"} h-screen bg-blue-900 text-white flex flex-col transition-all duration-300`}>
      {/* Toggle */}
      <div className="p-4 flex justify-between items-center">
        {isOpen && <h1 className="text-xl font-bold">Sales</h1>}
        <Menu className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 px-2">
        {menus.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.name}
              onClick={() => setActive(m.name)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-700 ${
                active === m.name ? "bg-blue-700" : ""
              }`}
            >
              <Icon size={20} />
              {isOpen && <span>{m.name}</span>}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 hover:bg-blue-700 flex items-center gap-3 cursor-pointer">
        <LogOut size={20} />
        {isOpen && "Logout"}
      </div>
    </div>
  );
}
