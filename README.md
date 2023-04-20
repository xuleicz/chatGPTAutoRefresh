# chatGPT自动刷新和重试（油猴脚本）

## 背景
在使用梯子访问官网使用chatGPT的过程中，经常会提示“Something went wrong...”，需要刷新网页，不但麻烦，而且会导致之前输入的未回答的信息丢失。  

## 作用
报错后自动处理，让对话继续。

## 用法
1. 浏览器安装油猴插件（Tampermonkey），添加新脚本，复制“chatGPTAutoRefresh.user.js”中的所有文本，替换新脚本窗口中的现有所有内容，按Ctrl+S保存。
2. 刷新chatGPT网页。

## 原理
1. 后台定期访问session页以保持会话。
2. 自动检测到chatGPT回答报错后，立即访问session页，并自动重新生成回答。
