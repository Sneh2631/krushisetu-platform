import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { voiceService } from '../services/voiceService';

interface AudioSpeechButtonProps {
  textToRead?: string;
  textToSpeak?: string;
  text?: string;
  label?: string;
  className?: string;
}

export const AudioSpeechButton: React.FC<AudioSpeechButtonProps> = ({
  textToRead,
  textToSpeak,
  text,
  label,
  className = '',
}) => {
  const finalSpeechText = textToRead || textToSpeak || text || '';
  const { language, t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = voiceService.subscribe((status) => {
      if (!status.isSpeaking && isPlaying) {
        setIsPlaying(false);
      }
    });
    return () => unsubscribe();
  }, [isPlaying]);

  // Stop speech if language changes
  useEffect(() => {
    voiceService.stopSpeaking();
    setIsPlaying(false);
    setVoiceError(null);
  }, [language]);

  const handleToggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      voiceService.stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setVoiceError(null);
    const started = voiceService.speak(
      finalSpeechText,
      language,
      () => setIsPlaying(false),
      (err) => {
        setIsPlaying(false);
        if (err === 'voice_unavailable_gu') {
          setVoiceError(t('voiceUnavailableGu'));
        } else if (err === 'voice_unavailable_hi') {
          setVoiceError(t('voiceUnavailableHi'));
        } else {
          setVoiceError(t('voiceUnavailable'));
        }
      }
    );

    if (started) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleToggleSpeak}
        title={isPlaying ? t('audioStop') : t('voiceListen')}
        aria-label={isPlaying ? t('audioStop') : t('voiceListen')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer border min-h-[38px] ${
          isPlaying
            ? 'bg-[#FF7043] text-white border-[#FF7043] shadow-md animate-pulse'
            : 'bg-white/80 hover:bg-white text-[#17362C] border-[#17362C]/15 shadow-sm'
        } ${className}`}
      >
        {isPlaying ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span>{t('audioSpeaking')}</span>
            <VolumeX className="w-3 h-3 ml-0.5 opacity-80" />
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#3F754A]" />
            <span>{label || t('voiceListen')}</span>
          </>
        )}
      </button>

      {voiceError && (
        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5 shrink-0" />
          {voiceError}
        </span>
      )}
    </div>
  );
};
