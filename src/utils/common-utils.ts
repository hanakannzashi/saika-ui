export function trimLeadingZeros(num: string): string {
  num = num.replace(/^0+/, '');
  return num.startsWith('.') || num === "" ? '0' + num : num
}

export function trimTrailingZeros(num: string): string {
  return num.replace(/\.?0*$/, '')
}

export function trimZeros(num: string): string {
  return trimTrailingZeros(trimLeadingZeros(num))
}

// beautify a number, e.g. from 10000000 to 10,000,000
export function beautify(num: string): string {
  const reg = num.indexOf('.') !== -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return trimZeros(num).replace(reg, '$1,');
}

export function round(num: string, fracDigits: number): string {
  if (num.indexOf('.') === -1) {
    num = num + '.'
  }
  if (fracDigits === 0) {
    return num.substring(0, num.indexOf('.'))
  }
  if(num.length - 1 - num.indexOf('.') < fracDigits) {
    num = num + '0'.repeat(fracDigits - (num.length - 1 - num.indexOf('.')))
  }
  return num.substring(0, num.indexOf('.') + 1 + fracDigits)
}

// int number
export function isIntNum(str: string): boolean {
  return (/^[+-]?\d+$/).test(str)
}

// int number > 0
export function isPosIntNum(str: string): boolean {
  return (/^\+?\d+$/).test(str) && !(/^[+-]?0+$/).test(str)
}

// int number < 0
export function  isNegIntNum(str: string): boolean {
  return (/^-\d+$/).test(str) && !(/^[+-]?0+$/).test(str)
}

// int number = 0
export function isZeroIntNum(str: string): boolean {
  return (/^[+-]?0+$/).test(str)
}

// int number >= 0
export function isPosOrZeroIntNum(str: string): boolean {
  return (/^\+?\d+$/).test(str) || (/^[+-]?0+$/).test(str)
}

// int number <= 0
export function isNegOrZeroIntNum(str: string): boolean {
  return (/^-\d+$/).test(str) || (/^[+-]?0+$/).test(str)
}

// number
export function isNum(str: string): boolean {
  return (/^[+-]?\d+(\.\d+)?$/).test(str)
}

// number > 0
export function isPosNum(str: string): boolean {
  return (/^\+?\d+(\.\d+)?$/).test(str) && !(/^[+-]?0+(\.0+)?$/).test(str)
}

// number < 0
export function isNegNum(str: string): boolean {
  return (/^-\d+(\.\d+)?$/).test(str) && !(/^[+-]?0+(\.0+)?$/).test(str)
}

// number = 0, including unstandard number starting or ending with dot, e.g. '0.' or '.0'
export function isZeroNumUnstandard(str: string): boolean {
  return (/^[+-]?0*(\.0*)?$/).test(str) && !(/^[+-]?\.?$/).test(str)
}

// number = 0
export function isZeroNum(str: string): boolean {
  return (/^[+-]?0+(\.0+)?$/).test(str)
}

// number >= 0
export function isPosOrZeroNum(str: string): boolean {
  return (/^\+?\d+(\.\d+)?$/).test(str) || (/^[+-]?0+(\.0+)?$/).test(str)
}

// number <= 0
export function isNegOrZeroNum(str: string): boolean {
  return (/^-\d+(\.\d+)?$/).test(str) || (/^[+-]?0+(\.0+)?$/).test(str)
}

// for any input, return int number >= 0
// this function is always used for html input label formatting
export function parsePosOrZeroIntNum(str: string): string {
  const num = str.replace(/^0+|[^\d]/g,'')
  return num === "" ? '0' : num
}

// for any input, return number >= 0
// this function is always used for html input label formatting
// note: return number may be unstandard, end with dot, e.g. '123.'
// note: return number doesn't trim trailing zeros, e.g. '123.0'
export function parsePosOrZeroNumUnstandard(str: string): string {
  let num = str.replace(/^0+|[^\d.]/g, '')
  if(num.startsWith('.')) {
    num = '0' + num
  }
  num = num.substring(0, num.indexOf('.') + 1) +
    num.substring(num.indexOf('.') + 1).replace('.', "")
  return num === "" ? '0' : num
}

// for any input, return number >= 0
// this function is always used for html input label formatting
export function parsePosOrZeroNum(str: string): string {
  return trimTrailingZeros(parsePosOrZeroNumUnstandard(str))
}