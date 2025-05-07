import dayjs from 'dayjs';
import { makeAutoObservable, runInAction } from 'mobx';

class MenuAnalyzeStore {
  order_dt_start: string = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  order_dt_finish: string = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  isInitialized: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setDates = (start: string, end: string) => {
    runInAction(() => {
      this.order_dt_start = start;
      this.order_dt_finish = end;
      this.isInitialized = true;
    });
  };

  get isReady() {
    return this.isInitialized;
  }
}

export const menuAnalyzeStore = new MenuAnalyzeStore();
