import { HizbInfo, SurahInfo } from '../types'

export const PARTS_PER_HIZB = 8

export const TOTAL_HIZBS = 60

export function partId(h: number, p: number): number {
  return h * 100 + p
}

export function partHizb(id: number): number {
  return Math.floor(id / 100)
}

export function partNum(id: number): number {
  return id % 100
}

export function hizbParts(h: number): number[] {
  const ids: number[] = []
  for (let p = 1; p <= PARTS_PER_HIZB; p++) ids.push(partId(h, p))
  return ids
}

export function hizbDone(h: number, memorized: number[]): boolean {
  return hizbParts(h).every(id => memorized.includes(id))
}

export function totalPartsDone(memorized: number[]): number {
  return memorized.filter(id => id >= 101 && id <= 6008).length
}

export function totalHizbsDone(memorized: number[]): number {
  let c = 0
  for (let h = 1; h <= 60; h++) if (hizbDone(h, memorized)) c++
  return c
}

export function progressHizb(h: number, memorized: number[]): number {
  return hizbParts(h).filter(id => memorized.includes(id)).length
}

export function getJuz(h: number): number {
  return Math.ceil(h / 2)
}

export const SURAH_NAMES_AR: string[] = [
  'الفاتحة','البقرة','آل عمران','النساء','المائدة',
  'الأنعام','الأعراف','الأنفال','التوبة','يونس',
  'هود','يوسف','الرعد','إبراهيم','الحجر',
  'النحل','الإسراء','الكهف','مريم','طه',
  'الأنبياء','الحج','المؤمنون','النور','الفرقان',
  'الشعراء','النمل','القصص','العنكبوت','الروم',
  'لقمان','السجدة','الأحزاب','سبأ','فاطر',
  'يس','الصافات','ص','الزمر','غافر',
  'فصلت','الشورى','الزخرف','الدخان','الجاثية',
  'الأحقاف','محمد','الفتح','الحجرات','ق',
  'الذاريات','الطور','النجم','القمر','الرحمن',
  'الواقعة','الحديد','المجادلة','الحشر','الممتحنة',
  'الصف','الجمعة','المنافقون','التغابن','الطلاق',
  'التحريم','الملك','القلم','الحاقة','المعارج',
  'نوح','الجن','المزمل','المدثر','القيامة',
  'الإنسان','المرسلات','النبأ','النازعات','عبس',
  'التكوير','الانفطار','المطففين','الانشقاق','البروج',
  'الطارق','الأعلى','الغاشية','الفجر','البلد',
  'الشمس','الليل','الضحى','الشرح','التين',
  'العلق','القدر','البينة','الزلزلة','العاديات',
  'القارعة','التكاثر','العصر','الهمزة','الفيل',
  'قريش','الماعون','الكوثر','الكافرون','النصر',
  'المسد','الإخلاص','الفلق','الناس'
]

export const SURAH_NAMES_FR: string[] = [
  'Al-Fatiha','Al-Baqara','Al-Imran','An-Nisa\'','Al-Ma\'idah',
  'Al-An\'am','Al-A\'raf','Al-Anfal','At-Tawbah','Yunus',
  'Hud','Yusuf','Ar-Ra\'d','Ibrahim','Al-Hijr',
  'An-Nahl','Al-Isra\'','Al-Kahf','Maryam','Ta-Ha',
  'Al-Anbiya\'','Al-Hajj','Al-Mu\'minun','An-Nur','Al-Furqan',
  'Ash-Shu\'ara\'','An-Naml','Al-Qasas','Al-\'Ankabut','Ar-Rum',
  'Luqman','As-Sajdah','Al-Ahzab','Saba\'','Fatir',
  'Ya-Sin','As-Saffat','Sad','Az-Zumar','Ghafir',
  'Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah',
  'Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf',
  'Adh-Dhariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman',
  'Al-Waqi\'ah','Al-Hadid','Al-Mujadila','Al-Hashr','Al-Mumtahanah',
  'As-Saff','Al-Jumu\'ah','Al-Munafiqun','At-Taghabun','At-Talaq',
  'At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah','Al-Ma\'arij',
  'Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah',
  'Al-Insan','Al-Mursalat','An-Naba\'','An-Nazi\'at','\'Abasa',
  'At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj',
  'At-Tariq','Al-A\'la','Al-Ghashiyah','Al-Fajr','Al-Balad',
  'Ash-Shams','Al-Layl','Ad-Duha','Ash-Sharh','At-Tin',
  'Al-\'Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah','Al-\'Adiyat',
  'Al-Qari\'ah','At-Takathur','Al-\'Asr','Al-Humazah','Al-Fil',
  'Quraysh','Al-Ma\'un','Al-Kawthar','Al-Kafirun','An-Nasr',
  'Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas'
]

// Hizb start/end mapping: accurate per the standard Quran division
export const HIZB_SURAH_MAP: HizbInfo[] = [
  {startSurah:1,startVerse:1,endSurah:2,endVerse:74},
  {startSurah:2,startVerse:75,endSurah:2,endVerse:141},
  {startSurah:2,startVerse:142,endSurah:2,endVerse:202},
  {startSurah:2,startVerse:203,endSurah:2,endVerse:252},
  {startSurah:2,startVerse:253,endSurah:3,endVerse:14},
  {startSurah:3,startVerse:15,endSurah:3,endVerse:92},
  {startSurah:3,startVerse:93,endSurah:3,endVerse:163},
  {startSurah:3,startVerse:164,endSurah:4,endVerse:23},
  {startSurah:4,startVerse:23,endSurah:4,endVerse:87},
  {startSurah:4,startVerse:88,endSurah:4,endVerse:147},
  {startSurah:4,startVerse:148,endSurah:5,endVerse:26},
  {startSurah:5,startVerse:27,endSurah:5,endVerse:81},
  {startSurah:5,startVerse:82,endSurah:6,endVerse:29},
  {startSurah:6,startVerse:30,endSurah:6,endVerse:110},
  {startSurah:6,startVerse:111,endSurah:6,endVerse:165},
  {startSurah:7,startVerse:1,endSurah:7,endVerse:84},
  {startSurah:7,startVerse:85,endSurah:7,endVerse:170},
  {startSurah:7,startVerse:171,endSurah:8,endVerse:40},
  {startSurah:8,startVerse:41,endSurah:9,endVerse:33},
  {startSurah:9,startVerse:34,endSurah:9,endVerse:89},
  {startSurah:9,startVerse:90,endSurah:10,endVerse:25},
  {startSurah:10,startVerse:26,endSurah:11,endVerse:5},
  {startSurah:11,startVerse:6,endSurah:11,endVerse:83},
  {startSurah:11,startVerse:84,endSurah:12,endVerse:52},
  {startSurah:12,startVerse:53,endSurah:13,endVerse:18},
  {startSurah:13,startVerse:19,endSurah:14,endVerse:52},
  {startSurah:15,startVerse:1,endSurah:16,endVerse:50},
  {startSurah:16,startVerse:51,endSurah:16,endVerse:128},
  {startSurah:17,startVerse:1,endSurah:17,endVerse:98},
  {startSurah:17,startVerse:99,endSurah:18,endVerse:74},
  {startSurah:18,startVerse:75,endSurah:19,endVerse:98},
  {startSurah:20,startVerse:1,endSurah:20,endVerse:135},
  {startSurah:21,startVerse:1,endSurah:21,endVerse:112},
  {startSurah:22,startVerse:1,endSurah:22,endVerse:78},
  {startSurah:23,startVerse:1,endSurah:24,endVerse:20},
  {startSurah:24,startVerse:21,endSurah:25,endVerse:20},
  {startSurah:25,startVerse:21,endSurah:26,endVerse:110},
  {startSurah:26,startVerse:111,endSurah:27,endVerse:53},
  {startSurah:27,startVerse:54,endSurah:28,endVerse:50},
  {startSurah:28,startVerse:51,endSurah:29,endVerse:45},
  {startSurah:29,startVerse:46,endSurah:31,endVerse:21},
  {startSurah:31,startVerse:22,endSurah:33,endVerse:30},
  {startSurah:33,startVerse:28,endSurah:34,endVerse:23},
  {startSurah:34,startVerse:24,endSurah:36,endVerse:27},
  {startSurah:36,startVerse:28,endSurah:37,endVerse:144},
  {startSurah:37,startVerse:145,endSurah:39,endVerse:31},
  {startSurah:39,startVerse:32,endSurah:40,endVerse:40},
  {startSurah:40,startVerse:41,endSurah:41,endVerse:46},
  {startSurah:41,startVerse:47,endSurah:43,endVerse:23},
  {startSurah:43,startVerse:24,endSurah:45,endVerse:37},
  {startSurah:46,startVerse:1,endSurah:48,endVerse:17},
  {startSurah:48,startVerse:18,endSurah:51,endVerse:30},
  {startSurah:51,startVerse:31,endSurah:54,endVerse:55},
  {startSurah:55,startVerse:1,endSurah:57,endVerse:29},
  {startSurah:58,startVerse:1,endSurah:61,endVerse:14},
  {startSurah:62,startVerse:1,endSurah:66,endVerse:12},
  {startSurah:67,startVerse:1,endSurah:71,endVerse:28},
  {startSurah:72,startVerse:1,endSurah:77,endVerse:50},
  {startSurah:78,startVerse:1,endSurah:86,endVerse:17},
  {startSurah:87,startVerse:1,endSurah:114,endVerse:6}
]

export function getHizbStart(h: number): { surah: number; verse: number; nameAr: string; nameFr: string } {
  const d = HIZB_SURAH_MAP[h - 1]
  return { surah: d.startSurah, verse: d.startVerse, nameAr: SURAH_NAMES_AR[d.startSurah - 1], nameFr: SURAH_NAMES_FR[d.startSurah - 1] }
}

export function getHizbEnd(h: number): { surah: number; verse: number; nameAr: string; nameFr: string } {
  const d = HIZB_SURAH_MAP[h - 1]
  return { surah: d.endSurah, verse: d.endVerse, nameAr: SURAH_NAMES_AR[d.endSurah - 1], nameFr: SURAH_NAMES_FR[d.endSurah - 1] }
}

export function getSurahHizbs(surahNum: number): number[] {
  const res: number[] = []
  for (let h = 1; h <= 60; h++) {
    const d = HIZB_SURAH_MAP[h - 1]
    if (d.startSurah <= surahNum && d.endSurah >= surahNum) res.push(h)
  }
  return res
}

export function getHizbSurahs(h: number): number[] {
  const d = HIZB_SURAH_MAP[h - 1]
  const surahs: number[] = []
  for (let i = d.startSurah; i <= d.endSurah; i++) surahs.push(i)
  return surahs
}

export const SURAH_TO_AHZAB: Record<number, number[]> = {}
for (let s = 1; s <= 114; s++) {
  SURAH_TO_AHZAB[s] = getSurahHizbs(s)
}
