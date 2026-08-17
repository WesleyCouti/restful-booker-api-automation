export const bookingSchema = {
  type: 'object',
  additionalProperties: false,

  required: [
    'firstname',
    'lastname',
    'totalprice',
    'depositpaid',
    'bookingdates'
  ],

  properties: {
    firstname: {
      type: 'string',
      minLength: 1
    },

    lastname: {
      type: 'string',
      minLength: 1
    },

    totalprice: {
      type: 'number',
      minimum: 0
    },

    depositpaid: {
      type: 'boolean'
    },

    bookingdates: {
      type: 'object',
      additionalProperties: false,

      required: [
        'checkin',
        'checkout'
      ],

      properties: {
        checkin: {
          type: 'string',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$'
        },

        checkout: {
          type: 'string',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$'
        }
      }
    },

    additionalneeds: {
      type: 'string'
    }
  }
} as const;
