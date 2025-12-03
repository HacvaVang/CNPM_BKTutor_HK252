import React, { useState, useEffect, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parse,
  parseISO,
} from "date-fns";
import { vi } from "date-fns/locale";
import clsx from "clsx"; // <-- Thêm dòng này

// =======================================================================
// === 1. CALENDAR HEADER ===
// =======================================================================
const CalendarHeader = ({ currentDate, changeMonth, locale }) => {
  const prevMonth = subMonths(currentDate, 1);
  const nextMonth = addMonths(currentDate, 1);

  const formatMonth = (date) =>
    format(date, "MMMM", { locale }).charAt(0).toUpperCase() +
    format(date, "MMMM", { locale }).slice(1).toLowerCase();

  return (
    <div className="flex justify-between items-center px-4 pt-4 pb-2 bg-blue-600 border-b border-blue-700">
      <button
        onClick={() => changeMonth(-1)}
        className="text-blue-100 font-semibold text-sm hover:text-white transition duration-150 flex items-center p-2 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {formatMonth(prevMonth)}
      </button>

      <h2 className="text-xl font-bold text-white uppercase tracking-wider p-2">
        {format(currentDate, "MMMM yyyy", { locale })}
      </h2>

      <button
        onClick={() => changeMonth(1)}
        className="text-blue-100 font-semibold text-sm hover:text-white transition duration-150 flex items-center p-2 rounded-lg"
      >
        {formatMonth(nextMonth)}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// =======================================================================
// === 2. CALENDAR DAYS HEADER ===
// =======================================================================
const CalendarDaysHeader = () => {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="grid grid-cols-7 text-center font-bold text-blue-800 border-b border-gray-200 bg-blue-50 border-l border-r border-gray-200">
      {days.map((day, index) => (
        <div
          key={day}
          className={clsx(
            "py-2 text-sm border-r border-gray-200",
            index === 6 && "border-r-0"
          )}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

// =======================================================================
// === 3. CALENDAR CELLS ===
// =======================================================================
const CalendarCells = ({ calendarData, currentDate, today, events }) => {
  const getEventsForDay = (day) =>
    events.filter((event) => isSameDay(event.dateObject, day));

  return (
    <div className="grid grid-cols-7 border-l border-b border-gray-300">
      {calendarData.flat().map((day, index) => {
        const dayEvents = getEventsForDay(day);
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isToday = isSameDay(day, today);
        const eventLimit = 4;

        return (
          <div
            key={index}
            className={clsx(
              "min-h-[120px] p-1 border-t border-gray-300 transition duration-100 ease-in-out",
              (index + 1) % 7 === 0 ? "border-r-0" : "border-r",
              !isCurrentMonth
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-gray-800 hover:bg-blue-50"
            )}
          >
            {/* Số ngày */}
            <div className="flex justify-start px-1 pt-1">
              <span
                className={clsx(
                  "text-lg font-bold inline-block px-2 py-1 leading-none",
                  isToday && isCurrentMonth
                    ? "bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center"
                    : null,
                  !isCurrentMonth ? "text-gray-400" : "text-gray-900"
                )}
              >
                {format(day, "d")}
              </span>
            </div>

            {/* Danh sách sự kiện */}
            <div className="mt-1 space-y-0.5 px-1 text-sm">
              {dayEvents.slice(0, eventLimit).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start text-blue-700 hover:text-blue-900 cursor-pointer truncate"
                  title={event.title}
                >
                  <span className="inline-block w-2 h-2 mr-2 mt-1 rounded-full bg-blue-500 flex-shrink-0"></span>
                  <span className="truncate">{event.title}</span>
                </div>
              ))}

              {dayEvents.length > eventLimit && (
                <div className="text-xs text-blue-500 pt-1 cursor-pointer hover:underline pl-4 font-semibold">
                  + {dayEvents.length - eventLimit} nữa
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =======================================================================
// === 4. COMPONENT CHÍNH ===
// =======================================================================
export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(parseISO("2025-12-15"));
  const today = new Date();

  // Fetch mock data
  useEffect(() => {
    const fetchEvents = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockEvents = [
        { id: 101, title: "Assignment...", date: "2025-12-01", description: "Nộp bài tập lớn." },
        { id: 102, title: "Symbolic...", date: "2025-12-05", description: "Báo cáo Computation." },
        { id: 103, title: "Nội dung 1...", date: "2025-12-08", description: "Hội thảo 1." },
        { id: 104, title: "Nội dung 2...", date: "2025-12-08", description: "Hội thảo 2." },
        { id: 105, title: "Nội dung 3...", date: "2025-12-08", description: "Hội thảo 3." },
        { id: 106, title: "Nội dung 4...", date: "2025-12-08", description: "Hội thảo 4." },
        { id: 107, title: "Nội dung 5...", date: "2025-12-08", description: "Hội thảo 5." },
        { id: 108, title: "Nội dung 6...", date: "2025-12-08", description: "Hội thảo 6." },
        { id: 109, title: "Tự chọn...", date: "2025-12-15", description: "Ngày tự chọn." },
        { id: 110, title: "1. BÀI TẬP...", date: "2025-12-19", description: "Bài kiểm tra 1." },
        { id: 111, title: "2. BÀI TẬP...", date: "2025-12-19", description: "Bài kiểm tra 2." },
        { id: 112, title: "3. BÀI TẬP...", date: "2025-12-19", description: "Bài kiểm tra 3." },
        { id: 113, title: "4. BÀI TẬP...", date: "2025-12-19", description: "Bài kiểm tra 4." },
        { id: 201, title: "2024-HK Bắt đầu", date: "2025-11-23", description: "Bắt đầu học kỳ." },
      ];

      const processed = mockEvents.map((e) => ({
        ...e,
        dateObject: parse(e.date, "yyyy-MM-dd", new Date()),
      }));

      setEvents(processed);
    };

    fetchEvents();
  }, []);

  // Tính toán lưới lịch
  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      rows.push(week);
    }
    return rows;
  }, [currentDate]);

  const changeMonth = (direction) => {
    setCurrentDate(addMonths(currentDate, direction));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8">Lịch Công Việc</h1>

      <div className="max-w-7xl mx-auto border-4 border-purple-500 rounded-xl shadow-2xl overflow-hidden bg-purple-200">
        <CalendarHeader currentDate={currentDate} changeMonth={changeMonth} locale={vi} />

        <div>
          <CalendarDaysHeader />
          <CalendarCells
            calendarData={calendarData}
            currentDate={currentDate}
            today={today}
            events={events}
          />
        </div>
      </div>
    </div>
  );
}