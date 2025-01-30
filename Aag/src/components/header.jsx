import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

export function Header({ 
  navItems = [
    { name: "Home", path: "/" },
    { name: "Student Panel", path: "/student" },
    { name: "Faculty Panel", path: "/faculty" },
    { name: "Mentor Panel", path: "/mentor" },
  ],
  downloadButton = { text: "Download Files", onClick: () => {} } // Default Download Button
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl">
            IAP CELL
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(({ name, path }, index) => (
              <Link
                key={index}
                to={path}
                className="relative text-sm font-medium text-gray-700 hover:text-purple-600 transition duration-300 group"
              >
                {name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </Link>
            ))}
            {downloadButton && (
              <Button variant="outline" onClick={downloadButton.onClick}>
                {downloadButton.text}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={cn(
            "w-64 bg-white h-full shadow-lg flex flex-col p-6 fixed top-0 right-0 transition-transform duration-300",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="self-end p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Sidebar Navigation */}
          <nav className="flex flex-col gap-4 mt-4">
            {navItems.map(({ name, path }, index) => (
              <Link
                key={index}
                to={path}
                className="relative text-lg font-medium text-gray-700 hover:text-purple-600 transition duration-300 group"
                onClick={() => setIsOpen(false)}
              >
                {name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </Link>
            ))}
            {downloadButton && (
              <Button variant="outline" className="w-full mt-4" onClick={downloadButton.onClick}>
                {downloadButton.text}
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
