export function logReq({method, path}) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    const message = `${new Date().toLocaleString("en-US", options)} - ${method} ${path}`;
    console.log(message)
}