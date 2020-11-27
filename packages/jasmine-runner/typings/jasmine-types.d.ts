/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/class-name-casing */

/**
 * Grabbed from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jasmine,
 * but removed duplicate globals, `it`, `describe`, etc
 */

declare namespace jasmine {
  interface DoneFn extends Function {
    (): void;

    /** fails the spec and indicates that it has completed. If the message is an Error, Error.message is used */
    fail: (message?: Error | string) => void;
  }

  type Func = (...args: any[]) => any;

  // Use trick with prototype to allow abstract classes.
  // More info: https://stackoverflow.com/a/38642922/2009373
  type Constructor = Function & { prototype: any };

  type ImplementationCallback = (() => PromiseLike<any>) | ((done: DoneFn) => void);

  type ExpectedRecursive<T> =
    | T
    | ObjectContaining<T>
    | AsymmetricMatcher<any>
    | {
        [K in keyof T]: ExpectedRecursive<T[K]> | Any;
      };
  type Expected<T> =
    | T
    | ObjectContaining<T>
    | AsymmetricMatcher<any>
    | Any
    | Spy
    | {
        [K in keyof T]: ExpectedRecursive<T[K]>;
      };
  type SpyObjMethodNames<T = undefined> = T extends undefined
    ? readonly string[] | { [methodName: string]: any }
    : ReadonlyArray<keyof T> | { [P in keyof T]?: T[P] extends Func ? ReturnType<T[P]> : any };

  type SpyObjPropertyNames<T = undefined> = T extends undefined
    ? readonly string[] | { [propertyName: string]: any }
    : ReadonlyArray<keyof T> | { [P in keyof T]?: T[P] };

  /**
   * Configuration that can be used when configuring Jasmine via {@link jasmine.Env.configure}
   */
  interface EnvConfiguration {
    random?: boolean;
    seed?: number;
    failFast?: boolean;
    failSpecWithNoExpectations?: boolean;
    oneFailurePerSpec?: boolean;
    hideDisabled?: boolean;
    specFilter?: Function;
    promise?: Function;
  }

  function clock(): Clock;

  var matchersUtil: MatchersUtil;

  /**
   * That will succeed if the actual value being compared is an instance of the specified class/constructor.
   */
  function any(aclass: Constructor | symbol): AsymmetricMatcher<any>;

  /**
   * That will succeed if the actual value being compared is not `null` and not `undefined`.
   */
  function anything(): AsymmetricMatcher<any>;

  /**
   * That will succeed if the actual value being compared is `true` or anything truthy.
   * @since 3.1.0
   */
  function truthy(): AsymmetricMatcher<any>;

  /**
   * That will succeed if the actual value being compared is  `null`, `undefined`, `0`, `false` or anything falsey.
   * @since 3.1.0
   */
  function falsy(): AsymmetricMatcher<any>;

  /**
   * That will succeed if the actual value being compared is empty.
   * @since 3.1.0
   */
  function empty(): AsymmetricMatcher<any>;

  /**
   * That will succeed if the actual value being compared is not empty.
   * @since 3.1.0
   */
  function notEmpty(): AsymmetricMatcher<any>;

  function arrayContaining<T>(sample: ArrayLike<T>): ArrayContaining<T>;
  function arrayWithExactContents<T>(sample: ArrayLike<T>): ArrayContaining<T>;
  function objectContaining<T>(sample: { [K in keyof T]?: ExpectedRecursive<T[K]> }): ObjectContaining<T>;

  function setDefaultSpyStrategy<Fn extends Func = Func>(and: SpyAnd<Fn>): void;
  function createSpy<Fn extends Func>(name?: string, originalFn?: Fn): Spy<Fn>;
  function createSpyObj(baseName: string, methodNames: SpyObjMethodNames, propertyNames?: SpyObjPropertyNames): any;
  function createSpyObj<T>(baseName: string, methodNames: SpyObjMethodNames<T>, propertyNames?: SpyObjPropertyNames<T>): SpyObj<T>;
  function createSpyObj(methodNames: SpyObjMethodNames, propertyNames?: SpyObjPropertyNames): any;
  function createSpyObj<T>(methodNames: SpyObjMethodNames<T>, propertyNames?: SpyObjPropertyNames<T>): SpyObj<T>;

  function pp(value: any): string;

  function getEnv(): Env;

  function addCustomEqualityTester(equalityTester: CustomEqualityTester): void;

  function addMatchers(matchers: CustomMatcherFactories): void;
  function addAsyncMatchers(matchers: CustomAsyncMatcherFactories): void;

  function stringMatching(str: string | RegExp): AsymmetricMatcher<string>;

  function formatErrorMsg(domain: string, usage: string): (msg: string) => string;

  interface Any extends AsymmetricMatcher<any> {
    (...params: any[]): any; // jasmine.Any can also be a function
    new (expectedClass: any): any;

    jasmineMatches(other: any): boolean;
    jasmineToString(): string;
  }

  interface AsymmetricMatcher<TValue> {
    asymmetricMatch(other: TValue, customTesters: readonly CustomEqualityTester[]): boolean;
    jasmineToString?(): string;
  }

  // taken from TypeScript lib.core.es6.d.ts, applicable to CustomMatchers.contains()
  interface ArrayLike<T> {
    length: number;
    [n: number]: T;
  }

  interface ArrayContaining<T> extends AsymmetricMatcher<any> {
    new?(sample: ArrayLike<T>): ArrayLike<T>;
  }

  interface ObjectContaining<T> extends AsymmetricMatcher<T> {
    new?(sample: { [K in keyof T]?: any }): { [K in keyof T]?: any };

    jasmineMatches(other: any, mismatchKeys: any[], mismatchValues: any[]): boolean;
    jasmineToString?(): string;
  }

  interface Block {
    new (env: Env, func: SpecFunction, spec: Spec): any;

    execute(onComplete: () => void): void;
  }

  interface WaitsBlock extends Block {
    new (env: Env, timeout: number, spec: Spec): any;
  }

  interface WaitsForBlock extends Block {
    new (env: Env, timeout: number, latchFunction: SpecFunction, message: string, spec: Spec): any;
  }

  interface Clock {
    install(): void;
    uninstall(): void;
    /** Calls to any registered callback are triggered when the clock is ticked forward via the jasmine.clock().tick function, which takes a number of milliseconds. */
    tick(ms: number): void;
    mockDate(date?: Date): void;
    withMock(func: () => void): void;
  }

  type CustomEqualityTester = (first: any, second: any) => boolean | void;

  interface CustomMatcher {
    compare<T>(actual: T, expected: T, ...args: any[]): CustomMatcherResult;
    compare(actual: any, ...expected: any[]): CustomMatcherResult;
    negativeCompare?<T>(actual: T, expected: T, ...args: any[]): CustomMatcherResult;
    negativeCompare?(actual: any, ...expected: any[]): CustomMatcherResult;
  }

  interface CustomAsyncMatcher {
    compare<T>(actual: T, expected: T, ...args: any[]): Promise<CustomMatcherResult>;
    compare(actual: any, ...expected: any[]): Promise<CustomMatcherResult>;
    negativeCompare?<T>(actual: T, expected: T, ...args: any[]): Promise<CustomMatcherResult>;
    negativeCompare?(actual: any, ...expected: any[]): Promise<CustomMatcherResult>;
  }

  type CustomMatcherFactory = (util: MatchersUtil, customEqualityTesters: readonly CustomEqualityTester[]) => CustomMatcher;

  type CustomAsyncMatcherFactory = (util: MatchersUtil, customEqualityTesters: readonly CustomEqualityTester[]) => CustomAsyncMatcher;

  interface CustomMatcherFactories {
    [name: string]: CustomMatcherFactory;
  }

  interface CustomAsyncMatcherFactories {
    [name: string]: CustomAsyncMatcherFactory;
  }

  interface CustomMatcherResult {
    pass: boolean;
    message?: string;
  }

  interface MatchersUtil {
    equals(a: any, b: any, customTesters?: readonly CustomEqualityTester[]): boolean;
    contains<T>(haystack: ArrayLike<T> | string, needle: any, customTesters?: readonly CustomEqualityTester[]): boolean;
    buildFailureMessage(matcherName: string, isNot: boolean, actual: any, ...expected: any[]): string;
  }

  interface Env {
    currentSpec: Spec;

    matchersClass: Matchers<any>;

    version(): any;
    versionString(): string;
    nextSpecId(): number;
    addReporter(reporter: Reporter | CustomReporter): void;
    execute(): void;
    describe(description: string, specDefinitions: () => void): Suite;
    // ddescribe(description: string, specDefinitions: () => void): Suite; Not a part of jasmine. Angular team adds these
    beforeEach(beforeEachFunction: ImplementationCallback, timeout?: number): void;
    beforeAll(beforeAllFunction: ImplementationCallback, timeout?: number): void;
    currentRunner(): Runner;
    afterEach(afterEachFunction: ImplementationCallback, timeout?: number): void;
    afterAll(afterAllFunction: ImplementationCallback, timeout?: number): void;
    xdescribe(desc: string, specDefinitions: () => void): XSuite;
    it(description: string, func: () => void): Spec;
    // iit(description: string, func: () => void): Spec; Not a part of jasmine. Angular team adds these
    xit(desc: string, func: () => void): XSpec;
    compareRegExps_(a: RegExp, b: RegExp, mismatchKeys: string[], mismatchValues: string[]): boolean;
    compareObjects_(a: any, b: any, mismatchKeys: string[], mismatchValues: string[]): boolean;
    equals_(a: any, b: any, mismatchKeys: string[], mismatchValues: string[]): boolean;
    contains_(haystack: any, needle: any): boolean;
    addCustomEqualityTester(equalityTester: CustomEqualityTester): void;
    addMatchers(matchers: CustomMatcherFactories): void;
    specFilter(spec: Spec): boolean;
    /**
     * @deprecated Use oneFailurePerSpec option in {@link jasmine.Env.configure} instead.
     */
    throwOnExpectationFailure(value: boolean): void;
    /**
     * @deprecated Use failFast option in {@link jasmine.Env.configure} instead.
     */
    stopOnSpecFailure(value: boolean): void;
    /**
     * @deprecated Use seed option in {@link jasmine.Env.configure} instead.
     */
    seed(seed: string | number): string | number;
    provideFallbackReporter(reporter: Reporter): void;
    throwingExpectationFailures(): boolean;
    allowRespy(allow: boolean): void;
    randomTests(): boolean;
    /**
     * @deprecated Use random option in {@link jasmine.Env.configure} instead.
     */
    randomizeTests(b: boolean): void;
    clearReporters(): void;
    configure(configuration: EnvConfiguration): void;
  }

  interface FakeTimer {
    new (): any;

    reset(): void;
    tick(millis: number): void;
    runFunctionsWithinRange(oldMillis: number, nowMillis: number): void;
    scheduleFunction(timeoutKey: any, funcToCall: () => void, millis: number, recurring: boolean): void;
  }

  type HtmlReporter = new () => any;

  type HtmlSpecFilter = new () => any;

  interface Result {
    type: string;
  }

  interface NestedResults extends Result {
    description: string;

    totalCount: number;
    passedCount: number;
    failedCount: number;

    skipped: boolean;

    rollupCounts(result: NestedResults): void;
    log(values: any): void;
    getItems(): Result[];
    addResult(result: Result): void;
    passed(): boolean;
  }

  interface MessageResult extends Result {
    values: any;
    trace: Trace;
  }

  interface ExpectationResult extends Result {
    matcherName: string;
    passed(): boolean;
    expected: any;
    actual: any;
    message: string;
    trace: Trace;
  }

  interface Order {
    new (options: { random: boolean; seed: string }): any;
    random: boolean;
    seed: string;
    sort<T>(items: T[]): T[];
  }

  namespace errors {
    class ExpectationFailed extends Error {
      constructor();

      stack: any;
    }
  }

  interface TreeProcessor {
    new (attrs: any): any;
    execute: (done: Function) => void;
    processTree(): any;
  }

  interface Trace {
    name: string;
    message: string;
    stack: any;
  }

  interface PrettyPrinter {
    new (): any;

    format(value: any): void;
    iterateObject(obj: any, fn: (property: string, isGetter: boolean) => void): void;
    emitScalar(value: any): void;
    emitString(value: string): void;
    emitArray(array: any[]): void;
    emitObject(obj: any): void;
    append(value: any): void;
  }

  interface StringPrettyPrinter extends PrettyPrinter {}

  interface Queue {
    new (env: any): any;

    env: Env;
    ensured: boolean[];
    blocks: Block[];
    running: boolean;
    index: number;
    offset: number;
    abort: boolean;

    addBefore(block: Block, ensure?: boolean): void;
    add(block: any, ensure?: boolean): void;
    insertNext(block: any, ensure?: boolean): void;
    start(onComplete?: () => void): void;
    isRunning(): boolean;
    next_(): void;
    results(): NestedResults;
  }

  interface Matchers<T> {
    new (env: Env, actual: T, spec: Env, isNot?: boolean): any;

    env: Env;
    actual: T;
    spec: Env;
    isNot?: boolean;
    message(): any;

    /**
     * Expect the actual value to be `===` to the expected value.
     *
     * @param expected - The expected value to compare against.
     * @param expectationFailOutput
     * @example
     * expect(thing).toBe(realThing);
     */
    toBe(expected: Expected<T>, expectationFailOutput?: any): boolean;

    /**
     * Expect the actual value to be equal to the expected, using deep equality comparison.
     * @param expected - Expected value.
     * @param expectationFailOutput
     * @example
     * expect(bigObject).toEqual({ "foo": ['bar', 'baz'] });
     */
    toEqual(expected: Expected<T>, expectationFailOutput?: any): boolean;

    /**
     * Expect the actual value to match a regular expression.
     * @param expected - Value to look for in the string.
     * @example
     * expect("my string").toMatch(/string$/);
     * expect("other string").toMatch("her");
     */
    toMatch(expected: string | RegExp, expectationFailOutput?: any): boolean;

    toBeDefined(expectationFailOutput?: any): boolean;
    toBeUndefined(expectationFailOutput?: any): boolean;
    toBeNull(expectationFailOutput?: any): boolean;
    toBeNaN(): boolean;
    toBeTruthy(expectationFailOutput?: any): boolean;
    toBeFalsy(expectationFailOutput?: any): boolean;
    toBeTrue(): boolean;
    toBeFalse(): boolean;
    toHaveBeenCalled(): boolean;
    toHaveBeenCalledBefore(expected: Func): boolean;
    toHaveBeenCalledWith(...params: any[]): boolean;
    toHaveBeenCalledTimes(expected: number): boolean;
    toContain(expected: any, expectationFailOutput?: any): boolean;
    toBeLessThan(expected: number, expectationFailOutput?: any): boolean;
    toBeLessThanOrEqual(expected: number, expectationFailOutput?: any): boolean;
    toBeGreaterThan(expected: number, expectationFailOutput?: any): boolean;
    toBeGreaterThanOrEqual(expected: number, expectationFailOutput?: any): boolean;
    toBeCloseTo(expected: number, precision?: any, expectationFailOutput?: any): boolean;
    toThrow(expected?: any): boolean;
    toThrowError(message?: string | RegExp): boolean;
    toThrowError(expected?: new (...args: any[]) => Error, message?: string | RegExp): boolean;
    toThrowMatching(predicate: (thrown: any) => boolean): boolean;
    toBeNegativeInfinity(expectationFailOutput?: any): boolean;
    toBePositiveInfinity(expectationFailOutput?: any): boolean;
    toBeInstanceOf(expected: Constructor): boolean;

    /**
     * Expect the actual value to be a DOM element that has the expected class.
     * @since 3.0.0
     * @param expected - The class name to test for.
     * @example
     * var el = document.createElement('div');
     * el.className = 'foo bar baz';
     * expect(el).toHaveClass('bar');
     */
    toHaveClass(expected: string, expectationFailOutput?: any): boolean;

    /**
     * Add some context for an expect.
     * @param message - Additional context to show when the matcher fails
     */
    withContext(message: string): Matchers<T>;

    /**
     * Invert the matcher following this expect.
     */
    not: Matchers<T>;
  }

  interface ArrayLikeMatchers<T> extends Matchers<ArrayLike<T>> {
    /**
     * Expect the actual value to be `===` to the expected value.
     *
     * @param expected - The expected value to compare against.
     * @param expectationFailOutput
     * @example
     * expect(thing).toBe(realThing);
     */
    toBe(expected: Expected<ArrayLike<T>> | ArrayContaining<T>, expectationFailOutput?: any): boolean;

    /**
     * Expect the actual value to be equal to the expected, using deep equality comparison.
     * @param expected - Expected value.
     * @param expectationFailOutput
     * @example
     * expect(bigObject).toEqual({ "foo": ['bar', 'baz'] });
     */
    toEqual(expected: Expected<ArrayLike<T>> | ArrayContaining<T>, expectationFailOutput?: any): boolean;

    toContain(expected: Expected<T>, expectationFailOutput?: any): boolean;

    /**
     * Add some context for an expect.
     * @param message - Additional context to show when the matcher fails.
     */
    withContext(message: string): ArrayLikeMatchers<T>;

    /**
     * Invert the matcher following this expect.
     */
    not: ArrayLikeMatchers<T>;
  }

  type MatchableArgs<Fn> = Fn extends (...args: infer P) => any ? { [K in keyof P]: P[K] | AsymmetricMatcher<any> } : never;

  interface FunctionMatchers<Fn extends Func> extends Matchers<any> {
    toHaveBeenCalledWith(...params: MatchableArgs<Fn>): boolean;

    /**
     * Add some context for an expect.
     * @param message - Additional context to show when the matcher fails.
     */
    withContext(message: string): FunctionMatchers<Fn>;

    /**
     * Invert the matcher following this expect.
     */
    not: FunctionMatchers<Fn>;
  }

  interface NothingMatcher {
    nothing(): void;
  }

  interface AsyncMatchers<T, U> {
    /**
     * Expect a promise to be resolved.
     * @param expectationFailOutput
     */
    toBeResolved(expectationFailOutput?: any): Promise<void>;

    /**
     * Expect a promise to be rejected.
     * @param expectationFailOutput
     */
    toBeRejected(expectationFailOutput?: any): Promise<void>;

    /**
     * Expect a promise to be resolved to a value equal to the expected, using deep equality comparison.
     * @param expected - Value that the promise is expected to resolve to.
     */
    toBeResolvedTo(expected: Expected<T>): Promise<void>;

    /**
     * Expect a promise to be rejected with a value equal to the expected, using deep equality comparison.
     * @param expected - Value that the promise is expected to be rejected with.
     */
    toBeRejectedWith(expected: Expected<U>): Promise<void>;

    /**
     * Expect a promise to be rejected with a value matched to the expected.
     * @param expected - Error constructor the object that was thrown needs to be an instance of. If not provided, Error will be used.
     * @param message - The message that should be set on the thrown Error.
     */
    toBeRejectedWithError(expected?: new (...args: any[]) => Error, message?: string | RegExp): Promise<void>;

    /**
     * Expect a promise to be rejected with a value matched to the expected.
     * @param message - The message that should be set on the thrown Error.
     */
    toBeRejectedWithError(message?: string | RegExp): Promise<void>;

    /**
     * Add some context for an expect.
     * @param message - Additional context to show when the matcher fails.
     */
    withContext(message: string): AsyncMatchers<T, U>;

    /**
     * Invert the matcher following this expect.
     */
    not: AsyncMatchers<T, U>;
  }

  interface Reporter {
    reportRunnerStarting(runner: Runner): void;
    reportRunnerResults(runner: Runner): void;
    reportSuiteResults(suite: Suite): void;
    reportSpecStarting(spec: Spec): void;
    reportSpecResults(spec: Spec): void;
    log(str: string): void;
  }

  interface MultiReporter extends Reporter {
    addReporter(reporter: Reporter): void;
  }

  interface SuiteInfo {
    totalSpecsDefined: number;
  }

  interface CustomReportExpectation {
    matcherName: string;
    message: string;
    passed: boolean;
    stack: string;
  }

  interface FailedExpectation extends CustomReportExpectation {
    actual: string;
    expected: string;
  }

  interface PassedExpectation extends CustomReportExpectation {}

  interface CustomReporterResult {
    description: string;
    failedExpectations?: FailedExpectation[];
    fullName: string;
    id: string;
    passedExpectations?: PassedExpectation[];
    pendingReason?: string;
    status?: string;
  }

  interface RunDetails {
    failedExpectations: ExpectationResult[];
    order: Order;
  }

  interface CustomReporter {
    jasmineStarted?(suiteInfo: SuiteInfo): void;
    suiteStarted?(result: CustomReporterResult): void;
    specStarted?(result: CustomReporterResult): void;
    specDone?(result: CustomReporterResult): void;
    suiteDone?(result: CustomReporterResult): void;
    jasmineDone?(runDetails: RunDetails): void;
  }

  interface Runner {
    new (env: Env): any;

    execute(): void;
    beforeEach(beforeEachFunction: SpecFunction): void;
    afterEach(afterEachFunction: SpecFunction): void;
    beforeAll(beforeAllFunction: SpecFunction): void;
    afterAll(afterAllFunction: SpecFunction): void;
    finishCallback(): void;
    addSuite(suite: Suite): void;
    add(block: Block): void;
    specs(): Spec[];
    suites(): Suite[];
    topLevelSuites(): Suite[];
    results(): NestedResults;
  }

  type SpecFunction = (spec?: Spec) => void;

  interface SuiteOrSpec {
    id: number;
    env: Env;
    description: string;
    queue: Queue;
  }

  interface Spec extends SuiteOrSpec {
    new (env: Env, suite: Suite, description: string): any;

    suite: Suite;

    afterCallbacks: SpecFunction[];
    spies_: Spy[];

    results_: NestedResults;
    matchersClass: Matchers<any>;

    getFullName(): string;
    results(): NestedResults;
    log(arguments: any): any;
    runs(func: SpecFunction): Spec;
    addToQueue(block: Block): void;
    addMatcherResult(result: Result): void;
    getResult(): any;
    expect(actual: any): any;
    waits(timeout: number): Spec;
    waitsFor(latchFunction: SpecFunction, timeoutMessage?: string, timeout?: number): Spec;
    fail(e?: any): void;
    getMatchersClass_(): Matchers<any>;
    addMatchers(matchersPrototype: CustomMatcherFactories): void;
    finishCallback(): void;
    finish(onComplete?: () => void): void;
    after(doAfter: SpecFunction): void;
    execute(onComplete?: () => void, enabled?: boolean): any;
    addBeforesAndAftersToQueue(): void;
    explodes(): void;
    spyOn(obj: any, methodName: string, ignoreMethodDoesntExist: boolean): Spy;
    spyOnProperty(object: any, property: string, accessType?: 'get' | 'set'): Spy;
    spyOnAllFunctions(object: any): Spy;

    removeAllSpies(): void;
    throwOnExpectationFailure: boolean;
  }

  interface XSpec {
    id: number;
    runs(): void;
  }

  interface Suite extends SuiteOrSpec {
    new (env: Env, description: string, specDefinitions: () => void, parentSuite: Suite): any;

    parentSuite: Suite;

    getFullName(): string;
    finish(onComplete?: () => void): void;
    beforeEach(beforeEachFunction: SpecFunction): void;
    afterEach(afterEachFunction: SpecFunction): void;
    beforeAll(beforeAllFunction: SpecFunction): void;
    afterAll(afterAllFunction: SpecFunction): void;
    results(): NestedResults;
    add(suiteOrSpec: SuiteOrSpec): void;
    specs(): Spec[];
    suites(): Suite[];
    children(): any[];
    execute(onComplete?: () => void): void;
  }

  interface XSuite {
    execute(): void;
  }

  interface Spy<Fn extends Func = Func> {
    (...params: Parameters<Fn>): ReturnType<Fn>;

    and: SpyAnd<Fn>;
    calls: Calls<Fn>;
    withArgs(...args: MatchableArgs<Fn>): Spy<Fn>;
  }

  type SpyObj<T> = T &
    {
      [K in keyof T]: T[K] extends Func ? T[K] & Spy<T[K]> : T[K];
    };

  /**
   * It's like SpyObj, but doesn't verify argument/return types for functions.
   * Useful if TS cannot correctly infer type for complex objects.
   */
  type NonTypedSpyObj<T> = SpyObj<{ [K in keyof T]: T[K] extends Func ? Func : T[K] }>;

  /**
   * Obtains the promised type that a promise-returning function resolves to.
   */
  type PromisedReturnType<Fn extends Func> = Fn extends (...args: any[]) => PromiseLike<infer TResult> ? TResult : never;

  /**
   * Obtains the type that a promise-returning function can be rejected with.
   * This is so we can use .and.rejectWith() only for functions that return a promise.
   */
  type PromisedRejectType<Fn extends Function> = Fn extends (...args: any[]) => PromiseLike<unknown> ? any : never;

  interface SpyAnd<Fn extends Func> {
    identity: string;

    /** By chaining the spy with and.callThrough, the spy will still track all calls to it but in addition it will delegate to the actual implementation. */
    callThrough(): Spy<Fn>;
    /** By chaining the spy with and.returnValue, all calls to the function will return a specific value. */
    returnValue(val: ReturnType<Fn>): Spy<Fn>;
    /** By chaining the spy with and.returnValues, all calls to the function will return specific values in order until it reaches the end of the return values list. */
    returnValues(...values: Array<ReturnType<Fn>>): Spy<Fn>;
    /** By chaining the spy with and.callFake, all calls to the spy will delegate to the supplied function. */
    callFake(fn: Fn): Spy<Fn>;
    /** Tell the spy to return a promise resolving to the specified value when invoked. */
    resolveTo(val?: PromisedReturnType<Fn>): Spy<Fn>;
    /** Tell the spy to return a promise rejecting with the specified value when invoked. */
    rejectWith(val?: PromisedRejectType<Fn>): Spy<Fn>;
    /** By chaining the spy with and.throwError, all calls to the spy will throw the specified value. */
    throwError(msg: string | Error): Spy;
    /** When a calling strategy is used for a spy, the original stubbing behavior can be returned at any time with and.stub. */
    stub(): Spy;
  }

  interface Calls<Fn extends Func> {
    /** By chaining the spy with calls.any(), will return false if the spy has not been called at all, and then true once at least one call happens. */
    any(): boolean;
    /** By chaining the spy with calls.count(), will return the number of times the spy was called */
    count(): number;
    /** By chaining the spy with calls.argsFor(), will return the arguments passed to call number index */
    argsFor(index: number): Parameters<Fn>;
    /** By chaining the spy with calls.allArgs(), will return the arguments to all calls */
    allArgs(): ReadonlyArray<Parameters<Fn>>;
    /** By chaining the spy with calls.all(), will return the context (the this) and arguments passed all calls */
    all(): ReadonlyArray<CallInfo<Fn>>;
    /** By chaining the spy with calls.mostRecent(), will return the context (the this) and arguments for the most recent call */
    mostRecent(): CallInfo<Fn>;
    /** By chaining the spy with calls.first(), will return the context (the this) and arguments for the first call */
    first(): CallInfo<Fn>;
    /** By chaining the spy with calls.reset(), will clears all tracking for a spy */
    reset(): void;
  }

  interface CallInfo<Fn extends Func> {
    /** The context (the this) for the call */
    object: any;
    /** All arguments passed to the call */
    args: Parameters<Fn>;
    /** The return value of the call */
    returnValue: ReturnType<Fn>;
  }

  interface Util {
    inherit(childClass: Function, parentClass: Function): any;
    formatException(e: any): any;
    htmlEscape(str: string): string;
    argsToArray(args: any): any;
    extend(destination: any, source: any): any;
  }

  interface JsApiReporter extends Reporter {
    started: boolean;
    finished: boolean;
    result: any;
    messages: any;
    runDetails: RunDetails;

    new (): any;

    suites(): Suite[];
    summarize_(suiteOrSpec: SuiteOrSpec): any;
    results(): any;
    resultsForSpec(specId: any): any;
    log(str: any): any;
    resultsForSpecs(specIds: any): any;
    summarizeResult_(result: any): any;
  }

  interface Jasmine {
    Spec: Spec;
    clock: Clock;
    util: Util;
  }

  var HtmlReporter: HtmlReporter;
  var HtmlSpecFilter: HtmlSpecFilter;

  /**
   * Default number of milliseconds Jasmine will wait for an asynchronous spec to complete.
   */
  var DEFAULT_TIMEOUT_INTERVAL: number;

  /**
   * Maximum number of array elements to display when pretty printing objects.
   * This will also limit the number of keys and values displayed for an object.
   * Elements past this number will be ellipised.
   */
  var MAX_PRETTY_PRINT_ARRAY_LENGTH: number;

  /**
   * Maximum number of charasters to display when pretty printing objects.
   * Characters past this number will be ellipised.
   */
  var MAX_PRETTY_PRINT_CHARS: number;

  /**
   * Maximum object depth the pretty printer will print to.
   * Set this to a lower value to speed up pretty printing if you have large objects.
   */
  var MAX_PRETTY_PRINT_DEPTH: number;
}

declare module 'jasmine' {
  class jasmine {
    constructor(options: any);
    jasmine: jasmine.Jasmine;
    addMatchers(matchers: jasmine.CustomMatcherFactories): void;
    addReporter(reporter: jasmine.Reporter): void;
    addSpecFile(filePath: string): void;
    addSpecFiles(files: string[]): void;
    configureDefaultReporter(options: any, ...args: any[]): void;
    execute(files?: string[], filterString?: string): any;
    exitCodeCompletion(passed: any): void;
    loadConfig(config: any): void;
    loadConfigFile(configFilePath: any): void;
    loadHelpers(): void;
    loadSpecs(): void;
    onComplete(onCompleteCallback: (passed: boolean) => void): void;
    provideFallbackReporter(reporter: jasmine.Reporter): void;
    randomizeTests(value?: any): boolean;
    seed(value: any): void;
    showColors(value: any): void;
    stopSpecOnExpectationFailure(value: any): void;
    static ConsoleReporter(): any;
    env: jasmine.Env;

    /**
     * Custom edit for Stryker
     * @see https://github.com/jasmine/jasmine-npm/blob/master/lib/jasmine.js#L24
     */
    exit(): void;

    reportersCount: number;
    completionReporter: jasmine.CustomReporter;
    reporter: jasmine.CustomReporter;
    coreVersion(): string;
    showingColors: boolean;
    projectBaseDir: string;
    printDeprecation(): void;
    specFiles: string[];
    helperFiles: string[];
  }
  export = jasmine;
}