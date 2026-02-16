
import { Offer, AppData } from './types';
import { DEFAULT_SHEET_ID, CATEGORIES } from './constants';
import { fetchSheetData } from './services/sheetService';
import RamadanWidget from './components/RamadanWidget';
import OfferCard from './components/OfferCard';
import React, { useState, useEffect, useMemo } from 'react';

const App: React.FC = () => {
  const [data, setData] = useState<(AppData & { rawData?: any }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [showDebug, setShowDebug] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSheetData(DEFAULT_SHEET_ID);
      setData(result);
    } catch (err: any) {
      setError(err.message || "فشل الاتصال بجدول البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const featuredOffer = useMemo(() => {
    if (!data || data.offers.length === 0) return null;
    return data.offers.find(o => o.isFeatured) || data.offers[0];
  }, [data]);

  const filteredOffers = useMemo(() => {
    if (!data) return [];
    let list = data.offers;
    if (activeCategory === "الكل") return list;
    return list.filter(o => o.category === activeCategory);
  }, [data, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-bold text-blue-900 text-center px-4">جاري جلب البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 font-sans" dir="rtl">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 h-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌙</span>
            <h1 className="text-2xl font-black text-blue-900">عروض رمضان الخير</h1>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setShowDebug(!showDebug)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200">فحص 🔍</button>
             <button onClick={loadData} className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold border border-amber-200">تحديث ⚡</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {data && <RamadanWidget startDate={data.config.ramadanStartDate} dua={data.config.dailyDua} />}
        
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 mb-8 text-red-800 rounded-lg">
            حدث خطأ: {error}
          </div>
        )}

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-amber-400 rounded-full"></span>
            عرض اليوم المتميز
          </h2>
          {featuredOffer ? <OfferCard offer={featuredOffer} featured /> : <div className="text-center p-10 bg-white rounded-3xl text-gray-400">لا توجد عروض متميزة حالياً</div>}
        </section>

        <section className="mb-12">
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl whitespace-nowrap font-bold transition-all ${activeCategory === cat ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOffers.length > 0 ? (
            filteredOffers.map(offer => <OfferCard key={offer.id} offer={offer} />)
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl text-gray-400 border border-dashed">
               لا توجد عروض في هذه الفئة حالياً
            </div>
          )}
        </section>

        {showDebug && data && (
          <section className="mt-20 p-6 bg-slate-900 text-green-400 rounded-3xl overflow-hidden shadow-2xl font-mono text-xs border-t-4 border-blue-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">تحليل البيانات (Debug Mode):</h3>
              <button onClick={() => setShowDebug(false)} className="text-slate-400">إغلاق ×</button>
            </div>
            
            <div className="space-y-6">
              {/* رسالة تنبيه ذكية */}
              {data.rawData?.configHeaders?.includes('id') && (
                <div className="bg-amber-900/50 border border-amber-500 p-4 rounded-xl text-amber-200 text-sm mb-4">
                  <strong>⚠️ تنبيه هام:</strong> ورقة "Config" ترجع بيانات "Offers". 
                  <br /> يرجى التأكد من "نشر المستند بأكمله" من إعدادات جوجل شيت، وليس ورقة واحدة فقط.
                </div>
              )}

              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-blue-300 font-bold mb-2">عناوين الأعمدة في ورقة الإعدادات:</p>
                <div className="flex flex-wrap gap-2">
                   {data.rawData?.configHeaders?.map((h: string) => (
                     <span key={h} className={`px-2 py-1 rounded border ${h.toLowerCase().includes('dua') || h.includes('دعاء') ? 'bg-green-900 border-green-500 text-white' : 'bg-slate-700 border-slate-600'}`}>
                        "{h}"
                     </span>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-blue-300 font-bold mb-2">// القيم النهائية:</p>
                  <pre className="bg-slate-800 p-4 rounded-xl overflow-x-auto border border-slate-700">
                    {JSON.stringify(data.config, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-pink-300 font-bold mb-2">// محتوى ورقة الإعدادات الخام:</p>
                  <div className="bg-slate-800 p-4 rounded-xl overflow-x-auto border border-slate-700 h-64 overflow-y-auto text-[10px]">
                    {data.rawData?.configRows?.slice(0, 3).map((row: any, i: number) => (
                      <div key={i} className="mb-4 pb-2 border-b border-slate-700 last:border-0">
                        <p className="text-gray-500 mb-1">الصف {i+1}:</p>
                        {Object.entries(row).map(([key, val]) => (
                          <div key={key} className="flex justify-between gap-4">
                            {/* Fix: casting variables to String to ensure they are valid ReactNodes in debug output */}
                            <span className="text-amber-400">"{String(key)}"</span>
                            <span className="text-green-300 text-left">"{String(val)}"</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
