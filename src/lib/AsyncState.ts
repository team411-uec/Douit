export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};
