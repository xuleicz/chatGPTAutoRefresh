// ==UserScript==
// @name         ChatGPT会话保持和自动重试
// @description
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Lei Xu
// @match        https://chat.openai.com/*
// @exclude      https://chat.openai.com/api/auth/session
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	//刷新地址
    var refreshUrl = "https://chat.openai.com/api/auth/session";

    //上次刷新失败的时间
    var lastRefreshFailedTime = new Date(0);

	//后台刷新
	function refreshInBackground() {
		fetch(refreshUrl).then(response => {
			//会话过期
			if (response.status == 403) {
				if (new Date().getTime() < lastRefreshFailedTime.getTime() + 3000) {
					throw '刷新失败过于频繁';
                }
				refreshInIframe();
			}
			//会话更新成功
			else {
				if (existsErrorResponse()) {
					clickRegenerate();
                }
				startSchedule();
			}
		});
	}

    //在iframe中刷新
    function refreshInIframe() {
	   	var iframe = document.createElement('iframe');
	   	iframe.width = 0;
	   	iframe.height = 0;
	   	iframe.src = refreshUrl;

		iframe.onload = () => {
			var text = iframe.contentDocument.documentElement.innerText;
			//会话更新失败
			if (text.indexOf(`"expires":"`) == -1) {
				console.error(text);
				lastRefreshFailedTime = new Date();
			}
			//会话更新成功
			if (existsErrorResponse()) {
				clickRegenerate();
            }
			startSchedule();
		}

	   	document.body.appendChild(iframe);
   	}

    //存在错误响应
    function existsErrorResponse() {

        //找到第一个main标签
        const found_main = document.getElementsByTagName('main');
        if (found_main.length > 0) {
            const main = found_main[0];

            //找到错误提示红框
            const found_div = main.getElementsByClassName('border-red-500');
            if (found_div.length > 0) {
	            return true;
            }
        }

        return false;
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

    function checkError() {
	    if (existsErrorResponse()) {
	    	refreshInBackground();
        }
	    else setTimeout(checkError, 1000);
    }

    //启动定期任务
    function startSchedule() {
	    setTimeout(refreshInBackground, 30000);
	    setTimeout(checkError, 1000);
    }

    startSchedule();
})();
