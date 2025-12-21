export function LongStringFormatter(str:string) {
    const n=15;
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
}