import path from 'path'

const config = {
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    adapter: {
      url: process.env.DATABASE_URL!
    }
  }
}

export default config