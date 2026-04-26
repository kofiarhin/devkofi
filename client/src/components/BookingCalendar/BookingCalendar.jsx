import { CaretLeft, CaretRight, WarningCircle } from "@phosphor-icons/react";
import { formatSlotA11yLabel } from "../../Pages/BookCall/bookCallDateUtils";
import "./booking-calendar.styles.scss";

const LoadingCalendar = () => (
  <div className="booking-calendar__grid" aria-label="Loading available slots">
    {Array.from({ length: 5 }).map((_, i) => (
      <div className="booking-calendar__day" key={i}>
        <div className="booking-calendar__day-heading">
          <span className="booking-calendar__skeleton booking-calendar__skeleton--name" />
          <span className="booking-calendar__skeleton booking-calendar__skeleton--date" />
        </div>
        <div className="booking-calendar__slots">
          {Array.from({ length: 4 }).map((__, j) => (
            <span className="booking-calendar__skeleton booking-calendar__skeleton--slot" key={j} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const BookingCalendar = ({
  days = [],
  isLoading,
  isError,
  selectedSlot,
  onSelectSlot,
  weekLabel,
  onPreviousWeek,
  onNextWeek,
  isPreviousDisabled,
}) => {
  const hasAvailableSlots = days.some((day) => day.slots.some((slot) => slot.available));

  return (
    <section className="booking-calendar" aria-labelledby="booking-calendar-title">
      <div className="booking-calendar__header">
        <div>
          <h2 id="booking-calendar-title">Select a Date &amp; Time</h2>
          <p className="booking-calendar__week-label">{weekLabel}</p>
        </div>
        <nav className="booking-calendar__nav" aria-label="Week navigation">
          <button
            type="button"
            onClick={onPreviousWeek}
            disabled={isPreviousDisabled}
            aria-label="Show previous week"
          >
            <CaretLeft size={15} weight="bold" />
          </button>
          <button type="button" onClick={onNextWeek} aria-label="Show next week">
            <CaretRight size={15} weight="bold" />
          </button>
        </nav>
      </div>

      {isLoading && <LoadingCalendar />}

      {!isLoading && isError && (
        <div className="booking-calendar__feedback" role="alert">
          <WarningCircle size={20} weight="duotone" />
          <div>
            <strong>Availability could not load.</strong>
            <span>Refresh the page or try another week.</span>
          </div>
        </div>
      )}

      {!isLoading && !isError && !hasAvailableSlots && days.length > 0 && (
        <div className="booking-calendar__empty">
          <p>No available times this week.</p>
          <p>Move to the next week to find a time.</p>
        </div>
      )}

      {!isLoading && !isError && hasAvailableSlots && (
        <div className="booking-calendar__grid">
          {days.map((day) => {
            const availableSlots = day.slots.filter((slot) => slot.available);
            const dayNum = parseInt(day.date.slice(8), 10);
            const dayName = day.weekday.slice(0, 3).toUpperCase();

            return (
              <div className="booking-calendar__day" key={day.date}>
                <div className="booking-calendar__day-heading">
                  <span>{dayName}</span>
                  <strong>{dayNum}</strong>
                </div>
                <div className="booking-calendar__slots">
                  {availableSlots.length === 0 ? (
                    <p className="booking-calendar__none">No times</p>
                  ) : (
                    availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.slotStart === slot.slotStart;
                      return (
                        <button
                          key={slot.slotStart}
                          className={`booking-calendar__slot${isSelected ? " booking-calendar__slot--selected" : ""}`}
                          type="button"
                          aria-pressed={isSelected}
                          aria-label={formatSlotA11yLabel(day, slot)}
                          onClick={() => onSelectSlot(slot)}
                        >
                          {slot.label}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default BookingCalendar;
