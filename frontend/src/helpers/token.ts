export const getToken = () => {
  return localStorage.getItem('token')
}

export const saveToken = (value: string) => {
  localStorage.setItem('token', value)
}

export const removeToken = () => {
  localStorage.removeItem('token')
}
