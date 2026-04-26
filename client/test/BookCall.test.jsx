import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookCall from "../src/Pages/BookCall/BookCall";
import useCreateBooking from "../src/hooks/mutations/useCreateBooking";
import useBookingAvailability from "../src/hooks/queries/useBookingAvailability";

vi.mock("../src/hooks/queries/useBookingAvailability");
vi.mock("../src/hooks/mutations/useCreateBooking");

const availability = {
  success: true,
  timezone: "GMT",
  slotDurationMinutes: 30,
  days: [
    {
      date: "2099-01-05",
      weekday: "Monday",
      slots: [
        {
          slotStart: "2099-01-05T09:00:00.000Z",
          slotEnd: "2099-01-05T09:30:00.000Z",
          label: "09:00",
          available: true,
        },
        {
          slotStart: "2099-01-05T09:30:00.000Z",
          slotEnd: "2099-01-05T10:00:00.000Z",
          label: "09:30",
          available: false,
        },
      ],
    },
  ],
};

const mutationBase = {
  mutate: vi.fn(),
  reset: vi.fn(),
  isPending: false,
  isError: false,
  error: null,
};

const mockAvailability = (overrides = {}) => {
  useBookingAvailability.mockReturnValue({
    data: availability,
    isLoading: false,
    isError: false,
    error: null,
    ...overrides,
  });
};

const mockMutation = (overrides = {}) => {
  const mutation = { ...mutationBase, mutate: vi.fn(), reset: vi.fn(), ...overrides };
  useCreateBooking.mockReturnValue(mutation);
  return mutation;
};

describe("BookCall", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAvailability();
    mockMutation();
  });

  it("renders the page", () => {
    render(<BookCall />);

    expect(screen.getByRole("heading", { name: "Choose a GMT call slot." })).toBeTruthy();
    expect(screen.getByText("Choose a weekday slot between 9:00 AM and 5:00 PM GMT.")).toBeTruthy();
  });

  it("renders a loading state", () => {
    mockAvailability({ data: undefined, isLoading: true });

    render(<BookCall />);

    expect(screen.getByLabelText("Loading available slots")).toBeTruthy();
  });

  it("allows an available slot to be selected", async () => {
    render(<BookCall />);
    const user = userEvent.setup();

    const slot = screen.getByRole("button", { name: /09:00 GMT, available/i });
    await user.click(slot);

    expect(slot.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/Monday, 5 January, 09:00-09:30 GMT/i)).toBeTruthy();
  });

  it("keeps unavailable slots disabled", async () => {
    render(<BookCall />);
    const user = userEvent.setup();

    const unavailableSlot = screen.getByRole("button", { name: /09:30 GMT, unavailable/i });
    expect(unavailableSlot.disabled).toBe(true);

    await user.click(unavailableSlot);

    expect(unavailableSlot.getAttribute("aria-pressed")).toBe("false");
  });

  it("keeps submit disabled until a slot and required fields are present", async () => {
    render(<BookCall />);
    const user = userEvent.setup();

    const submit = screen.getByRole("button", { name: /Book this call/i });
    expect(submit.disabled).toBe(true);

    await user.click(screen.getByRole("button", { name: /09:00 GMT, available/i }));
    expect(submit.disabled).toBe(true);

    await user.type(screen.getByLabelText("Name"), "Laura");
    await user.type(screen.getByLabelText("Email"), "laura@example.com");

    expect(submit.disabled).toBe(false);
  });

  it("shows conflict errors", async () => {
    mockMutation({
      isError: true,
      error: { response: { status: 409, data: { error: "This slot is no longer available" } } },
    });

    render(<BookCall />);

    expect(screen.getByText("This slot is no longer available. Choose another time.")).toBeTruthy();
  });

  it("renders confirmation after successful booking", async () => {
    const mutation = mockMutation({
      mutate: vi.fn((payload, options) => {
        options.onSuccess({
          booking: {
            id: "booking-1",
            slotStart: payload.slotStart,
            slotEnd: "2099-01-05T09:30:00.000Z",
          },
        });
      }),
    });

    render(<BookCall />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /09:00 GMT, available/i }));
    await user.type(screen.getByLabelText("Name"), "Laura");
    await user.type(screen.getByLabelText("Email"), "laura@example.com");
    await user.click(screen.getByRole("button", { name: /Book this call/i }));

    await waitFor(() => {
      expect(mutation.mutate).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Call booked.")).toBeTruthy();
    });
  });
});
