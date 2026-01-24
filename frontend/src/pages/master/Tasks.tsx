import React, { useState } from 'react';
import { useTasks, useDeleteTask, useApproveTask } from '@/hooks/useTasks';
import CreateTaskModal from '@/components/CreateTaskModal';
import EditTaskModal from '@/components/EditTaskModal';
import ViewTaskModal from '@/components/ViewTaskModal';
import DeleteTaskModal from '@/components/DeleteTaskModal';
import { Task } from '@/types';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Car,
  Calendar,
  Search,
  Filter,
  Award,
  Zap,
  X,
  DollarSign
} from 'lucide-react';

const MasterTasks: React.FC = () => {
  const { data: tasks, isLoading } = useTasks();
  const deleteTaskMutation = useDeleteTask();
  const approveTaskMutation = useApproveTask();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md';
      case 'high': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md';
      case 'medium': return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <CheckSquare className="h-3.5 w-3.5" />;
      case 'in-progress': return <Clock className="h-3.5 w-3.5" />;
      case 'completed': return <AlertCircle className="h-3.5 w-3.5" />;
      case 'approved': return <CheckCircle className="h-3.5 w-3.5" />;
      case 'rejected': return <AlertCircle className="h-3.5 w-3.5" />;
      default: return <CheckSquare className="h-3.5 w-3.5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return 'Tayinlangan';
      case 'in-progress': return 'Jarayonda';
      case 'completed': return 'Bajarilgan';
      case 'approved': return 'Tasdiqlangan';
      case 'rejected': return 'Rad etilgan';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Shoshilinch';
      case 'high': return 'Yuqori';
      case 'medium': return 'O\'rta';
      case 'low': return 'Past';
      default: return priority;
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks?.tasks 
    : tasks?.tasks?.filter((task: any) => task.status === filter);

  const searchedTasks = filteredTasks?.filter((task: any) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleApproveTask = (task: Task) => {
    setSelectedTask(task);
    setShowApprovalModal(true);
  };

  const confirmApproval = async (approved: boolean) => {
    if (selectedTask) {
      await approveTaskMutation.mutateAsync({
        id: selectedTask._id,
        approved,
        rejectionReason: approved ? undefined : rejectionReason
      });
      setShowApprovalModal(false);
      setSelectedTask(null);
      setRejectionReason('');
    }
  };

  const confirmDelete = async () => {
    if (selectedTask) {
      await deleteTaskMutation.mutateAsync(selectedTask._id);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 -m-8 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Vazifalar
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {tasks?.tasks?.length || 0} ta vazifa
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary group"
          >
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <span>Yangi</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stats-card-primary animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <CheckSquare className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">
                  {tasks?.tasks?.filter((task: any) => task.status === 'assigned').length || 0}
                </p>
                <p className="text-sm text-blue-100 mt-1">+12% bu hafta</p>
              </div>
            </div>
            <p className="text-white/90 font-semibold">Tayinlangan</p>
          </div>

          <div className="stats-card-warning animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">
                  {tasks?.tasks?.filter((task: any) => task.status === 'in-progress').length || 0}
                </p>
                <p className="text-sm text-amber-100 mt-1">Faol</p>
              </div>
            </div>
            <p className="text-white/90 font-semibold">Jarayonda</p>
          </div>

          <div className="card p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">
                  {tasks?.tasks?.filter((task: any) => task.status === 'completed').length || 0}
                </p>
                <p className="text-sm text-orange-100 mt-1">Tekshirish kerak</p>
              </div>
            </div>
            <p className="text-white/90 font-semibold">Kutilmoqda</p>
          </div>

          <div className="stats-card-success animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">
                  {tasks?.tasks?.filter((task: any) => task.status === 'approved').length || 0}
                </p>
                <p className="text-sm text-green-100 mt-1">+18% bu hafta</p>
              </div>
            </div>
            <p className="text-white/90 font-semibold">Tasdiqlangan</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card-gradient p-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Vazifa, shogird yoki avtomobil bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12 text-base"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-gray-600 font-semibold mr-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filter:</span>
            </div>
            {[
              { value: 'all', label: 'Barchasi', count: tasks?.tasks?.length || 0, color: 'bg-gray-600' },
              { value: 'assigned', label: 'Tayinlangan', count: tasks?.tasks?.filter((t: any) => t.status === 'assigned').length || 0, color: 'bg-blue-600' },
              { value: 'in-progress', label: 'Jarayonda', count: tasks?.tasks?.filter((t: any) => t.status === 'in-progress').length || 0, color: 'bg-amber-600' },
              { value: 'completed', label: 'Kutilmoqda', count: tasks?.tasks?.filter((t: any) => t.status === 'completed').length || 0, color: 'bg-orange-600' },
              { value: 'approved', label: 'Tasdiqlangan', count: tasks?.tasks?.filter((t: any) => t.status === 'approved').length || 0, color: 'bg-green-600' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                  filter === tab.value
                    ? `${tab.color} text-white shadow-md scale-105`
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
                }`}
              >
                {tab.label}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  filter === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid - 3 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchedTasks?.map((task: any) => (
            <div
              key={task._id}
              className="card hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Task Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1 line-clamp-2">
                    {task.title}
                  </h3>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${getPriorityColor(task.priority)} flex items-center gap-1 shrink-0`}>
                    <Zap className="h-3 w-3" />
                    {getPriorityText(task.priority)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                    <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {task.assignedTo.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm truncate">{task.assignedTo.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-purple-50 px-2.5 py-1.5 rounded-lg">
                    <Car className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    <span className="font-semibold text-gray-900 text-sm truncate">{task.car.make} {task.car.model}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold border ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                    {getStatusText(task.status)}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{task.estimatedHours}s</span>
                  </div>
                  {task.payment && task.payment > 0 && (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-medium">{task.payment.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">{new Date(task.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>
              </div>

              {/* Task Footer */}
              <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleViewTask(task)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" 
                    title="Ko'rish"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditTask(task)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Tahrirlash"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {task.status === 'completed' && (
                    <button 
                      onClick={() => handleApproveTask(task)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                      title="Tasdiqlash/Rad etish"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteTask(task)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {task.status === 'approved' && (
                  <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {searchedTasks?.length === 0 && (
          <div className="card-gradient p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckSquare className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Vazifalar topilmadi</h3>
              <p className="text-gray-600 mb-8">Birinchi vazifani yaratish uchun quyidagi tugmani bosing</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary btn-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Vazifa yaratish
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      {/* View Task Modal */}
      <ViewTaskModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      {/* Delete Task Modal */}
      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={confirmDelete}
        task={selectedTask}
        isDeleting={deleteTaskMutation.isPending}
      />

      {/* Task Approval Modal */}
      {showApprovalModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Vazifani tasdiqlash</h3>
                </div>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-white/80 hover:text-white p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">{selectedTask.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{selectedTask.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Shogird:</span>
                  <span>{selectedTask.assignedTo.name}</span>
                </div>
                {selectedTask.payment && selectedTask.payment > 0 && (
                  <div className="flex items-center gap-2 text-sm mt-2 bg-green-50 p-2 rounded-lg">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-800">
                      To'lov: {selectedTask.payment.toLocaleString()} so'm
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Rad etish sababi (ixtiyoriy):
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Agar rad etsangiz, sababini yozing..."
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => confirmApproval(false)}
                disabled={approveTaskMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {approveTaskMutation.isPending ? 'Saqlanmoqda...' : 'Rad etish'}
              </button>
              <button
                onClick={() => confirmApproval(true)}
                disabled={approveTaskMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {approveTaskMutation.isPending ? 'Saqlanmoqda...' : 'Tasdiqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterTasks;
