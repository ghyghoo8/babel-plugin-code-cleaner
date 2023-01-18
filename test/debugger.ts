import test from "ava";
import { transform } from "@babel/core";
import codeCleaner from "../src/index";

const code = `const fn = () => {
  let a = "hello"
  console.log("log");
  console.error("error")
  console.warn("error")
  console.info("error")
};
const fn1 = () => console.log("log");
if (true) {
  const a = 1;
  console.log("log");
  console.error("error")
  console.warn("error")
  console.info("error")
  debugger
}
new Array(5).fill(0).map(_=>console.log("123"));
debugger
console.log("log");
console.error("error")
console.warn("error")
console.info("error")
`;


const codeResult = `const fn = () => {
  let a = "hello";
};
const fn1 = () => {};
if (true) {
  const a = 1;
  debugger;
}
new Array(5).fill(0).map(_ => {});
debugger;`;

test("测试debugger", async (t) => {
  return new Promise((resolve,reject) => {
    transform(code, {
      plugins: [[codeCleaner, { ignoreDebug: true }]],
    }, (err, result) => {
      if (err) {
        t.log(err.name, err.message)
        t.fail(err.stack)
        reject(err)
      } else {
        // t.log(result?.code)
        t.is(result?.code, codeResult)
        resolve()
      }
    })
  })
});