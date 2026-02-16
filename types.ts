
export interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  currency: string; // الحقل الجديد
  originalPrice: string;
  storeName: string;
  whatsapp: string;
  imageUrl: string;
  isFeatured: boolean;
  expiryDate: string;
}

export interface RamadanConfig {
  ramadanStartDate: string;
  dailyDua: string;
  sheetId: string;
}

export interface AppData {
  offers: Offer[];
  config: RamadanConfig;
}
