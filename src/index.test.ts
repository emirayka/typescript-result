import Result, {Ok, Err} from './index'

describe('isOk', () => {
  test('returns true if the result is ok', () => {
    const result: Result<number, string> = Ok(2)

    expect(result.isOk()).toBe(true)
  })

  test('returns false if the result is err', () => {
    const result: Result<number, string> = Err('Error here')

    expect(result.isOk()).toBe(false)
  })
})

describe('isErr', () => {
  test('returns true if the result is err', () => {
    const result: Result<number, string> = Err('Error here')

    expect(result.isErr()).toBe(true)
  })

  test('returns false if the result is ok', () => {
    const result: Result<number, string> = Ok(2)

    expect(result.isErr()).toBe(false)
  })
})

describe('unwrap', () => {
  test('unwraps value if the result is ok', () => {
    const result: Result<number, string> = Ok(2)

    expect(result.unwrap()).toBe(2)
  })

  test('throws an error if the result is err', () => {
    try {
      const result: Result<number, string> = Err('Error here')

      result.unwrap()

      fail()
    }
    catch (e) {
    }
  })
})

describe('unwrapErr', () => {
  test('unwraps error value if the result is err', () => {
    const result: Result<number, string> = Err('Error here')

    expect(result.unwrapErr()).toBe('Error here')
  })

  test('returns false if the result is ok', () => {
    try {
      const result: Result<number, string> = Ok(2)

      result.unwrapErr()

      fail()
    }
    catch (e) {
    }
  })
})

describe('unwrapOr', () => {
  test('returns the contained ok value or a provided default', () => {
    expect(Ok(2).unwrapOr(3)).toBe(2)
    expect(Err('Error here').unwrapOr(3)).toBe(3)
  })
})

describe('unwrapOrElse', () => {
  const defaultValueConstructor = (): number => 3

  test('returns the contained ok value or computed from a provided function', () => {
    expect(Ok(2).unwrapOrElse(defaultValueConstructor)).toBe(2)
    expect(Err('Error here').unwrapOrElse(defaultValueConstructor)).toBe(3)
  })
})

describe('expect', () => {
  test('returns the contained Ok value', () => {
    const result: Result<number, string> = Ok(2)

    expect(result.expect('Expected ok')).toBe(2)
  })

  test('throws an error if Err', () => {
    const message = 'Expected ok'

    try {
      const result: Result<number, string> = Err('Error')

      result.expect(message)

      fail()
    }
    catch (e) {
      expect(e.message).toEqual(message)
    }
  })
})

describe('expectErr', () => {
  test('returns the contained Err value', () => {
    const result: Result<number, string> = Err('Error')

    expect(result.expectErr('Expected err')).toEqual('Error')
  })

  test('throws an error if Err', () => {
    const message = 'Expected err'

    try {
      const result: Result<number, string> = Ok(2)

      result.expectErr(message)

      fail()
    }
    catch (e) {
      expect(e.message).toEqual(message)
    }
  })
})

describe('map', () => {
  const assertMap = <T, E, T2>(r: Result<T, E>, f: (value: T) => T2, expected: Result<T2, E>): void => {
    const result: Result<T2, E> = r.map(f)

    expect(result).toEqual(expected)
  }
  const square = (value: number): number => value * value

  test('maps result by applying a provided function if ok, otherwise does nothing', () => {
    assertMap(Ok(2), square, Ok(4))
    assertMap(Err('error'), square, Err('error'))
  })
})

describe('mapErr', () => {
  const assertMapErr = <T, E, E2>(r: Result<T, E>, f: (error: E) => E2, expected: Result<T, E2>): void => {
    const result: Result<T, E2> = r.mapErr(f)

    expect(result).toEqual(expected)
  }
  const len = (error: string): number => error.length

  test('maps result by applying a provided function if ok, otherwise does nothing', () => {
    assertMapErr(Ok(2), len, Ok(2))
    assertMapErr(Err('error'), len, Err(5))
  })
})

describe('mapOr', () => {
  const assertMapOr = <T, E, T2>(
    r: Result<T, E>,
    f: (value: T) => T2,
    defaultValue: T2,
    expected: T2,
  ): void => {
    const result: T2 = r.mapOr(f, defaultValue)

    expect(result).toEqual(expected)
  }

  const square = (value: number): number => value * value

  test('maps result by applying a provided function or returns provided default value', () => {
    assertMapOr(Ok(2), square, 5, 4)
    assertMapOr(Err('Error'), square, 5, 5)
  })
})

describe('mapOrElse', () => {
  const assertMapOr = <T, E, T2>(
    r: Result<T, E>,
    f: (value: T) => T2,
    defaultValue: T2,
    expected: T2,
  ): void => {
    const result: T2 = r.mapOr(f, defaultValue)

    expect(result).toEqual(expected)
  }

  const square = (value: number): number => value * value

  test('maps result by applying a provided function or returns provided default value', () => {
    assertMapOr(Ok(2), square, 5, 4)
    assertMapOr(Err('Error'), square, 5, 5)
  })
})

describe('or', () => {
  const assertOr = <T, E>(
    first: Result<T, E>,
    second: Result<T, E>,
    expected: Result<T, E>,
  ): void => {
    const result: Result<T, E> = first.or(second)

    expect(result).toEqual(expected)
  }

  test('returns or...', () => {
    assertOr(Err('Err1'), Err('Err2'), Err('Err2'))
    assertOr(Err('Err1'), Ok(2), Ok(2))
    assertOr(Ok(1), Err('Err2'), Ok(1))
    assertOr(Ok(1), Ok(2), Ok(1))
  })
})

describe('orElse', () => {
  const assertOrElse = <T, E>(
    first: Result<T, E>,
    f: (error: E) => Result<T, E>,
    expected: Result<T, E>,
  ): void => {
    const result: Result<T, E> = first.orElse(f)

    expect(result).toEqual(expected)
  }

  const ok = (): Result<number, string> => Ok(0)
  const err = (s: string): Result<number, string> => Err(s)

  test('returns or...', () => {
    assertOrElse(Err('Err1'), err, Err('Err1'))
    assertOrElse(Err('Err1'), ok, Ok(0))
    assertOrElse(Ok(1), err, Ok(1))
    assertOrElse(Ok(1), ok, Ok(1))
  })
})

describe('and', () => {
  const assertOr = <T, E>(
    first: Result<T, E>,
    second: Result<T, E>,
    expected: Result<T, E>,
  ): void => {
    const result: Result<T, E> = first.and(second)

    expect(result).toEqual(expected)
  }

  test('returns and...', () => {
    assertOr(Err('Err1'), Err('Err2'), Err('Err1'))
    assertOr(Err('Err1'), Ok(2), Err('Err1'))
    assertOr(Ok(1), Err('Err2'),Err('Err2'))
    assertOr(Ok(1), Ok(2), Ok(2))
  })
})

describe('andThen', () => {
  const assertAndThen = <T, E>(
    first: Result<T, E>,
    f: (value: T) => Result<T, E>,
    expected: Result<T, E>,
  ): void => {
    const result: Result<T, E> = first.andThen(f)

    expect(result).toEqual(expected)
  }

  const square = (value: number): Result<number, string> => Ok(value * value)
  const err = (value: number): Result<number, string> => Err(`${value}`)

  test('returns and...', () => {
    assertAndThen(Err('Err1'), err, Err('Err1'))
    assertAndThen(Err('Err1'), square, Err('Err1'))
    assertAndThen(Ok(2), err, Err('2'))
    assertAndThen(Ok(2), square, Ok(4))
  })
})
