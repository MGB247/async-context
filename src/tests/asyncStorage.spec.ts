import { AsyncContext } from "../asyncContext";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Async Local Storage for Context Handling', () => {
    beforeAll(async () => {
        jest.setTimeout(300000);
    });

    async function someOtherAsyncFunction() {
        await sleep(2000);
        return AsyncContext.get("context")
    }

    async function receiveRequest() {
        return Promise.resolve(someOtherAsyncFunction());
    }

    it('Context consistency test', async () => {
        const setContexts = [];
        const getContexts = [];
        const setContexts1 = [];
        const getContexts1 = [];
        for (let i = 0; i < 10; i++) {
            const requestKey = i;
            setContexts.push(`context for ${requestKey + 10}`)
            AsyncContext.run(async () => {
                AsyncContext.set('context', `context for ${requestKey + 10}`)
                await sleep(Math.random() * 10 * 1000);
                getContexts[i] = await receiveRequest();
            });

            setContexts1.push(`context for ${requestKey + 20}`)
            AsyncContext.run(async () => {
                AsyncContext.set('context', `context for ${requestKey + 20}`)
                await sleep(Math.random() * 10 * 1000);
                getContexts1[i] = await receiveRequest();
            });
        }
        await sleep(30000);
        for (let i = 0; i < 10; i++) {
            expect(getContexts[i]).toBe(setContexts[i]);
            expect(getContexts1[i]).toBe(setContexts1[i]);
        }

    }, 300000);

    it('Verify context uniqueness when chaining run calls', async () => {
        const outerContext = 'outerContext';
        const innerContext = 'innerContext';
        const uniqueToOuter = 'uniqueToOuter';
        const uniqueToInner = 'uniqueToInner';
        let outerContextRead, innerContextRead, uniqueToOuterReadByInner, uniqueToInnerReadByOuter, uniqueToOuterReadByOuter, uniqueToInnerReadByInner;
        AsyncContext.run(async () => {
            AsyncContext.set('context', outerContext);
            AsyncContext.set('uniqueToOuter', uniqueToOuter);
            AsyncContext.run(async () => {
                AsyncContext.set('context', innerContext);
                AsyncContext.set('uniqueToInner', uniqueToInner);
                innerContextRead = AsyncContext.get('context');
                uniqueToInnerReadByInner = AsyncContext.get('uniqueToInner');
                uniqueToOuterReadByInner = AsyncContext.get('uniqueToOuter');
            });
            outerContextRead = AsyncContext.get('context');
            uniqueToOuterReadByOuter = AsyncContext.get('uniqueToOuter');
            uniqueToInnerReadByOuter = AsyncContext.get('uniqueToInner');
        });

        //Context shouldn't get overwritten when run function is chained
        expect(innerContextRead).toBe(innerContext);
        expect(outerContextRead).toBe(outerContext);

        //Context of outer read by outer should remain as is. Same for inner run.
        expect(uniqueToOuterReadByOuter).toBe(uniqueToOuter);
        expect(uniqueToInnerReadByInner).toBe(uniqueToInner);

        //Context of outer run that is read by inner should be undefined and vice versa
        expect(uniqueToOuterReadByInner).toBeUndefined();
        expect(uniqueToInnerReadByOuter).toBeUndefined();
    })
})