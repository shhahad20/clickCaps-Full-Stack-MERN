import 'dotenv/config'

export const dev = {
  app: { port: Number(process.env.PORT) || 3002 },
  db: {
    url:
      process.env.MOGODB_URL
  },
}
