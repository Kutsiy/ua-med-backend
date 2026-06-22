export interface IJwtStategy<T = any, R = any> {
  validate(payload: T): R;
}

export const JWT_STRATEGY = Symbol('JWT_STRATEGY');
