import 'dotenv/config'

export const dev = {
  app: { port: Number(process.env.PORT) || 3002 },
  db: {
    url:
      process.env.MOGODB_URL
  }, 
  jwt:{
    key:
    process.env.ACCESS_KEY || ',sjhrkwjh%$dsfghdfgh#%#219298jhds__=',
    activate_k:
    process.env.ACTIVATION_KEY || 'KL!dkj55/5436346?@df5FCXAf986)(',
    reset_k:
    process.env.RESET_PASSWORD_KEY || 'Qwer!dkj55/drtewt45?@df5RE@!XAf986)k'
  },
}
