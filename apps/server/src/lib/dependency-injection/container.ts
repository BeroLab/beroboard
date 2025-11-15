import type { Token } from "./token";

class Container {
   private readonly instances = new Map<symbol, unknown>();

   register<T>(token: Token<T>, impl: T) {
      this.instances.set(token.id, impl);
   }
   resolve<T>(token: Token<T>): T {
      const impl = this.instances.get(token.id);
      if (!impl) throw Error(`No implementation found for token: ${String(token.id)}`);
      return impl as T;
   }
}

export const container = new Container();
