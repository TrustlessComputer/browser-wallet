export class StorageService {
  private _getKey = (key: string) => key;

  getCustomKey(prefix: string, suffix: string) {
    return `${prefix}-${suffix}`;
  }

  set(key: string, data: unknown) {
    const _key = this._getKey(key);
    const dataStr = JSON.stringify(data);
    return localStorage.setItem(_key, dataStr);
  }

  get(key: string) {
    const _key = this._getKey(key);
    const dataStr = localStorage.getItem(_key);
    return dataStr ? JSON.parse(dataStr) : undefined;
  }

  remove(key: string) {
    const _key = this._getKey(key);
    return localStorage.removeItem(_key);
  }

  allKeys = (): string[] => {
    return Object.keys(localStorage);
  };

  removeKeys = (key: string) => {
    const keys = this.allKeys();
    keys.forEach(_key => {
      if (_key.toLowerCase().includes(key.toLowerCase())) {
        this.remove(_key);
      }
    });
  };
}

const storageLocal = new StorageService();

export default storageLocal;
