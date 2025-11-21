const getToken = () => { 
    return localStorage.getItem('token')
}
const setToken = (token: string) => { 
    localStorage.setItem('token', token)
}
export { getToken, setToken }