const getDisc = function (key: string) { 
    const item = localStorage.getItem(key);
    return item
}
const setDisc = function (key: string,value: string) { 
    localStorage.setItem(key, value)
}

const removeDisc = function (key: string) { 
    localStorage.removeItem(key)
}
export {
    getDisc,
    setDisc,
    removeDisc
}