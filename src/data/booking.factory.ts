import type { Booking } from '../types/booking';

type BookingOverrides = Partial<Omit<Booking, 'bookingdates'>> & {
  bookingdates?: Partial<Booking['bookingdates']>;
};

export function buildBooking(
  overrides: BookingOverrides = {}
): Booking {
  const defaultBooking: Booking = {
    firstname: 'Wesley',
    lastname: 'QA',
    totalprice: 450,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-09-10',
      checkout: '2026-09-15'
    },
    additionalneeds: 'Breakfast'
  };

  return {
    ...defaultBooking,
    ...overrides,
    bookingdates: {
      ...defaultBooking.bookingdates,
      ...overrides.bookingdates
    }
  };
}
