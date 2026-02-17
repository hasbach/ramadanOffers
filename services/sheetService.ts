
import { Offer, RamadanConfig } from '../types';

function sanitizeKey(key: string): string {
  if (!key) return '';
  return key.toString()
    .trim()
    .toLowerCase()
    .replace(/[\uFEFF\u200B\u200C\u200D]/g, '')
    .replace(/\s+/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

function getValueByKeys(obj: any, searchKeys: string[]): string {
  if (!obj) return '';
  const actualKeys = Object.keys(obj);
  const cleanSearchKeys = searchKeys.map(k => sanitizeKey(k));
  
  const foundKey = actualKeys.find(k => cleanSearchKeys.includes(sanitizeKey(k)));
  if (foundKey) return String(obj[foundKey]).trim();
  
  const partialKey = actualKeys.find(k => {
    const cleanK = sanitizeKey(k);
    return cleanSearchKeys.some(sk => cleanK.includes(sk) || sk.includes(cleanK));
  });
  if (partialKey) return String(obj[partialKey]).trim();
  
  return '';
}

function normalizeDate(dateInput: any): string {
  if (!dateInput) return '';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput).trim();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  } catch {
    return String(dateInput).trim();
  }
}

function isSameDayMonth(dateStr1: string, dateStr2: string): boolean {
  try {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
    return d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  } catch {
    return false;
  }
}

function parseCSV(csvText: string): any[] {
  if (!csvText) return [];
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleanText.split(/\r?\n/);
  if (lines.length === 0) return [];

  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes('\t')) delimiter = '\t';
  else if (firstLine.includes(';')) delimiter = ';';

  const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
  
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === delimiter && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj: any = {};
    headers.forEach((header, i) => {
      if (header) {
        let val = values[i] || '';
        val = val.replace(/^["']|["']$/g, '');
        obj[header] = val;
      }
    });
    return obj;
  });
}

function getCsvUrl(idOrUrl: string, sheetName: string): string {
  const cleanId = idOrUrl.trim();
  if (cleanId.includes('2PACX-')) {
    return `https://docs.google.com/spreadsheets/d/e/${cleanId}/pub?output=csv&sheet=${encodeURIComponent(sheetName)}`;
  }
  return `https://docs.google.com/spreadsheets/d/${cleanId}/export?format=csv&sheet=${encodeURIComponent(sheetName)}`;
}

export async function fetchSheetData(sheetId: string): Promise<{ offers: Offer[], config: RamadanConfig, rawData?: any }> {
  try {
    const offersUrl = getCsvUrl(sheetId, 'Offers');
    const offersRes = await fetch(offersUrl, { cache: 'no-store' });
    const offersText = await offersRes.text();
    const rawOffers = parseCSV(offersText);

    const configUrl = getCsvUrl(sheetId, 'Config');
    const configRes = await fetch(configUrl, { cache: 'no-store' });
    const configText = await configRes.text();
    let rawConfig = parseCSV(configText);

    const isConfigDuplicated = rawConfig.length > 0 && getValueByKeys(rawConfig[0], ['id', 'title']).length > 0;
    const dataSourceForConfig = isConfigDuplicated ? rawOffers : rawConfig;

    const offers: Offer[] = rawOffers.map((item, index) => {
      const featuredVal = getValueByKeys(item, ['isFeatured', 'مميز', 'featured', 'متميز']).toLowerCase();
      const idFromSheet = getValueByKeys(item, ['id', 'المعرف', 'كود']);
      
      return {
        // إذا كان المعرف فارغاً، نستخدم رقم الصف لضمان ظهور كل العناصر في React
        id: idFromSheet || `row-${index}`,
        title: getValueByKeys(item, ['title', 'العنوان', 'اسم العرض']),
        description: getValueByKeys(item, ['description', 'الوصف']),
        category: getValueByKeys(item, ['category', 'الفئة']) || 'عام',
        price: getValueByKeys(item, ['price', 'السعر']),
        currency: getValueByKeys(item, ['currency', 'العملة']) || 'ر.س',
        originalPrice: getValueByKeys(item, ['originalPrice', 'السعر السابق']),
        storeName: getValueByKeys(item, ['storeName', 'المتجر', 'اسم المتجر']),
        whatsapp: getValueByKeys(item, ['whatsapp', 'واتساب']),
        imageUrl: getValueByKeys(item, ['imageUrl', 'الصورة']) || 'https://via.placeholder.com/400x300',
        isFeatured: featuredVal === 'true' || featuredVal === 'yes' || featuredVal === 'نعم' || featuredVal === '1',
        expiryDate: getValueByKeys(item, ['expiryDate', 'تاريخ الانتهاء'])
      };
    });

    const todayStr = normalizeDate(new Date());
    let ramadanStartDate = getValueByKeys(dataSourceForConfig[0], ['ramadanStartDate', 'تاريخ رمضان', 'بداية']) || '2026-02-15';

    let dailyDua = '';
    const duaMatch = dataSourceForConfig.find(row => {
      const rowDate = normalizeDate(getValueByKeys(row, ['date', 'التاريخ', 'اليوم']));
      return rowDate === todayStr || (rowDate && isSameDayMonth(rowDate, todayStr));
    });

    if (duaMatch) {
      dailyDua = getValueByKeys(duaMatch, ['dailyDua', 'الدعاء', 'دعاء', 'نص']);
    }

    if (!dailyDua) {
      const anyDua = dataSourceForConfig.find(row => getValueByKeys(row, ['dailyDua', 'الدعاء', 'دعاء']).length > 3);
      if (anyDua) {
        dailyDua = getValueByKeys(anyDua, ['dailyDua', 'الدعاء', 'دعاء']);
      }
    }

    if (!dailyDua) dailyDua = 'اللهم بلغنا رمضان وأنت راضٍ عنا.';

    return { 
      offers, 
      config: { ramadanStartDate, dailyDua, sheetId },
      rawData: { 
        configHeaders: Object.keys(rawConfig[0] || {}),
        isConfigDuplicated,
        dataSourceUsed: isConfigDuplicated ? 'Offers (Merged Mode)' : 'Config'
      }
    };
  } catch (error: any) {
    throw error;
  }
}
