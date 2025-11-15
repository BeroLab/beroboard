export interface Token<T> {
   readonly id: symbol;
   readonly __type?: T;
}
export function createToken<T>(description: string): Token<T> {
   return { id: Symbol(description) };
}
