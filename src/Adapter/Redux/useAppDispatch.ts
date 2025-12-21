import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './Store/Store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected,
) => useSelector(selector) as TSelected;
