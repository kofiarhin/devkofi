import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Globe, Tag, VideoCamera } from "@phosphor-icons/react";
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
import { CalendlyLink, Checklist } from "../../components/Site/Site";
import { BOOK_CALL_LABEL } from "../../constants/booking";
import "./book-call.styles.scss";

const callTopics = [
  "AI integration for your business: your system, the process and a sensible first step",
  "1-on-1 mentorship: your goals, current level and which track fits",
  "Whether we're a good fit, with no obligation",
];

const panelVariants = {
  enter: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 22 } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.14 } },
};

const EventInfoPanel = () => (
  <div className="event-info-panel">
    <div className="event-info-panel__avatar">K</div>
    <p className="event-info-panel__host">Kofi Arhin · DevKofi</p>
    <h1 className="event-info-panel__title">{BOOK_CALL_LABEL}</h1>
    <p className="event-info-panel__subtitle">
      A short call about AI integration for your business or 1-on-1 mentorship.
    </p>
    <div className="event-info-panel__divider" />
    <ul className="event-info-panel__meta">
      <li>
        <Tag size={15} weight="duotone" />
        Free
      </li>
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
    <main className="site-page book-call-page">
      <div className="book-call-page__glow" aria-hidden="true" />
      <div className="book-call-page__intro">
        <p className="site-eyebrow">Free intro call</p>
        <p className="book-call-page__lead">
          Pick a time that suits you. We'll talk about what you want to build or learn, and agree a sensible next step.
        </p>
      </div>
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
      <div className="book-call-page__after">
        <CalendlyLink />
        <div className="book-call-page__topics">
          <h2>What we'll cover</h2>
          <Checklist items={callTopics} />
        </div>
      </div>
    </main>
  );
};

export default BookCall;
