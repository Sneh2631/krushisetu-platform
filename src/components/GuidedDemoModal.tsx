import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from '../i18n/useTranslation';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToSection: (sectionId: string) => void;
}

interface TourStep {
  stepNumber: number;
  title: string;
  badge: string;
  description: string;
  highlightAction: string;
  targetSectionId: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    stepNumber: 1,
    title: '3D WebGL Gujarat Farm & Market Ecosystem',
    badge: 'Interactive 3D Visualizer',
    description:
      'Explore the interactive 3D farm island featuring cultivated crop rows, animated growing plants, harvest crates, and connected hubs (FPO, APMC, Cold Store, and Corporate Buyer) with an active logistics loop.',
    highlightAction: 'View 3D Hero Scene',
    targetSectionId: '#',
  },
  {
    stepNumber: 2,
    title: 'Role-Based Switching (Farmer / FPO vs Corporate Buyer)',
    badge: 'Persona Experience',
    description:
      'Seamlessly toggle between the Farmer/FPO view and the Institutional Buyer view using the top navigation switcher to test both market sides.',
    highlightAction: 'Toggle Role Switcher in Header',
    targetSectionId: 'farmer-dashboard',
  },
  {
    stepNumber: 3,
    title: 'Transparent Multi-Channel Price Discovery Matrix',
    badge: 'Price Realization Matrix',
    description:
      'Compare APMC Mandi, Food Processor, Institutional Buyer, and e-NAM net returns across Gujarat. View itemized deductions (APMC Cess, handling, transport) to reveal the actual money reaching the farmer’s bank account.',
    highlightAction: 'Explore Price Discovery Matrix',
    targetSectionId: 'price-discovery',
  },
  {
    stepNumber: 4,
    title: 'Deterministic Price & Demand Forecast Engine',
    badge: 'Predictive Arrival Intelligence',
    description:
      'Forecast market prices 3 to 30 days ahead with supply arrival pressure gauges, institutional demand indices, and an AI recommended sale window.',
    highlightAction: 'Inspect Forecast Trends',
    targetSectionId: 'forecast',
  },
  {
    stepNumber: 5,
    title: 'Produce Harvest Lot Creation Wizard',
    badge: 'Lot Registration',
    description:
      'Farmer listings created with crop cultivars, quantity, grade specs, location, and storage availability—persisted locally with celebratory feedback.',
    highlightAction: 'Register a New Harvest Batch',
    targetSectionId: 'farmer-dashboard',
  },
  {
    stepNumber: 6,
    title: 'Verified Institutional Buyer Marketplace',
    badge: 'Corporate Demand Sourcing',
    description:
      'Direct contracts with pre-vetted corporate processors (Jivraj Agro, Balaji Wafers, Adani Wilmar, GUJCOMASOL, Amul) with verified reliability ratings.',
    highlightAction: 'Browse Buyer Directory',
    targetSectionId: 'marketplace',
  },
  {
    stepNumber: 7,
    title: 'Transparent Net Offer Comparison & Fee Deductions',
    badge: 'Middleman Savings',
    description:
      'Side-by-side modal showing gross offer vs mandi fees vs pooled transport, highlighting exactly how much extra money the farmer makes.',
    highlightAction: 'Compare Net Payout Itemization',
    targetSectionId: 'marketplace',
  },
  {
    stepNumber: 8,
    title: 'Pooled Logistics & Smart Route Optimization',
    badge: '57% Freight Cost Savings',
    description:
      'Consolidates smallholder farm-gate pickups into high-capacity vehicles, cutting freight cost from ₹4.20/kg down to ₹1.80/kg while saving CO₂.',
    highlightAction: 'Simulate Vehicle Route',
    targetSectionId: 'logistics',
  },
  {
    stepNumber: 9,
    title: 'WDRA Cold Storage Holding vs Sell Today Advisor',
    badge: 'Distress Sale Mitigation',
    description:
      'Evaluate WDRA cold storages across Gujarat with an interactive holding gain vs storage fee calculator.',
    highlightAction: 'Calculate Holding Net Gain',
    targetSectionId: 'storage',
  },
  {
    stepNumber: 10,
    title: '6-Milestone Escrow Clearing Audit Trail',
    badge: 'Guaranteed Payment Security',
    description:
      'Complete milestone trail from digital contract to automated NEFT/IMPS bank release, backed by Gujarat State Escrow.',
    highlightAction: 'Simulate Escrow Payout',
    targetSectionId: 'payments',
  },
  {
    stepNumber: 11,
    title: 'FPO Conciliation & Grievance Arbitration Portal',
    badge: '48-Hour SLA Redressal',
    description:
      'Formal dispute registration for weighment mismatch, quality dispute, or payment delay under state arbitration guidelines.',
    highlightAction: 'Review Grievance SLAs',
    targetSectionId: 'grievance',
  },
];

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onJumpToSection,
}) => {
  const { t } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (_) {}
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleJump = (sectionId: string) => {
    onJumpToSection(sectionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-[#F6F1E4] w-full max-w-2xl rounded-3xl border border-[#17362C]/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-[#17362C] text-[#F6F1E4] px-6 py-4 flex items-center justify-between border-b border-[#D9FF55]/20">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#D9FF55] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 Evaluation Tour</span>
            </div>
            <h3 className="text-lg font-black font-editorial text-white">
              KrushiSetu Architecture Walkthrough ({currentStepIndex + 1}/{TOUR_STEPS.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label={t('closeModal')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#17362C]/10 h-1.5 w-full">
          <div
            className="bg-[#3F754A] h-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-[#17362C] text-[#D9FF55] px-2.5 py-0.5 rounded-full">
              Feature #{currentStep.stepNumber}
            </span>
            <span className="text-xs font-bold text-[#3F754A] uppercase tracking-wider">
              {currentStep.badge}
            </span>
          </div>

          <h4 className="text-xl font-black font-editorial text-[#17362C]">
            {currentStep.title}
          </h4>

          <p className="text-xs sm:text-sm text-[#132B23]/80 leading-relaxed font-medium">
            {currentStep.description}
          </p>

          <div className="pt-2">
            <button
              onClick={() => handleJump(currentStep.targetSectionId)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3F754A] text-white text-xs font-bold shadow hover:bg-[#2e5937] transition-all cursor-pointer min-h-[44px]"
            >
              <span>{currentStep.highlightAction}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 disabled:opacity-40 min-h-[44px] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 inline mr-1" />
            <span>{t('prevStepBtn')}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="py-2.5 px-6 rounded-xl bg-[#17362C] text-[#D9FF55] text-xs font-extrabold shadow hover:bg-[#254E40] min-h-[44px] cursor-pointer flex items-center gap-1.5"
          >
            <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : t('nextStepBtn')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
