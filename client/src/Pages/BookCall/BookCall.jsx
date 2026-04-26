import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import BookingCalendar from "../../components/BookingCalendar/BookingCalendar";
import BookingForm, { BookingConfirmation } from "../../components/BookingForm/BookingForm";
import useCreateBooking from "../../hooks/mutations/useCreateBooking";
import useBookingAvailability from "../../hooks/queries/useBookingAvailability";
import {
  addWeeks,
  formatDateParam,
  formatWeekRange,
  getCurrentWeekStart,
  getWeekMonday,
  isPreviousWeekDisabled,
} from "./bookCallDateUtils";
import "./book-call.styles.scss";

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 20 } },
};

const BookCall = () => {
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const availability = useBookingAvailability(weekStart);
  const createBookingMutation = useCreateBooking();

  const weekLabel = useMemo(() => formatWeekRange(weekStart), [weekStart]);
  const previousDisabled = useMemo(() => isPreviousWeekDisabled(weekStart), [weekStart]);

  const moveWeek = (amount) => {
    const nextWeek = addWeeks(getWeekMonday(weekStart), amount);
    setWeekStart(formatDateParam(nextWeek));
    setSelectedSlot(null);
    setConfirmedBooking(null);
    createBookingMutation.reset();
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setConfirmedBooking(null);
    createBookingMutation.reset();
  };

  return (
    <main className="book-call-page">
      <motion.section
        className="book-call-page__intro"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        aria-labelledby="book-call-title"
      >
        <span className="book-call-page__eyebrow">Book a call</span>
        <h1 id="book-call-title">Choose a GMT call slot.</h1>
        <p>Choose a weekday slot between 9:00 AM and 5:00 PM GMT.</p>
      </motion.section>

      <div className="book-call-page__layout">
        <BookingCalendar
          days={availability.data?.days || []}
          isLoading={availability.isLoading}
          isError={availability.isError}
          error={availability.error}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSelectSlot}
          weekLabel={weekLabel}
          onPreviousWeek={() => moveWeek(-1)}
          onNextWeek={() => moveWeek(1)}
          isPreviousDisabled={previousDisabled}
        />

        {confirmedBooking ? (
          <BookingConfirmation
            booking={confirmedBooking}
            onReset={() => {
              setConfirmedBooking(null);
              setSelectedSlot(null);
            }}
          />
        ) : (
          <BookingForm
            selectedSlot={selectedSlot}
            mutation={createBookingMutation}
            onSuccess={(booking) => {
              setConfirmedBooking(booking);
              setSelectedSlot(null);
            }}
          />
        )}
      </div>
    </main>
  );
};

export default BookCall;
