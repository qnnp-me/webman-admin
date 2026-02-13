/**
 * 获取控制器详细权限，并决定展示哪些按钮或dom元素
 */
layui.$(function () {
    let $ = layui.$;
    $.ajax({
        url: "/app/admin/rule/permission",
        dataType: "json",
        success: function (res) {
            let style = '';
            let codes = res.data || [];
            let isSuperAdmin = false;
            // codes里有*，说明是超级管理员，拥有所有权限
            if (codes.indexOf('*') !== -1) {
                $("head").append("<style>*[permission]{display: initial; pointer-events: auto;}</style>");
                isSuperAdmin = true;
            }
            if (self !== top) {
                top.Admin.Account.isSuperAdmin = isSuperAdmin;
            } else {
                window.Admin.Account.isSuperAdmin = isSuperAdmin;
            }
            if (isSuperAdmin) return;

            // 细分权限
            layui.each(codes, function (k, code) {
                codes[k] = '*[permission^="'+code+'"]';
            });
            if (codes.length) {
                $("head").append("<style>" + codes.join(",") + "{display: initial; pointer-events: auto;}</style>");
            }
        }
    });
});

// TODO 将来应该删除
function compatible()
{
    [
        ['pear-btn-xs', 'layui-btn-xs'],
        ['pear-btn-sm', 'layui-btn-sm'],
        ['pear-btn-lg', 'layui-btn-lg'],
        ['pear-btn', 'layui-btn'],
    ].forEach(([old_class,new_class]) => {
        document.querySelectorAll(`.${old_class}:not(.${new_class})`).forEach(item=>{
            item.classList.add(new_class);
        });
    })
}

// 优化后的兼容性处理
function optimizedCompatible()
{
    // 初始化执行一次
    compatible();

    // 现代浏览器使用 MutationObserver
    if ('MutationObserver' in window) {
        const observer = new MutationObserver(() => compatible());
        observer.observe(document.body, { childList: true, subtree: true });
        window.compatibleObserver = observer;
        return;
    }

    // 老浏览器使用节流定时器
    let timer = null;
    const handler = () => {
        if (timer) return;
        timer = setTimeout(() => {
            compatible();
            timer = null;
        }, 1000);
    };

    document.addEventListener('DOMNodeInserted', handler);
    window.throttledCompatible = handler;
}

requestAnimationFrame(optimizedCompatible);
