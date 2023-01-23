/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
// import { decodeAndVerifyJwtToken } from './somewhere/in/your/app/utils'; // TODO: develop some method to verify the token

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  // session: Session | null
  isAllowed: boolean | null;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts?: CreateContextOptions) {
  return {
    isAllowed: _opts?.isAllowed,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching

  const { 'x-api-key': apiKey } = opts.req.headers;

  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  async function getPermissionFromApiKey() {
    if (apiKey) {
      // TODO: define the way to check a valid token
      /*const isAllowed = await verifyIsAllowed(
        apiKey,
      );
      return isAllowed;*/
      return apiKey == 'auth token';
    }
    return false;
  }
  const isAllowed = await getPermissionFromApiKey();

  const contextInner = await createContextInner({ isAllowed });

  return {
    ...contextInner,
  };
}
