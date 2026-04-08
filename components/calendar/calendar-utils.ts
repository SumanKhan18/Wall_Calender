export type CalendarDay = {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
};

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date).toUpperCase();
}

export function getYearLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(date);
}

export function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) {
    return false;
  }

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isWeekend(date: Date) {
  const weekday = date.getDay();
  return weekday === 0 || weekday === 6;
}

export function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function getCalendarDays(monthDate: Date): CalendarDay[] {
  const firstDay = startOfMonth(monthDate);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === monthDate.getMonth()
    };
  });
}

export function normalizeRange(start: Date | null, end: Date | null) {
  if (!start && !end) {
    return { from: null, to: null };
  }

  if (start && !end) {
    return { from: start, to: start };
  }

  if (!start && end) {
    return { from: end, to: end };
  }

  if (start!.getTime() <= end!.getTime()) {
    return { from: start, to: end };
  }

  return { from: end, to: start };
}

export function isWithinRange(date: Date, start: Date | null, end: Date | null) {
  const { from, to } = normalizeRange(start, end);
  if (!from || !to) {
    return false;
  }

  return date >= stripTime(from) && date <= stripTime(to);
}

export function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
