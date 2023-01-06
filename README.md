# async-context
Lets your async functions have local context, accessible from within any call inside them.

# Example 1
Wrap your async functions in the AsyncContext.run function:

```js
function someInnerFunction() {
  console.log(AsyncContext.get("myGlobalData"));
  //{message: "hello"}
}
function yourAsyncFunction() {
  someInnerFunction();
  AsyncContext.set("myGlobalData", {message: "hello"});
}

AsyncContext.run(yourAsyncFunction, [], yourData);
```

# Example 2
ContextSetter can be used to provide multiple functions that set different contexts:

```js
const yourSetters = [
  (data) => {
    AsyncContext.set("requestId", uuid())
  },
  (data) => {
    AsyncContext.set("someOtherGlobalData", {})
  },
]
AsyncContext.run(yourAsyncFunction, yourSetters, yourData);
```

# Example 3 (NestJS)
NestJS Middleware can be used to intercept requests and add context to them which then can be accessed from any subsequent layer:

```js

function contextMiddleware(req: Request, res: Response, next: NextFunction) {
  const yourSetters = [
    (req) => {
      AsyncContext.set("requestId", uuid())
    },
    (req) => {
      AsyncContext.set("someOtherGlobalData", {})
    },
  ];
  AsyncContext.run(next, yourSetters, req);
};

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(contextMiddleware)
      .forRoutes({ path: 'example', method: RequestMethod.GET });
  }
}

//example.controller.ts

@Get('example')
async getExamples() {
  console.log(AsyncContext.get("requestId"));
  //outputs some uuid
}
```

