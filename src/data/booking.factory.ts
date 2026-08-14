import type { Booking } from '../types/booking';

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Wesley',
    lastname: 'QA',
    totalprice: 450,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-09-10',
      checkout: '2026-09-15'
    },
    additionalneeds: 'Breakfast',
    ...overrides
  };
}
