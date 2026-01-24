import React from 'react';
import { X, User, Car, Calendar, Clock, Zap, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Task } from '@/types';

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'from-red-500 to-pink-600';
      case 'high': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-400 to-orange-400';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`relative overflow-hidden rounded-t-2xl bg-gradient-to-r ${getPriorityColor(task.priority)} p-6`}>
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-lg ${getStatusColor(task.status)} border`}>
                  {getStatusText(task.status)}
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {getPriorityText(task.priority)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{task.title}</h2>
              <p className="text-white/90 text-sm">Vazifa tafsilotlari</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">Tavsif</h3>
            </div>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{task.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assigned To */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Shogird</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {task.assignedTo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{task.assignedTo.name}</p>
                  <p className="text-xs text-gray-600">@{task.assignedTo.username}</p>
                </div>
              </div>
            </div>

            {/* Car */}
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">Avtomobil</span>
              </div>
              <p className="font-bold text-gray-900">{task.car.make} {task.car.carModel}</p>
              <p className="text-sm text-gray-600">{task.car.licensePlate}</p>
              <p className="text-xs text-gray-500 mt-1">{task.car.ownerName}</p>
            </div>

            {/* Estimated Hours */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-900">Taxminiy vaqt</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{task.estimatedHours} soat</p>
              {task.actualHours && (
                <p className="text-sm text-gray-600 mt-1">Haqiqiy: {task.actualHours} soat</p>
              )}
            </div>

            {/* Due Date */}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-900">Muddat</span>
              </div>
              <p className="font-bold text-gray-900">
                {new Date(task.dueDate).toLocaleDateString('uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Yaratilgan: {new Date(task.createdAt).toLocaleDateString('uz-UZ')}
              </p>
            </div>
          </div>

          {/* Notes */}
          {task.notes && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-900">Izohlar</span>
              </div>
              <p className="text-gray-700">{task.notes}</p>
            </div>
          )}

          {/* Rejection Reason */}
          {task.status === 'rejected' && task.rejectionReason && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-red-900">Rad etilish sababi</span>
              </div>
              <p className="text-gray-700">{task.rejectionReason}</p>
            </div>
          )}

          {/* Completion Info */}
          {(task.completedAt || task.approvedAt) && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-900">Holat ma'lumotlari</span>
              </div>
              {task.completedAt && (
                <p className="text-sm text-gray-700">
                  Bajarilgan: {new Date(task.completedAt).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
              {task.approvedAt && (
                <p className="text-sm text-gray-700 mt-1">
                  Tasdiqlangan: {new Date(task.approvedAt).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-200"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
