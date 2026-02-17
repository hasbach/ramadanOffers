
import { Offer, AppData } from './types';
import { DEFAULT_SHEET_ID, CATEGORIES } from './constants';
import { fetchSheetData } from './services/sheetService';
import RamadanWidget from './components/RamadanWidget';
import OfferCard from './components/OfferCard';
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [data, setData] = useState<(AppData & { rawData?: any }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const generateAIInsight = async (offers: Offer[]) => {
    if (!offers || offers.length === 0) return;
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const offersText = offers.slice(0, 10).map(o => `- ${o.title} (${o.price} ${o.currency}) في متجر ${o.storeName}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أنت مساعد تسوق ذكي لخبير في عروض رمضان. إليك قائمة بعروض اليوم:\n${offersText}\n\nقدم نصيحة شرائية قصيرة جداً (جملتين بحد أقصى) وبلهجة ودودة تشجع على التوفير والاستعداد لرمضان. ركز على أفضل قيمة مقابل السعر.`,
      });
      
      setAiInsight(response.text || null);
    } catch (err) {
      console.error("AI Insight Error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSheetData(DEFAULT_SHEET_ID);
      setData(result);
      if (result.offers.length > 0) {
        generateAIInsight(result.offers);
      }
    } catch (err: any) {
      setError(err.message || "فشل الاتصال بجدول البيانات");
    } finally {
      setLoading(false);
    }
  };

 const featuredOffers = useMemo(() => {
    if (!data || data.offers.length === 0) return [];
    const featured = data.offers.filter(o => o.isFeatured);
    return featured.length > 0 ? featured : [data.offers[0]];
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
          <p className="text-xl font-bold text-blue-900 text-center px-4">جاري جلب عروض الخير...</p>
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
             <button onClick={loadData} className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold border border-amber-200 hover:bg-amber-200 transition-all active:scale-95">تحديث ⚡</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {data && <RamadanWidget startDate={data.config.ramadanStartDate} dua={data.config.dailyDua} />}
        
        {/* قسم ذكاء العروض - مدعوم بـ AI */}
        {(aiInsight || aiLoading) && (
          <section className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
                <span className="text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-900 font-black text-lg mb-1 flex items-center gap-2">
                  إضاءة رمضانية ذكية
                  <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold uppercase">AI</span>
                </h3>
                {aiLoading ? (
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-2"></div>
                ) : (
                  <p className="text-blue-800/80 leading-relaxed font-medium">{aiInsight}</p>
                )}
              </div>
            </div>
          </section>
        )}

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
		  {featuredOffers.length > 0 ? (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			  {featuredOffers.map(offer => (
				<OfferCard key={offer.id} offer={offer} featured />
			  ))}
			</div>
		  ) : (
			<div className="text-center p-10 bg-white rounded-3xl text-gray-400 border border-dashed">
			  لا توجد عروض متميزة حالياً
			</div>
		  )}
		</section>
        <section className="mb-12">
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl whitespace-nowrap font-bold transition-all ${activeCategory === cat ? 'bg-blue-900 text-white shadow-lg scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
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
      </main>
    </div>
  );
};

export default App;
