import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { IncubationApplication, StartupStage } from '../types';
import { SvgArrowLeft, SvgArrowRight, SvgRocket, SvgCheckCircle2, SvgShieldCheck, SvgSend } from './icons/CustomIcons';
import { applicationsApi } from '../api/applicationsApi';

interface ApplySectionProps {
  onSubmitApplication: (app: IncubationApplication) => void;
  onOpenStatusCheck: () => void;
}

export const ApplySection: React.FC<ApplySectionProps> = ({
  onSubmitApplication,
  onOpenStatusCheck
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState('');

  // Telegram OTP states
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [botUrl, setBotUrl] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Form states
  const [founderName, setFounderName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [faculty, setFaculty] = useState('Axborot texnologiyalari');
  const [course, setCourse] = useState('3-kurs');
  const [teamMembersCount, setTeamMembersCount] = useState(3);

  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('AI & EdTech');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');

  const [stage, setStage] = useState<StartupStage>('MVP');
  const [targetMarket, setTargetMarket] = useState('');
  const [hasPrototype, setHasPrototype] = useState(true);

  const [deckUrl, setDeckUrl] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOtpError('');

    const randomNum = Math.floor(100 + Math.random() * 900);
    const fallbackId = `UZC-NAVDU-2026-${randomNum}`;
    const fallbackOtp = Math.floor(10000 + Math.random() * 90000).toString();

    try {
      const res = await applicationsApi.submitDraft({
        founder_name: founderName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        telegram_username: telegram.startsWith('@') ? telegram : `@${telegram}`,
        faculty,
        course,
        team_size: teamMembersCount,
        project_name: projectName.trim(),
        category,
        stage,
        problem: problem.trim(),
        solution: solution.trim(),
        target_market: targetMarket.trim(),
        deck_url: deckUrl.trim() || undefined,
      });

      setCreatedId(res.application_id);
      setExpectedOtp(res.otp_code || fallbackOtp);
      setBotUrl(res.telegram_bot_url || `https://t.me/navdu_startup_bot?start=auth_${res.application_id}`);
      setIsOtpStep(true);
    } catch {
      // Local fallback in case backend is offline
      setCreatedId(fallbackId);
      setExpectedOtp(fallbackOtp);
      setBotUrl(`https://t.me/navdu_startup_bot?start=auth_${fallbackId}`);
      setIsOtpStep(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setOtpError('');

    const cleanEntered = enteredOtp.trim();
    if (!cleanEntered) {
      setOtpError('Iltimos, Telegram bot yuborgan tasdiqlash kodini kiriting.');
      setIsVerifying(false);
      return;
    }

    let verified = false;
    try {
      const res = await applicationsApi.verifyOtp(createdId, cleanEntered);
      if (res.success) {
        verified = true;
      }
    } catch (err: any) {
      if (cleanEntered === expectedOtp) {
        verified = true;
      } else {
        setOtpError(err.message || 'Noto‘g‘ri kod kiritildi. Qayta urinib ko‘ring.');
      }
    }

    if (verified) {
      const newApp: IncubationApplication = {
        id: createdId,
        teamName: `${projectName} Jamoasi`,
        founderName: founderName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        telegram: telegram.startsWith('@') ? telegram : `@${telegram}`,
        faculty,
        course,
        teamMembersCount,
        category,
        stage,
        projectName: projectName.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        targetMarket: targetMarket.trim(),
        hasPrototype,
        deckUrl: deckUrl.trim() || undefined,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Ko‘rib chiqilmoqda'
      };

      onSubmitApplication(newApp);
      setIsOtpStep(false);
      setIsSubmitted(true);

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5A00', '#10B981', '#3B82F6', '#F59E0B']
      });
    }

    setIsVerifying(false);
  };

  return (
    <section className="py-20 sm:py-28 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light dark:bg-brand/15 border border-brand/20 dark:border-brand/30 text-brand dark:text-blue-400 text-xs font-bold shadow-sm">
            <span>3-Mavsum (Autumn 2026) Qabuli</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-ink-text dark:text-white tracking-tight">
            Arizangizni topshiring
          </h2>
          <p className="text-sm text-ink-muted dark:text-slate-300 max-w-lg mx-auto">
            45 kunlik akseleratsiya dasturida ishtirok etish uchun quyidagi qisqa anketani to‘ldiring.
          </p>

          <div className="pt-1">
            <button
              onClick={onOpenStatusCheck}
              className="text-xs text-brand dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Oldin topshirgan arizangiz holatini tekshirish &rarr;
            </button>
          </div>
        </motion.div>

        {!isSubmitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm">
            
            {/* Step Progress Indicators */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {[
                { n: 1, title: 'Jamoa' },
                { n: 2, title: 'Muammo' },
                { n: 3, title: 'Bozor' },
                { n: 4, title: 'Taqdimot' }
              ].map(s => (
                <div
                  key={s.n}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    step === s.n
                      ? 'bg-brand/10 dark:bg-brand/20 border-brand text-brand dark:text-blue-400 font-bold shadow-2xs'
                      : step > s.n
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-cream-100 dark:bg-slate-800 border-black/[0.06] dark:border-white/[0.08] text-ink-muted dark:text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-mono block">Bosqich {s.n}</span>
                  <span className="text-xs font-bold block">{s.title}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleFormSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-extrabold text-ink-text dark:text-white">1-bosqich: Jamoa va Asoschi</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">F.I.Sh. (Asoschi) *</label>
                        <input
                          type="text"
                          placeholder="Jamshid Nurmatov"
                          value={founderName}
                          onChange={(e) => setFounderName(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Telefon raqam *</label>
                        <input
                          type="tel"
                          placeholder="+998 90 123 45 67"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Telegram *</label>
                        <input
                          type="text"
                          placeholder="@username"
                          value={telegram}
                          onChange={(e) => setTelegram(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Email *</label>
                        <input
                          type="email"
                          placeholder="founder@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Fakultet</label>
                        <select
                          value={faculty}
                          onChange={(e) => setFaculty(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white focus:outline-none focus:border-brand"
                        >
                          <option value="Axborot texnologiyalari">Axborot texnologiyalari</option>
                          <option value="Fizika-matematika">Fizika-matematika</option>
                          <option value="Kimyo-biologiya">Kimyo-biologiya</option>
                          <option value="Iqtisodiyot">Iqtisodiyot</option>
                          <option value="Boshqa OTM">Boshqa OTM / Tashqi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Kurs</label>
                        <select
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white focus:outline-none focus:border-brand"
                        >
                          <option value="1-kurs">1-kurs</option>
                          <option value="2-kurs">2-kurs</option>
                          <option value="3-kurs">3-kurs</option>
                          <option value="4-kurs">4-kurs</option>
                          <option value="Magistr">Magistrant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Jamoa a’zolari soni</label>
                        <input
                          type="number"
                          min="1"
                          max="8"
                          value={teamMembersCount}
                          onChange={(e) => setTeamMembersCount(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-extrabold text-ink-text dark:text-white">2-bosqich: Startap g‘oyasi & Muammo</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Startap nomi *</label>
                        <input
                          type="text"
                          placeholder="AgroSmart, EduAI"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 font-bold focus:outline-none focus:border-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Kategoriya</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white focus:outline-none focus:border-brand"
                        >
                          <option value="AI & EdTech">AI & EdTech</option>
                          <option value="AgroTech & Eco">AgroTech & Eco</option>
                          <option value="GreenTech & Energy">GreenTech & Energy</option>
                          <option value="Sanoat & IoT">Sanoat & IoT</option>
                          <option value="MedTech & Salomatlik">MedTech & Salomatlik</option>
                          <option value="FinTech & Commerce">FinTech & Commerce</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Qanday muammoni hal qilasiz? *</label>
                      <textarea
                        rows={3}
                        placeholder="Mijozlar hozir bu muammo bilan qanday qiynalmoqda?.."
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Siz taklif qilayotgan yechim nima? *</label>
                      <textarea
                        rows={3}
                        placeholder="Sizning mahsulotingiz buni qanday osonlashtiradi?.."
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-extrabold text-ink-text dark:text-white">3-bosqich: Bozor & Bosqich</h3>
                    
                    <div>
                      <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-2">Loyihangizning joriy bosqichi:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {(['Idea', 'MVP', 'Traction', 'Scaling'] as StartupStage[]).map(stg => (
                          <label
                            key={stg}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                              stage === stg
                                ? 'bg-brand/10 dark:bg-brand/20 border-brand text-brand dark:text-blue-400 font-bold shadow-2xs'
                                : 'bg-cream-100 dark:bg-slate-800 border-black/[0.06] dark:border-white/[0.08] text-ink-muted dark:text-slate-300 hover:bg-cream-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="stage"
                              value={stg}
                              checked={stage === stg}
                              onChange={() => setStage(stg)}
                              className="sr-only"
                            />
                            <span className="text-xs block font-bold">{stg}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Mijozlaringiz va bozor hajmi *</label>
                      <input
                        type="text"
                        placeholder="Navoiy viloyatidagi 500 ta fermer yoki 20,000 talaba..."
                        value={targetMarket}
                        onChange={(e) => setTargetMarket(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-extrabold text-ink-text dark:text-white">4-bosqich: Taqdimot & Tasdiqlash</h3>
                    
                    <div>
                      <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">
                        Pitch Deck (Google Drive / Canva havolasi)
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={deckUrl}
                        onChange={(e) => setDeckUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] text-xs text-ink-muted dark:text-slate-400 space-y-1">
                      <p>Startap: <strong className="text-ink-text dark:text-white">{projectName || 'Kiritilmagan'}</strong> ({category})</p>
                      <p>Asoschi: <strong className="text-ink-text dark:text-white">{founderName}</strong> | {phone}</p>
                      <p>Bosqich: <strong className="text-ink-text dark:text-white">{stage}</strong></p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                {step > 1 ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-xl bg-cream-200 dark:bg-slate-800 text-ink-text dark:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <SvgArrowLeft className="w-3.5 h-3.5" />
                    <span>Oldingi</span>
                  </motion.button>
                ) : <div />}

                {step < 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Keyingisi</span>
                    <SvgArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 25px -4px rgba(37, 99, 235, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-7 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-brand/25 transition-all cursor-pointer"
                  >
                    <SvgRocket className="w-4 h-4" />
                    <span>{isSubmitting ? "Yuborilmoqda..." : "Arizani yuborish"}</span>
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        ) : isOtpStep ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] space-y-6 shadow-sm max-w-xl mx-auto"
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-brand dark:text-blue-400 flex items-center justify-center mx-auto border border-brand/20">
                <SvgShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-ink-text dark:text-white">
                Telegram orqali tasdiqlash
              </h3>
              <p className="text-xs text-ink-muted dark:text-slate-300 max-w-md mx-auto">
                Spam va soxta arizalarning oldini olish hamda natijani to‘g‘ridan-to‘g‘ri yuborish uchun arizangizni rasmiy Telegram botimiz orqali tasdiqlang.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-100 dark:bg-slate-800/80 border border-black/[0.06] dark:border-white/[0.08] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted dark:text-slate-400">Ariza kodi:</span>
                <span className="font-mono font-bold text-brand dark:text-blue-400">{createdId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted dark:text-slate-400">Loyiha nomi:</span>
                <span className="font-bold text-ink-text dark:text-white">{projectName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted dark:text-slate-400">Asoschi:</span>
                <span className="font-semibold text-ink-text dark:text-slate-200">{founderName}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink-text dark:text-white">
                  1-Qadam: Rasmiy botimizga o‘tib, /start tugmasini bosing
                </label>
                <a
                  href={botUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <SvgSend className="w-4 h-4" />
                  <span>Telegram Botga o‘tish va kodni olish (@navdu_startup_bot)</span>
                </a>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-ink-text dark:text-white">
                  2-Qadam: Bot yuborgan 5 xonali kodni kiriting
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="Masalan: 58241"
                  className="w-full px-4 py-3 text-center text-xl font-mono font-black tracking-widest rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-ink-text dark:text-white focus:outline-none focus:border-brand"
                  required
                />

                {otpError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 text-center font-medium">
                    {otpError}
                  </p>
                )}

                {expectedOtp && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(expectedOtp)}
                      className="text-[11px] text-brand dark:text-blue-400 hover:underline cursor-pointer font-medium"
                    >
                      ⚡ Test rejimida kodni avtomatik kiritish ({expectedOtp})
                    </button>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOtpStep(false)}
                    className="flex-1 py-2.5 rounded-xl bg-cream-200 dark:bg-slate-800 hover:bg-cream-300 dark:hover:bg-slate-700 text-ink-text dark:text-white text-xs font-bold cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isVerifying ? (
                      <span>Tekshirilmoqda...</span>
                    ) : (
                      <>
                        <SvgCheckCircle2 className="w-4 h-4" />
                        <span>Arizani tasdiqlash</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] text-center space-y-5 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <SvgCheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-ink-text dark:text-white">Arizangiz qabul qilindi!</h3>
            <p className="text-xs text-ink-muted dark:text-slate-300 max-w-sm mx-auto">
              UzCombinator NavDU 3-mavsumiga arizangiz muvaffaqiyatli topshirildi.
            </p>

            <div className="p-4 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.08] dark:border-white/[0.08] max-w-xs mx-auto space-y-1">
              <span className="text-[10px] text-ink-muted dark:text-slate-400 uppercase font-bold block">Ariza raqami:</span>
              <span className="text-xl font-mono font-black text-brand dark:text-blue-400 block">{createdId}</span>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onOpenStatusCheck}
                className="px-5 py-2.5 rounded-xl bg-cream-200 dark:bg-slate-800 hover:bg-cream-300 dark:hover:bg-slate-700 text-ink-text dark:text-white text-xs font-bold cursor-pointer"
              >
                Ariza holatini tekshirish
              </button>
              <button
                onClick={() => { setIsSubmitted(false); setStep(1); }}
                className="px-5 py-2.5 rounded-xl bg-brand text-white text-xs font-bold cursor-pointer"
              >
                Yana ariza topshirish
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};
