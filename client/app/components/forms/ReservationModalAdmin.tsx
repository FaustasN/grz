'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import DatePicker from '../ui/DatePicker';
import TimePicker from '../ui/TimePicker';

import { API_ENDPOINTS } from '../utils/api';

interface Reservation {
  id: number;
  name: string;
  phone: string | number;
  reservation_date: string;
  service_type: string;
  additional_info: string | null;
  created_at: string;
}

interface ReservationModalAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReservationModalAdmin({ isOpen, onClose, onSuccess }: ReservationModalAdminProps) {

  const [step, setStep] = useState<'service' | 'date' | 'time' | 'success'>('service');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [selectedService, setSelectedService] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

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
            const times = (data.reservations as Reservation[]).map((r) => {
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
      setError('Pasirinkite datą');
      return;
    }

    {
      const [h, m] = selectedTime.split(':');
      const candidate = new Date(selectedDate);
      candidate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
      if (candidate.getTime() < Date.now()) {
        setError('Pasirinkite datą');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const reservationDateTime = `${formattedDate} ${selectedTime}:00`;

      const serviceText = services.find(s => s.id === selectedService)?.label || '';

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
          setError(data.message || 'Laikas jau rezervuotas');
        } else {
          setError(data.message || 'Klaida');
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
        setError(data.message || 'Klaida');
      }
    } catch (err) {
      setError('Klaida jungiantis su serveriu');
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
      label: 'Ratu balansavimas', 
      description: 'Ratu balansavimas yra procesas, kuriame ratų sukimosi ašis yra sukietinama, kad būtų užtikrinta stabilus ir saugus vairuoti.',
      icon: '⚖️' 
    },
    { 
      id: 'ratu_suvedimas', 
      label: 'Ratu suvedimas', 
      description: 'Ratu suvedimas yra procesas, kuriame ratų sukimosi ašis yra sukietinama, kad būtų užtikrinta stabilus ir saugas vairuoti.',
      icon: '📐' 
    },
    { 
      id: 'kitos_paslaugos', 
      label: 'Kitos paslaugos', 
      description: 'Kitos paslaugos yra paslaugos, kurios neįeina į šiuos kategorijas.',
      icon: '📋' 
    }
  ];

  const formatDate = (date: Date) => {
    const months = [
      'Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
      'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 'success' ? 'Rezervacija sėkmingai išsaugota' : 'Rezervacija'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {step !== 'success' && (
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${step === 'service' ? 'text-gray-800' : 'text-gray-400'}`}>
                  Paslauga
                </span>
                <span className={`text-sm font-medium ${step === 'date' ? 'text-gray-800' : 'text-gray-400'}`}>
                  Data
                </span>
                <span className={`text-sm font-medium ${step === 'time' ? 'text-gray-800' : 'text-gray-400'}`}>
                  Laikas
                </span>
              </div>
              <div className="flex gap-2 mb-6">
                <div className={`h-1 flex-1 rounded-full ${step === 'service' || step === 'date' || step === 'time' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${step === 'date' || step === 'time' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${step === 'time' ? 'bg-gray-800' : 'bg-gray-200'}`} />
              </div>
            </div>
          )}

          <div className="px-6 pb-6">
            {step === 'service' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <MessageSquare size={20} />
                  <p className="font-medium">Pasirinkite paslaugą</p>
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
                  Toliau
                </button>
              </div>
            )}

            {step === 'date' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Calendar size={20} />
                  <p className="font-medium">Pasirinkite datą</p>
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
                    Atgal
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selectedDate}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Toliau
                  </button>
                </div>
              </div>
            )}

            {step === 'time' && (
              <div className="space-y-4">
                {isLoadingTimes ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                    <p className="mt-2 text-gray-600">Tikrinami galimi laikai...</p>
                  </div>
                ) : (
                  <>
                    {reservedTimes.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                        <p className="font-medium">Rezervuoti laikai pažymėti pilka spalva</p>
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
                        Atgal
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Pateikiama...
                      </>
                    ) : (
                      'Pateikti'
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Rezervacija sėkmingai išsaugota
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-left">
                  <p className="text-sm text-gray-600">Rezervacijos detalės:</p>
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
                  Uždaryti
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

