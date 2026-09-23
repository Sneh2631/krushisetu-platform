import { useState, useEffect } from 'react';
import type { Crop, MandiMarket, UserRole } from './types';
import { LanguageProvider } from './i18n/LanguageContext';
import { useTranslation } from './i18n/useTranslation';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ThemeProvider } from './theme/ThemeContext';

// Core Application Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Hero } from './components/Hero';
import { PriceDiscovery } from './components/PriceDiscovery';
import { PriceForecastEngine } from './components/PriceForecastEngine';
import { LogisticsOptimizer } from './components/LogisticsOptimizer';
import { StorageAdvisor } from './components/StorageAdvisor';
import { PaymentEscrowTracker } from './components/PaymentEscrowTracker';
import { GrievancePortal } from './components/GrievancePortal';
import { HowItWorks } from './components/HowItWorks';
import { ImpactSection } from './components/ImpactSection';
import { Footer } from './components/Footer';

// Dynamic Role Views
import { FarmerDashboard } from './components/FarmerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { AdminVerificationDashboard } from './components/AdminVerificationDashboard';
import { PublicLanding } from './components/PublicLanding';
import { AuthPage } from './components/auth/AuthPage';
import { RoleSelectionPage } from './components/auth/RoleSelectionPage';
import { UnauthorizedAccessView } from './components/auth/UnauthorizedAccessView';
import { NewsSection } from './components/NewsSection';

// Modals & Interactive Overlays
import { ProduceLotCreationModal } from './components/ProduceLotCreationModal';
import { DealWorkspaceModal } from './components/DealWorkspaceModal';
import { HelpAndGuidanceModal } from './components/HelpAndGuidanceModal';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { UserProfileModal } from './components/UserProfileModal';

import { EnhancedVoiceAgentModal } from './components/EnhancedVoiceAgentModal';
import { ChatbotProvider } from './chatbot/ChatbotProvider';
import { ChatbotDrawer } from './chatbot/ChatbotDrawer';
import { ChatbotButton } from './chatbot/ChatbotButton';

function MainAppContent() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  // Reactive Hash-Based Routing State
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Active Selections for Discovery Tools (Maharashtra defaults)
  const [selectedCrop, setSelectedCrop] = useState<Crop>('Soybean');
  const [selectedMarket, setSelectedMarket] = useState<MandiMarket>('Pune');

  // Modals
  const [createLotModalOpen, setCreateLotModalOpen] = useState(false);
  const [dealWorkspaceOpen, setDealWorkspaceOpen] = useState(false);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [demoTourModalOpen, setDemoTourModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [userProfileModalOpen, setUserProfileModalOpen] = useState(false);
  const [voiceAgentModalOpen, setVoiceAgentModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('krushisetu_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleOpenDealWorkspace = (dealId: string) => {
    setActiveDealId(dealId);
    setDealWorkspaceOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const cleanHash = currentHash.split('?')[0].toLowerCase();

  // =========================================================================
  // 1. PUBLIC UNAUTHENTICATED EXPERIENCE & ROUTE PROTECTION
  // =========================================================================
  if (!isAuthenticated) {
    // Protected routes accessed directly without session -> safely redirect to respective login
    if (cleanHash === '#/seller' || cleanHash === '#/farmer') {
      window.location.hash = '#/login/farmer';
      return (
        <AuthPage
          initialRole="farmer"
          initialMode="login"
          onBackToRoleSelection={() => { window.location.hash = '#/role-selection'; }}
          onBackToHome={() => { window.location.hash = '#/'; }}
        />
      );
    }

    if (cleanHash === '#/buyer') {
      window.location.hash = '#/login/buyer';
      return (
        <AuthPage
          initialRole="buyer"
          initialMode="login"
          onBackToRoleSelection={() => { window.location.hash = '#/role-selection'; }}
          onBackToHome={() => { window.location.hash = '#/'; }}
        />
      );
    }

    if (cleanHash === '#/admin') {
      window.location.hash = '#/login/admin';
      return (
        <AuthPage
          initialRole="admin"
          initialMode="login"
          onBackToRoleSelection={() => { window.location.hash = '#/role-selection'; }}
          onBackToHome={() => { window.location.hash = '#/'; }}
        />
      );
    }

    // Role Selection Page
    if (cleanHash === '#/role-selection') {
      return (
        <RoleSelectionPage
          onSelectRole={(role, mode) => {
            window.location.hash = `#/${mode || 'login'}/${role}`;
          }}
          onBackToHome={() => {
            window.location.hash = '#/';
          }}
        />
      );
    }

    // Role-specific login & registration flows
    if (cleanHash.startsWith('#/login/') || cleanHash.startsWith('#/register/')) {
      const isRegister = cleanHash.startsWith('#/register/');
      const targetRole: UserRole = cleanHash.includes('buyer')
        ? 'buyer'
        : cleanHash.includes('admin')
        ? 'admin'
        : 'farmer';

      return (
        <AuthPage
          initialRole={targetRole}
          initialMode={targetRole === 'admin' ? 'login' : (isRegister ? 'register' : 'login')}
          onBackToRoleSelection={() => { window.location.hash = '#/role-selection'; }}
          onBackToHome={() => { window.location.hash = '#/'; }}
        />
      );
    }

    // Public Landing Homepage
    return (
      <>
        <PublicLanding
          onStartAsFarmer={() => {
            window.location.hash = '#/login/farmer';
          }}
          onStartAsBuyer={() => {
            window.location.hash = '#/login/buyer';
          }}
          onOpenAdminLogin={() => {
            window.location.hash = '#/login/admin';
          }}
          onOpenRoleSelection={() => {
            window.location.hash = '#/role-selection';
          }}
        />

        <AdminLoginModal
          isOpen={adminLoginModalOpen}
          onClose={() => setAdminLoginModalOpen(false)}
          onLoginSuccess={() => {
            setAdminLoginModalOpen(false);
          }}
        />
      </>
    );
  }

  // =========================================================================
  // 2. AUTHENTICATED EXPERIENCE & CROSS-ROLE ROUTE PROTECTION
  // =========================================================================
  const activeRole: UserRole = user?.role || 'farmer';

  // If user is already authenticated and navigates to public/login routes, redirect to their dashboard
  if (
    cleanHash === '#/' ||
    cleanHash === '' ||
    cleanHash === '#/role-selection' ||
    cleanHash.startsWith('#/login') ||
    cleanHash.startsWith('#/register')
  ) {
    const targetDashboard = activeRole === 'admin' ? '#/admin' : activeRole === 'buyer' ? '#/buyer' : '#/seller';
    if (window.location.hash !== targetDashboard) {
      window.location.hash = targetDashboard;
    }
  }

  // STRICT CROSS-ROLE ACCESS RESTRICTIONS
  // 1. Farmer attempts to access Buyer or Admin portals
  if (activeRole === 'farmer') {
    if (cleanHash === '#/buyer') {
      return (
        <UnauthorizedAccessView
          targetRole="buyer"
          onNavigateToMyDashboard={() => { window.location.hash = '#/seller'; }}
        />
      );
    }
    if (cleanHash === '#/admin') {
      return (
        <UnauthorizedAccessView
          targetRole="admin"
          onNavigateToMyDashboard={() => { window.location.hash = '#/seller'; }}
        />
      );
    }
  }
  // 2. Buyer attempts to access Farmer or Admin portals
  else if (activeRole === 'buyer') {
    if (cleanHash === '#/seller' || cleanHash === '#/farmer') {
      return (
        <UnauthorizedAccessView
          targetRole="farmer"
          onNavigateToMyDashboard={() => { window.location.hash = '#/buyer'; }}
        />
      );
    }
    if (cleanHash === '#/admin') {
      return (
        <UnauthorizedAccessView
          targetRole="admin"
          onNavigateToMyDashboard={() => { window.location.hash = '#/buyer'; }}
        />
      );
    }
  }
  // 3. Admin attempts to access Farmer or Buyer portals
  else if (activeRole === 'admin') {
    if (cleanHash === '#/seller' || cleanHash === '#/farmer') {
      return (
        <UnauthorizedAccessView
          targetRole="farmer"
          onNavigateToMyDashboard={() => { window.location.hash = '#/admin'; }}
        />
      );
    }
    if (cleanHash === '#/buyer') {
      return (
        <UnauthorizedAccessView
          targetRole="buyer"
          onNavigateToMyDashboard={() => { window.location.hash = '#/admin'; }}
        />
      );
    }
  }

  const isAdminAuthenticated = activeRole === 'admin' && user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#F6F1E4] text-[#132B23] dark:bg-[#0B1713] dark:text-[#EDF5F1] font-sans antialiased selection:bg-[#D9FF55] selection:text-[#17362C] pb-16 md:pb-0 flex flex-col transition-colors duration-200">
      
      {/* Left Vertical Fixed Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onOpenDemoTour={() => setDemoTourModalOpen(true)}
        onNavigateSection={scrollToSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => {
          setIsSidebarCollapsed((prev) => {
            const next = !prev;
            try {
              localStorage.setItem('krushisetu_sidebar_collapsed', String(next));
            } catch {}
            return next;
          });
        }}
      />

      {/* Main Page Layout Starting After Left Sidebar */}
      <div className={`${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'} flex-1 flex flex-col min-w-0 transition-all duration-300`}>
        
        {/* Compact Top Navigation Header (No in-session role switching) */}
        <Navbar
          userRole={activeRole}
          onOpenCreateLotModal={() => setCreateLotModalOpen(true)}
          onOpenDemoTour={() => setDemoTourModalOpen(true)}
          onOpenHelp={() => setHelpModalOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenProfile={() => setUserProfileModalOpen(true)}
          onNavigateSection={(sec) => {
            if (sec === 'deals' && activeDealId) {
              setDealWorkspaceOpen(true);
            } else if (sec === 'listings') {
              scrollToSection('farmer-dashboard');
            } else if (sec === 'interests') {
              scrollToSection('farmer-dashboard');
            } else {
              scrollToSection(sec);
            }
          }}
        />

        <main className="flex-1 min-w-0">
          {/* Hero Section */}
          <Hero
            onExploreMarkets={() => scrollToSection('price-discovery')}
            onStartFarmerJourney={() => setCreateLotModalOpen(true)}
          />

          {/* DEDICATED ROLE-SPECIFIC APPLICATION EXPERIENCE */}
          {activeRole === 'admin' ? (
            isAdminAuthenticated ? (
              <AdminVerificationDashboard />
            ) : (
              <div className="max-w-3xl mx-auto my-12 p-8 bg-[#17362C] text-white rounded-3xl text-center space-y-4 border-2 border-red-500/50 shadow-2xl">
                <div className="text-4xl">🔒</div>
                <h2 className="text-2xl font-black font-editorial text-red-400">
                  {t('adminPortalTitle', 'Protected Admin Portal')}
                </h2>
                <p className="text-sm text-gray-300">
                  {t('authErrorAdminProtected', 'This portal is restricted to authorized government nodal officers. Please complete admin login.')}
                </p>
                <button
                  type="button"
                  onClick={() => setAdminLoginModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-[#D9FF55] text-[#17362C] font-black text-sm shadow-xl hover:bg-lime-300 cursor-pointer"
                >
                  {t('adminLoginBtn', 'Admin Login')}
                </button>
              </div>
            )
          ) : activeRole === 'farmer' ? (
            <FarmerDashboard
              onOpenCreateLotModal={() => setCreateLotModalOpen(true)}
              onNavigateToPriceDiscovery={() => scrollToSection('price-discovery')}
              onOpenHelp={() => setHelpModalOpen(true)}
              onOpenDealWorkspace={handleOpenDealWorkspace}
            />
          ) : (
            <BuyerDashboard
              onOpenDealWorkspace={handleOpenDealWorkspace}
            />
          )}

          {/* Public Consumer Sections: Only displayed for Farmers and Buyers, hidden for Admin console */}
          {activeRole !== 'admin' && (
            <>
              {/* Transparent Price Discovery Matrix */}
              <PriceDiscovery
                selectedCrop={selectedCrop}
                onSelectCrop={setSelectedCrop}
                selectedMarket={selectedMarket}
                onSelectMarket={setSelectedMarket}
                onSelectBestOffer={() => setCreateLotModalOpen(true)}
              />

              {/* Deterministic Price & Demand Forecast Engine */}
              <PriceForecastEngine
                selectedCrop={selectedCrop}
                onSelectCrop={setSelectedCrop}
                onNavigateToMarketplace={() => scrollToSection('marketplace')}
              />

              {/* Public & Verified News, Advisories & Announcements Section */}
              <div id="news" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <NewsSection />
              </div>

              {/* Pooled Route Logistics & Freight Cost Optimizer */}
              <LogisticsOptimizer />

              {/* WDRA Cold Storage Holding vs Sell Today Advisor */}
              <StorageAdvisor selectedCrop={selectedCrop} />

              {/* 6-Milestone Payment Escrow Clearing Tracker */}
              <PaymentEscrowTracker />

              {/* Dispute & Grievance Arbitration Portal */}
              <GrievancePortal />

              {/* How It Works Operating Flow */}
              <HowItWorks />

              {/* Socio-Economic Impact Section */}
              <ImpactSection />
            </>
          )}

          {/* Comprehensive Footer */}
          <Footer />
        </main>
      </div>

      {/* ========================================================================= */}
      {/* ROOT-LEVEL MODALS & OVERLAYS (Outside main/sidebar stacking contexts)     */}
      {/* ========================================================================= */}

      {/* 6-Step Guided Produce Lot Creation Wizard Modal */}
      <ProduceLotCreationModal
        isOpen={createLotModalOpen}
        onClose={() => setCreateLotModalOpen(false)}
      />

      {/* Deal Workspace Modal */}
      <DealWorkspaceModal
        isOpen={dealWorkspaceOpen}
        onClose={() => setDealWorkspaceOpen(false)}
        dealId={activeDealId || 'DEAL-2026-001'}
      />

      {/* Guided Tour Modal */}
      <GuidedDemoModal
        isOpen={demoTourModalOpen}
        onClose={() => setDemoTourModalOpen(false)}
        onJumpToSection={scrollToSection}
      />

      {/* Help & Guidance Drawer */}
      <HelpAndGuidanceModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        onNavigateToGrievance={() => scrollToSection('grievance')}
      />

      {/* Protected Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onLoginSuccess={() => {
          setAdminLoginModalOpen(false);
        }}
      />

      {/* User Profile View & Edit Modal */}
      <UserProfileModal
        isOpen={userProfileModalOpen}
        onClose={() => setUserProfileModalOpen(false)}
      />

      {/* Fixed Mobile Bottom Navigation */}
      <MobileBottomNav
        onNavigateHome={() => scrollToSection('#')}
        onNavigatePrices={() => scrollToSection('price-discovery')}
        onOpenCreateLot={() => setCreateLotModalOpen(true)}
        onNavigateOrders={() => scrollToSection('payments')}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenVoiceAgent={() => setVoiceAgentModalOpen(true)}
      />

      {/* Enhanced Voice Agent Modal - Competition Edition */}
      <EnhancedVoiceAgentModal
        isOpen={voiceAgentModalOpen}
        onClose={() => setVoiceAgentModalOpen(false)}
      />

      {/* Chatbot Drawer & Button */}
      <ChatbotDrawer />
      <ChatbotButton />

      {/* Floating Help Trigger */}
      <button
        type="button"
        onClick={() => setHelpModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 px-4 py-3 rounded-full bg-[#17362C] dark:bg-[#1C382E] text-[#D9FF55] font-extrabold text-xs shadow-2xl hover:scale-105 transition-all border border-[#D9FF55]/40 cursor-pointer"
        aria-label="Need Help Support"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#D9FF55] animate-ping" />
        <span>{t('needHelpBtn', 'Need Help?')}</span>
      </button>

      {/* Floating Voice Agent Button */}
      <button
        type="button"
        onClick={() => setVoiceAgentModalOpen(true)}
        className="fixed bottom-6 right-32 z-40 hidden md:flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold text-xs shadow-2xl hover:scale-105 transition-all border border-emerald-400/40 cursor-pointer"
        aria-label="Voice Assistant"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
          <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
        </svg>
        <span>{t('voiceAssistant', 'Voice Agent')}</span>
      </button>

    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ChatbotProvider>
            <MainAppContent />
          </ChatbotProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
