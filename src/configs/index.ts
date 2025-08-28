import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: process.env.SERVER_PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  frontEndUrl: process.env.FRONTENT_URL,
  nodeEnv: process.env.NODE_ENV
}
