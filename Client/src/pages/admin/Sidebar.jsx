
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ChartNoAxesColumn,
  SquareLibrary,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      path: "dashboard",
      icon: ChartNoAxesColumn,
    },
    {
      title: "Courses",
      path: "courses",
      icon: SquareLibrary,
    },
  ];

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
        : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
    }`;

  return (
    <div className="flex flex-col lg:flex-row mt-16 min-h-screen w-full bg-gray-50 dark:bg-gray-950">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[250px] shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="sticky top-16 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5 px-3">
            Admin Panel
          </h2>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={linkStyle}
                >
                  <Icon size={21} />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile and Tablet Navigation */}
      <div className="lg:hidden sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 py-3">
        <div className="flex gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 dark:text-gray-300">
        <Outlet />
      </main>

    </div>
  );
};

export default Sidebar;
