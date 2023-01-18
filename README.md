# babel-plugin-code-cleaner
babel代码清洁工，删除指定的调试代码

```

## 安装插件
```js
npm install babel-plugin-code-cleaner -D
```

## 使用
babel.config.js
```js
{
  "plugins": ["babel-plugin-code-cleaner"]
}
```
**添加配置参数**
```js
{
  "plugins": [["code-cleaner", {
    "env": "production", // 始终执行cleaner
    "ignoreDebug": true, // 忽略 debugger的清除
    "commentWord": "@ignore-code-cleaner" // 默认值
  }]]
}
```

## 文档

| 参数   | 类型 |  默认值 | 介绍 |
| :----- | :--: | :--:|:--|----- |
| env |	String |	空 | env === 'production'，则始终执行cleaner |
| ignoreDebug |	Boolean|	false | 跳过debugger的cleaner |
| commentWord |	String |	@ignore-code-cleaner | 遇到注释跳过cleaner，类似于 ```// @ts-ignore``` |

