import React, { useState } from 'react';
import { useCars } from '@/hooks/useCars';
import CreateCarModal from '@/components/CreateCarModal';
import ViewCarModal from '@/components/ViewCarModal';
import EditCarStepModal from '@/components/EditCarStepModal';
import DeleteCarModal from '@/components/DeleteCarModal';
import { Plus, Search, Car as CarIcon, Eye, Edit, Trash2, Phone, Calendar, Package2, DollarSign, Filter } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Car } from '@/types';
import { t } from '@/lib/transliteration';

const Cars: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // localStorage'dan tilni o'qish
  const language = React.useMemo<'latin' | 'cyrillic'>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as 'latin' | 'cyrillic') || 'latin';
  }, []);

  const { data: carsData, isLoading } = useCars({ 
    search: searchTerm, 
    status: statusFilter 
  });

  const cars = (carsData as any)?.cars || [];

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setIsViewModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setIsEditModalOpen(true);
  };

  const handleDeleteCar = (car: Car) => {
    setSelectedCar(car);
    setIsDeleteModalOpen(true);
  };

  const handleEditFromView = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteFromView = () => {
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCar(null);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': 
        return { 
          bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', 
          text: 'text-amber-700',
          border: 'border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'in-progress': 
        return { 
          bg: 'bg-gradient-to-r from-blue-50 to-cyan-50', 
          text: 'text-blue-700',
          border: 'border-blue-200',
          dot: 'bg-blue-500'
        };
      case 'completed': 
        return { 
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50', 
          text: 'text-green-700',
          border: 'border-green-200',
          dot: 'bg-green-500'
        };
      case 'delivered': 
        return { 
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50', 
          text: 'text-gray-700',
          border: 'border-gray-200',
          dot: 'bg-gray-500'
        };
      default: 
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-700',
          border: 'border-gray-200',
          dot: 'bg-gray-500'
        };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('Kutilmoqda', language);
      case 'in-progress': return t('Jarayonda', language);
      case 'completed': return t('Tayyor', language);
      case 'delivered': return t('Topshirilgan', language);
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 -m-6 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header - Modern & Elegant */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="bg-white/20 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                <CarIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 tracking-tight">{t("Avtomobillar", language)}</h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                  {t("Avtomobillar va ularning ta'mirlash holatini boshqaring", language)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="group relative bg-white hover:bg-blue-50 text-blue-600 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm sm:text-base">
                <span className="hidden sm:inline">{t("Yangi mashina", language)}</span>
                <span className="sm:hidden">{t("Qo'shish", language)}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Filters - Modern Design */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("Mashina, egasi yoki raqam bo'yicha qidirish...", language)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto pl-10 sm:pl-12 pr-8 sm:pr-10 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium appearance-none cursor-pointer sm:min-w-[200px]"
              >
                <option value="">{t("Barcha holatlar", language)}</option>
                <option value="pending">{t("Kutilmoqda", language)}</option>
                <option value="in-progress">{t("Jarayonda", language)}</option>
                <option value="completed">{t("Tayyor", language)}</option>
                <option value="delivered">{t("Topshirilgan", language)}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-blue-600 absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 sm:mt-6 text-gray-600 font-medium text-sm sm:text-base">{t("Mashinalar yuklanmoqda...", language)}</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CarIcon className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{t("Mashinalar topilmadi", language)}</h3>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-4 sm:px-0">
                {t("Tizimga birinchi mashinani qo'shishdan boshlang va ta'mirlash jarayonini boshqaring.", language)}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {t("Birinchi mashinani qo'shish", language)}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cars.map((car: Car) => {
              const statusConfig = getStatusConfig(car.status);
              
              // Narxni hisoblash (fallback sifatida)
              const partsTotal = (car.parts || []).reduce((sum, part) => sum + (part.quantity * part.price), 0);
              const serviceItemsTotal = ((car as any).serviceItems || []).reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
              const calculatedTotal = partsTotal + serviceItemsTotal;
              
              // Backend dan kelgan totalEstimate ni ishlatish, agar mavjud bo'lsa
              const displayTotal = car.totalEstimate || calculatedTotal;
              
              return (
                <div
                  key={car._id}
                  className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
                >
                  {/* Status Badge - Top Right */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                    <div className={`${statusConfig.bg} ${statusConfig.border} border px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center space-x-1.5 sm:space-x-2 shadow-sm`}>
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusConfig.dot} animate-pulse`}></div>
                      <span className={`text-xs font-semibold ${statusConfig.text}`}>
                        {getStatusText(car.status)}
                      </span>
                    </div>
                  </div>

                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-4 sm:p-6 pb-6 sm:pb-8">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="bg-white/20 backdrop-blur-xl p-2.5 sm:p-3 rounded-xl shadow-lg">
                        <CarIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
                          {car.make} {car.carModel}
                        </h3>
                        <div className="flex items-center space-x-2 sm:space-x-3 text-blue-100">
                          <div className="flex items-center space-x-1 sm:space-x-1.5">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm font-medium">{car.year}</span>
                          </div>
                          <span className="text-blue-300 text-xs sm:text-sm">•</span>
                          <span className="text-xs sm:text-sm font-bold tracking-wider truncate">{car.licensePlate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    {/* Owner Info */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-3 sm:p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t("Egasi", language)}</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-gray-900 mb-2 truncate">{car.ownerName}</p>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium truncate">{car.ownerPhone}</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 border border-purple-100">
                        <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1 sm:mb-2">
                          <Package2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-600 uppercase">{t("Qismlar", language)}</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-bold text-purple-900">{car.parts.length}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 border border-green-100">
                        <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1 sm:mb-2">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                          <span className="text-xs font-semibold text-green-600 uppercase">{t("Narx", language)}</span>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-green-900 truncate">
                          {displayTotal > 0 ? formatCurrency(displayTotal) : t("0 so'm", language)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer - Action Buttons */}
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleViewCar(car)}
                        className="flex-1 flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 font-medium group"
                        title={t("Ko'rish", language)}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm">{t("Ko'rish", language)}</span>
                      </button>
                      <button 
                        onClick={() => handleEditCar(car)}
                        className="p-2 sm:p-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all duration-200"
                        title={t("Tahrirlash", language)}
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCar(car)}
                        className="p-2 sm:p-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all duration-200"
                        title={t("O'chirish", language)}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCarModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      {selectedCar && (
        <>
          <ViewCarModal
            isOpen={isViewModalOpen}
            onClose={closeAllModals}
            car={selectedCar}
            onEdit={handleEditFromView}
            onDelete={handleDeleteFromView}
          />
          
          <EditCarStepModal
            isOpen={isEditModalOpen}
            onClose={closeAllModals}
            car={selectedCar}
          />
          
          <DeleteCarModal
            isOpen={isDeleteModalOpen}
            onClose={closeAllModals}
            car={selectedCar}
          />
        </>
      )}
    </div>
  );
};

export default Cars;