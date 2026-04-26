import { CalendarBlank, CaretLeft, CaretRight, WarningCircle } from "@phosphor-icons/react";
import { formatSlotA11yLabel } from "../../Pages/BookCall/bookCallDateUtils";
import "./booking-calendar.styles.scss";

const LoadingCalendar = () => (
  <div className="booking-calendar__grid" aria-label="Loading available slots">
    {Array.from({ length: 5 }).map((_, dayIndex) => (
      <div className="booking-calendar__day booking-calendar__day--loading" key={dayIndex}>
        <span className="booking-calendar__skeleton booking-calendar__skeleton--heading" />
        {Array.from({ length: 8 }).map((__, slotIndex) => (
          <span className="booking-calendar__skeleton booking-calendar__skeleton--slot" key={slotIndex} />
        ))}
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
      <div className="booking-calendar__toolbar">
        <div>
          <span className="booking-calendar__eyebrow">
            <CalendarBlank size={16} weight="duotone" />
            GMT availability
          </span>
          <h2 id="booking-calendar-title">Choose a weekday slot</h2>
          <p>{weekLabel}</p>
        </div>

        <div className="booking-calendar__nav" aria-label="Week navigation">
          <button
            type="button"
            onClick={onPreviousWeek}
            disabled={isPreviousDisabled}
            aria-label="Show previous week"
          >
            <CaretLeft size={17} weight="bold" />
          </button>
          <button type="button" onClick={onNextWeek} aria-label="Show next week">
            <CaretRight size={17} weight="bold" />
          </button>
        </div>
      </div>

      {isLoading && <LoadingCalendar />}

      {!isLoading && isError && (
        <div className="booking-calendar__feedback" role="alert">
          <WarningCircle size={22} weight="duotone" />
          <div>
            <strong>Availability could not load.</strong>
            <span>Refresh the page or try another week.</span>
          </div>
        </div>
      )}

      {!isLoading && !isError && !hasAvailableSlots && (
        <div className="booking-calendar__feedback">
          <CalendarBlank size={22} weight="duotone" />
          <div>
            <strong>No open slots this week.</strong>
            <span>Move to the next week to find another time.</span>
          </div>
        </div>
      )}

      {!isLoading && !isError && days.length > 0 && (
        <div className="booking-calendar__grid">
          {days.map((day) => (
            <div className="booking-calendar__day" key={day.date}>
              <div className="booking-calendar__day-heading">
                <span>{day.weekday}</span>
                <strong>{day.date.slice(5).replace("-", "/")}</strong>
              </div>

              <div className="booking-calendar__slots">
                {day.slots.map((slot) => {
                  const isSelected = selectedSlot?.slotStart === slot.slotStart;

                  return (
                    <button
                      className={`booking-calendar__slot${isSelected ? " booking-calendar__slot--selected" : ""}`}
                      type="button"
                      key={slot.slotStart}
                      disabled={!slot.available}
                      aria-disabled={!slot.available}
                      aria-pressed={isSelected}
                      aria-label={formatSlotA11yLabel(day, slot)}
                      onClick={() => {
                        if (slot.available) {
                          onSelectSlot(slot);
                        }
                      }}
                    >
                      <span>{slot.label}</span>
                      <small>{slot.available ? "Open" : "Taken"}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BookingCalendar;
