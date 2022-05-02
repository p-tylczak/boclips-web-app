import Hotjar from 'src/services/analytics/hotjar/Hotjar';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import UserAttributes from 'src/services/analytics/hotjar/UserAttributes';

export default class HotjarService {
  private readonly hotjar: Hotjar;

  public constructor(hotjar: Hotjar) {
    this.hotjar = hotjar;
  }

  public event(event: HotjarEvents) {
    this.hotjar.event(event);
  }

  public userAttributes(user: UserAttributes) {
    this.hotjar.identify(user.userId(), user.attributes());
  }
}
