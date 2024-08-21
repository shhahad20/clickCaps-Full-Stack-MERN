import axios from 'axios'

const isDevelopment = import.meta.env.MODE === 'development'
export const baseURL = 'http://localhost:5050'

// if (!isDevelopment) {
//   baseURL = 'http://localhost:5050/'
// }

// const api = axios.create({
//   baseURL
// })

// export default api
