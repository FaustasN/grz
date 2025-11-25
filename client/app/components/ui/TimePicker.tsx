'use client';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  reservedTimes?: string[];
  selectedDate?: Date | null;
}

export default function TimePicker({ selectedTime, onTimeSelect, reservedTimes = [], selectedDate = null }: TimePickerProps) {
  const getInitialTime = () => {
    if (selectedTime) {
      const [h, m] = selectedTime.split(':');
      return { hours: h || '10', minutes: m || '00' };
    }
    return { hours: '10', minutes: '00' };
  };
  
  const [hours, setHours] = useState(() => getInitialTime().hours);
  const [minutes, setMinutes] = useState(() => getInitialTime().minutes);

  useEffect(() => {
    if (selectedTime) {
      const [h, m] = selectedTime.split(':');
      queueMicrotask(() => {
        setHours(h || '10');
        setMinutes(m || '00');
      });
    }
  }, [selectedTime]);

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
        <h3 className="text-lg font-semibold text-gray-800">Pasirinkite laiką</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valanda
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minutė
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

        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Pasirinktas laikas</p>
          <p className="text-2xl font-bold text-gray-800">{hours}:{minutes}</p>
        </div>
      </div>
    </div>
  );
}

