const SLOT_DURATION_MINUTES = 30;
const BUSINESS_START_HOUR = 16;
const BUSINESS_END_HOUR = 18;
const BOOKABLE_WEEKDAYS = new Set([1, 2, 3, 4, 5]);
const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const parseDateInput = (dateInput) => {
  if (dateInput instanceof Date) {
    return Number.isNaN(dateInput.getTime()) ? null : new Date(dateInput.getTime());
  }

  if (typeof dateInput !== "string") {
    return null;
  }

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0));
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.getUTCFullYear() !== Number(year) ||
      parsed.getUTCMonth() !== Number(month) - 1 ||
      parsed.getUTCDate() !== Number(day)
    ) {
      return null;
    }
    return parsed;
  }

  const parsed = new Date(dateInput);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toDateOnly = (date) => date.toISOString().slice(0, 10);

const getWeekMonday = (dateInput) => {
  const date = parseDateInput(dateInput);
  if (!date) {
    return null;
  }

  const midnight = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)
  );
  const day = midnight.getUTCDay();
  const offset = day === 0 ? -6 : 1 - day;
  midnight.setUTCDate(midnight.getUTCDate() + offset);
  return midnight;
};

const isWeekday = (dateInput) => {
  const date = parseDateInput(dateInput);
  return Boolean(date && BOOKABLE_WEEKDAYS.has(date.getUTCDay()));
};

const getSlotEnd = (slotStart) => {
  const date = parseDateInput(slotStart);
  if (!date) {
    return null;
  }
  return new Date(date.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);
};

const isValidBookableSlot = (slotStart) => {
  const date = parseDateInput(slotStart);
  if (!date || !isWeekday(date)) {
    return false;
  }

  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();

  return (
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0 &&
    (minute === 0 || minute === 30) &&
    hour >= BUSINESS_START_HOUR &&
    (hour < BUSINESS_END_HOUR || (hour === BUSINESS_END_HOUR && minute === 0)) &&
    !(hour === BUSINESS_END_HOUR && minute === 0)
  );
};

const formatSlotLabel = (date) => {
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
};

const generateWeekSlots = (weekStart, bookedSlotStarts = new Set(), now = new Date()) => {
  const monday = getWeekMonday(weekStart);
  const bookedSet = bookedSlotStarts instanceof Set ? bookedSlotStarts : new Set(bookedSlotStarts);

  if (!monday) {
    return [];
  }

  return Array.from({ length: 5 }, (_, dayIndex) => {
    const dayDate = new Date(monday.getTime());
    dayDate.setUTCDate(monday.getUTCDate() + dayIndex);

    const slots = [];
    for (let hour = BUSINESS_START_HOUR; hour < BUSINESS_END_HOUR; hour += 1) {
      for (const minute of [0, 30]) {
        const slotStart = new Date(
          Date.UTC(dayDate.getUTCFullYear(), dayDate.getUTCMonth(), dayDate.getUTCDate(), hour, minute, 0, 0)
        );
        const slotEnd = getSlotEnd(slotStart);
        const slotStartIso = slotStart.toISOString();

        slots.push({
          slotStart: slotStartIso,
          slotEnd: slotEnd.toISOString(),
          label: formatSlotLabel(slotStart),
          available: slotStart > now && !bookedSet.has(slotStartIso),
        });
      }
    }

    return {
      date: toDateOnly(dayDate),
      weekday: WEEKDAY_LABELS[dayDate.getUTCDay()],
      slots,
    };
  });
};

module.exports = {
  SLOT_DURATION_MINUTES,
  BUSINESS_START_HOUR,
  BUSINESS_END_HOUR,
  getWeekMonday,
  isWeekday,
  isValidBookableSlot,
  getSlotEnd,
  generateWeekSlots,
};
