/**
 * 浏览页面顶部搜索框展开收回控制
 */
function toggleSearchFormShow()
{
    let $ = layui.$;
    let items = $('.top-search-from .layui-form-item');
    if (items.length <= 2) {
        if (items.length <= 1) $('.top-search-from').parent().parent().remove();
        return;
    }
    let btns = $('.top-search-from .toggle-btn a');
    let toggle = toggleSearchFormShow;
    if (typeof toggle.hide === 'undefined') {
        btns.on('click', function () {
            toggle();
        });
    }
    let countPerRow = parseInt($('.top-search-from').width()/$('.layui-form-item').width());
    if (items.length <= countPerRow) {
        return;
    }
    btns.removeClass('layui-hide');
    toggle.hide = !toggle.hide;
    if (toggle.hide) {
        for (let i = countPerRow - 1; i < items.length - 1; i++) {
            $(items[i]).hide();
        }
        return $('.top-search-from .toggle-btn a:last').addClass('layui-hide');
    }
    items.show();
    $('.top-search-from .toggle-btn a:first').addClass('layui-hide');
}

// TODO 将来删除
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

layui.$(function () {
    toggleSearchFormShow();
    optimizedCompatible();
});

