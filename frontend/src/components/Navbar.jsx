import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  WalletIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  MicrophoneIcon,
  AcademicCapIcon,
  StarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  ChevronDownIcon,
  Bars2Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";


const profileMenuItems = [
  { label: "My Profile",   icon: UserCircleIcon, action: "profile" },
  { label: "Edit Profile", icon: Cog6ToothIcon,   action: "profile" },
  { label: "Inbox",        icon: InboxArrowDownIcon, action: "coming_soon" },
  { label: "Help",         icon: LifebuoyIcon,       action: "coming_soon" },
  { label: "Sign Out",     icon: PowerIcon,          action: "logout" },
];

export function Way2FresherNavbar() {
  const { selectedCareers } = useApp();
  const { currentUser, logOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const dropdownRef = useRef(null);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setIsNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);
      await logOut();
      triggerToast("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleProfileMenuClick = (action) => {
    setIsMenuOpen(false);
    if (action === "profile") {
      navigate("/profile");
    } else if (action === "logout") {
      handleLogout();
    } else {
      triggerToast("This feature is coming soon!");
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/careers?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsNavOpen(false);
    }
  };

  const handleNavClick = (targetPath) => {
    setIsNavOpen(false);
    if (location.pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  
  const primaryNavItems = [
    { label: "Careers", icon: BriefcaseIcon, href: "/careers", type: "route" },
    { label: "Courses", icon: BuildingOfficeIcon, href: "/courses", type: "route" },
    { label: "Branch Guide", icon: WalletIcon, href: "/branches", type: "route" },
    { label: "Quiz", icon: WalletIcon, href: "/quiz", type: "route" },
    { label: "Compare", icon: WalletIcon, href: "/compare", type: "route", countBadge: selectedCareers.length },
    { label: "Jobs", icon: BriefcaseIcon, href: "#", type: "action", msg: "Jobs board is coming soon! Partnering with companies." },
    { label: "Internships", icon: BuildingOfficeIcon, href: "#", type: "action", msg: "Internships coming soon!" },
    { label: "Walk-ins", icon: WalletIcon, href: "#", type: "action", msg: "Walk-ins listing coming soon!" },
  ];

  
  const toolNavItems = [
    { label: "Resume builder", icon: DocumentTextIcon, href: "#", highlight: true, msg: "Resume builder tools are launching soon!" },
    { label: "ATS checker", icon: ChartBarIcon, href: "#", highlight: false, msg: "ATS analyzer tool is in beta testing." },
    { label: "Skill tests", icon: ClipboardDocumentCheckIcon, href: "#", highlight: false, msg: "Skill assessments coming soon." },
    { label: "Mock interview", icon: MicrophoneIcon, href: "#", highlight: false, msg: "AI mock interviews launching in next phase." },
    { label: "Learning hub", icon: AcademicCapIcon, href: "#", highlight: false, msg: "Courses are available in the 'Courses' page!" },
    { label: "Get hired score", icon: StarIcon, href: "#", highlight: false, badge: "Signature", msg: "Hired Score calculator coming soon." },
  ];

  return (
    <>
      {}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 text-white border border-emerald-500/30 px-6 py-3 rounded-full shadow-lg shadow-emerald-500/10 backdrop-blur-md flex items-center gap-2 animate-pulse pointer-events-auto">
          <span className="text-emerald-400">💡</span>
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      <div className="fixed top-3 sm:top-6 left-0 right-0 z-50 pointer-events-none flex flex-col items-center gap-2 sm:gap-3 px-2 sm:px-4">
        
        {}
        <nav className="w2f-navbar mx-auto w-[98%] max-w-[1280px] pointer-events-auto rounded-full px-6 py-2 sm:py-2.5 flex items-center justify-between transition-all backdrop-blur-xl relative z-30">
          
          {}
          <Link
            to="/"
            onClick={() => handleNavClick("/")}
            className="mr-6 flex cursor-pointer items-center gap-2 py-1"
          >
            <img 
              src="/logo.png" 
              alt="way2fresher logo" 
              className="h-[36px] sm:h-[44px] w-auto object-contain transition-transform hover:scale-105" 
            />
            <span className="hidden sm:inline text-lg font-bold tracking-tight hover:text-emerald-400 transition-colors">
              Way2<span className="text-emerald-400">Fresher</span>
            </span>
          </Link>

          {}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {primaryNavItems.slice(0, 5).map(({ label, href, countBadge }) => (
                <li key={label}>
                  <NavLink
                    to={href}
                    onClick={() => handleNavClick(href)}
                    className={({ isActive }) => 
                      `px-2 xl:px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider w2f-navlink ${
                        isActive 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 w2f-navlink-active" 
                          : "hover:text-white"
                      }`
                    }
                  >
                    {label} {countBadge > 0 && `(${countBadge})`}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="mx-4 hidden lg:max-w-[200px] xl:max-w-[350px] flex-1 lg:flex">
            <div className="w2f-search-container flex w-full items-center gap-2 rounded-full px-4 py-1.5">
              <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search careers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w2f-search-input w-full bg-transparent text-xs outline-none"
              />
            </div>
          </div>

          {}
          <div className="hidden items-center gap-2 lg:flex">
            <button 
              onClick={() => triggerToast("Salary guide coming soon!")}
              className="w2f-tool-btn rounded-full px-3 py-1.5 text-xs font-medium hover:bg-white/5 transition-all lg:hidden xl:block"
            >
              Salary guide
            </button>
            <button 
              onClick={() => triggerToast("Career blogs section is in development.")}
              className="w2f-tool-btn rounded-full px-3 py-1.5 text-xs font-medium hover:bg-white/5 transition-all lg:hidden xl:block"
            >
              Career blogs
            </button>

            {currentUser ? (
              
              <div className="relative z-50" ref={dropdownRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-1 rounded-full p-0.5 hover:bg-white/5 transition-all outline-none"
                >
                  <img
                    alt={currentUser.displayName || "user avatar"}
                    className="h-8 w-8 rounded-full border border-emerald-500 p-0.5 object-cover"
                    src={currentUser.photoURL || "https://www.gravatar.com/avatar/?d=mp"}
                  />
                  <ChevronDownIcon
                    className={`h-3 w-3 text-slate-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isMenuOpen && (
                  <div className="w2f-profile-menu-dropdown absolute right-0 mt-2 w-48 rounded-xl p-1 shadow-2xl backdrop-blur-xl z-[999]">
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs font-bold text-slate-200">{currentUser.displayName || "User"}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                    {profileMenuItems.map(({ label, icon, action }, key) => {
                      const isLast = key === profileMenuItems.length - 1;
                      return (
                        <button
                          key={label}
                          onClick={() => handleProfileMenuClick(action)}
                          className={`w2f-profile-menu-item flex w-full items-center gap-2 rounded px-3 py-2 text-xs transition-colors text-left ${
                            isLast ? "hover:bg-red-500/10 text-red-400" : ""
                          }`}
                        >
                          {React.createElement(icon, {
                            className: `h-4 w-4 ${isLast ? "text-red-400" : "text-slate-400"}`,
                          })}
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login"
                  className="w2f-btn-secondary px-4 py-1.5 rounded-full text-xs font-semibold"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup"
                  className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400 shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {}
          <button
            onClick={toggleIsNavOpen}
            className="ml-auto h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/5 lg:hidden text-white outline-none"
            aria-label="Toggle navigation"
          >
            <Bars2Icon className="h-6 w-6" style={{ color: "var(--text-primary)" }} />
          </button>

        </nav>

        {}
        <div className="w2f-tools-strip hidden w-[96%] max-w-[1280px] pointer-events-auto rounded-full px-6 py-1.5 shadow-xl backdrop-blur-md lg:block relative z-20">
          <div className="flex items-center justify-between">
            <ul className="flex items-center gap-1 list-none m-0 p-0 w-full justify-around">
              {toolNavItems.map(({ label, icon, highlight, badge, msg }) => (
                <li key={label}>
                  <button
                    onClick={() => triggerToast(msg)}
                    className={`flex items-center gap-1.5 rounded-full lg:px-2 xl:px-3 py-1 lg:text-[11px] xl:text-xs font-medium transition-all ${
                      highlight
                        ? "w2f-tool-highlight shadow-sm"
                        : "w2f-tool-btn hover:text-white"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `h-[14px] w-[14px] ${highlight ? "text-white" : "text-slate-500"}`
                    })}
                    <span>{label}</span>
                    {badge && (
                      <span className="ml-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                        {badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {}
      {isNavOpen && (
        <div className="fixed inset-x-0 top-[72px] sm:top-[90px] z-40 lg:hidden pointer-events-auto">
          <div className="w2f-mobile-drawer mx-auto w-[95%] rounded-3xl p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
            
            {}
            <div className="w2f-search-container flex w-full items-center gap-2 rounded-full px-4 py-2">
              <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search careers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w2f-search-input w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div>
              <p 
                className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Primary Nav
              </p>
              <ul className="flex flex-col gap-1 list-none m-0 p-0">
                {primaryNavItems.slice(0, 5).map(({ label, href, countBadge }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      onClick={() => handleNavClick(href)}
                      className="w2f-navlink flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                    >
                      <span>{label} {countBadge > 0 && `(${countBadge})`}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-white/5 my-0.5" />

            <div>
              <p 
                className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Opportunities
              </p>
              <ul className="flex flex-col gap-1 list-none m-0 p-0">
                {primaryNavItems.slice(5).map(({ label, msg }) => (
                  <li key={label}>
                    <button
                      onClick={() => triggerToast(msg)}
                      className="w2f-tool-btn flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all text-left"
                    >
                      <span>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-white/5 my-0.5" />

            <div>
              <p 
                className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Career Tools
              </p>
              <ul className="flex flex-col gap-1 list-none m-0 p-0">
                {toolNavItems.map(({ label, msg, badge }) => (
                  <li key={label}>
                    <button
                      onClick={() => triggerToast(msg)}
                      className="w2f-tool-btn flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm font-semibold transition-all text-left"
                    >
                      <span>{label}</span>
                      {badge && (
                        <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                          {badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-white/5 my-0.5" />

            {}
            <div className="flex flex-col gap-2 mt-2">
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsNavOpen(false)}
                    className="flex justify-center rounded-xl w2f-btn-secondary px-4 py-2.5 text-sm font-semibold"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex justify-center rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsNavOpen(false)}
                    className="flex justify-center rounded-xl w2f-btn-secondary px-4 py-2.5 text-sm font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsNavOpen(false)}
                    className="flex justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Way2FresherNavbar;