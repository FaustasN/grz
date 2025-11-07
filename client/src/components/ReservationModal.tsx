import { useState, useEffect } from 'react';
import { X, Calendar, User, Phone as PhoneIcon, MessageSquare, Loader2, CheckCircle, Mail } from 'lucide-react';
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
  const [step, setStep] = useState<'service' | 'date' | 'time' | 'details' | 'success'>('service');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    additionalInfo: ''
  });
  const [selectedService, setSelectedService] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Apply styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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

  const handleNext = () => {
    if (step === 'service' && selectedService) {
      setStep('date');
    } else if (step === 'date' && selectedDate) {
      setStep('time');
    } else if (step === 'time') {
      // Prevent moving forward if selected time is in the past
      const isPast = (() => {
        if (!selectedDate) return false;
        const [h, m] = selectedTime.split(':');
        const candidate = new Date(selectedDate);
        candidate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
        return candidate.getTime() < Date.now();
      })();
      if (isPast) {
        setError(t('reservation.selectDateRequired'));
        return;
      }
      setStep('details');
    }
  };

  const handleBack = () => {
    if (step === 'date') {
      setStep('service');
    } else if (step === 'time') {
      setStep('date');
    } else if (step === 'details') {
      setStep('time');
    }
  };

  const validateName = (name: string): string | null => {
    if (!name || name.trim().length === 0) {
      return t('reservation.nameRequired');
    }
    if (name.trim().length < 3) {
      return t('reservation.nameMinLength');
    }
    // Allow letters (including Lithuanian), spaces, hyphens
    const nameRegex = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]+$/;
    if (!nameRegex.test(name)) {
      return t('reservation.nameInvalid');
    }
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone || phone.trim().length === 0) {
      return t('reservation.phoneRequired');
    }
    
    // Remove all spaces and non-digits except +
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Lithuanian phone formats:
    // +37060000000 (11 digits with +370)
    // 8 60000000 (9 digits starting with 8)
    // 860000000 (9 digits starting with 8)
    // +370 600 00000
    
    const phoneRegex = /^(\+370|0)?[6]\d{7}$/;
    const cleanedForValidation = cleanPhone.replace(/^\+370/, '').replace(/^8/, '');
    
    if (!phoneRegex.test(cleanedForValidation)) {
      return t('reservation.phoneInvalid');
    }
    
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email || email.trim().length === 0) {
      return t('reservation.emailRequired');
    }
    // Check that @ and . are required and in correct positions
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('reservation.emailInvalid');
    }
    return null;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate name
    const nameError = validateName(formData.name);
    if (nameError) {
      setError(nameError);
      return;
    }

    // Validate phone
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    if (!selectedDate) {
      setError(t('reservation.selectDateRequired'));
      return;
    }

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Format date and time in local timezone (Lithuania)
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      // Use the selected time directly (no timezone adjustment needed)
      // The time is what the user sees and selected
      const reservationDateTime = `${formattedDate} ${selectedTime}:00`;

      // Combine service and additional info
      const serviceText = selectedService ? services.find(s => s.id === selectedService)?.label : '';
      const additionalInfoText = formData.additionalInfo 
        ? `${serviceText ? serviceText + '. ' : ''}${formData.additionalInfo}` 
        : serviceText || '';

      const response = await fetch(API_ENDPOINTS.RESERVATIONS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone.replace(/\s/g, ''),
          reservation_date: reservationDateTime,
          service_type: selectedService,
          additional_info: additionalInfoText
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle HTTP error status codes
        if (response.status === 409) {
          setError(data.message || t('reservation.timeAlreadyReserved'));
        } else {
          setError(data.message || t('reservation.error'));
        }
        return;
      }

      if (data.success) {
        setStep('success');
        // Call onSuccess callback if provided (for admin panel to refresh list)
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
    setFormData({ name: '', phone: '', email: '', additionalInfo: '' });
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
      description: t('services.list.otherServices.description2'),
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
          className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-up pr-1 sm:mr-8"
          onClick={(e) => e.stopPropagation()}
          style={{ scrollbarGutter: 'stable' }}
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
                <span className={`text-sm font-medium ${step === 'details' ? 'text-gray-800' : 'text-gray-400'}`}>
                  {t('reservation.contact')}
                </span>
              </div>
              <div className="flex gap-2 mb-6">
                <div className={`h-1 flex-1 rounded-full ${step === 'service' || step === 'date' || step === 'time' || step === 'details' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${step === 'date' || step === 'time' || step === 'details' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${step === 'time' || step === 'details' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${step === 'details' ? 'bg-gray-800' : 'bg-gray-200'}`} />
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
                    {(() => {
                      if (!selectedDate) return null;
                      const [h, m] = selectedTime.split(':');
                      const candidate = new Date(selectedDate);
                      candidate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
                      if (candidate.getTime() < Date.now()) {
                        return (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {t('reservation.selectDateRequired')}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </>
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
                    className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                  >
                    {t('reservation.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Contact Details */}
            {step === 'details' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">{t('reservation.selectedService')}:</p>
                  <p className="text-lg font-bold text-gray-800 mb-2">
                    {services.find(s => s.id === selectedService)?.icon} {services.find(s => s.id === selectedService)?.label}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{t('reservation.selectedTime')}:</p>
                  <p className="text-lg font-bold text-gray-800">
                    {selectedDate && formatDate(selectedDate)} - {selectedTime}
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <User size={20} />
                      {t('reservation.name')} *
                    </span>
                    <span className={`text-xs ${formData.name.length > 20 ? 'text-red-500' : 'text-gray-500'}`}>
                      {formData.name.length}/20
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow letters, spaces, hyphens, and Lithuanian characters
                      if (value === '' || /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]*$/.test(value)) {
                        if (value.length <= 20) {
                          setFormData({ ...formData, name: value });
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                    placeholder={t('reservation.namePlaceholder')}
                    required
                    minLength={3}
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('reservation.nameMinLength')}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Mail size={25} />
                      {t('reservation.email')} *
                    </span>
                    <span className={`text-xs ${formData.email.length > 25 ? 'text-red-500' : 'text-gray-500'}`}>
                      {formData.email.length}/25
                    </span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 25) {
                        setFormData({ ...formData, email: value });
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                    placeholder="example@example.com"
                    required
                    maxLength={25}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('reservation.emailFormat')}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon size={18} />
                    {t('reservation.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow digits, spaces, +, and -
                      if (value === '' || /^[\d\s+\-]*$/.test(value)) {
                        setFormData({ ...formData, phone: value });
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                    placeholder="+370 600 00000"
                    required
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('reservation.phoneFormat')}</p>
                </div>

                {/* Additional info */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare size={18} />
                    {t('reservation.additionalInfo')} ({t('reservation.optional')})
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all resize-none"
                    placeholder={t('reservation.additionalInfoPlaceholder')}
                    rows={3}
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    {t('reservation.back')}
                  </button>
                  <button
                    type="submit"
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
              </form>
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
                  <p className="font-semibold text-gray-800">{formData.name}</p>
                  <p className="text-gray-700">{formData.phone}</p>
                  <p className="text-gray-700">
                    {selectedDate && formatDate(selectedDate)} - {selectedTime}
                  </p>
                  <p className="text-gray-700 font-medium">
                    {services.find(s => s.id === selectedService)?.icon} {services.find(s => s.id === selectedService)?.label}
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

