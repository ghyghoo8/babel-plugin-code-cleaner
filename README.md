# babel-plugin-code-cleaner
babel代码清洁工，删除指定的调试代码：```console``` & ```debugger```

## 插件安装
```js
npm install babel-plugin-code-cleaner -D
```

## babel配置
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

## 配置项
<table><thead>
<tr><td>参数</td><td>类型</td><td>默认值</td><td>介绍</td></tr>
</thead><tbody>
  <tr><td>env</td><td>string</td><td>空</td><td><code>env === 'production'</code>，则始终执行cleaner</td></tr>
<tr><td>ignoreDebug</td><td>boolean</td><td>false</td><td>跳过debugger的cleaner</td></tr>
<tr><td>commentWord</td><td>string</td><td>@ignore-code-cleaner</td><td>遇到注释跳过cleaner，类似于 <code>// @ts-ignore</code></td></tr>
</tbody></table>

