# kokkoro-og

> 发送网页 html 的 og 信息

## 安装

``` shell
# 切换至 bot 目录
cd bot

# 安装 npm 包
npm i kokkoro-og
```

在 [kokkoro](https://github.com/dcyuki/kokkoro) 成功运行并登录后，发送 `>enable og` 即可启用插件
使用 `>og <key> <value>` 可修改当前群聊的插件参数，例如关闭 GitHub 信息发送 `>og github false`

## 参数

``` javascript
const option = {
  // 是否发送 github og 信息
  github: true
}
```