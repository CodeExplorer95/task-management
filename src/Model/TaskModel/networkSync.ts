import { store } from '../../Adapter/Redux/Store/Store';
import { startNetworkSync as startSync } from './taskSlice';

export function startNetworkListener() {
  const { dispatch } = store;
  startSync(dispatch);
}
