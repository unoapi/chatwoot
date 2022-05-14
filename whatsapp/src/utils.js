
export const numberToId = (number) => {
  number = number.replace('+', '')
  const country = number.substring(0, 2)
  const prefix = number.substring(2, 4)
  const digits = number.match('.{8}$')[0]
  const phone = `${country}${prefix}${digits}@s.whatsapp.net`
  return phone
}

export const idToNumber = (id) => {
  const number = id.replace('@s.whatsapp.net', '').split(':')[0]
  const country = number.substring(0, 2)
  const prefix = number.substring(2, 4)
  const digits = number.match('.{8}$')[0]
  let digit = number.replace(country, '').replace(prefix, '').replace(digits, '')
  if (digit === '' && ['6', '7', '8', '9'].includes(digits[0])) {
    digit = 9
  }
  const out = `+${country}${prefix}${digit}${digits}`
  return out
}

export function contactToArray(number, isGroup) {
  const localArr = []
  if (Array.isArray(number)) {
    for (let contact of number) {
      contact = contact.split('@')[0]
      if (contact !== '')
        if (isGroup) localArr.push(`${contact}@g.us`)
        else localArr.push(`${numberToId(contact)}`)
    }
  } else {
    const arrContacts = number.split(/\s*[,]\s*/g)
    for (let contact of arrContacts) {
      contact = contact.split('@')[0]
      if (contact !== '')
        if (isGroup) localArr.push(`${contact}@g.us`)
        else localArr.push(`${numberToId(contact)}`)
    }
  }
  return localArr
}