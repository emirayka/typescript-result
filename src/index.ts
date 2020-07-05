type ResultOk<T> = {
  kind: 'ok'
  value: T
}

type ResultError<E> = {
  kind: 'error'
  error: E
}

type ResultType<T, E> = ResultOk<T> |
  ResultError<E>

const isOk = <T, E>(result: ResultType<T, E>): result is ResultOk<T> => {
  return result.kind === 'ok'
}

const isErr = <T, E>(result: ResultType<T, E>): result is ResultError<E> => {
  return result.kind === 'error'
}

class Result<T, E> {
  private readonly result: ResultType<T, E>

  constructor(result: ResultType<T, E>) {
    this.result = result
  }

  static ok<T, E>(value: T): Result<T, E> {
    return new Result({
      kind: 'ok',
      value,
    })
  }

  static err<T, E>(error: E): Result<T, E> {
    return new Result({
      kind: 'error',
      error,
    })
  }

  isOk(): boolean {
    return isOk(this.result)
  }

  isErr(): boolean {
    return isErr(this.result)
  }

  unwrap(): T {
    if (isOk(this.result)) {
      return this.result.value
    } else {
      throw new Error('Result.unwrap: Attempt to unwrap Err value.')
    }
  }

  unwrapErr(): E {
    if (isErr(this.result)) {
      return this.result.error
    } else {
      throw new Error('Result.unwrap: Attempt to unwrap Ok value.')
    }
  }

  unwrapOr(defaultValue: T): T {
    if (isOk(this.result)) {
      return this.result.value
    } else {
      return defaultValue
    }
  }

  unwrapOrElse(defaultValueConstructor: () => T): T {
    if (isOk(this.result)) {
      return this.result.value
    } else {
      return defaultValueConstructor()
    }
  }

  expect(s: string): T {
    if (isOk(this.result)) {
      return this.result.value
    } else {
      throw new Error(s)
    }
  }

  expectErr(s: string): E {
    if (isErr(this.result)) {
      return this.result.error
    } else {
      throw new Error(s)
    }
  }

  map<T2>(f: (value: T) => T2): Result<T2, E> {
    if (isOk(this.result)) {
      return Result.ok(f(this.result.value))
    } else {
      return Result.err(this.result.error)
    }
  }

  mapErr<E2>(f: (error: E) => E2): Result<T, E2> {
    if (isOk(this.result)) {
      return Result.ok(this.result.value)
    } else {
      return Result.err(f(this.result.error))
    }
  }

  mapOr<T2>(f: (error: T) => T2, defaultValue: T2): T2 {
    if (isOk(this.result)) {
      return f(this.result.value)
    } else {
      return defaultValue
    }
  }

  mapOrElse<T2>(f: (error: T) => T2, defaultValueConstructor: () => T2): T2 {
    if (isOk(this.result)) {
      return f(this.result.value)
    } else {
      return defaultValueConstructor()
    }
  }

  or(another: Result<T, E>): Result<T, E> {
    if (isOk(this.result)) {
      return this
    } else {
      return another
    }
  }

  orElse(anotherConstructor: (error: E) => Result<T, E>): Result<T, E> {
    if (isOk(this.result)) {
      return this
    } else {
      return anotherConstructor(this.result.error)
    }
  }

  and(another: Result<T, E>): Result<T, E> {
    if (isOk(this.result)) {
      return another
    } else {
      return this
    }
  }

  andThen(anotherConstructor: (value: T) => Result<T, E>): Result<T, E> {
    if (isOk(this.result)) {
      return anotherConstructor(this.result.value)
    } else {
      return this
    }
  }
}

export const Ok = <T, E>(value: T): Result<T, E> => Result.ok(value)
export const Err = <T, E>(error: E): Result<T, E> => Result.err(error)

export default Result