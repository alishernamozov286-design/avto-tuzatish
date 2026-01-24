import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Wrench, 
  Users, 
  Car, 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  BarChart3,
  Sparkles,
  ArrowRight,
  Star,
  MessageSquare,
  Award,
  Zap,
  Clock,
  Target,
  Menu,
  X,
  Rocket,
  Globe,
  MapPin,
  Download,
} from 'lucide-react';
import { usePublicStats } from '@/hooks/usePublicStats';
import GoogleMap from '@/components/GoogleMap';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { t } from '@/lib/transliteration';

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [language, setLanguage] = useState<'latin' | 'cyrillic'>(() => {
    // localStorage'dan tilni o'qish
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as 'latin' | 'cyrillic') || 'latin';
  });
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { data: stats, isLoading: statsLoading } = usePublicStats();
  
  // Til o'zgarganda localStorage'ga saqlash
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // PWA Install Prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    // Debug: Check if PWA is installable
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);
  
  const handleChatOpen = () => {
    const chatButton = document.querySelector('[data-ai-chat-button]') as HTMLElement;
    if (chatButton) {
      chatButton.click();
    }
  };

  const handleModalInstall = async () => {
    setIsInstalling(true);
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Ilovani o\'rnatish uchun tizimga kiring');
        setIsInstalling(false);
        setShowInstallModal(false);
        // Redirect to login
        window.location.href = '/login';
        return;
      }

      // Import install service dynamically
      const { InstallService } = await import('@/services/installService');
      
      // Check install eligibility
      const eligibility = await InstallService.checkInstallEligibility();
      
      if (!eligibility.canInstall) {
        alert(eligibility.message);
        setIsInstalling(false);
        return;
      }

      if (deferredPrompt) {
        // PWA install prompt mavjud bo'lsa
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          // Record installation in backend
          await InstallService.recordInstallation();
          setShowInstallModal(false);
          setTimeout(() => {
            setIsInstalling(false);
          }, 1000);
        } else {
          setIsInstalling(false);
        }
      } else {
        // PWA prompt mavjud emas - brauzer menyusiga yo'naltirish
        alert('Iltimos, brauzer menyusidan (⋮) "Install Mator Life" ni tanlang yoki manzil satridagi o\'rnatish ikonkasini bosing');
        setIsInstalling(false);
      }
    } catch (error: any) {
      alert(error.message || 'O\'rnatishda xatolik yuz berdi');
      setIsInstalling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 z-50 group">
              <img src="/logo.jpg" alt="Mator Life" className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 object-cover rounded-lg sm:rounded-xl shadow-lg group-hover:scale-105 transition-transform" />
              <div>
                <span className="block text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Mator Life
                </span>
                <span className="hidden sm:block text-[10px] md:text-xs text-gray-600 font-semibold">Professional Service</span>
              </div>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a href="#home" className="relative text-gray-700 hover:text-indigo-600 font-semibold transition-colors group text-sm xl:text-base">
                {t("Bosh Sahifa", language)}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#features" className="relative text-gray-700 hover:text-indigo-600 font-semibold transition-colors group text-sm xl:text-base">
                {t("Imkoniyatlar", language)}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#benefits" className="relative text-gray-700 hover:text-indigo-600 font-semibold transition-colors group text-sm xl:text-base">
                {t("Afzalliklar", language)}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#location" className="relative text-gray-700 hover:text-indigo-600 font-semibold transition-colors group text-sm xl:text-base">
                {t("Joylashuv", language)}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all group text-sm"
                >
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:rotate-12 transition-transform" />
                  <span className="font-semibold text-gray-700">{language === 'latin' ? 'Lotin' : 'Кирилл'}</span>
                </button>
                
                {showLangMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowLangMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50 animate-slide-up">
                      <button
                        onClick={() => {
                          setLanguage('latin');
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-all flex items-center space-x-3 ${
                          language === 'latin' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-xl">🇺🇿</span>
                        <span>Lotin (ABC)</span>
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('cyrillic');
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-all flex items-center space-x-3 ${
                          language === 'cyrillic' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-xl">🇺🇿</span>
                        <span>Кирилл (АБВ)</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              <Link to="/login" className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4">
                  {t("Kirish", language)}
                  <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-1.5 sm:space-x-2 z-50">
              {/* Mobile Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'latin' ? 'cyrillic' : 'latin')}
                className="p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all"
                title={language === 'latin' ? 'Кириллга ўтиш' : 'Lotinga o\'tish'}
              >
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </button>
              
              <Link to="/login" className="btn-primary btn-sm text-xs sm:text-sm py-1.5 sm:py-2 px-2.5 sm:px-3">
                {t("Kirish", language)}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed top-16 sm:top-18 md:top-20 right-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] md:h-[calc(100vh-5rem)] w-72 sm:w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden z-40 overflow-y-auto">
                <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
                  {[
                    { href: '#home', icon: Wrench, label: t('Bosh Sahifa', language), color: 'indigo' },
                    { href: '#features', icon: Shield, label: t('Imkoniyatlar', language), color: 'blue' },
                    { href: '#benefits', icon: TrendingUp, label: t('Afzalliklar', language), color: 'purple' },
                    { href: '#location', icon: MapPin, label: t('Joylashuv', language), color: 'green' }
                  ].map((item) => (
                    <a 
                      key={item.href}
                      href={item.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-${item.color}-50 hover:bg-${item.color}-100 transition-all group`}
                    >
                      <div className={`p-1.5 sm:p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform`}>
                        <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 text-${item.color}-600`} />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{item.label}</span>
                      <ArrowRight className="ml-auto h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleChatOpen();
                    }}
                    className="w-full btn-secondary btn-lg mt-3 sm:mt-4 text-xs sm:text-sm py-2.5 sm:py-3"
                  >
                    <MessageSquare className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Savol Berish
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-6 md:space-y-8 animate-slide-up">
              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm border-2 border-blue-200 rounded-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 shadow-xl text-xs sm:text-sm">
                <div className="relative">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600 animate-pulse" />
                  <div className="absolute inset-0 bg-blue-600 blur-md opacity-50"></div>
                </div>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {t("#1 Mator Life Servislari uchun", language)}
                </span>
              </div>
              
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-3 sm:mb-4 md:mb-6">
                  <span className="block text-gray-900 mb-2 sm:mb-3">{t("Servisingizni", language)}</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    {t("Boshqaring", language)}
                  </span>
                </h1>
                <div className="h-0.5 sm:h-1 w-20 sm:w-28 md:w-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto lg:mx-0"></div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed font-medium px-2 sm:px-0">
                  {t("Ustoz va shogirdlar uchun maxsus ishlab chiqilgan", language)}
                  <span className="text-gray-900 font-bold"> {t("professional boshqaruv tizimi", language)}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start px-2 sm:px-0">
                  {[
                    { icon: CheckCircle, text: t('Vazifalar', language), bgColor: 'bg-blue-100', textColor: 'text-blue-700', iconColor: 'text-blue-600' },
                    { icon: Sparkles, text: t('AI Yordamchi', language), bgColor: 'bg-indigo-100', textColor: 'text-indigo-700', iconColor: 'text-indigo-600' },
                    { icon: BarChart3, text: t('Qarz Daftarchasi', language), bgColor: 'bg-purple-100', textColor: 'text-purple-700', iconColor: 'text-purple-600' }
                  ].map((item, i) => (
                    <div key={i} className={`inline-flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 ${item.bgColor} ${item.textColor} rounded-full text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-transform`}>
                      <item.icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${item.iconColor}`} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start px-2 sm:px-0">
                <Link to="/login" className="group relative w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg sm:rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg sm:rounded-xl shadow-xl hover:scale-105 transition-all">
                    <Rocket className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {t("Boshlash", language)}
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                
                <button onClick={handleChatOpen} className="group inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-lg sm:rounded-xl shadow-xl hover:bg-blue-50 hover:scale-105 transition-all">
                  <MessageSquare className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform" />
                  {t("Savol Berish", language)}
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex -space-x-1.5 sm:-space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 sm:border-3 md:border-4 border-white shadow-lg animate-float" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="text-lg sm:text-xl md:text-2xl font-black text-gray-900">200+</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-semibold">{t("Foydalanuvchi", language)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 fill-amber-400 text-amber-400 drop-shadow-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                  <span className="ml-1 sm:ml-2 text-base sm:text-lg md:text-xl font-black text-gray-900">4.9/5</span>
                </div>
              </div>
            </div>
            
            {/* Right Stats */}
            <div className="relative animate-fade-in mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-white">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {[
                    { icon: Users, value: stats?.apprentices || 0, label: t('Shogirdlar', language), gradient: 'from-blue-500 to-indigo-600' },
                    { icon: CheckCircle, value: (stats?.tasks || 0).toLocaleString(), label: t('Vazifalar', language), gradient: 'from-green-500 to-emerald-600' },
                    { icon: Car, value: stats?.cars || 0, label: t('Avtomobillar', language), gradient: 'from-amber-500 to-orange-500' },
                    { icon: Sparkles, value: stats?.aiQuestions ? (stats.aiQuestions > 999 ? `${(stats.aiQuestions / 1000).toFixed(1)}K` : stats.aiQuestions) : 0, label: t('AI Savollar', language), gradient: 'from-red-500 to-pink-600' }
                  ].map((stat, i) => (
                    <div key={i} className={`relative group bg-gradient-to-br ${stat.gradient} p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                        <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 sm:mb-2">
                          {statsLoading ? '...' : stat.value}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white/90">{stat.label}</div>
                      </div>
                      <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-slide-up">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 text-xs sm:text-sm">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="font-bold text-blue-600">{t("Kuchli Imkoniyatlar", language)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-2">
              {t("Barcha Kerakli Vositalar", language)}
            </h2>
            <div className="h-0.5 sm:h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t("Mator Life servisini professional darajada boshqarish uchun", language)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: Users,
                title: t('Shogirdlar Boshqaruvi', language),
                description: t('Shogirdlarni qo\'shing, vazifalar bering va rivojlanishni kuzating. Har bir shogirdning yutuqlari va daromadlari real vaqtda.', language),
                gradient: 'from-blue-500 to-indigo-600'
              },
              {
                icon: Car,
                title: t('Avtomobil Bazasi', language),
                description: t('Mijozlar avtomobillarini ro\'yxatdan o\'tkazing, xizmatlar qo\'shing va ta\'mirlash tarixini batafsil saqlang.', language),
                gradient: 'from-green-500 to-emerald-600'
              },
              {
                icon: CheckCircle,
                title: t('Vazifalar Tizimi', language),
                description: t('Shogirdlarga vazifalar bering, muddatlarni belgilang va bajarilishni real vaqtda kuzating.', language),
                gradient: 'from-amber-500 to-orange-500'
              },
              {
                icon: Sparkles,
                title: t('AI Yordamchi', language),
                description: t('Sun\'iy intellekt yordamida mator muammolarini diagnostika qiling va tez javoblar oling.', language),
                gradient: 'from-red-500 to-pink-600'
              },
              {
                icon: BarChart3,
                title: t('Qarz Daftarchasi', language),
                description: t('Mijozlar va ta\'minotchilar bilan qarzlarni boshqaring, to\'lovlarni kuzating va moliyaviy holatni nazorat qiling.', language),
                gradient: 'from-purple-500 to-indigo-600'
              },
              {
                icon: Award,
                title: t('Yutuqlar Tizimi', language),
                description: t('Shogirdlar uchun yutuqlar va mukofotlar. Motivatsiyani oshiring va rivojlanishni rag\'batlantiring.', language),
                gradient: 'from-cyan-500 to-blue-600'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className={`inline-flex p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-indigo-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-slide-up">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 text-xs sm:text-sm">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              <span className="font-bold text-indigo-600">{t("Nima uchun Mator Life?", language)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-2">
              {t("Bizning Afzalliklarimiz", language)}
            </h2>
            <div className="h-0.5 sm:h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t("Ustoz va shogirdlar uchun maxsus yaratilgan professional tizim", language)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: Clock,
                stat: '80%',
                title: t('Vaqt Tejash', language),
                description: t('Vazifalar va qarzlarni avtomatik boshqarish orqali kunlik ishlarni tezlashtiring', language)
              },
              {
                icon: Zap,
                stat: '5x',
                title: t('Samaradorlik', language),
                description: t('AI yordamchi va bilimlar bazasi bilan shogirdlar samaradorligini oshiring', language)
              },
              {
                icon: Target,
                stat: '100%',
                title: t('Nazorat', language),
                description: t('Barcha jarayonlar, qarzlar va vazifalar ustidan to\'liq nazorat', language)
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-gray-100 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg sm:rounded-xl">
                      <benefit.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-indigo-600" />
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{benefit.stat}</div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-slide-up">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 text-xs sm:text-sm">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="font-bold text-green-600">{t("Bizning Joylashuvimiz", language)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-2">
              {t("Bizni Topishingiz Oson", language)}
            </h2>
            <div className="h-0.5 sm:h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t("Buxoro G'ijduvon tumanida joylashgan zamonaviy avtomobil servisi", language)}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            {/* Map */}
            <div className="relative animate-fade-in order-2 lg:order-1">
              <GoogleMap className="h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-xl sm:rounded-2xl overflow-hidden" />
            </div>
            
            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-slide-up order-1 lg:order-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-white">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{t("Aloqa Ma'lumotlari", language)}</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-2.5 md:p-3 bg-blue-100 rounded-lg sm:rounded-xl flex-shrink-0">
                      <MapPin className="h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{t("Manzil", language)}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">{t("Buxoro viloyati, G'ijduvon tumani", language)}<br />{t("UZ Daewoo service yonida", language)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-2.5 md:p-3 bg-green-100 rounded-lg sm:rounded-xl flex-shrink-0">
                      <Clock className="h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{t("Ish Vaqti", language)}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">{t("Dushanba - Shanba", language)}<br />9:00 - 21:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-2.5 md:p-3 bg-amber-100 rounded-lg sm:rounded-xl flex-shrink-0">
                      <MessageSquare className="h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{t("Telefon", language)}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">+998 91 251 36 36<br /></p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => window.open('tel:+998901234567', '_self')}
                    className="w-full btn-secondary text-xs sm:text-sm md:text-base py-2 sm:py-2.5"
                  >
                    <MessageSquare className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {t("Qo'ng'iroq Qilish", language)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="relative bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border-2 border-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-20 translate-x-20 sm:-translate-y-26 sm:translate-x-26 md:-translate-y-32 md:translate-x-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full translate-y-20 -translate-x-20 sm:translate-y-26 sm:-translate-x-26 md:translate-y-32 md:-translate-x-32 blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="font-bold text-blue-600">{t("Bugun Boshlang", language)}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 sm:mb-4 px-2">
                {t("Tayyor misiz?", language)}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                {t("Mator Life servisingizni professional darajada boshqaring. Ustoz va shogirdlar uchun maxsus ishlab chiqilgan tizim.", language)}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
                <Link to="/login" className="group relative w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative btn-primary btn-lg text-xs sm:text-sm md:text-base py-2.5 sm:py-3">
                    <Globe className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t("Tizimga Kirish", language)}
                    <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
                <button onClick={handleChatOpen} className="btn-secondary btn-lg w-full sm:w-auto text-xs sm:text-sm md:text-base py-2.5 sm:py-3">
                  <MessageSquare className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t("Savol Berish", language)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-8 sm:py-10 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <img src="/logo.jpg" alt="Mator Life" className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded-lg sm:rounded-xl shadow-lg" />
                <span className="text-base sm:text-lg md:text-xl font-bold">Mator Life</span>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-3 sm:mb-4 pr-2">
                {t("Mator Life servislari uchun zamonaviy boshqaruv tizimi", language)}
              </p>
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 fill-current" />
                ))}
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-semibold">4.9/5</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t("Mahsulot", language)}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">{t("Bosh Sahifa", language)}</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">{t("Imkoniyatlar", language)}</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">{t("Afzalliklar", language)}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t("Kompaniya", language)}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t("Biz haqimizda", language)}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("Aloqa", language)}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t("Qo'llab-quvvatlash", language)}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t("Yordam", language)}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("Maxfiylik", language)}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              &copy; 2026 Mator Life. {t("Barcha huquqlar himoyalangan.", language)}
            </p>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-400">
            
            </div>
          </div>
        </div>
      </footer>

      {/* Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-slide-up">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl">
                <img src="/logo.jpg" alt="Mator Life" className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Mator Life
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Ilovani qurilmangizga o'rnating
              </p>
              
              <div className="text-left space-y-2 sm:space-y-3 mb-4 sm:mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-700">Tezkor kirish</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-700">Offline ishlash</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-700">Push bildirishnomalar</p>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={handleModalInstall}
                  disabled={isInstalling}
                  className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  {isInstalling ? (
                    <>
                      <svg className="animate-spin mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Yuklanmoqda...
                    </>
                  ) : (
                    <>
                      <Download className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      O'rnatish
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowInstallModal(false)}
                  disabled={isInstalling}
                  className="w-full btn-secondary disabled:opacity-50 text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Keyinroq
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
