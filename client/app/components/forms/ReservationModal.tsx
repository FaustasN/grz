'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, User, Phone as PhoneIcon, MessageSquare, Loader2, CheckCircle, Mail } from 'lucide-react';
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

interface ReservationModalProps {
  isOpen: boolean;  
  onClose: () => void;
  onSuccess?: () => void;
  initialService?: string;
}

export default function ReservationModal({ isOpen, onClose, onSuccess, initialService }: ReservationModalProps) {
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

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      if (initialService) {
        setSelectedService(initialService);
        setStep('date');
      } else {
        setSelectedService('');
        setStep('service');
      }
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      setStep('service');
      setSelectedDate(null);
      setSelectedTime('11:00');
      setFormData({ name: '', phone: '', email: '', additionalInfo: '' });
      setSelectedService('');
      setReservedTimes([]);
      setError('');
    }
  }, [isOpen, initialService]);

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

  const handleNext = () => {
    if (step === 'service' && selectedService) {
      setStep('date');
    } else if (step === 'date' && selectedDate) {
      setStep('time');
    } else if (step === 'time') {
      const isPast = (() => {
        if (!selectedDate) return false;
        const [h, m] = selectedTime.split(':');
        const candidate = new Date(selectedDate);
        candidate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
        return candidate.getTime() < Date.now();
      })();
      if (isPast) {
        setError('Pasirinkite datą');
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
      return 'Vardas ir pavardė yra privalomas';
    }
    if (name.trim().length < 3) {
      return 'Vardas ir pavardė turi būti ilgesnis nei 2 simboliai';
    }
    const nameRegex = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]+$/;
    if (!nameRegex.test(name)) {
      return 'Vardas ir pavardė turi būti tik raidės ir skaičiai';
    }
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone || phone.trim().length === 0) {
      return 'Telefono numeris yra privalomas';
    }
    
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    const phoneRegex = /^(\+370|0)?[6]\d{7}$/;
    const cleanedForValidation = cleanPhone.replace(/^\+370/, '').replace(/^8/, '');
    
    if (!phoneRegex.test(cleanedForValidation)) {
      return 'Telefono numeris turi būti 8 arba 9 skaitmenų';
    }
    
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email || email.trim().length === 0) {
      return 'El. paštas yra privalomas';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'El. paštas turi būti validus';
    }
    return null;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const nameError = validateName(formData.name);
    if (nameError) {
      setError(nameError);
      return;
    }

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    if (!selectedDate) {
      setError('Pasirinkite datą');
      return;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);

    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const reservationDateTime = `${formattedDate} ${selectedTime}:00`;

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
        if (response.status === 409) {
                setError(data.message || 'Laikas jau rezervuotas');
        } else {
          setError(data.message || 'Įvyko klaida');
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
        setError(data.message || 'Įvyko klaida');
      }
    } catch (err) {
      setError('Nepavyko prisijungti prie serverio. Prašome pabandyti vėliau.');
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
      label: 'Ratu balansavimas', 
      description: 'Ratu balansavimas yra procesas, kuris užtikrina, kad ratai suktusi lygiai ir nemūštų automobilio judėjimo metu.',
    },
    { 
      id: 'ratu_suvedimas', 
      label: 'Ratu suvedimas', 
      description: 'Ratu suvedimas yra procesas, kuris užtikrina, kad automobilis važiuotų tolygiai ir netemptų į šonus.',
    },
    { 
      id: 'kitos_paslaugos', 
      label: 'Kitos paslaugos', 
      description: 'Kitos paslaugos yra paslaugos, kurios neįtrauktos į šias paslaugas. Tai gali būti, pavyzdžiui, kompiuterinė diagnostika, kebulo remontas, stabdžių kaladėlių keitimas ir kt.',
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
        className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative flex min-h-full items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-up pointer-events-auto mx-auto"
          onClick={(e) => e.stopPropagation()}
          style={{ scrollbarGutter: 'stable' }}
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
                <span className={`text-sm font-medium ${step === 'details' ? 'text-gray-800' : 'text-gray-400'}`}>
                  Kontaktai
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

          <div className="px-6 pb-6">
            {step === 'service' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <MessageSquare size={20} />
                  <p className="font-medium font-semibold">Pasirinkite paslaugą</p>
                </div>
                <div className="grid grid-cols-1 gap-3 ">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`
                        flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${selectedService === service.id
                          ? 'border-gray-800 bg-gray-50 shadow-md '
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 '
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 w-full ">
                        <span className={`flex-1 ${
                          selectedService === service.id
                            ? 'font-bold text-gray-800'
                            : 'font-medium text-gray-700'
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
                    {(() => {
                      if (!selectedDate) return null;
                      const [h, m] = selectedTime.split(':');
                      const candidate = new Date(selectedDate);
                      candidate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
                      if (candidate.getTime() < Date.now()) {
                        return (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            Pasirinkite datą
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
                    Atgal
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Toliau
                  </button>
                </div>
              </div>
            )}

            {step === 'details' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <User size={20} />
                      Vardas ir pavardė *
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
                      if (value === '' || /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]*$/.test(value)) {
                        if (value.length <= 20) {
                          setFormData({ ...formData, name: value });
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                    placeholder="Vardas ir pavardė"
                    required
                    minLength={3}
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">Vardas ir pavardė turi būti ilgesnis nei 2 simboliai</p>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Mail size={25} />
                      El. paštas *
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
                    placeholder="el.paštas@example.com"
                    required
                    maxLength={25}
                  />
                          <p className="text-xs text-gray-500 mt-1">El. paštas turi būti validus</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon size={18} />
                    Telefonas *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[\d\s+\-]*$/.test(value)) {
                        setFormData({ ...formData, phone: value });
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                    placeholder="+370 600 00000"
                    required
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">Telefono numeris turi būti 8 arba 9 skaitmenų</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare size={18} />
                    Papildoma informacija (neprivaloma)
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Papildoma informacija"
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    Atgal
                  </button>
                  <button
                    type="submit"
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
              </form>
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
                  <p className="font-semibold text-gray-800">{formData.name}</p>
                  <p className="text-gray-700">{formData.phone}</p>
                  <p className="text-gray-700">
                    {selectedDate && formatDate(selectedDate)} - {selectedTime}
                  </p>
                  <p className="text-gray-700 font-medium">
                   {services.find(s => s.id === selectedService)?.label}
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

