const dev = process.env.NODE_ENV !== 'production'

export const server = dev
  ? 'https://lastsevendays.com/api'
  : 'https://lastsevendays.com/api'
