# async-context
Lets your async functions have local context, accessible from within any call inside them.

Wrap your async functions in the AsyncContext.run function:

```
AsyncContext.run(yourAsyncFunction, [], yourGlobalContext);
```

ContextSetter can be used to provide multiple functions that set different contexts:

```
const yourSetters = [
  (globalContext) => {
    AsyncContext.set("requestId", uuid())
  },
  (globalContext) => {
    AsyncContext.set("someOtherGlobalData", {})
  },
]
AsyncContext.run(yourAsyncFunction, yourSetters, yourGlobalContext);
```

