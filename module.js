const addonsJsonCache = {}

const convert = (value, radix) =>
  [...value.toString()].reduce(
    (r, v) => r * BigInt(radix) + BigInt(parseInt(v, radix)),
    0n,
  )

export default async function getEnabledAddonIds(number, version) {
  const addonIds = []

  let json = addonsJsonCache[version]
  if (json === undefined) {
    const res = await fetch(
      `https://raw.githubusercontent.com/ScratchAddons/ScratchAddons/${version}/addons/addons.json`,
    )
    json = await res.json()
    addonsJsonCache[version] = json
  }
  const addons = json.filter((addonId) => !addonId.startsWith('//'))

  let binaryStr = convert(number, 36).toString(2)
  binaryStr = '0'.repeat(addons.length - binaryStr.length) + binaryStr
  const booleanArr = binaryStr
    .split('')
    .map((num) => (num === '1' ? true : false))

  for (const i in addons) {
    if (booleanArr[i]) addonIds.push(addons[i])
  }

  return addonIds
}
