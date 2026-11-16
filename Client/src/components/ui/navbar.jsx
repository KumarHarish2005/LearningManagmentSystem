
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  School,
  Settings,
  User,
  X,
} from "lucide-react";
import React from "react";
import { Button } from "./button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { DarkMode } from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Separator } from "@base-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authapi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await logoutUser().unwrap();
      toast.success(response.message || "Logged Out");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Logout Failed");
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200/80 bg-white/90 text-gray-900 shadow-sm backdrop-blur-xl dark:border-gray-800/80 dark:bg-[#0b0f19]/90 dark:text-white">

      {/* Desktop Navbar */}
      <div className="mx-auto hidden h-full max-w-7xl items-center justify-between px-6 md:flex">

        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 transition-transform group-hover:scale-105">
            <School size={23} />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              E-Learning<span className="text-blue-600 dark:text-blue-400">.</span>
            </span>
            <span className="text-[10px] font-medium tracking-[0.18em] text-gray-500 dark:text-gray-400">
              LEARN WITHOUT LIMITS
            </span>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {user ? (
            <>
              <Link
                to="/my-learning"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
              >
                <BookOpen size={17} />
                My Learning
              </Link>

              {user.role === "instructor" && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-1.5 pr-3 transition-all hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-500 dark:hover:bg-gray-800"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback className="bg-blue-100 font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <span className="max-w-28 truncate text-sm font-semibold">
                        {user.name || "My Account"}
                      </span>

                      <ChevronDown size={15} className="text-gray-500" />
                    </button>
                  }
                />

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="z-50 w-64 rounded-xl border border-gray-200 bg-white p-2 text-gray-900 shadow-xl dark:border-gray-700 dark:bg-[#151b29] dark:text-white"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-3 py-3 font-normal">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoURL} />
                          <AvatarFallback>
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <Link to="/profile" className="flex w-full items-center gap-2">
                        <User size={16} />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link to="/my-learning" className="flex w-full items-center gap-2">
                        <BookOpen size={16} />
                        My Learning
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link to="/settings" className="flex w-full items-center gap-2">
                        <Settings size={16} />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    {user.role === "instructor" && (
                      <DropdownMenuItem>
                        <Link to="/admin/dashboard" className="flex w-full items-center gap-2">
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                  >
                    <LogOut size={16} />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Login
              </Link>

              <Button
                onClick={() => navigate("/login")}
                className="rounded-lg bg-blue-600 px-5 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Get Started
              </Button>
            </div>
          )}

          <div className="mx-1 h-8 w-px bg-gray-200 dark:bg-gray-700" />

          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <MobileNavbar />
    </header>
  );
};

export default Navbar;


// --------------------------------------------------
// Mobile Navbar
// --------------------------------------------------

const MobileNavbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await logoutUser().unwrap();
      toast.success(response.message || "Logged Out");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Logout Failed");
    }
  };

  return (
    <div className="flex h-full items-center justify-between px-4 md:hidden">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
          <School size={21} />
        </div>

        <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
          E-Learning<span className="text-blue-600 dark:text-blue-400">.</span>
        </span>
      </Link>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger
          render={
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-xl border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              <Menu size={20} />
            </Button>
          }
        />

        <SheetContent
          side="right"
          className="flex w-[300px] flex-col border-l border-gray-200 bg-white p-0 text-gray-900 dark:border-gray-800 dark:bg-[#0b0f19] dark:text-white sm:w-[350px]"
        >

          {/* Drawer Header */}
          <SheetHeader className="border-b border-gray-100 p-5 text-left dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <School size={23} />
              </div>

              <div>
                <SheetTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  E-Learning
                </SheetTitle>
                <SheetDescription className="text-xs text-gray-500 dark:text-gray-400">
                  Learn without limits
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* User Profile */}
          {user ? (
            <div className="m-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <Avatar className="h-11 w-11 border border-gray-200 dark:border-gray-700">
                <AvatarImage src={user.photoURL} />
                <AvatarFallback className="bg-blue-100 font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user.name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="m-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Welcome to E-Learning
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Sign in to continue your learning journey.
              </p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1 px-4">

            <p className="mb-2 mt-2 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              Navigation
            </p>

            {user ? (
              <>
                <SheetClose
                  render={
                    <Link
                      to="/my-learning"
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    >
                      <BookOpen size={19} />
                      My Learning
                    </Link>
                  }
                />

                {user.role === "instructor" && (
                  <SheetClose
                    render={
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                      >
                        <LayoutDashboard size={19} />
                        Dashboard
                      </Link>
                    }
                  />
                )}

                <SheetClose
                  render={
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    >
                      <User size={19} />
                      Profile
                    </Link>
                  }
                />

                
              </>
            ) : (
              <SheetClose
                render={
                  <Link
                    to="/login"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                  >
                    <LogIn size={19} />
                    Login
                  </Link>
                }
              />
            )}

            <Separator className="my-4 bg-gray-200 dark:bg-gray-800" />

            {/* Appearance */}
            <div className="flex items-center justify-between rounded-xl px-3 py-3">
              <div className="flex items-center gap-3 text-sm font-medium">
                <Moon size={19} className="text-gray-500 dark:text-gray-400" />
                Appearance
              </div>
              <DarkMode />
            </div>
          </nav>

          {/* Footer */}
          {user && (
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <SheetClose
                render={
                  <Button
                    variant="outline"
                    onClick={logoutHandler}
                    className="h-11 w-full justify-center gap-2 rounded-xl border-red-200 bg-red-50 font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  >
                    <LogOut size={18} />
                    Log Out
                  </Button>
                }
              />
            </div>
          )}

        </SheetContent>
      </Sheet>
    </div>
  );
};
