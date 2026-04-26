const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  weekday: "short",
  day: "numeric",
  month: "short",
});

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const parseSlotDate = (value) => new Date(value);

export const formatDateParam = (date) => date.toISOString().slice(0, 10);

export const getWeekMonday = (dateInput = new Date()) => {
  const date = dateInput instanceof Date ? new Date(dateInput.getTime()) : new Date(dateInput);
  const midnight = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)
  );
  const day = midnight.getUTCDay();
  const offset = day === 0 ? -6 : 1 - day;
  midnight.setUTCDate(midnight.getUTCDate() + offset);
  return midnight;
};

export const addWeeks = (date, amount) => {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + amount * 7);
  return next;
};

export const getCurrentWeekStart = () => formatDateParam(getWeekMonday());

export const formatWeekRange = (weekStart) => {
  const start = getWeekMonday(weekStart);
  const end = new Date(start.getTime());
  end.setUTCDate(start.getUTCDate() + 4);
  return `${DATE_FORMATTER.format(start)} - ${DATE_FORMATTER.format(end)}`;
};

export const isPreviousWeekDisabled = (weekStart) => {
  const currentMonday = getWeekMonday();
  const visibleMonday = getWeekMonday(weekStart);
  return visibleMonday <= currentMonday;
};

export const formatSlotSummary = (slot) => {
  if (!slot?.slotStart) {
    return "No slot selected";
  }

  const start = parseSlotDate(slot.slotStart);
  const end = parseSlotDate(slot.slotEnd);
  return `${FULL_DATE_FORMATTER.format(start)}, ${TIME_FORMATTER.format(start)}-${TIME_FORMATTER.format(end)} GMT`;
};

export const formatSlotA11yLabel = (day, slot) => {
  const date = parseSlotDate(slot.slotStart);
  const status = slot.available ? "available" : "unavailable";
  return `${FULL_DATE_FORMATTER.format(date)}, ${slot.label} GMT, ${status}`;
};
