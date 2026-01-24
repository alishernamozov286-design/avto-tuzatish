import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks, useUpdateTaskStatus } from '@/hooks/useTasks';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  Play,
  Check,
  Zap,
  Target,
  Filter,
  Search,
  Car,
  AlertTriangle,
  FileText,
  Sparkles,
  XCircle,
  Circle,
  Package
} from 'lucide-react';
import { t } from '@/lib/transliteration';

const ApprenticeTasks: React.FC = () => {
  const { user } = useAuth();
  const { data: tasks, isLoading, error } = useTasks();
  const updateTaskStatus = useUpdateTaskStatus();
  
  // localStorage'dan tilni o'qish
  const language = React.useMemo<'latin' | 'cyrillic'>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as 'latin' | 'cyrillic') || 'latin';
  }, []);
  
  // Debug logging
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [carServices, setCarServices] = useState<any[]>([]);

  // Fetch car services
  useEffect(() => {
    const fetchCarServices = async () => {
      try {
        const response = await fetch('/api/car-services', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCarServices(data.services || []);
        }
      } catch (error) {
        }
    };
    fetchCarServices();
  }, [tasks]); // Refetch when tasks change

  // Shogird uchun vazifalarni filtrlash
  const allTasks = tasks?.tasks || [];
  const myTasks = allTasks.filter((task: any) => {
    // assignedTo object yoki string bo'lishi mumkin
    const assignedToId = typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;
    return assignedToId === user?.id;
  });
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const handleStartTask = async (taskId: string) => {
    setProcessingTaskId(taskId);
    try {
      await updateTaskStatus.mutateAsync({
        id: taskId,
        status: 'in-progress'
      });
    } finally {
      setProcessingTaskId(null);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    setProcessingTaskId(taskId);
    try {
      await updateTaskStatus.mutateAsync({
        id: taskId,
        status: 'completed'
      });
    } finally {
      setProcessingTaskId(null);
    }
  };

  const handleRestartService = async (serviceId: string) => {
    if (!confirm('Xizmatni qayta boshlaysizmi?')) {
      return;
    }

    try {
      const response = await fetch(`/api/car-services/${serviceId}/restart`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Refetch car services
        const servicesResponse = await fetch('/api/car-services', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (servicesResponse.ok) {
          const data = await servicesResponse.json();
          setCarServices(data.services || []);
        }
        alert('Xizmat qayta boshlandi!');
      } else {
        const error = await response.json();
        alert(error.message || 'Xatolik yuz berdi');
      }
    } catch (error) {
      alert('Xatolik yuz berdi');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('Vazifalar yuklanmoqda...', language)}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('Xatolik yuz berdi', language)}</h2>
          <p className="text-gray-600 mb-4">{t('Vazifalarni yuklashda muammo bo\'ldi', language)}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('Qayta yuklash', language)}
          </button>
        </div>
      </div>
    );
  }

  const assignedTasks = myTasks.filter((task: any) => task.status === 'assigned');
  const inProgressTasks = myTasks.filter((task: any) => task.status === 'in-progress');
  const completedTasks = myTasks.filter((task: any) => task.status === 'completed');
  const approvedTasks = myTasks.filter((task: any) => task.status === 'approved');

  // Filter tasks based on active tab
  let filteredTasks = myTasks;
  if (activeTab === 'active') {
    filteredTasks = [...assignedTasks, ...inProgressTasks];
  } else if (activeTab === 'completed') {
    filteredTasks = [...completedTasks, ...approvedTasks];
  }

  // Apply search filter
  if (searchQuery) {
    filteredTasks = filteredTasks.filter((task: any) => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.car?.make?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.car?.carModel?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Apply priority filter
  if (filterPriority !== 'all') {
    filteredTasks = filteredTasks.filter((task: any) => task.priority === filterPriority);
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Green Theme */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{t('Mening vazifalarim', language)}</h1>
              <p className="text-green-100 mt-1">
                {t('Sizga berilgan', language)} {myTasks.length} {t('ta vazifani boshqaring', language)}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            name: t('Tayinlangan', language), 
            value: assignedTasks.length, 
            icon: CheckSquare, 
            gradient: 'from-blue-500 to-cyan-500',
            iconBg: 'from-blue-100 to-cyan-100'
          },
          { 
            name: t('Jarayonda', language), 
            value: inProgressTasks.length, 
            icon: Clock, 
            gradient: 'from-yellow-500 to-orange-500',
            iconBg: 'from-yellow-100 to-orange-100'
          },
          { 
            name: t('Bajarilgan', language), 
            value: completedTasks.length, 
            icon: AlertCircle, 
            gradient: 'from-orange-500 to-red-500',
            iconBg: 'from-orange-100 to-red-100'
          },
          { 
            name: t('Tasdiqlangan', language), 
            value: approvedTasks.length, 
            icon: CheckCircle, 
            gradient: 'from-green-500 to-emerald-500',
            iconBg: 'from-green-100 to-emerald-100'
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Tabs */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('Hammasi', language)} ({myTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('Faol', language)} ({assignedTasks.length + inProgressTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'completed'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('Bajarilgan', language)} ({completedTasks.length + approvedTasks.length})
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Qidirish...', language)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white w-full sm:w-48"
              >
                <option value="all">{t('Barcha muhimlik', language)}</option>
                <option value="urgent">{t('Shoshilinch', language)}</option>
                <option value="high">{t('Yuqori', language)}</option>
                <option value="medium">{t('O\'rta', language)}</option>
                <option value="low">{t('Past', language)}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
              <Target className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('Vazifalar topilmadi', language)}</h3>
            <p className="text-gray-500">
              {searchQuery || filterPriority !== 'all' 
                ? t('Qidiruv yoki filtr bo\'yicha vazifalar topilmadi', language)
                : t('Hozirda sizga vazifa berilmagan', language)}
            </p>
          </div>
        ) : (
          filteredTasks.map((task: any, index: number) => {
            const isCompleted = task.status === 'completed' || task.status === 'approved';
            
            // Find related car service with null checks
            const relatedService = carServices.find((service: any) => {
              if (!service.car || !task.car) return false;
              const serviceCarId = typeof service.car === 'object' ? service.car._id : service.car;
              const taskCarId = typeof task.car === 'object' ? task.car._id : task.car;
              return serviceCarId === taskCarId;
            });
            
            return (
              <div 
                key={task._id}
                className={`group card p-6 hover:shadow-xl transition-all duration-300 border-l-4 ${
                  task.status === 'approved' ? 'border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent' :
                  task.status === 'completed' ? 'border-l-orange-500 bg-gradient-to-r from-orange-50/50 to-transparent' :
                  task.status === 'rejected' ? 'border-l-red-500 bg-gradient-to-r from-red-50/50 to-transparent' :
                  task.status === 'in-progress' ? 'border-l-yellow-500 bg-gradient-to-r from-yellow-50/50 to-transparent' :
                  'border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex-1 space-y-4">
                    {/* Title and Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                          {task.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">{task.description}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Priority Badge */}
                      <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'urgent' && <AlertTriangle className="h-3 w-3 mr-1.5" />}
                        {task.priority === 'high' && <AlertCircle className="h-3 w-3 mr-1.5" />}
                        {task.priority === 'medium' && <Circle className="h-3 w-3 mr-1.5" />}
                        {task.priority === 'low' && <CheckCircle className="h-3 w-3 mr-1.5" />}
                        {task.priority === 'urgent' ? t('Shoshilinch', language) : 
                         task.priority === 'high' ? t('Yuqori', language) :
                         task.priority === 'medium' ? t('O\'rta', language) : t('Past', language)}
                      </span>

                      {/* Status Badge */}
                      <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg ${getStatusColor(task.status)}`}>
                        {task.status === 'assigned' && <FileText className="h-3 w-3 mr-1.5" />}
                        {task.status === 'in-progress' && <Zap className="h-3 w-3 mr-1.5" />}
                        {task.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1.5" />}
                        {task.status === 'approved' && <Sparkles className="h-3 w-3 mr-1.5" />}
                        {task.status === 'rejected' && <XCircle className="h-3 w-3 mr-1.5" />}
                        {task.status === 'assigned' ? t('Tayinlangan', language) :
                         task.status === 'in-progress' ? t('Jarayonda', language) :
                         task.status === 'completed' ? t('Bajarilgan', language) :
                         task.status === 'approved' ? t('Tasdiqlangan', language) : t('Rad etilgan', language)}
                      </span>

                      {/* Due Date */}
                      <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        {new Date(task.dueDate).toLocaleDateString('uz-UZ')}
                      </span>

                      {/* Hours */}
                      <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                        <Clock className="h-3 w-3 mr-1.5" />
                        {isCompleted && task.actualHours ? `${task.actualHours} ${t('soat', language)}` : `${task.estimatedHours} ${t('soat', language)}`}
                      </span>

                      {/* Payment - har doim ko'rsatish */}
                      <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${
                        task.payment && task.payment > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        💰 {task.payment ? new Intl.NumberFormat('uz-UZ').format(task.payment) : '0'} {t('so\'m', language)}
                      </span>
                    </div>

                    {/* Car Info */}
                    {task.car && (
                      <div className="flex items-center space-x-3 p-4 bg-white/80 rounded-xl border border-gray-200">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {task.car.make?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            {task.car.make || 'Noma\'lum'} {task.car.carModel || ''}
                          </p>
                          <p className="text-xs text-gray-500">{task.car.licensePlate || 'Raqam yo\'q'}</p>
                        </div>
                      </div>
                    )}

                    {/* Service Status */}
                    {relatedService && (
                      <div className={`rounded-xl border-2 overflow-hidden ${
                        relatedService.status === 'completed' 
                          ? 'bg-green-50 border-green-300' 
                          : relatedService.status === 'ready-for-delivery'
                          ? 'bg-orange-50 border-orange-300'
                          : relatedService.status === 'rejected'
                          ? 'bg-red-50 border-red-300'
                          : relatedService.status === 'in-progress'
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        {relatedService.status === 'completed' ? (
                          <div className="p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <div className="p-2 bg-green-500 rounded-full">
                                <CheckCircle className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-700">{t('Qabul qilindi!', language)}</p>
                              <p className="text-sm text-green-600 mt-1">{t('Xizmat muvaffaqiyatli yakunlandi', language)}</p>
                            </div>
                          </div>
                        ) : relatedService.status === 'rejected' ? (
                          <div className="p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <div className="p-2 bg-red-500 rounded-full">
                                <XCircle className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="text-center mb-3">
                              <p className="text-lg font-bold text-red-700">{t('Rad etildi', language)}</p>
                              <p className="text-sm text-red-600 mt-1">{t('Qayta ishlash kerak', language)}</p>
                            </div>
                            {relatedService.rejectionReason && (
                              <div className="p-3 bg-red-100 border-l-4 border-red-500 rounded mb-3">
                                <p className="text-xs font-semibold text-red-900 mb-1">{t('Rad etish sababi:', language)}</p>
                                <p className="text-sm text-red-800">{relatedService.rejectionReason}</p>
                              </div>
                            )}
                            <button
                              onClick={() => handleRestartService(relatedService._id)}
                              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                              <span className="text-lg">↻</span>
                              {t('Qayta boshlash', language)}
                            </button>
                          </div>
                        ) : relatedService.status === 'ready-for-delivery' ? (
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-orange-600" />
                                <div>
                                  <p className="text-xs font-medium text-gray-600">Xizmat holati</p>
                                  <p className="text-sm font-bold text-orange-700">{t('📦 Topshirishga tayyor', language)}</p>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-orange-200 text-orange-800 text-xs font-bold rounded-full animate-pulse">
                                {t('Ustoz tekshirmoqda', language)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Package className={`h-5 w-5 ${
                                  relatedService.status === 'in-progress'
                                  ? 'text-blue-600'
                                  : 'text-gray-600'
                                }`} />
                                <div>
                                  <p className="text-xs font-medium text-gray-600">Xizmat holati</p>
                                  <p className={`text-sm font-bold ${
                                    relatedService.status === 'in-progress'
                                    ? 'text-blue-700'
                                    : 'text-gray-700'
                                  }`}>
                                    {relatedService.status === 'in-progress' ? t('⚙ Jarayonda', language) : t('⏳ Kutilmoqda', language)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes and Rejection Reason */}
                    {task.notes && (
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <strong className="font-semibold">Izoh:</strong> {task.notes}
                        </p>
                      </div>
                    )}
                    {task.rejectionReason && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <p className="text-sm text-red-900">
                          <strong className="font-semibold">Rad etish sababi:</strong> {task.rejectionReason}
                        </p>
                      </div>
                    )}
                    {isCompleted && task.completedAt && (
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Bajarildi: {new Date(task.completedAt).toLocaleDateString('uz-UZ', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex lg:flex-col gap-3">
                    {task.status === 'assigned' && (
                      <button 
                        onClick={() => handleStartTask(task._id)}
                        disabled={processingTaskId === task._id}
                        className="flex-1 lg:flex-none btn bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {processingTaskId === task._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Yuklanmoqda...</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            <span>{t('Boshlash', language)}</span>
                          </>
                        )}
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <button 
                        onClick={() => handleCompleteTask(task._id)}
                        disabled={processingTaskId === task._id}
                        className="flex-1 lg:flex-none btn bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {processingTaskId === task._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Yuklanmoqda...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>{t('Tugatish', language)}</span>
                          </>
                        )}
                      </button>
                    )}
                    {task.status === 'rejected' && relatedService && (
                      <button 
                        onClick={() => handleRestartService(relatedService._id)}
                        className="flex-1 lg:flex-none btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <span className="text-lg">↻</span>
                        <span>Qayta boshlash</span>
                      </button>
                    )}
                    {task.status === 'approved' && (
                      <div className="flex items-center justify-center px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {t('Tasdiqlangan', language)}
                      </div>
                    )}
                    {task.status === 'completed' && (
                      <div className="flex items-center justify-center px-6 py-3 bg-orange-100 text-orange-700 rounded-lg font-semibold">
                        <Clock className="h-5 w-5 mr-2" />
                        {t('Kutilmoqda', language)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApprenticeTasks;