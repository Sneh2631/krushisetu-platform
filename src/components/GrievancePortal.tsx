import React, { useState } from 'react';
import type { Language, GrievanceTicket } from '../types';
import { SAMPLE_GRIEVANCES } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';
import {
  LifeBuoy,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AudioSpeechButton } from './AudioSpeechButton';

interface GrievancePortalProps {
  language?: Language;
}

export const GrievancePortal: React.FC<GrievancePortalProps> = () => {
  const { t, translateStatus, language } = useTranslation();
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(SAMPLE_GRIEVANCES);
  const [transactionId, setTransactionId] = useState('TXN-GJ-2026-9921');
  const [category, setCategory] = useState<'Weighment Mismatch' | 'Quality Grade Dispute' | 'Payment Delay' | 'Logistics Delay' | 'Contract Default'>('Weighment Mismatch');
  const [description, setDescription] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [createdTicketNo, setCreatedTicketNo] = useState('');

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'Weighment Mismatch': return t('disputeWeighmentMismatch');
      case 'Quality Grade Dispute': return t('disputeQualityDispute');
      case 'Payment Delay': return t('disputePaymentDelay');
      case 'Logistics Delay': return t('disputeLogisticsDelay');
      case 'Contract Default': return t('disputeContractDefault');
      default: return cat;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketNo = `GRV-GJ-2026-${randomNum}`;
    const newGrievance: GrievanceTicket = {
      id: `GRV-${Date.now()}`,
      grievanceNo: ticketNo,
      transactionId,
      category,
      description,
      preferredLanguage: language,
      status: 'Submitted',
      createdAt: new Date().toISOString().split('T')[0],
      slaDays: 2,
    };

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF7043', '#D9FF55'],
      });
    } catch (_) {}

    setGrievances([newGrievance, ...grievances]);
    setCreatedTicketNo(ticketNo);
    setSubmittedSuccess(true);
    setDescription('');
    setTimeout(() => setSubmittedSuccess(false), 8000);
  };

  const speechText = `${t('grievanceTitle')}. ${t('grievanceSubtitle')}. ${t('slaNotice')}`;

  return (
    <section id="grievance" className="py-10 sm:py-14 bg-gradient-to-b from-[#F6F1E4] via-white to-[#F6F1E4] border-b border-[#17362C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF7043]/10 text-[#FF7043] text-xs font-bold uppercase tracking-wider">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>{t('fpoConciliationSla')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-editorial text-[#132B23] tracking-tight">
            {t('grievanceTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#132B23]/70 leading-relaxed">
            {t('grievanceSubtitle')}
          </p>
          <div className="pt-1">
            <AudioSpeechButton textToRead={speechText} label={t('voiceListen')} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Dispute Registration Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#17362C]/10 shadow-sm space-y-4">
            <h3 className="text-lg font-black font-editorial text-[#132B23] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#FF7043]" />
              <span>{t('submitGrievanceBtn')}</span>
            </h3>

            {submittedSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs flex items-center gap-2 animate-fadeIn font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {t('grievanceSuccess')} {createdTicketNo}. {t('slaNotice')}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#132B23] uppercase tracking-wider mb-1">
                  {t('transactionId')} *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-[#F6F1E4] border border-[#17362C]/15 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-[#132B23] focus:outline-none focus:border-[#3F754A] min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#132B23] uppercase tracking-wider mb-1">
                  {t('issueCategory')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#F6F1E4] border border-[#17362C]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#132B23] font-semibold focus:outline-none focus:border-[#3F754A] min-h-[44px]"
                >
                  <option value="Weighment Mismatch">{t('disputeWeighmentMismatch')}</option>
                  <option value="Quality Grade Dispute">{t('disputeQualityDispute')}</option>
                  <option value="Payment Delay">{t('disputePaymentDelay')}</option>
                  <option value="Logistics Delay">{t('disputeLogisticsDelay')}</option>
                  <option value="Contract Default">{t('disputeContractDefault')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#132B23] uppercase tracking-wider mb-1">
                  {t('description')} *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('grievanceDescPlaceholder')}
                  className="w-full bg-[#F6F1E4] border border-[#17362C]/15 rounded-xl p-3.5 text-xs text-[#132B23] focus:outline-none focus:border-[#3F754A]"
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                ⚖️ {t('slaNotice')}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#17362C] hover:bg-[#254E40] text-[#D9FF55] font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer min-h-[48px]"
              >
                {t('submitGrievanceBtn')}
              </button>
            </form>
          </div>

          {/* Active Tickets List */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-black font-editorial text-[#132B23] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3F754A]" />
              <span>{t('activeFpoArbitrationTickets')}</span>
            </h3>

            <div className="space-y-3">
              {grievances.map((grv) => (
                <div
                  key={grv.id}
                  className="bg-white p-5 rounded-2xl border border-[#17362C]/10 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#3F754A]">
                      {grv.grievanceNo}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      ● {translateStatus(grv.status)}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#132B23]">{getCategoryLabel(grv.category)}</h4>
                  <p className="text-xs text-[#132B23]/70 leading-relaxed">{grv.description}</p>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                    <span>Txn: {grv.transactionId}</span>
                    <span className="flex items-center gap-1 font-semibold text-[#FF7043]">
                      <Clock className="w-3 h-3" /> {t('slaRemainingLabel', { days: grv.slaDays })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
