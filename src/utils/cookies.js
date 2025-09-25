
import { setCookie, getCookie, deleteCookie } from 'cookies-next'

// Set cookie
export const setCookies = (key, value, options = {}) => {
  setCookie(key, value, {
    maxAge: 60 * 60 * 24 * 3, // 3 days
    ...options,
  })
}

// Get cookie
export const getCookies = (key) => {
  return getCookie(key)
}

// Remove cookie
export const removeCookies = (key) => {
  deleteCookie(key)
}
