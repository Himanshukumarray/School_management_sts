import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { GiArchiveRegister } from "react-icons/gi";
import { MdLocalLibrary } from "react-icons/md";

import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; roles?: string[] }[];
  roles?: string[]; // Add roles property to control visibility
};

// Admin navigation items
const adminNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Analytics", path: "/", pro: false }],
    roles: ["admin", "student", "teacher"],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
    roles: ["admin", "student", "teacher"],
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
    roles: ["admin", "student", "teacher"],
  },
 
  {
    name: "Results",
    icon: <PageIcon />,
    subItems: [
      { name: "Check Results", path: "/StudentResult", pro: false },
      { name: "Upload Result", path: "/TeacherPage", pro: false },
    ],
    roles: ["admin", "teacher"],
  },
  {
    name: "Attendance",
    icon: <PageIcon />,
    subItems: [
      { name: "Teacher Attendance", path: "/TeacherAttendacePage", pro: false },
      { name: "Student Attendance", path: "/AttendancePage", pro: false },
      // { name: "Class Attendance", path: "/FacultyAttendance", pro: false },
      { name: "Attendance Summary", path: "/AttendanceSummary", pro: false },
    ],
    roles: ["admin", "teacher"],
  },
  {
    icon: < MdLocalLibrary />,
    name: "Library",
    subItems: [
      { name: "Issue books", path: "/libpage", pro: false },
      { name: "View books", path: "/viewbooks", pro: false },
      { name: "Add books", path: "/addbook", pro: false, roles: ["admin", "teacher"] },
      { name: "Books list", path: "/booklist", pro: false },
    ],
    roles: ["admin", "student", "teacher"],
  },
  {
    name: "Syllabus",
    icon: <TableIcon />,
    subItems: [{ name: "Syllabus", path: "/SyllabusPage", pro: false }],
    roles: ["admin", "student",  "teacher"],
  },
  {
    icon: <GiArchiveRegister />,
    name: "Register",
    subItems: [
      { name: "Add Student", path: "/student-form", pro: false },
      { name: "Add Teacher", path: "/teacher-form", pro: false },
      { name: "Student List", path: "/viewstudentdetails", pro: false },
    ],
    roles: ["admin", "teacher"],
  },
];

// Student navigation items
const studentNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Analytics", path: "/", pro: false }],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  
  {
    icon: < MdLocalLibrary />,
    name: "Library",
    subItems: [
      { name: "Issue books", path: "/libpage", pro: false },
      { name: "View books", path: "/viewbooks", pro: false },
      { name: "Books list", path: "/booklist", pro: false },
    ],
  },
  {
    name: "Syllabus",
    icon: <TableIcon />,
    subItems: [{ name: "Syllabus", path: "/SyllabusPage", pro: false }],
  },

  

];

// Other navigation items
const othersItems: NavItem[] = [
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
    ],
    roles: ["admin", "student", "teacher", "teacher"],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const role = sessionStorage.getItem("userRole");

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Determine which nav items to display based on role
  const navItems = role === "student" ? studentNavItems : adminNavItems;

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const filterSubItemsByRole = (subItems?: { name: string; path: string; pro?: boolean; new?: boolean; roles?: string[] }[], itemRoles?: string[]) => {
    if (!subItems || !role) return [];
    return subItems.filter(subItem => {
      // If the subItem has its own roles property, use that instead
      if (subItem.roles) {
        return role !== null && subItem.roles.includes(role);
      }
      // Otherwise, use the parent item's roles
      return !itemRoles || (role !== null && itemRoles.includes(role));
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => {
    // Filter items by role
    const filteredItems = items.filter(item => {
      return !item.roles || (role && item.roles.includes(role));
    });

    return (
      <ul className="flex flex-col gap-4">
        {filteredItems.map((nav, index) => {
          // Filter sub-items by role
          const filteredSubItems = filterSubItemsByRole(nav.subItems, nav.roles);

          // Skip rendering if there are no sub-items after filtering
          if (nav.subItems && filteredSubItems.length === 0) {
            return null;
          }

          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                    } cursor-pointer ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                    }`}
                >
                  <span
                    className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                        }`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                      }`}
                  >
                    <span
                      className={`menu-item-icon-size ${isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                        }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )
              )}
              {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {filteredSubItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item ${isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                            }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const getLogoSrc = () => {
    if (role === "admin") {
      return "/images/logo/school-icons.webp";  // Admin logo path
    }
    else if (role === "student") {
      return "/images/logo/golden-logo.webp";  // Student logo path
    }
    else if (role === "teacher") {
      return "/images/logo/golden-logo.webp";  // Teacher logo path
    }
    else if (role === "superadmin") {
      return "/images/logo/golden-logo.webp";  // Superadmin logo path
    }
    else {
      return "/images/logo/stslogo.png";  // Default logo path
    }
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src={getLogoSrc()}
                alt="Logo"
                width={100}
                height={30}
              />
              <img
                className="hidden dark:block"
                src={getLogoSrc()}
                alt="Logo"
                width={100}
                height={30}
              />
            </>
          ) : (
            <img
              src={getLogoSrc()}
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  role === "admin" ? "Admin Menu" : "User Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;