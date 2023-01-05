# async-context
Lets your async functions have local context, accessible from within any call inside them.

# Example 1
Wrap your async functions in the AsyncContext.run function:

```
AsyncContext.run(yourAsyncFunction, [], yourGlobalContext);
```

# Example 2
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

# Example 3 (NestJS)
NestJS Middleware can be used to intercept requests and add context to them which then can be accessed from any subsequent layer:

```

function contextMiddleware(req: Request, res: Response, next: NextFunction) {
  const yourSetters = [
    (globalContext) => {
      AsyncContext.set("requestId", uuid())
    },
    (globalContext) => {
      AsyncContext.set("someOtherGlobalData", {})
    },
  ]
  //Passing in req as the global context so that anything can be set at request level
  AsyncContext.run(next, yourSetters, req);
};

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(contextMiddleware)
      .forRoutes({ path: 'example', method: RequestMethod.GET });
  }
}
```

