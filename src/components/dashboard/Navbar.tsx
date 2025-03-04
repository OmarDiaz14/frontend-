import React, { useState, useEffect, useRef } from "react";
import { User, ChevronDown } from "lucide-react";
import { IoHomeOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const hiddenPaths = ["/login", "/", "/registro"];

interface NavbarProps {
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const shouldShowNavbar = !hiddenPaths.includes(
    location.pathname.toLowerCase()
  );

  const toggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleHomeClick = (): void => {
    navigate("/Home");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!shouldShowNavbar) {
    return null;
  }

  return (
    <nav
      className="bg-neutral-900 shadow-md fixed top-0 left-0 z-50"
      style={{
        width: sidebarOpen ? "calc(100% - 300px)" : "calc(100% - 90px)",
        marginLeft: sidebarOpen ? "300px" : "90px",
        transition: "all 0.3s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-end items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-white hover:text-blue-400 transition-colors"
              type="button"
              aria-label="Home"
              onClick={handleHomeClick}
            >
              <IoHomeOutline className="h-6 w-6" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center p-2 text-white hover:text-blue-400 transition-colors focus:outline-none"
                type="button"
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <User className="h-6 w-6" />
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-1">
                    <a
                      href="/Usuario"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Mi perfil
                    </a>
                    <a
                      href="/Login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Cerrar sesión
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
