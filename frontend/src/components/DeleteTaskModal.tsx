import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { Task } from '@/types';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task: Task | null;
  isDeleting?: boolean;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  task,
  isDeleting = false 
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-slideUp">
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-red-500 to-pink-600 p-6">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Vazifani o'chirish</h2>
                <p className="text-red-100 text-sm">Bu amalni qaytarib bo'lmaydi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
              disabled={isDeleting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-gray-900 font-medium mb-2">
              Siz ushbu vazifani o'chirmoqchisiz:
            </p>
            <div className="bg-white p-3 rounded-lg border border-red-100">
              <p className="font-bold text-gray-900">{task.title}</p>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>Shogird: {task.assignedTo.name}</span>
                <span>•</span>
                <span>{task.car.make} {task.car.carModel}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-900 mb-1">Diqqat!</p>
                <p className="text-sm text-yellow-800">
                  Bu vazifa va unga bog'liq barcha ma'lumotlar butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                O'chirilmoqda...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                O'chirish
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
