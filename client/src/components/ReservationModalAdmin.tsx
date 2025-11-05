import { useState, useEffect } from 'react';
import { X, Calendar, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from '../config/api';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReservationModal({ isOpen, onClose, onSuccess }: ReservationModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'service' | 'date' | 'time' | 'success'>('service');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [selectedService, setSelectedService] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // Refresh times when selectedService changes and date is already selected
  useEffect(() => {
    if (selectedDate && selectedService && step === 'time') {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      setIsLoadingTimes(true);
      fetch(API_ENDPOINTS.RESERVATIONS.GET_BY_DATE(formattedDate, selectedService))
        .then(response => response.json())
        .then(data => {
          if (data.success && data.reservations) {
            const times = data.reservations.map((r: any) => {
              const date = new Date(r.reservation_date);
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              return `${hours}:${minutes}`;
            });
            setReservedTimes(times);
          } else {
            setReservedTimes([]);
          }
        })
        .catch(error => {
          console.error('Error fetching reserved times:', error);
          setReservedTimes([]);
        })
        .finally(() => {
          setIsLoadingTimes(false);
        });
    }
  }, [selectedService, selectedDate, step]);

  if (!isOpen) return null;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNext = async () => {
    if (step === 'service' && selectedService) {
      setStep('date');
    } else if (step === 'date' && selectedDate) {
      setStep('time');
    } else if (step === 'time') {
      // Automatically submit when time is selected
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (step === 'date') {
      setStep('service');
    } else if (step === 'time') {
      setStep('date');
    }
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!selectedDate) {
      setError(t('reservation.selectDateRequired'));
      return;
    }

    // Prevent submission if selected time is in the past
    {
      const [h, m] = selectedTime.split(':');
      const candidate = new Date(selectedDate);
      candidate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
      if (candidate.getTime() < Date.now()) {
        setError(t('reservation.selectDateRequired'));
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Format date and time in local timezone (Lithuania)
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const reservationDateTime = `${formattedDate} ${selectedTime}:00`;

      // Service text
      const serviceText = services.find(s => s.id === selectedService)?.label || '';

      // Send minimal data for admin reservations (name and phone are set to generic values)
      const response = await fetch(API_ENDPOINTS.RESERVATIONS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Rezervuota',
          email: 'rezervuota@gmail.com',
          phone: '00000000',
          reservation_date: reservationDateTime,
          service_type: selectedService,
          additional_info: serviceText
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError(data.message || t('reservation.timeAlreadyReserved'));
        } else {
          setError(data.message || t('reservation.error'));
        }
        return;
      }

      if (data.success) {
        setStep('success');
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 100);
        }
      } else {
        setError(data.message || t('reservation.error'));
      }
    } catch (err) {
      setError(t('reservation.errorConnectingToServer'));
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('service');
    setSelectedDate(null);
    setSelectedTime('11:00');
    setSelectedService('');
    setReservedTimes([]);
    setError('');
    onClose();
  };

  const services = [
    { 
      id: 'ratu_balansavimas', 
      label: t('services.list.wheelBalancing.title'), 
      description: t('services.list.wheelBalancing.description'),
      icon: '⚖️' 
    },
    { 
      id: 'ratu_suvedimas', 
      label: t('services.list.wheelAlignment.title'), 
      description: t('services.list.wheelAlignment.description'),
      icon: '📐' 
    },
    { 
      id: 'kitos_paslaugos', 
      label: t('services.list.otherServices.title'), 
      description: t('services.list.otherServices.description'),
      icon: '📋' 
    }
  ];

  const formatDate = (date: Date) => {
    const months = [
      t('datePicker.january'), t('datePicker.february'), t('datePicker.march'), t('datePicker.april'), t('datePicker.may'), t('datePicker.june'),
      t('datePicker.july'), t('datePicker.august'), t('datePicker.september'), t('datePicker.october'), t('datePicker.november'), t('datePicker.december')
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 'success' ? t('reservation.success') : t('reservation.title')}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress indicator */}
          {step !== 'success' && (
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${step === 'service' ? 'text-gray-800' : 'text-gray-400'}`}>
                  {t('reservation.service')}
                </span>
                <span className={`text-sm font-medium ${step === 'date' ? 'text-gray-800' : 'text-gray-400'}`}>
                  {t('reservation.date')}
                </span>
                <span className={`text-sm font-medium ${step === 'time' ? 'text-gray-800' : 'text-gray-400'}`}>
                  {t('reservation.time')}
                </span>
              </div>
              <div className="flex gap-2 mb-6">
                <div className={`h-1 flex-1 rounded-full ${step === 'service' || step === 'date' || step === 'time' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${step === 'date' || step === 'time' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${step === 'time' ? 'bg-gray-800' : 'bg-gray-200'}`} />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Step 1: Service Selection */}
            {step === 'service' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <MessageSquare size={20} />
                  <p className="font-medium">{t('reservation.selectService')}</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`
                        flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${selectedService === service.id
                          ? 'border-gray-800 bg-gray-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-2xl">{service.icon}</span>
                        <span className={`font-medium flex-1 ${
                          selectedService === service.id ? 'text-gray-800' : 'text-gray-700'
                        }`}>
                          {service.label}
                        </span>
                        {selectedService === service.id && (
                          <CheckCircle size={20} className="text-gray-800" />
                        )}
                      </div>
                      <p className={`text-sm ${
                        selectedService === service.id ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {service.description}
                      </p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  disabled={!selectedService}
                  className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {t('reservation.next')}
                </button>
              </div>
            )}

            {/* Step 2: Date Selection */}
            {step === 'date' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Calendar size={20} />
                  <p className="font-medium">{t('reservation.selectDate')}</p>
                </div>
                <DatePicker
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    {t('reservation.back')}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selectedDate}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {t('reservation.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Time Selection */}
            {step === 'time' && (
              <div className="space-y-4">
                {isLoadingTimes ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                    <p className="mt-2 text-gray-600">{t('reservation.checkingTimes')}</p>
                  </div>
                ) : (
                  <>
                    {reservedTimes.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                        <p className="font-medium">{t('reservation.timesReserved')}</p>
                      </div>
                    )}
                    <TimePicker
                      selectedTime={selectedTime}
                      onTimeSelect={setSelectedTime}
                      reservedTimes={reservedTimes}
                      selectedDate={selectedDate}
                    />
                  </>
                )}
                
                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    {t('reservation.back')}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        {t('reservation.submitting')}
                      </>
                    ) : (
                      t('reservation.submit')
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Success State */}
            {step === 'success' && (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {t('reservation.success')}
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-left">
                  <p className="text-sm text-gray-600">{t('reservation.details')}:</p>
                  <p className="text-gray-700 font-medium">
                    {services.find(s => s.id === selectedService)?.icon} {services.find(s => s.id === selectedService)?.label}
                  </p>
                  <p className="text-gray-700">
                    {selectedDate && formatDate(selectedDate)} - {selectedTime}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors mt-4"
                >
                  {t('reservation.close')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

