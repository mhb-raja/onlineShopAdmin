export interface IResponseResult<T> {
  status: string;
  eStatus?: Status;
  message?: string;
  data: T;
}

export enum Status {
  Success = 1,
  Error = 2,
  NotFound = 3,
  UnAuthorized = 4,
  AccessDenied = 5,
  UnAuthenticated = 6,
}
