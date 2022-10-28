export const findNestedObjectValue = (obj, key) => {
  if (!key) return obj;
  const keyChain = key.split('.');
  return _findNestedObjectValueRecursive(obj, keyChain);
};

const _findNestedObjectValueRecursive = (
  obj,
  keyChain
) => {
  if (!obj || !keyChain?.length) return obj;

  const [key, ...rest] = keyChain;
  const keyValue = obj?.[key];

  if (!rest.length) return keyValue;

  return _findNestedObjectValueRecursive(keyValue, rest);
};
