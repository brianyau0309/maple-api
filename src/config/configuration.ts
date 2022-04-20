export default () => ({
  node: {
    env: process.env.NODE_ENV || 'development'
  },
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.DATABASE_URI,
  },
});
