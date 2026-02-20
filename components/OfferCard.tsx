
import React from 'react';
import { Offer } from '../types';

interface Props {
  offer: Offer;
  featured?: boolean;
  onClick?: () => void;
}

const OfferCard: React.FC<Props> = ({ offer, featured = false, onClick }) => {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation(); // منع فتح النافذة المنبثقة عند الضغط على الزر
    const text = `السلام عليكم، مهتم بعرض: ${offer.title} من متجر ${offer.storeName}`;
    window.open(`https://wa.me/${offer.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const PriceDisplay = ({ size = "normal" }: { size?: "normal" | "large" }) => (
    <div className="flex items-baseline gap-2">
      <span className={`${size === "large" ? "text-4xl font-black" : "text-2xl font-bold"} text-blue-900`}>
        {offer.price}
      </span>
      <span className={`${size === "large" ? "text-xl font-bold" : "text-sm font-medium"} text-blue-700/70`}>
        {offer.currency}
      </span>
    </div>
  );

  if (featured) {
    return (
      <div 
        onClick={onClick}
        className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border-2 border-amber-200 group cursor-pointer hover:border-amber-400 transition-all"
      >
        <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden">
          <img 
            src={offer.imageUrl} 
            alt={offer.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded-full font-bold shadow-lg animate-bounce">
            عرض اليوم المميز 🔥
          </div>
        </div>
        <div className="lg:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
             <div className="text-amber-600 font-bold uppercase tracking-wide">{offer.category}</div>
             <div className="bg-amber-50 text-amber-800 px-4 py-1 rounded-full text-sm font-black border border-amber-100 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                {offer.storeName}
             </div>
          </div>
          
          <h3 className="text-3xl font-bold text-gray-800 mb-4">{offer.title}</h3>
          
          <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3">{offer.description}</p>
          
          <div className="flex items-center gap-4 mb-8">
            <PriceDisplay size="large" />
            {offer.originalPrice && (
              <div className="text-xl text-gray-400 line-through">
                {offer.originalPrice} {offer.currency}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-green-100 text-xl"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.389l-.711 2.597 2.66-.697c.837.544 1.831.865 2.903.865 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm3.387 8.263c-.14.392-.711.711-1.171.758-.315.033-.726.046-1.15-.091-1.744-.565-2.887-2.332-2.973-2.449-.087-.117-.701-.933-.701-1.78s.441-1.263.598-1.44c.157-.177.342-.222.456-.222.114 0 .228.001.328.006.104.005.244-.039.382.293.14.336.479 1.166.521 1.25.042.084.07.182.014.294-.056.112-.084.182-.168.28-.084.098-.177.219-.252.294-.084.084-.171.175-.073.342.098.167.433.716.929 1.157.64.569 1.177.745 1.345.829.168.084.266.07.364-.042.098-.112.42-.49.532-.658.112-.168.224-.14.378-.084.154.056.975.462 1.143.546.168.084.28.126.322.196.042.07.042.406-.098.798z"/></svg>
              تواصل واطلب الآن
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={offer.imageUrl} 
          alt={offer.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-900 text-xs font-bold px-3 py-1 rounded-lg">
          {offer.category}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{offer.title}</h4>
        
        <div className="mb-3 flex items-center gap-2">
           <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
           </div>
           <span className="text-base font-black text-blue-900 tracking-tight">{offer.storeName}</span>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{offer.description}</p>
        
        <div className="flex flex-col mb-4">
          <PriceDisplay />
          {offer.originalPrice && (
            <div className="text-sm text-gray-400 line-through">
              {offer.originalPrice} {offer.currency}
            </div>
          )}
        </div>

        <button 
          onClick={handleWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-auto shadow-md"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.389l-.711 2.597 2.66-.697c.837.544 1.831.865 2.903.865 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm3.387 8.263c-.14.392-.711.711-1.171.758-.315.033-.726.046-1.15-.091-1.744-.565-2.887-2.332-2.973-2.449-.087-.117-.701-.933-.701-1.78s.441-1.263.598-1.44c.157-.177.342-.222.456-.222.114 0 .228.001.328.006.104.005.244-.039.382.293.14.336.479 1.166.521 1.25.042.084.07.182.014.294-.056.112-.084.182-.168.28-.084.098-.177.219-.252.294-.084.084-.171.175-.073.342.098.167.433.716.929 1.157.64.569 1.177.745 1.345.829.168.084.266.07.364-.042.098-.112.42-.49.532-.658.112-.168.224-.14.378-.084.154.056.975.462 1.143.546.168.084.28.126.322.196.042.07.042.406-.098.798z"/></svg>
          اطلب عبر واتساب
        </button>
      </div>
    </div>
  );
};

export default OfferCard;
