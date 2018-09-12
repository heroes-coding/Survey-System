
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

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")

export const passwordIsStrong = (p) => strongRegex.test(p)

export const getMessage = (message, placeholder, list) => {
  const n = list.length
  if (n===0) return ""
  let names
  if (n===1) names = list[0]
  else if (n===2) names = `${list[0]} and ${list[1]}`
  else names = `${list.slice(0,n-1).join(", ")}, and ${list[n-1]}`
  return placeholder ? message.replace(placeholder,names) : names
}


export function formatNumber(num) {
  switch (true) {
    case num === Infinity:
      return "∞"
    case isNaN(num):
      return num
    case num < 10:
      return Math.round(num*100)/100
    case num < 100:
      return Math.round(num*10)/10
    case num < 1000:
      return Math.round(num)
    case num < 10000:
      return Math.round(num/10)/100 + "K"
    case num < 100000:
      return Math.round(num/100)/10 + "K"
    default:
      return Math.round(num/1000) + "K"
  }
}
