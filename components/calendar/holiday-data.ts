export type HolidayType = "gazetted" | "restricted" | "regional";

export type HolidayEntry = {
  date: string;
  labels: string[];
  type: HolidayType;
};

const EXACT_HOLIDAYS_BY_YEAR: Record<number, HolidayEntry[]> = {
  2026: [
    { date: "2026-01-01", labels: ["New Year's Day"], type: "restricted" },
    { date: "2026-01-13", labels: ["Lohri"], type: "regional" },
    {
      date: "2026-01-14",
      labels: ["Makar Sankranti", "Magha Bihu", "Pongal"],
      type: "restricted"
    },
    { date: "2026-01-23", labels: ["Sri Panchmi", "Basant Panchmi"], type: "restricted" },
    { date: "2026-01-26", labels: ["Republic Day"], type: "gazetted" },
    { date: "2026-02-01", labels: ["Guru Ravi Das Jayanti"], type: "restricted" },
    { date: "2026-02-12", labels: ["Swami Dayananda Saraswati Jayanti"], type: "restricted" },
    { date: "2026-02-15", labels: ["Maha Shivratri"], type: "restricted" },
    { date: "2026-02-19", labels: ["Shivaji Jayanti"], type: "restricted" },
    { date: "2026-03-03", labels: ["Holika Dahan", "Dol Yatra"], type: "restricted" },
    { date: "2026-03-04", labels: ["Holi"], type: "gazetted" },
    {
      date: "2026-03-19",
      labels: ["Chaitra Sukladi", "Gudi Padwa", "Ugadi", "Cheti Chand"],
      type: "restricted"
    },
    { date: "2026-03-20", labels: ["Jamat-Ul-Vida"], type: "restricted" },
    { date: "2026-03-21", labels: ["Id-ul-Fitr"], type: "gazetted" },
    { date: "2026-03-26", labels: ["Ram Navami"], type: "gazetted" },
    { date: "2026-03-31", labels: ["Mahavir Jayanti"], type: "gazetted" },
    { date: "2026-04-03", labels: ["Good Friday"], type: "gazetted" },
    { date: "2026-04-05", labels: ["Easter Sunday"], type: "restricted" },
    {
      date: "2026-04-14",
      labels: ["Dr. B.R. Ambedkar Jayanti", "Vaisakhi", "Vishu", "Tamil New Year"],
      type: "gazetted"
    },
    { date: "2026-04-15", labels: ["Vaisakhadi", "Bahag Bihu"], type: "restricted" },
    { date: "2026-05-01", labels: ["Buddha Purnima", "May Day"], type: "gazetted" },
    { date: "2026-05-09", labels: ["Rabindranath Tagore Jayanti"], type: "restricted" },
    { date: "2026-05-27", labels: ["Id-ul-Zuha", "Bakrid"], type: "gazetted" },
    { date: "2026-06-26", labels: ["Muharram"], type: "gazetted" },
    { date: "2026-07-16", labels: ["Rath Yatra"], type: "restricted" },
    {
      date: "2026-08-15",
      labels: ["Independence Day", "Parsi New Year", "Nauraj"],
      type: "gazetted"
    },
    {
      date: "2026-08-26",
      labels: ["Milad-un-Nabi", "Id-e-Milad", "Onam", "Thiru Onam Day"],
      type: "gazetted"
    },
    { date: "2026-08-28", labels: ["Raksha Bandhan"], type: "restricted" },
    { date: "2026-09-04", labels: ["Janmashtami"], type: "gazetted" },
    { date: "2026-09-14", labels: ["Ganesh Chaturthi"], type: "restricted" },
    { date: "2026-10-02", labels: ["Gandhi Jayanti"], type: "gazetted" },
    { date: "2026-10-18", labels: ["Dussehra Saptami"], type: "restricted" },
    { date: "2026-10-19", labels: ["Dussehra Mahashtami"], type: "restricted" },
    { date: "2026-10-20", labels: ["Dussehra", "Mahanavami"], type: "gazetted" },
    { date: "2026-10-26", labels: ["Maharishi Valmiki Jayanti"], type: "restricted" },
    { date: "2026-10-29", labels: ["Karwa Chauth"], type: "restricted" },
    { date: "2026-11-08", labels: ["Diwali", "Naraka Chaturdasi"], type: "gazetted" },
    { date: "2026-11-09", labels: ["Govardhan Puja"], type: "restricted" },
    { date: "2026-11-11", labels: ["Bhai Duj"], type: "restricted" },
    { date: "2026-11-15", labels: ["Chhat Puja", "Surya Shashthi"], type: "restricted" },
    {
      date: "2026-11-24",
      labels: ["Guru Nanak Jayanti", "Guru Teg Bahadur Martyrdom Day"],
      type: "gazetted"
    },
    { date: "2026-12-23", labels: ["Hazrat Ali's Birthday"], type: "restricted" },
    { date: "2026-12-24", labels: ["Christmas Eve"], type: "restricted" },
    { date: "2026-12-25", labels: ["Christmas Day"], type: "gazetted" }
  ]
};

const RECURRING_HOLIDAYS: HolidayEntry[] = [
  { date: "0000-01-01", labels: ["New Year's Day"], type: "restricted" },
  { date: "0000-01-13", labels: ["Lohri"], type: "regional" },
  {
    date: "0000-01-14",
    labels: ["Makar Sankranti", "Magha Bihu", "Pongal"],
    type: "restricted"
  },
  { date: "0000-01-26", labels: ["Republic Day"], type: "gazetted" },
  { date: "0000-08-15", labels: ["Independence Day"], type: "gazetted" },
  { date: "0000-10-02", labels: ["Gandhi Jayanti"], type: "gazetted" },
  { date: "0000-12-25", labels: ["Christmas Day"], type: "gazetted" }
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getRecurringKey(date: Date) {
  return `0000-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getHolidayMapForMonth(monthDate: Date) {
  const yearEntries = EXACT_HOLIDAYS_BY_YEAR[monthDate.getFullYear()] ?? [];
  const map = new Map<string, HolidayEntry>();

  for (const entry of RECURRING_HOLIDAYS) {
    if (entry.date.slice(5, 7) === pad(monthDate.getMonth() + 1)) {
      map.set(entry.date, entry);
    }
  }

  for (const entry of yearEntries) {
    if (entry.date.startsWith(`${monthDate.getFullYear()}-${pad(monthDate.getMonth() + 1)}`)) {
      map.set(entry.date, entry);
    }
  }

  return {
    byDate(date: Date) {
      return map.get(getDateKey(date)) ?? map.get(getRecurringKey(date));
    }
  };
}
