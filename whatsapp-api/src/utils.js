
export const formatNumber = (number) => {
  const country = number.substring(1, 2)
  const prefix = number.substring(3, 4)
  const digits = number.match('.{8}$')[0]
  const phone = `${country}${prefix}${digits}`
  return phone
}

export function contactToArray(number, isGroup) {
  let localArr = []
  if (Array.isArray(number)) {
    for (let contact of number) {
      contact = contact.split('@')[0]
      if (contact !== '')
        if (isGroup) localArr.push(`${contact}@g.us`)
        else localArr.push(`${formatNumber(contact)}@c.us`)
    }
  } else {
    let arrContacts = number.split(/\s*[,]\s*/g)
    for (let contact of arrContacts) {
      contact = contact.split('@')[0]
      if (contact !== '')
        if (isGroup) localArr.push(`${contact}@g.us`)
        else localArr.push(`${formatNumber(contact)}@c.us`)
    }
  }

  return localArr
}