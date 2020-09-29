import { CreateConfig } from "./useFormConfig";
const arrayProto = Array.prototype;
export const createProto = Object.create(arrayProto);

const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

const createConfig = new CreateConfig();

methodsToPatch.forEach((method) => {
  createProto[method] = function(...args) {
    const { configIndex, ownIndex, $cfg } = this;
    let insertData, _args;
    switch (method) {
      case "push":
      case "unshift":
        insertData = args.splice(0);
        break;
      case "splice":
        insertData = args.splice(2);
        break;
    }
    if (args) {
      _args = args.map((item) => {
        return typeof item === "object"
          ? createConfig.pxying(configIndex, ownIndex)(item)
          : item;
      });
    }
    return arrayProto[method].apply(this, [...args, ..._args]);
  };
});
