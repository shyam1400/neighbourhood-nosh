import React, { useState } from 'react';
import { Truck, Store, Clock, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

export type DeliveryOption = 'delivery' | 'walkIn' | 'scheduled';

interface DeliveryOptionsProps {
  selectedOption: DeliveryOption | null;
  onOptionSelect: (option: DeliveryOption) => void;
  onDateTimeSelect?: (date: string, time: string) => void;
  scheduledDate?: string;
  scheduledTime?: string;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  selectedOption,
  onOptionSelect,
  onDateTimeSelect,
  scheduledDate,
  scheduledTime
}) => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(scheduledDate || '');
  const [selectedTime, setSelectedTime] = useState(scheduledTime || '');

  const handleDateTimeChange = () => {
    if (onDateTimeSelect && selectedDate && selectedTime) {
      onDateTimeSelect(selectedDate, selectedTime);
    }
  };

  const deliveryOptions = [
    {
      value: 'delivery' as DeliveryOption,
      title: t('delivery.delivery'),
      description: t('delivery.deliveryDesc'),
      icon: <Truck className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'walkIn' as DeliveryOption,
      title: t('delivery.walkIn'),
      description: t('delivery.walkInDesc'),
      icon: <Store className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      value: 'scheduled' as DeliveryOption,
      title: t('delivery.scheduled'),
      description: t('delivery.scheduledDesc'),
      icon: <Clock className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t('delivery.selectOption')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption || ''} onValueChange={(value) => onOptionSelect(value as DeliveryOption)}>
          <div className="space-y-4">
            {deliveryOptions.map((option) => (
              <div key={option.value} className="relative">
                <Label
                  htmlFor={option.value}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedOption === option.value
                      ? `${option.borderColor} ${option.bgColor}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${option.color}`}>
                        {option.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900">{option.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {/* Scheduled Order Date/Time Selection */}
        {selectedOption === 'scheduled' && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('delivery.selectDate')} & {t('delivery.selectTime')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduled-date" className="text-sm font-medium text-gray-700">
                  {t('delivery.selectDate')}
                </Label>
                <Input
                  id="scheduled-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="scheduled-time" className="text-sm font-medium text-gray-700">
                  {t('delivery.selectTime')}
                </Label>
                <Input
                  id="scheduled-time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            {selectedDate && selectedTime && (
              <Button
                onClick={handleDateTimeChange}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                {t('common.save')} {t('delivery.scheduled')} {t('common.continue')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryOptions;
