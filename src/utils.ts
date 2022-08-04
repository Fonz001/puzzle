import { transform, isEqual, isObject, isPlainObject, isArray, reduce, merge } from 'lodash'

/**
 * Returns an object containing the fields in which an object differs from a base object.
 * Not prepared for circular dependency.
 * @param {object} object - The object to compare.
 * @param {object} base - The base object to compare to.
 * */
export function deepObjectsDifference(object = {}, base = {}) {
  return transform(object, (result, value, key) => {
    const comperator = base == null ? undefined : base[key]
    if (!isEqual(value, comperator)) {
      result[key] = isObject(value) && isObject(comperator) ? deepObjectsDifference(value, comperator) : value
    }
  })
}

/**
 * Recursively walks down an object by always taking the first available key
 * until it finds a primitive type or an array. Then returns the path.
 * @param {object} object - The object to inspect.
 * @returns {object} A one level deep object with paths to nested values as keys.
 */
export const convertNestedObjectToPath = (obj, path = []) =>
  (isPlainObject(obj) || isArray(obj))
    ? reduce(obj, (cum, next, key) => merge(cum, convertNestedObjectToPath(next, [...path, key])), {})
    : { [path.join('.')]: obj }
