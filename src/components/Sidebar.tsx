import React, { useEffect, useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../auth/AuthContext';
import {
  TrendingUp,
  LineChart,
  Users,
  Truck,
  Warehouse,
  ShieldCheck,
  PlayCircle,
  X,
  Sparkles,
  ChevronRight,
  Newspaper,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export interface NavItemConfig {
  id: string;
  labelKey: string;
  defaultLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'price-discovery',
    labelKey: 'navLiveMarkets',
    defaultLabel: 'Live Markets',
    icon: TrendingUp,
  },
  {
    id: 'forecast',
    labelKey: 'navForecast',
    defaultLabel: 'Price Forecast',
    icon: LineChart,
  },
  {
    id: 'marketplace',
    labelKey: 'navMarketplace',
    defaultLabel: 'Pooled Buyers',
    icon: Users,
  },
  {
    id: 'logistics',
    labelKey: 'navLogistics',
    defaultLabel: 'Logistics',
    icon: Truck,
  },
  {
    id: 'storage',
    labelKey: 'navStorage',
    defaultLabel: 'Storage',
    icon: Warehouse,
  },
  {
    id: 'payments',
    labelKey: 'navPayments',
    defaultLabel: 'Escrow & Payments',
    icon: ShieldCheck,
  },
  {
    id: 'news',
    labelKey: 'newsAnnouncementsNav',
    defaultLabel: 'News & Advisories',
    icon: Newspaper,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDemoTour?: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenDemoTour,
  activeSection: activeSectionProp,
  onNavigateSection,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [internalActiveSection, setInternalActiveSection] = useState<string>('price-discovery');

  const activeSection = activeSectionProp || internalActiveSection;

  // Track active section via IntersectionObserver when scrolling
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible entries
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by highest intersection ratio or position
          const topEntry = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev
          );
          if (topEntry.target.id) {
            setInternalActiveSection(topEntry.target.id);
          }
        }
      },
      {
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setInternalActiveSection(id);

    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Auto-close on mobile
    if (isOpen) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity animate-fadeIn"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-40 ${
          isCollapsed ? 'lg:w-20 w-72' : 'w-72'
        } bg-[#17362C] border-r border-[#D9FF55]/15 text-[#F6F1E4] shadow-2xl flex flex-col justify-between transition-all duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        role="navigation"
        aria-label="Main Sidebar Navigation"
      >
        {/* Top Header: Logo, SIH Badge & Tagline */}
        <div className={`p-4 ${isCollapsed ? 'lg:px-2.5' : 'p-5'} border-b border-[#D9FF55]/15 bg-[#132B23]/70 transition-all`}>
          <div className="flex items-center justify-between gap-2">
            {/* Logo and Brand */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (isOpen) onClose();
              }}
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#D9FF55] rounded-xl p-1 -m-1"
              aria-label="KrushiSetu Home"
              title={isCollapsed ? t('brandName') : undefined}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3F754A] to-[#D9FF55] p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#17362C] rounded-[14px] flex items-center justify-center">
                  <span className="text-xl">🌱</span>
                </div>
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black font-editorial tracking-tight text-white group-hover:text-[#D9FF55] transition-colors truncate">
                      {t('brandName')}
                    </span>
                    <span className="text-[9px] bg-[#D9FF55]/20 text-[#D9FF55] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider shrink-0">
                      SIH'26
                    </span>
                  </div>
                </div>
              )}
            </a>

            <div className="flex items-center gap-1">
              {/* Desktop Collapse / Expand Toggle Button */}
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1.5 rounded-xl text-[#F6F1E4]/70 hover:text-white hover:bg-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9FF55] transition-all cursor-pointer"
                  title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Minimize sidebar to get more screen'}
                  aria-label={isCollapsed ? 'Expand sidebar' : 'Minimize sidebar'}
                >
                  {isCollapsed ? (
                    <PanelLeftOpen className="w-4 h-4 text-[#D9FF55]" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-2 rounded-xl text-[#F6F1E4]/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D9FF55] transition-colors"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tagline */}
          {!isCollapsed && (
            <p className="mt-3 text-xs leading-relaxed text-[#F6F1E4]/75 font-medium border-l-2 border-[#D9FF55]/40 pl-2.5">
              {t('brandTagline')}
            </p>
          )}
        </div>

        {/* Vertical Navigation Options */}
        <div className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'lg:px-2 px-3' : 'px-3'} space-y-1.5 scrollbar-thin`}>
          {!isCollapsed ? (
            <div className="px-3 pb-2 text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#D9FF55]/60 flex items-center justify-between">
              <span>Marketplace Navigation</span>
              <Sparkles className="w-3 h-3 text-[#D9FF55]/40" />
            </div>
          ) : (
            <div className="hidden lg:flex justify-center pb-2">
              <span className="w-6 h-0.5 bg-[#D9FF55]/20 rounded-full" />
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            const label = t(item.labelKey) || item.defaultLabel;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                title={isCollapsed ? label : undefined}
                className={`group flex items-center ${
                  isCollapsed ? 'lg:justify-center justify-between lg:px-2 px-3.5' : 'justify-between px-3.5'
                } py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer min-h-[46px] outline-none focus:ring-2 focus:ring-[#D9FF55] ${
                  isSelected
                    ? 'bg-[#D9FF55] text-[#17362C] shadow-lg shadow-[#D9FF55]/15 font-black translate-x-0.5'
                    : 'text-[#F6F1E4]/85 hover:text-white hover:bg-white/10 hover:translate-x-0.5'
                }`}
                aria-current={isSelected ? 'page' : undefined}
              >
                <div className={`flex items-center ${isCollapsed ? 'lg:gap-0 gap-3' : 'gap-3'} min-w-0`}>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#17362C] text-[#D9FF55]'
                        : 'bg-white/5 text-[#D9FF55] group-hover:bg-white/15'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`${isCollapsed ? 'lg:hidden' : ''} truncate`}>{label}</span>
                </div>

                {!isCollapsed && (
                  isSelected ? (
                    <span className="w-2 h-2 rounded-full bg-[#17362C] animate-pulse shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors shrink-0" />
                  )
                )}
              </a>
            );
          })}
        </div>

        {/* Bottom Sidebar Card: User Session, Architecture Tour & MSAMB Info */}
        <div className={`p-3.5 ${isCollapsed ? 'lg:p-2' : 'p-4'} border-t border-[#D9FF55]/15 bg-[#132B23]/80 space-y-2.5 transition-all`}>
          {/* User Session Info & Logout */}
          {user && (
            <div className={`p-2 rounded-xl bg-black/25 border border-white/10 flex items-center ${isCollapsed ? 'lg:justify-center justify-between' : 'justify-between'} text-xs`}>
              {!isCollapsed ? (
                <>
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] uppercase font-black tracking-wider text-[#D9FF55]">
                      {user.role === 'farmer' ? '🚜 Seller' : user.role === 'buyer' ? '🏢 Buyer' : '🛡️ MSAMB Admin'}
                    </div>
                    <div className="text-white font-bold truncate">
                      {user.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 border border-white/10 transition-colors cursor-pointer shrink-0"
                    title={t('logoutBtn', 'Logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                  title={`${user.name} (${user.role}) - ${t('logoutBtn', 'Logout')}`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {onOpenDemoTour && !isCollapsed && (
            <button
              type="button"
              onClick={() => {
                onOpenDemoTour();
                if (isOpen) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#D9FF55] hover:border-[#D9FF55]/30 transition-all cursor-pointer shadow-sm"
            >
              <PlayCircle className="w-4 h-4 text-[#D9FF55]" />
              <span>Interactive Architecture Tour</span>
            </button>
          )}

          {onToggleCollapse && isCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#D9FF55] transition-all cursor-pointer"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {!isCollapsed && (
            <div className="px-2 pt-1 text-center">
              <p className="text-[10px] text-[#F6F1E4]/60 font-mono">
                Smart India Hackathon 2026
              </p>
              <p className="text-[9px] text-[#F6F1E4]/40 mt-0.5">
                Government of Maharashtra · MSAMB
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
