'use client';

import { useState, useEffect } from 'react';
import { X, User, Phone as PhoneIcon, Loader2, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../utils/api';
import { trackContactFormSubmit } from '../utils/gtm';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ContactFormModal({ isOpen, onClose, onSuccess }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      setFormData({ name: '', phone: '' });
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const validateName = (name: string): string | null => {
    if (!name || name.trim().length === 0) {
      return 'Vardas  yra privalomas';
    }
    if (name.trim().length < 3) {
      return 'Vardas  turi būti ilgesnis nei 2 simboliai';
    }
    const nameRegex = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]+$/;
    if (!nameRegex.test(name)) {
      return 'Vardas susideda iš raidžių';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
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
    setIsSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.RESERVATIONS.CONTACT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone.replace(/\s/g, ''),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Įvyko klaida');
        return;
      }

      if (data.success) {
        trackContactFormSubmit();
        setSuccess(true);
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 100);
        }
      } else {
        setError(data.message || 'Įvyko klaida');
      }
    } catch (err) {
      setError('Nepavyko pateikti formos. Prašome pabandyti vėliau.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', phone: '' });
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative flex min-h-screen items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative bg-white rounded-2xl shadow-xl max-w-[400px] w-full max-h-[90vh] overflow-y-auto custom-scrollbar pointer-events-auto animate-[fadeInUp_0.3s_ease-out]"
          onClick={(e) => e.stopPropagation()}
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-800">
              {success ? '' : 'Susisieksime su jumis'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-6 pb-6">
            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Jūsų užklausa sėkmingai pateikta
                </h3>
                <p className="text-gray-600">
                  Ačiū už jūsų užklausą. Susisieksime su jumis netrukus. 
                </p>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors mt-4"
                >
                  Uždaryti
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={20} />
                    Vardas  *
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
                    placeholder="Vardas "
                    required
                    minLength={3}
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">Vardas turi būti ilgesnis nei 2 simboliai</p>
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

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

