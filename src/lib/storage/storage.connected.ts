import { StorageService } from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';
import { getOriginURL } from '@/utils';

class StorageConnected extends StorageService {
  private getKey = () => {
    return LocalStorageKey.CONNECTED_SITE;
  };
  getConnectedSite = () => {
    const key = this.getKey();
    const connected = this.get(key);
    return connected || {};
  };
  isConnected = (site: string) => {
    const key = this.getKey();
    const originURL = getOriginURL(site);
    const connected = this.get(key);
    return Boolean(connected[originURL]);
  };
  setConnectedSite = (site: string) => {
    const key = this.getKey();
    const connected = this.getConnectedSite();
    const originURL = getOriginURL(site);
    const newConnected = {
      ...connected,
      [originURL]: true,
    };
    this.set(key, newConnected);
  };
}

const storageConnected = new StorageConnected();

export default storageConnected;
