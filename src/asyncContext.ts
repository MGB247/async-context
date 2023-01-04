import { AsyncLocalStorage } from "async_hooks";

export class AsyncContext {
    private static asyncLocalStorage: AsyncLocalStorage<any> = new AsyncLocalStorage();

    /**
     * 
     * @param callback Set any context in this callback using AsyncContext.set(key: string, value: any). Any subsequent execution requiring the context should be done inside this callback.
     * @param setters An optional array of ContextSetter. Use these Setters to set global level contexts.
     * @param globalContext An optional global level context which is used by setters.
     */
    public static run = <T>(callback: () => void, setters: ContextSetter[] = [], globalContext: T = undefined) => {
        AsyncContext.asyncLocalStorage.run(new Map(), () => {
            setters.forEach((set) => {
                set(globalContext);
            });
            callback();
        });
    }

    /**
     * 
     * @param key A string key for storing the context.
     * @param value The context itself.
     */
    public static set<T>(key: string, value: T) {
        AsyncContext.asyncLocalStorage.getStore().set(key, value);
    }

    /**
     * 
     * @param key The key used to store the context.
     * @returns The context stored against the key.
     */
    public static get<T>(key: string): T {
        return AsyncContext.asyncLocalStorage.getStore()?.get(key);
    }

    /**
     * 
     * @param key The key used to store the context.
     * @returns A boolean indicating whether any context exists against the key.
     */
    public static has(key: string): boolean {
        return AsyncContext.asyncLocalStorage.getStore()?.get(key) !== undefined;
    }

    /**
     * @returns The original store.
     */
    public static getStore(): any {
        return AsyncContext.asyncLocalStorage.getStore();
    }
}

export type ContextSetter = <T>(context: T) => {}
