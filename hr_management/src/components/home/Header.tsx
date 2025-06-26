'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUsersGear } from "react-icons/fa6";
import { Menu, X } from "lucide-react";
import AuthButton from "../auth/AuthButton";

const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    { title: "Employees", url: "/" },
    { title: "Contracts", url: "/employee-contracts" },
    { title: "Departments", url: "/departments" },
    { title: "Attendance", url: "/attendance" },
    {
      title: "Payroll",
      dropdown: {
        salary: {
          title: "Salary",
          salaryContent: [
            { li: "Structure Types", url: "/structure-types" },
            { li: "Structures", url: "/salary-structures" },
            { li: "Rules", url: "/salary-rules" },
            { li: "Rule Parameters", url: "/rule-parameters" },
            { li: "Rule Categories", url: "/rule-categories" },
          ],
        },
      },
    },
    { title: "Time Off", url: "/time-off" },
    {
      title: "Settings",
      dropdown: {
        settings: {
          title: "Configuration",
          settingsContent: [
            { li: "Countries", url: "/countries" },
            { li: "Working Shedules", url: "/working-shedules" },
            { li: "System Settings", url: "/system-settings" },
          ],
        },
      },
    },
  ];

  const handleDropdownChange = (title: string, open: boolean) => {
    setOpenDropdown(open ? title : null);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  return (
    <header className="relative w-full bg-white shadow-sm">
      <div className="mx-auto flex items-center justify-between px-4 py-2 md:px-6 lg:px-8 h-16">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <FaUsersGear size={60} className="text-gray-700 pr-2" />
            <div className="flex flex-col justify-center items-start">
              <div className="flex items-baseline">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-red-500 mr-2" />
                <div>
                  <p className="text-lg font-extrabold tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-500">
                      HR
                    </span>
                    <span className="text-gray-800"> Management</span>
                  </p>
                  <p className="text-xs font-medium tracking-wide mt-[-2px] ml-[2px] text-gray-500">
                    System
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {navItems.map((item) =>
              item.dropdown ? (
                <Popover
                  key={item.title}
                  open={openDropdown === item.title}
                  onOpenChange={(isOpen) =>
                    handleDropdownChange(item.title, isOpen)
                  }
                >
                  <PopoverTrigger asChild>
                    <p
                      className={`text-[14px] cursor-pointer hover:text-neutral-800 ${
                        pathname === item.url ||
                        (item.title === "Payroll" &&
                          pathname.startsWith("/salary")) ||
                        (item.title === "Settings" &&
                          pathname.startsWith("/countries")) ||
                        pathname.startsWith("/system-settings")
                          ? "text-black border-b-2 border-black pb-1"
                          : "text-neutral-600"
                      }`}
                    >
                      {item.title}
                    </p>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    {item.dropdown.salary && (
                      <ul className="space-y-1">
                        <li className="font-semibold text-[14px] mb-2">
                          {item.dropdown.salary.title}
                        </li>
                        {item.dropdown.salary.salaryContent.map(
                          (content, index) => (
                            <Link href={content.url} key={index}>
                              <li
                                onClick={closeDropdown}
                                className={`text-[14px] pl-2 py-1 hover:underline cursor-pointer ${
                                  pathname === content.url
                                    ? "text-black font-medium"
                                    : "text-neutral-700"
                                }`}
                              >
                                {content.li}
                              </li>
                            </Link>
                          )
                        )}
                      </ul>
                    )}
                    {item.dropdown.settings && (
                      <ul className="space-y-1">
                        <li className="font-semibold text-[14px] mb-2">
                          {item.dropdown.settings.title}
                        </li>
                        {item.dropdown.settings.settingsContent.map(
                          (content, index) => (
                            <Link href={content.url} key={index}>
                              <li
                                onClick={closeDropdown}
                                className={`text-[14px] pl-2 py-1 hover:underline cursor-pointer ${
                                  pathname === content.url
                                    ? "text-black font-medium"
                                    : "text-neutral-700"
                                }`}
                              >
                                {content.li}
                              </li>
                            </Link>
                          )
                        )}
                      </ul>
                    )}
                  </PopoverContent>
                </Popover>
              ) : (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`text-[14px] cursor-pointer hover:text-neutral-800 ${
                    pathname === item.url
                      ? "text-black border-b-2 border-black pb-1"
                      : "text-neutral-600"
                  }`}
                >
                  {item.title}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Right Side: Auth + Mobile Toggle */}
        <div className="flex items-center gap-x-4">
          <div className="hidden lg:block">
            <AuthButton />
          </div>
          <button
            className="lg:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav - optional here */}
    </header>
  );
};

export default Header;
