export function overwriteMethods(originElement, configIndex, ownIndex) {
  const reg = /^on.*/;
  for (const prop in originElement) {
    const item = originElement[prop];
    if (typeof item === "function" && reg.test(item.name)) {
      originElement[prop] = function(...args) {
        item.apply(this, args.concat(configIndex, ownIndex));
      };
    }
  }
  return originElement;
}

export function overwriteArrayMethod() {}
