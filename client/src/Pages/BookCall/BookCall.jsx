import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Globe, VideoCamera } from "@phosphor-icons/react";
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

const panelVariants = {
  enter: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 22 } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.14 } },
};

const EventInfoPanel = () => (
  <div className="event-info-panel">
    <div className="event-info-panel__avatar">K</div>
    <p className="event-info-panel__host">Kofi Arhin</p>
    <h1 className="event-info-panel__title">Discovery Call</h1>
    <div className="event-info-panel__divider" />
    <ul className="event-info-panel__meta">
      <li>
        <Clock size={15} weight="duotone" />
        30 min
      </li>
      <li>
        <VideoCamera size={15} weight="duotone" />
        Web conference
      </li>
      <li>
        <Globe size={15} weight="duotone" />
        GMT timezone
      </li>
    </ul>
  </div>
);

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

  const handleBack = () => {
    setSelectedSlot(null);
    createBookingMutation.reset();
  };

  return (
    <main className="book-call-page">
      <motion.div
        className="book-call-page__card"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        <EventInfoPanel />

        <div className="book-call-page__content">
          <AnimatePresence mode="wait">
            {confirmedBooking ? (
              <motion.div
                key="confirmation"
                className="book-call-page__panel"
                variants={panelVariants}
                initial="enter"
                animate="visible"
                exit="exit"
              >
                <BookingConfirmation
                  booking={confirmedBooking}
                  onReset={() => {
                    setConfirmedBooking(null);
                    setSelectedSlot(null);
                  }}
                />
              </motion.div>
            ) : selectedSlot ? (
              <motion.div
                key="form"
                className="book-call-page__panel"
                variants={panelVariants}
                initial="enter"
                animate="visible"
                exit="exit"
              >
                <BookingForm
                  selectedSlot={selectedSlot}
                  mutation={createBookingMutation}
                  onBack={handleBack}
                  onSuccess={(booking) => {
                    setConfirmedBooking(booking);
                    setSelectedSlot(null);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                className="book-call-page__panel"
                variants={panelVariants}
                initial="enter"
                animate="visible"
                exit="exit"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
};

export default BookCall;
