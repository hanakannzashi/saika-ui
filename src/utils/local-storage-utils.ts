export class LocalStorageUtils {
  static getValue<T>(key: string): T | null {
    const json = localStorage.getItem(key)
    if(json === null) {
      return null
    }
    try {
      return JSON.parse(json)
    } catch (err) {
      console.error(err)
      return null
    }
  }

  static setValue(key: string, value: any) {
    const json = JSON.stringify(value)
    localStorage.setItem(key, json)
  }

  static removeValue(key: string) {
    localStorage.removeItem(key)
  }
}


