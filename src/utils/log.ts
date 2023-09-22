export const log = (...args: any[]) => {    
    if(process.env.REACT_APP_ENV === 'development') {
        console.log(...args)
    }
}