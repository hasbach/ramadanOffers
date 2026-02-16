
import React, { useState, useEffect } from 'react';

interface Props {
  startDate: string;
  dua: string;
}

const RamadanWidget: React.FC<Props> = ({ startDate, dua }) => {
  const [status, setStatus] = useState<{ type: 'countdown' | 'ongoing' | 'finished', value: any } | null>(null);

  useEffect(() => {
    const calculateStatus = () => {
      const now = new Date();
      let target = new Date(startDate);
      
      // منطق ذكي للتجربة: إذا كان التاريخ المكتوب في الجدول قديماً أو في المستقبل البعيد، 
      // نقوم بمطابقة اليوم والشهر مع السنة الحالية لتمكين ظهور "اليوم 2"
      const simulationTarget = new Date(now.getFullYear(), target.getMonth(), target.getDate());
      simulationTarget.setHours(0, 0, 0, 0);
      
      const diffTime = now.getTime() - simulationTarget.getTime();
      const oneDay = 1000 * 60 * 60 * 24;

      if (diffTime < 0) {
        // حالة العد التنازلي (لم يبدأ بعد)
        const absDiff = Math.abs(diffTime);
        setStatus({
          type: 'countdown',
          value: {
            days: Math.floor(absDiff / oneDay),
            hours: Math.floor((absDiff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((absDiff / 1000 / 60) % 60),
            seconds: Math.floor((absDiff / 1000) % 60),
          }
        });
      } else {
        // حالة أننا داخل الشهر أو بعده
        const diffDays = Math.floor(diffTime / oneDay) + 1;
        if (diffDays <= 30) {
          setStatus({ type: 'ongoing', value: diffDays });
        } else {
          setStatus({ type: 'finished', value: null });
        }
      }
    };

    calculateStatus();
    const timer = setInterval(calculateStatus, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <div className="w-full ramadan-gradient text-white rounded-3xl p-6 md:p-10 shadow-2xl mb-12 border-b-8 border-amber-400 relative overflow-hidden">
      <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col lg:flex-row justify-between items-stretch gap-8 relative z-10">
        
        <div className="flex-1 flex flex-col justify-center text-center lg:text-right">
          <h2 className="text-2xl md:text-4xl font-black mb-6 flex items-center justify-center lg:justify-start gap-4">
            <span className="text-4xl animate-pulse">🌙</span>
            {status?.type === 'ongoing' ? 'بشرى حلول الشهر الفضيل' : 'عدّاد شهر رمضان المبارك'}
          </h2>

          {status?.type === 'countdown' && status.value && (
            <div className="flex gap-3 md:gap-5 justify-center lg:justify-start">
              {[
                { label: 'يوم', val: status.value.days },
                { label: 'ساعة', val: status.value.hours },
                { label: 'دقيقة', val: status.value.minutes },
                { label: 'ثانية', val: status.value.seconds },
              ].map((item, idx) => (
                <div key={idx} className="bg-blue-900/40 backdrop-blur-md rounded-2xl p-4 min-w-[80px] border border-white/10 shadow-inner">
                  <div className="text-3xl md:text-4xl font-black gold-text mb-1">{item.val}</div>
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">{item.label}</div>
                </div>
              ))}
            </div>
          )}

          {status?.type === 'ongoing' && (
            <div className="flex flex-col items-center lg:items-start gap-2">
              <div className="text-5xl md:text-7xl font-black gold-text drop-shadow-lg flex items-baseline gap-3">
                اليوم <span className="text-white">{status.value}</span>
              </div>
              <p className="text-xl font-bold opacity-80">من شهر رمضان المبارك 🕌</p>
            </div>
          )}

          {status?.type === 'finished' && (
            <div className="text-4xl font-black gold-text">عيد مبارك وكل عام وأنتم بخير! ✨</div>
          )}
        </div>

        <div className="lg:w-2/5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-[2.5rem] p-8 flex flex-col justify-center shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-blue-900 shadow-lg">
              <span className="text-xl">✨</span>
            </div>
            <h3 className="text-amber-400 text-xl font-bold">دعاء اليوم</h3>
          </div>
          <p className="text-xl md:text-2xl leading-relaxed font-medium italic text-gray-50">
            "{dua}"
          </p>
          <div className="mt-6 w-12 h-1 bg-amber-400/30 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};

export default RamadanWidget;
