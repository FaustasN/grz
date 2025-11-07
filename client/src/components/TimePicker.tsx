import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TimePickerProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  reservedTimes?: string[];
  selectedDate?: Date | null;
}

export default function TimePicker({ selectedTime, onTimeSelect, reservedTimes = [], selectedDate = null }: TimePickerProps) {
  const { t } = useTranslation();
  const [hours, setHours] = useState('10');
  const [minutes, setMinutes] = useState('00');

  // Parse selected time when it changes
  useEffect(() => {
    if (selectedTime) {
      const [h, m] = selectedTime.split(':');
      setHours(h);
      setMinutes(m);
    }
  }, [selectedTime]);

  // Generate working hours (10:00 - 19:00, closes at 20:00)
  const workingHours = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 10;
    return hour.toString().padStart(2, '0');
  });

  const minuteOptions = ['00', '30'];

  const handleHourChange = (hour: string) => {
    setHours(hour);
    onTimeSelect(`${hour}:${minutes}`);
  };

  const handleMinuteChange = (minute: string) => {
    setMinutes(minute);
    onTimeSelect(`${hours}:${minute}`);
  };

  const isTimeReserved = (hour: string, minute: string) => {
    const timeString = `${hour}:${minute}`;
    return reservedTimes.includes(timeString);
  };

  const isTimePast = (hour: string, minute: string) => {
    if (!selectedDate) return false;
    const now = new Date();
    const candidate = new Date(selectedDate);
    candidate.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
    return candidate.getTime() < now.getTime();
  };

  const isTimeUnavailable = (hour: string, minute: string) => {
    return isTimeReserved(hour, minute) || isTimePast(hour, minute);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">{t('reservation.selectTime')}</h3>
      </div>

      <div className="space-y-4">
        {/* Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('reservation.hour')}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {workingHours.map((hour) => {
              const allTimesReserved = minuteOptions.every(minute => isTimeUnavailable(hour, minute));
              return (
                <button
                  key={hour}
                  onClick={() => !allTimesReserved && handleHourChange(hour)}
                  disabled={allTimesReserved}
                  className={`
                    p-3 rounded-lg text-center transition-all duration-200 font-medium
                    ${allTimesReserved 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : hours === hour 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                    ${!allTimesReserved && 'active:scale-95'}
                  `}
                >
                  {hour}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minutes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('reservation.minute')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {minuteOptions.map((minute) => {
              const reserved = isTimeUnavailable(hours, minute);
              return (
                <button
                  key={minute}
                  onClick={() => !reserved && handleMinuteChange(minute)}
                  disabled={reserved}
                  className={`
                    p-3 rounded-lg text-center transition-all duration-200 font-medium relative
                    ${reserved 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : minutes === minute 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                    ${!reserved && 'active:scale-95'}
                  `}
                >
                  {minute}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected time display */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">{t('reservation.selectedTime')}</p>
          <p className="text-2xl font-bold text-gray-800">{hours}:{minutes}</p>
        </div>
      </div>
    </div>
  );
}

