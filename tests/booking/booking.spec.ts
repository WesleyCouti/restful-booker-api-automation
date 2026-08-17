import Ajv from 'ajv';
import { AuthClient } from '../../src/clients/auth.client';
import { BookingClient } from '../../src/clients/booking.client';
import { buildBooking } from '../../src/data/booking.factory';
import { bookingSchema } from '../../src/schemas/booking.schema';

describe('Booking API', () => {
  const bookingClient = new BookingClient();
  const authClient = new AuthClient();

  const ajv = new Ajv({
    allErrors: true
  });

  const validateBookingSchema = ajv.compile(bookingSchema);

  function expectValidBookingContract(payload: unknown): void {
    const isValid = validateBookingSchema(payload);

    if (!isValid) {
      throw new Error(
        `Booking contract validation failed: ${ajv.errorsText(
          validateBookingSchema.errors
        )}`
      );
    }

    expect(isValid).toBe(true);
  }

  test('smoke - lists available bookings', async () => {
    const response = await bookingClient.list();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    expect(response.body[0]).toEqual(
      expect.objectContaining({
        bookingid: expect.any(Number)
      })
    );
  });

  test('creates a booking and validates response contract', async () => {
    const payload = buildBooking();

    const response = await bookingClient.create(payload);

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        bookingid: expect.any(Number),
        booking: expect.any(Object)
      })
    );

    expect(response.body.booking).toMatchObject(payload);

    expectValidBookingContract(response.body.booking);
  });

  test('updates an existing booking using authentication', async () => {
    const created = await bookingClient.createAndReturn(
      buildBooking()
    );

    const token = await authClient.createToken();

    const updatedPayload = buildBooking({
      firstname: 'Updated',
      totalprice: 900
    });

    const response = await bookingClient.update(
      created.bookingid,
      updatedPayload,
      token
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedPayload);

    expectValidBookingContract(response.body);
  });

  test('partially updates an existing booking', async () => {
    const created = await bookingClient.createAndReturn(
      buildBooking()
    );

    const token = await authClient.createToken();

    const partialPayload = {
      lastname: 'Automation'
    };

    const response = await bookingClient.partialUpdate(
      created.bookingid,
      partialPayload,
      token
    );

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      ...created.booking,
      ...partialPayload
    });

    expect(response.body.lastname).toBe(
      partialPayload.lastname
    );

    expectValidBookingContract(response.body);
  });

  test('deletes a booking and confirms it is no longer available', async () => {
    const created = await bookingClient.createAndReturn(
      buildBooking()
    );

    const token = await authClient.createToken();

    const deleteResponse = await bookingClient.delete(
      created.bookingid,
      token
    );

    expect([200, 201]).toContain(deleteResponse.status);

    const getResponse = await bookingClient.getById(
      created.bookingid
    );

    expect(getResponse.status).toBe(404);
  });

  test('returns 404 for a booking that does not exist', async () => {
    const response = await bookingClient.getById(
      999999999
    );

    expect(response.status).toBe(404);
  });

  test('rejects update without authentication', async () => {
    const created = await bookingClient.createAndReturn(
      buildBooking()
    );

    const unauthorizedPayload = buildBooking({
      firstname: 'Unauthorized'
    });

    const response = await bookingClient.update(
      created.bookingid,
      unauthorizedPayload,
      'invalid-token'
    );

    expect(response.status).toBe(403);
  });
});
