// Wait for stop function to return true
// By default it will wait for 500ms until reject
export default async function waitFor(stop: () => boolean, timeoutMs = 500) {
  return new Promise((resolve, reject) => {
    let timeoutId: NodeJS.Timeout
    const intervalId = setInterval(() => {
      timeoutId = timeoutId || setTimeout(() => {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        reject(`waitFor timeout (${timeoutMs}ms)`)
      }, timeoutMs)

      if (stop()) {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        resolve(true)
      }
    }, 50)
  })
}
