
import React, { useEffect } from 'react';
import { Offer } from '../types';

interface Props {
  offer: Offer;
  onClose: () => void;
}

const OfferModal: React.FC<Props> = ({ offer, onClose }) => {
  // إغلاق النافذة عند الضغط على مفتاح Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleWhatsApp = () => {
    const text = `السلام عليكم، مهتم بعرض: ${offer.title} من متجر ${offer.storeName}`;
    window.open(`https://wa.me/${offer.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* الخلفية المضببة */}
      <div 
        className="fixed inset-0 bg-blue-900/40 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>

      {/* نافذة المحتوى */}
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in duration-300">
        {/* زر الإغلاق */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-blue-900 p-2 rounded-full shadow-lg transition-all active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* القسم الأيمن: الصورة */}
        <div className="md:w-1/2 h-64 md:h-auto relative">
          <img 
            src={offer.imageUrl} 
            alt={offer.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-white/20">
             <div className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">{offer.category}</div>
             <div className="text-blue-900 font-black flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                {offer.storeName}
             </div>
          </div>
        </div>

        {/* القسم الأيسر: التفاصيل */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col h-full overflow-y-auto bg-gray-50/50">
          <div className="mb-auto">
            <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-6 leading-tight">
              {offer.title}
            </h2>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-blue-900">{offer.price}</span>
                <span className="text-xl font-bold text-blue-700/60">{offer.currency}</span>
              </div>
              {offer.originalPrice && (
                <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold text-lg line-through border border-red-100">
                  {offer.originalPrice}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-400 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-200"></span>
                تفاصيل العرض
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {offer.description}
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4">
            <div className="bg-blue-900 text-white p-6 rounded-3xl flex items-center justify-between shadow-xl">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-60 font-bold uppercase tracking-tighter">صاحب العرض</div>
                    <div className="text-xl font-black">{offer.storeName}</div>
                  </div>
               </div>
            </div>

            <button 
              onClick={handleWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-green-100 text-xl"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.389l-.711 2.597 2.66-.697c.837.544 1.831.865 2.903.865 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm3.387 8.263c-.14.392-.711.711-1.171.758-.315.033-.726.046-1.15-.091-1.744-.565-2.887-2.332-2.973-2.449-.087-.117-.701-.933-.701-1.78s.441-1.263.598-1.44c.157-.177.342-.222.456-.222.114 0 .228.001.328.006.104.005.244-.039.382.293.14.336.479 1.166.521 1.25.042.084.07.182.014.294-.056.112-.084.182-.168.28-.084.098-.177.219-.252.294-.084.084-.171.175-.073.342.098.167.433.716.929 1.157.64.569 1.177.745 1.345.829.168.084.266.07.364-.042.098-.112.42-.49.532-.658.112-.168.224-.14.378-.084.154.056.975.462 1.143.546.168.084.28.126.322.196.042.07.042.406-.098.798z"/></svg>
              تواصل واطلب عبر واتساب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
