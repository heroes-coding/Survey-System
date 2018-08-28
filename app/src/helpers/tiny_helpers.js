
export const asleep = (sleepTime) => {
  let promise = new Promise(async(resolve, reject) => {
    setTimeout(() => { resolve(true) }, sleepTime)
  })
  return promise
}

export const starlog = (m) => {
  const l = m.length
  const s = Array(l+9).join("*")
  console.log(`\n${s}\n*** ${m} ***\n${s}\n`)
}

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")

export const passwordIsStrong = (p) => strongRegex.test(p)
