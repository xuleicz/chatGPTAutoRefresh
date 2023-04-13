// ==UserScript==
// @name         ChatGPT报错后在新窗口刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打开新窗口来代替当前窗口刷新，可以不丢失当前输入的消息
// @author       Lei Xu
// @match        https://chat.openai.com/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("“ChatGPT报错后在新窗口刷新”脚本启动");

    //弹窗刷新
    function reloadInAnotherWindow(callbackWhenClosed) {
        // 创建遮罩层
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        document.body.appendChild(overlay);

        // 创建 iframe 元素
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.top = "50%";
        iframe.style.left = "50%";
        iframe.style.width = "800px";
        iframe.style.height = "600px";
        iframe.style.background = "#fff";
        iframe.style.transform = "translate(-50%, -50%)";
        // 加载404页面
        iframe.src = "https://chat.openai.com/404";
        overlay.appendChild(iframe);


        // 定时检查是否成功访问404页面
        function check404Shown() {
            if(iframe.contentDocument != null) {
                var found_h1 = iframe.contentDocument.documentElement.getElementsByTagName('h1');
                if (found_h1.length > 0) {
                    var h1 = found_h1[0];

                    if (h1.innerText == '404') {
                        // 关闭遮罩层
                        overlay.remove();
                        callbackWhenClosed();
                        return;
                    }
                }
            }
            //再循环
            setTimeout(check404Shown, 1000);
        }

        // 页面加载后定时检查是否成功访问404页面
        iframe.addEventListener('load', check404Shown);

        // 创建关闭按钮
        const closeButton = document.createElement("button");
        closeButton.textContent = "关闭";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.width = "60px";
        closeButton.style.height = "30px";
        closeButton.style.padding = "0";
        closeButton.style.border = "none";
        closeButton.style.background = "#f80";
        closeButton.style.color = "#fff";
        overlay.appendChild(closeButton);

        // 将关闭按钮移动到 iframe 右上角
        const iframeRect = iframe.getBoundingClientRect();
        const closeButtonRect = closeButton.getBoundingClientRect();
        const closeButtonOffset = 10; // 按钮与iframe的边距
        closeButton.style.top = iframeRect.top + closeButtonOffset + "px";
        closeButton.style.right =
            overlay.clientWidth - iframeRect.right + closeButtonOffset + "px";

        // 关闭按钮的点击事件，关闭遮罩层
        closeButton.addEventListener("click", () => {
            overlay.remove();
            callbackWhenClosed();
        });
    }

    //点击“重新生成”
    function clickRegenerate() {

        //找到第一个main标签
        const found_main = document.getElementsByTagName('main');
        if (found_main.length > 0) {
            const main = found_main[0];

            //找到第一个form标签
            const found_form = main.getElementsByTagName('form');
            if (found_form.length > 0) {
                const form = found_form[0];

                //找到第一个按钮
                const found_btn = form.getElementsByTagName('button');
                if (found_btn.length > 0) {
                    const btn = found_btn[0];

                    //点击按钮
                    btn.click();
                }
            }
        }
    }

    //定时检查错误提示
    const checkError = () => {

        //找到第一个main标签
        const found_main = document.getElementsByTagName('main');
        if (found_main.length > 0) {
            const main = found_main[0];

            //找到红框错误提示文本
            const found_div = main.getElementsByClassName('border-red-500');
            if (found_div.length > 0) {
                const div = found_div[0];

                //未刷新过
                if (div.getAttribute('tampermonkey-refreshed') != '1') {
                    div.setAttribute('tampermonkey-refreshed', '1');

                    console.log('后台刷新');

                    //弹窗刷新
                    reloadInAnotherWindow(clickRegenerate);
                }
            }
        }

        //再循环
        setTimeout(checkError, 1000);
    }

    //启动定时
    setTimeout(checkError, 1000);
})();
