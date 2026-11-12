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

    expect(screen.getByRole("heading", { name: "AI Workflow Call" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Select a Date & Time" })).toBeInTheDocument();
    expect(screen.getByText("GMT timezone")).toBeInTheDocument();
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

    expect(await screen.findByRole("heading", { name: "Your details" })).toBeInTheDocument();
    expect(screen.getByText(/Monday,? 5 January, 09:00-09:30 GMT/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /09:00 GMT, available/i })).not.toBeInTheDocument();
  });

  it("does not offer unavailable slots for booking", () => {
    const mutation = mockMutation();
    render(<BookCall />);

    expect(screen.getByRole("button", { name: /09:00 GMT, available/i })).toBeEnabled();
    expect(screen.queryByRole("button", { name: /09:30 GMT/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /confirm booking/i })).not.toBeInTheDocument();
    expect(mutation.mutate).not.toHaveBeenCalled();
  });

  it("keeps submit disabled until a slot and required fields are present", async () => {
    render(<BookCall />);
    const user = userEvent.setup();

    expect(screen.queryByRole("button", { name: /confirm booking/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /09:00 GMT, available/i }));
    const submit = await screen.findByRole("button", { name: /confirm booking/i });
    expect(submit).toBeDisabled();

    await user.type(await screen.findByLabelText("Name"), "Laura");
    await user.type(screen.getByLabelText("Email"), "laura@example.com");

    expect(submit.disabled).toBe(false);
  });

  it("shows conflict errors", async () => {
    mockMutation({
      isError: true,
      error: { response: { status: 409, data: { error: "This slot is no longer available" } } },
    });

    render(<BookCall />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /09:00 GMT, available/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("This slot is no longer available. Choose another time.");
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
    await user.type(await screen.findByLabelText("Name"), "Laura");
    await user.type(screen.getByLabelText("Email"), "laura@example.com");
    await user.click(screen.getByRole("button", { name: /Confirm booking/i }));

    await waitFor(() => {
      expect(mutation.mutate).toHaveBeenCalledTimes(1);
      expect(mutation.mutate).toHaveBeenCalledWith({
        name: "Laura", email: "laura@example.com", company: "", message: "",
        slotStart: "2099-01-05T09:00:00.000Z",
      }, expect.objectContaining({ onSuccess: expect.any(Function) }));
      expect(screen.getByRole("status")).toHaveTextContent("You're booked!");
      expect(screen.getByRole("status")).toHaveTextContent(/Monday,? 5 January, 09:00-09:30 GMT/);
    });
  });
});
