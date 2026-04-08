"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  formatLongDate,
  getCalendarDays,
  getMonthLabel,
  getYearLabel,
  isSameDay,
  isWeekend,
  isWithinRange,
  normalizeRange,
  stripTime,
  WEEKDAYS
} from "./calendar-utils";
import { getHolidayMapForMonth } from "./holiday-data";
import { getMonthTheme } from "./month-data";
import { MonthControls } from "./month-controls";
import { SpiralBinding } from "./spiral-binding";

const NOTES_STORAGE_KEY = "wall-calendar-general-notes";
const RANGE_TASKS_STORAGE_KEY = "wall-calendar-range-tasks";

type RangeState = {
  start: Date | null;
  end: Date | null;
};

type RangeTask = {
  id: string;
  from: string;
  to: string;
  task: string;
  monthKey: string;
};

function NotesPaper({
  notes,
  onChange,
  selectedRange,
  draftTask,
  onDraftTaskChange,
  onSaveTask,
  editingTaskId,
  onEditTask,
  onDeleteTask,
  rangeTasks
}: {
  notes: string;
  onChange: (value: string) => void;
  selectedRange: { from: Date; to: Date } | null;
  draftTask: string;
  onDraftTaskChange: (value: string) => void;
  onSaveTask: () => void;
  editingTaskId: string | null;
  onEditTask: (task: RangeTask) => void;
  onDeleteTask: (taskId: string) => void;
  rangeTasks: RangeTask[];
}) {
  return (
    <section className="relative order-2 min-h-0 h-[360px] max-h-[360px] overflow-y-auto overscroll-contain rounded-b-[2.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,244,238,0.94))] px-4 py-4 backdrop-blur-[1px] [touch-action:pan-y] [-webkit-overflow-scrolling:touch] sm:order-none sm:h-full sm:max-h-none sm:overflow-hidden sm:rounded-bl-[2.4rem] sm:rounded-br-none sm:px-7 sm:py-6 lg:max-h-none">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
          Notes
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 top-14 bg-[repeating-linear-gradient(180deg,transparent,transparent_28px,rgba(148,163,184,0.28)_28px,rgba(148,163,184,0.28)_29px)] sm:inset-x-8 sm:bottom-6 sm:top-16 sm:bg-[repeating-linear-gradient(180deg,transparent,transparent_33px,rgba(148,163,184,0.28)_33px,rgba(148,163,184,0.28)_34px)]" />
      <div className="relative z-10 pr-1 sm:h-[calc(100%-2.6rem)] sm:max-h-none sm:overflow-y-auto sm:overscroll-contain sm:pr-2 lg:h-[calc(100%-2.6rem)] lg:max-h-none">
        <div className="pb-6">
          <div>
            <p className="mb-2 font-display text-[0.62rem] font-bold uppercase tracking-[0.3em] text-slate-400">
              General Notes
            </p>
            <textarea
              value={notes}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Plan the month, pin reminders, sketch travel ideas..."
              className="h-20 w-full resize-none border-none bg-transparent text-[0.82rem] leading-[1.55rem] text-slate-700 outline-none placeholder:text-slate-400 sm:h-28 sm:text-[0.9rem] sm:leading-[1.8rem]"
            />
          </div>

          <div className="mt-4 rounded-[1.3rem] border border-slate-200/80 bg-white/75 p-3 shadow-[0_10px_20px_rgba(15,23,42,0.04)] sm:mt-5 sm:rounded-[1.45rem] sm:p-4">
            <p className="font-display text-[0.62rem] font-bold uppercase tracking-[0.3em] text-slate-400">
              Range Task
            </p>
            {selectedRange ? (
              <>
                <p className="mt-2 text-[0.88rem] font-semibold text-slate-700 sm:mt-3 sm:text-sm">
                  {formatLongDate(selectedRange.from)} - {formatLongDate(selectedRange.to)}
                </p>
                <textarea
                  value={draftTask}
                  onChange={(event) => onDraftTaskChange(event.target.value)}
                  placeholder="Task for this selected date range..."
                  className="mt-2 h-14 w-full resize-none rounded-2xl border border-slate-200 bg-white/85 px-3 py-2.5 text-[0.84rem] text-slate-700 outline-none placeholder:text-slate-400 sm:mt-3 sm:h-20 sm:px-4 sm:py-3 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={onSaveTask}
                  className="mt-2 rounded-full bg-sky-600 px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-sky-700 sm:mt-3 sm:text-xs sm:tracking-[0.25em]"
                >
                  {editingTaskId ? "Update Task" : "Save Task"}
                </button>
              </>
            ) : (
              <p className="mt-2 text-[0.82rem] text-slate-500 sm:mt-3 sm:text-sm">
                Select a start date and end date to create a dedicated task note.
              </p>
            )}
          </div>

          <div className="mt-3 space-y-2 sm:mt-4">
            {rangeTasks.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.25rem] border border-slate-200/80 bg-white/78 p-3 shadow-[0_8px_16px_rgba(15,23,42,0.04)] sm:p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[0.54rem] font-bold uppercase tracking-[0.24em] text-slate-400 sm:text-[0.62rem] sm:tracking-[0.3em]">
                      {item.from} - {item.to}
                    </p>
                    <p className="mt-1.5 text-[0.82rem] leading-5 text-slate-700 sm:mt-2 sm:text-sm sm:leading-6">{item.task}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditTask(item)}
                      className="rounded-full border border-slate-200 px-2.5 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-slate-500 transition hover:border-slate-300 hover:text-slate-700 sm:px-3 sm:text-[0.62rem] sm:tracking-[0.18em]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(item.id)}
                      className="rounded-full border border-rose-100 px-2.5 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-rose-500 transition hover:border-rose-200 hover:text-rose-700 sm:px-3 sm:text-[0.62rem] sm:tracking-[0.18em]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CalendarGrid({
  monthDate,
  range,
  hoverDate,
  onDateClick,
  onDateHover
}: {
  monthDate: Date;
  range: RangeState;
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
}) {
  const today = useMemo(() => stripTime(new Date()), []);
  const days = useMemo(() => getCalendarDays(monthDate), [monthDate]);
  const holidays = useMemo(() => getHolidayMapForMonth(monthDate), [monthDate]);
  const previewRange =
    range.start && !range.end && hoverDate ? normalizeRange(range.start, hoverDate) : null;

  return (
    <section className="rounded-br-[2.4rem] bg-white/88 px-2 py-3 sm:h-full sm:min-h-0 sm:overflow-y-auto sm:px-6 sm:py-5">
      <div className="mb-0 grid grid-cols-7 gap-0 border border-b-0 border-[#dfd7cb]/90">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="border-r border-[#dfd7cb]/90 bg-[#faf7f2] px-1 py-1.5 text-center font-display text-[0.44rem] font-bold uppercase tracking-[0.16em] text-slate-500 last:border-r-0 sm:px-2 sm:py-3 sm:text-[0.62rem] sm:tracking-[0.28em]"
          >
            {weekday}
          </div>
        ))}
      </div>
      <div className="grid min-h-[500px] grid-cols-7 grid-rows-6 gap-0 border border-[#dfd7cb]/90 border-t-0 sm:min-h-[560px] lg:h-[calc(100%-2.7rem)] lg:min-h-0">
        {days.map(({ date, dayNumber, isCurrentMonth }) => {
          const day = stripTime(date);
          const holiday = isCurrentMonth ? holidays.byDate(day) : undefined;
          const isToday = isSameDay(day, today);
          const isSelectedStart = isSameDay(day, range.start);
          const isSelectedEnd = isSameDay(day, range.end);
          const isSelected = isWithinRange(day, range.start, range.end);
          const isPreview =
            !isSelected &&
            previewRange?.from &&
            previewRange?.to &&
            day >= stripTime(previewRange.from) &&
            day <= stripTime(previewRange.to);
          const weekend = isWeekend(day);
          const holidayLabels = holiday?.labels ?? [];
          const isSpecialDate = holidayLabels.length > 0;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDateClick(day)}
              onMouseEnter={() => onDateHover(day)}
              onMouseLeave={() => onDateHover(null)}
              className={[
                "calendar-cell-transition relative h-full overflow-hidden border-r border-b text-left",
                "px-1 py-0.5 sm:px-2 sm:py-2",
                isCurrentMonth ? "bg-white/84" : "bg-[#f7f3ee]/55",
                isSelected ? "border-sky-400/40 bg-sky-100/95 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.18)]" : "",
                isPreview ? "border-sky-200/60 bg-sky-50/90" : "",
                isSelectedStart || isSelectedEnd
                  ? "bg-sky-500 text-white shadow-md shadow-sky-200/70"
                  : "",
                !isCurrentMonth ? "text-slate-300" : weekend || isSpecialDate ? "text-[#ea7f18]" : "text-slate-800"
              ].join(" ")}
              style={{
                borderRadius: 0
              }}
            >
              <span
                className={[
                  "block font-display leading-none",
                  isCurrentMonth ? "text-[0.88rem] sm:text-[1.9rem]" : "text-[0.72rem] sm:text-[1.42rem]",
                  isSelectedStart || isSelectedEnd ? "text-white" : "",
                  weekend || isSpecialDate ? "font-semibold" : "font-medium",
                  holiday?.type === "gazetted" ? "text-[#ea7f18]" : "",
                  holiday?.type === "restricted" ? "text-[#ea7f18]" : ""
                ].join(" ")}
              >
                {dayNumber}
              </span>
              <div className="mt-0.5 space-y-0 sm:mt-1.5 sm:space-y-0.5">
                {holidayLabels.length > 0 ? (
                  holidayLabels.map((label) => (
                    <span
                      key={label}
                      className={[
                        "block overflow-hidden text-ellipsis whitespace-nowrap text-[0.24rem] font-semibold leading-[1.02] sm:text-[0.48rem]",
                        isSelectedStart || isSelectedEnd
                          ? "text-white/90"
                          : holiday?.type === "regional"
                            ? "text-[#c76d18]"
                            : "text-[#ea7f18]"
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  ))
                ) : (
                  <span
                    className={[
                      "block text-[0.24rem] font-medium leading-tight sm:text-[0.5rem]",
                      isSelectedStart || isSelectedEnd ? "text-white/90" : "text-slate-400"
                    ].join(" ")}
                  >
                    {new Intl.DateTimeFormat("en-US", {
                      weekday: "short"
                    }).format(day)}
                  </span>
                )}
              </div>
              {holiday && holiday.type === "gazetted" && (
                <span
                  className={[
                    "absolute right-1 top-1 text-[0.38rem] font-bold leading-none sm:right-3 sm:top-2 sm:text-xs",
                    isSelectedStart || isSelectedEnd ? "text-white/90" : "text-[#ea7f18]"
                  ].join(" ")}
                >
                  *
                </span>
              )}
              {isToday && (
                <span className="absolute bottom-0.5 left-0.5 rounded-full bg-amber-100 px-1 py-0.5 text-[0.28rem] font-bold uppercase tracking-[0.06em] text-amber-700 sm:bottom-2 sm:left-3 sm:px-2 sm:text-[0.58rem] sm:tracking-[0.18em]">
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FlipShadow({ active }: { active: boolean }) {
  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{
        opacity: active ? 1 : 0
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute inset-x-8 top-16 z-20 h-[65%] rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.04)_26%,transparent_55%)] blur-xl"
    />
  );
}

function CalendarPage({
  monthLabel,
  yearLabel,
  displayMonth,
  monthImage,
  monthSubtitle,
  range,
  hoverDate,
  notes,
  rangeTasks,
  draftTask,
  onNotesChange,
  onDraftTaskChange,
  onSaveTask,
  editingTaskId,
  onEditTask,
  onDeleteTask,
  onDateClick,
  onDateHover,
  onClearRange
}: {
  monthLabel: string;
  yearLabel: string;
  displayMonth: Date;
  monthImage: string;
  monthSubtitle: string;
  range: RangeState;
  hoverDate: Date | null;
  notes: string;
  rangeTasks: RangeTask[];
  draftTask: string;
  onNotesChange: (value: string) => void;
  onDraftTaskChange: (value: string) => void;
  onSaveTask: () => void;
  editingTaskId: string | null;
  onEditTask: (task: RangeTask) => void;
  onDeleteTask: (taskId: string) => void;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  onClearRange: () => void;
}) {
  return (
    <div className="grid h-full min-h-0 grid-rows-[240px_auto] sm:grid-rows-[39%_61%]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0)_32%,rgba(15,23,42,0.12))]" />
        <Image
          src={monthImage}
          alt="A mountaineer climbing a steep mountain face"
          fill
          priority
          className="object-cover object-[center_68%] scale-[1.34] saturate-[0.94] sepia-[0.08] sm:object-center sm:scale-100"
          sizes="(max-width: 1024px) 100vw, 1080px"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.5),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(15,23,42,0.07)_55%,rgba(15,23,42,0.28))]" />
        <div className="absolute bottom-0 left-0 h-[28%] w-[42%] bg-white [clip-path:polygon(0_22%,100%_100%,0_100%)]" />
        <div className="absolute bottom-0 right-0 h-[42%] w-[64%] bg-[linear-gradient(135deg,rgba(30,102,150,0.96),rgba(45,157,220,0.94))] shadow-[-18px_-10px_28px_rgba(15,23,42,0.14)] [clip-path:polygon(16%_100%,100%_18%,100%_100%)]" />
        <div className="absolute bottom-0 right-[5%] h-[28%] w-[22%] bg-sky-300/90 [clip-path:polygon(0_100%,46%_44%,100%_100%)]" />
        <div className="absolute bottom-[7%] right-[4.5%] z-10 flex min-w-[150px] max-w-[48%] flex-col items-end rounded-tl-[1.4rem] bg-[linear-gradient(135deg,rgba(16,54,86,0.86),rgba(22,111,169,0.84))] px-3 py-2.5 text-right text-white shadow-[0_18px_34px_rgba(15,23,42,0.2)] backdrop-blur-[2px] sm:min-w-[235px] sm:rounded-tl-[2rem] sm:px-5 sm:py-4">
          <p className="mb-1 font-display text-[0.48rem] font-bold uppercase tracking-[0.28em] text-white/72 sm:mb-2 sm:text-[0.64rem] sm:tracking-[0.36em]">
            {monthSubtitle}
          </p>
          <div className="mb-1 h-px w-14 bg-white/30 sm:mb-2 sm:w-24" />
          <p className="font-display text-[0.82rem] font-semibold tracking-[0.18em] text-white/90 sm:text-[1.02rem] sm:tracking-[0.24em]">
            {yearLabel}
          </p>
          <h1 className="font-display text-[1.75rem] font-black uppercase leading-none tracking-[0.06em] drop-shadow-[0_4px_16px_rgba(15,23,42,0.2)] sm:text-[2.8rem] md:text-[3.3rem]">
            {monthLabel}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 grid-rows-[auto_auto] bg-white/92 sm:min-h-0 sm:grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[0.9fr_1.24fr] lg:grid-rows-1">
        <NotesPaper
          notes={notes}
          onChange={onNotesChange}
          selectedRange={range.start && range.end ? { from: range.start, to: range.end } : null}
          draftTask={draftTask}
          onDraftTaskChange={onDraftTaskChange}
          onSaveTask={onSaveTask}
          editingTaskId={editingTaskId}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          rangeTasks={rangeTasks}
        />
        <div className="order-1 flex min-h-0 flex-col border-b border-slate-200/70 lg:order-none lg:border-b-0 lg:border-l lg:border-t-0">
          <div className="flex flex-col gap-1.5 px-2 pb-1.5 pt-2 sm:px-6 sm:pt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="min-w-0">
              <p className="font-display text-[0.58rem] font-bold uppercase tracking-[0.24em] text-slate-400 sm:text-[0.68rem] sm:tracking-[0.32em]">
                Date Selection
              </p>
              <p className="mt-1 text-[0.72rem] text-slate-600 sm:mt-2 sm:text-[0.95rem]">
                {range.start && range.end
                  ? `${formatLongDate(range.start)} - ${formatLongDate(range.end)}`
                  : range.start
                    ? `Start: ${formatLongDate(range.start)}`
                    : "Click a date to begin a range."}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1 sm:mt-3 sm:gap-2">
                <span className="rounded-full bg-rose-50 px-2 py-1 text-[0.45rem] font-bold uppercase tracking-[0.08em] text-rose-700 sm:px-3 sm:text-[0.62rem] sm:tracking-[0.18em]">
                  Gazetted
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[0.45rem] font-bold uppercase tracking-[0.08em] text-emerald-700 sm:px-3 sm:text-[0.62rem] sm:tracking-[0.18em]">
                  Restricted
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[0.45rem] font-bold uppercase tracking-[0.08em] text-slate-600 sm:px-3 sm:text-[0.62rem] sm:tracking-[0.18em]">
                  Regional
                </span>
                <button
                  type="button"
                  onClick={onClearRange}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-[0.48rem] font-semibold uppercase tracking-[0.08em] text-slate-500 transition hover:border-slate-300 hover:text-slate-700 sm:px-4 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.22em]"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="min-h-0 flex-1 lg:overflow-y-auto">
            <CalendarGrid
              monthDate={displayMonth}
              range={range}
              hoverDate={hoverDate}
              onDateClick={onDateClick}
              onDateHover={onDateHover}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WallCalendar() {
  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [range, setRange] = useState<RangeState>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [rangeTasks, setRangeTasks] = useState<RangeTask[]>([]);
  const [draftTask, setDraftTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [notesReady, setNotesReady] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const savedNotes = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
      setNotes(savedNotes);
    }
    const savedTasks = window.localStorage.getItem(RANGE_TASKS_STORAGE_KEY);
    if (savedTasks) {
      setRangeTasks(JSON.parse(savedTasks));
    }
    setNotesReady(true);
  }, []);

  useEffect(() => {
    if (!notesReady) {
      return;
    }

    window.localStorage.setItem(NOTES_STORAGE_KEY, notes);
  }, [notes, notesReady]);

  useEffect(() => {
    if (!notesReady) {
      return;
    }

    window.localStorage.setItem(RANGE_TASKS_STORAGE_KEY, JSON.stringify(rangeTasks));
  }, [rangeTasks, notesReady]);

  const monthKey = `${displayMonth.getFullYear()}-${displayMonth.getMonth()}`;
  const monthLabel = getMonthLabel(displayMonth);
  const yearLabel = getYearLabel(displayMonth);
  const monthTheme = getMonthTheme(displayMonth.getMonth());
  const visibleRangeTasks = useMemo(
    () => rangeTasks.filter((item) => item.monthKey === monthKey),
    [rangeTasks, monthKey]
  );

  function changeMonth(step: 1 | -1) {
    setDirection(step);
    setIsFlipping(true);
    setDisplayMonth((current) => addMonths(current, step));
  }

  function handleDateClick(date: Date) {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
      return;
    }

    if (range.start && !range.end) {
      const normalized = normalizeRange(range.start, date);
      setRange({ start: normalized.from, end: normalized.to });
      setDraftTask("");
    }
  }

  function handleSaveTask() {
    if (!range.start || !range.end || !draftTask.trim()) {
      return;
    }

    const start = range.start;
    const end = range.end;
    const taskText = draftTask.trim();

    if (editingTaskId) {
      setRangeTasks((current) =>
        current.map((item) =>
          item.id === editingTaskId
            ? {
                ...item,
                from: formatLongDate(start),
                to: formatLongDate(end),
                task: taskText,
                monthKey,
                fromValue: start.toISOString(),
                toValue: end.toISOString()
              }
            : item
        )
      );
      setEditingTaskId(null);
    } else {
      setRangeTasks((current) => [
        {
          id: `${start.toISOString()}-${end.toISOString()}-${Date.now()}`,
          from: formatLongDate(start),
          to: formatLongDate(end),
          task: taskText,
          monthKey,
          fromValue: start.toISOString(),
          toValue: end.toISOString()
        },
        ...current
      ]);
    }
    setDraftTask("");
  }

  function handleEditTask(task: RangeTask) {
    setEditingTaskId(task.id);
    setDraftTask(task.task);
  }

  function handleDeleteTask(taskId: string) {
    setRangeTasks((current) => current.filter((item) => item.id !== taskId));
    if (editingTaskId === taskId) {
      setEditingTaskId(null);
      setDraftTask("");
    }
  }

  return (
    <div className="relative w-full max-w-[1000px] pb-3 pt-4 sm:pb-8 sm:pt-10">
      <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-6 w-1 -translate-x-1/2 rounded-full bg-slate-500/70 shadow-[0_10px_16px_rgba(15,23,42,0.22)] sm:h-8 sm:w-1.5" />
      <div className="pointer-events-none absolute left-1/2 top-5 z-30 h-4 w-4 -translate-x-1/2 rounded-full border border-slate-500/40 bg-slate-100/75 shadow-inner sm:top-7 sm:h-5 sm:w-5" />
      <div className="pointer-events-none absolute inset-x-4 top-7 z-0 h-[94%] rounded-[2rem] bg-[linear-gradient(180deg,rgba(240,236,230,0.76),rgba(225,220,211,0.64))] shadow-[0_45px_55px_rgba(15,23,42,0.08)] [transform:perspective(1800px)_rotateX(2deg)_rotateZ(-0.5deg)_translateY(10px)] sm:inset-x-10 sm:top-12 sm:h-[88%] sm:rounded-[2.7rem]" />
      <div className="pointer-events-none absolute inset-x-5 top-9 z-0 h-[94%] rounded-[2rem] border border-white/30 bg-[linear-gradient(180deg,rgba(252,251,248,0.65),rgba(238,233,225,0.75))] [transform:perspective(1800px)_rotateX(2deg)_rotateZ(-0.2deg)_translateY(18px)] sm:inset-x-12 sm:top-14 sm:h-[88%] sm:rounded-[2.7rem]" />

      <section className="paper-shadow paper-grain relative mx-auto overflow-hidden rounded-[2.6rem] border border-white/60 shadow-paper [transform:perspective(1800px)_rotateX(2deg)_rotateZ(-0.8deg)]">
        <SpiralBinding />
        <MonthControls onPrevious={() => changeMonth(-1)} onNext={() => changeMonth(1)} />
        <FlipShadow active={isFlipping} />

        <div className="relative min-h-[1180px] [perspective:2400px] sm:h-[84vh] sm:min-h-[680px] sm:max-h-[860px]">
          <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={() => {
              setIsFlipping(false);
            }}
          >
            <motion.div
              key={monthKey}
              initial={{
                rotateX: direction > 0 ? 84 : -84,
                rotateY: direction > 0 ? -12 : 12,
                opacity: 0.75,
                y: direction > 0 ? -42 : 42,
                z: -120,
                filter: "blur(1.4px)",
                boxShadow: "0 38px 48px rgba(15,23,42,0.14)"
              }}
              animate={{
                rotateX: 0,
                rotateY: 0,
                opacity: 1,
                y: 0,
                z: 0,
                filter: "blur(0px)",
                boxShadow: "0 26px 34px rgba(15,23,42,0.1)"
              }}
              exit={{
                rotateX: direction > 0 ? -126 : 126,
                rotateY: direction > 0 ? 14 : -14,
                y: direction > 0 ? -56 : 56,
                z: 110,
                opacity: 0.08,
                filter: "blur(2.8px)",
                boxShadow: "0 56px 72px rgba(15,23,42,0.22)"
              }}
              transition={{
                duration: 1.05,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="flip-page absolute inset-0 origin-top"
              style={{
                transformStyle: "preserve-3d"
              }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <CalendarPage
                  monthLabel={monthLabel}
                  yearLabel={yearLabel}
                  displayMonth={displayMonth}
                  monthImage={monthTheme.image}
                  monthSubtitle={monthTheme.subtitle}
                  range={range}
                  hoverDate={hoverDate}
                  notes={notes}
                  rangeTasks={visibleRangeTasks}
                  draftTask={draftTask}
                  onNotesChange={setNotes}
                  onDraftTaskChange={setDraftTask}
                  onSaveTask={handleSaveTask}
                  editingTaskId={editingTaskId}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onDateClick={handleDateClick}
                  onDateHover={setHoverDate}
                  onClearRange={() => {
                    setRange({ start: null, end: null });
                    setHoverDate(null);
                    setEditingTaskId(null);
                    setDraftTask("");
                  }}
                />
              </div>

              <div
                aria-hidden
                className="absolute inset-0 rounded-[2.6rem] bg-[linear-gradient(180deg,rgba(248,246,240,0.98),rgba(232,228,219,0.98))] [backface-visibility:hidden]"
                style={{
                  transform: "rotateX(180deg)"
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.08),transparent_24%,rgba(15,23,42,0.04)_65%,rgba(15,23,42,0.08))]" />
                <div className="absolute inset-x-10 top-16 h-px bg-slate-300/60" />
                <div className="absolute inset-x-10 top-24 h-px bg-slate-300/30" />
                <div className="absolute bottom-12 left-10 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Reverse Print
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
