class LocalStorage {
  set(key: string, data: unknown): void {
    const dataStr = JSON.stringify(data);
    return localStorage.setItem(key, dataStr);
  }

  get<T>(key: string): T | null {
    const dataStr = localStorage.getItem(key);
    return dataStr ? JSON.parse(dataStr) : null;
  }

  remove(key: string): void {
    return localStorage.removeItem(key);
  }
}

const localIns = new LocalStorage();

export default localIns;
