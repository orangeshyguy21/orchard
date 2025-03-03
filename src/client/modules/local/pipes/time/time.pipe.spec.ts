import { TimePipe } from './time.pipe';
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';

describe('TimePipe', () => {
  it('create an instance', () => {
    const pipe = new TimePipe(new LocalStorageService());
    expect(pipe).toBeTruthy();
  });
});
