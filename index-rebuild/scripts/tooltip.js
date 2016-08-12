/**
 * Created by ChenWeiYu
 * Date : 2016/8/11
 * Time : 20:13
 */

function Tooltip(opt) {
    this.container = typeof opt.selector == "string" ? document.querySelector(opt.selector) : opt.selector;
    this.tooltipDiv = document.createElement('div');
    this.content = opt.content || "提示";
    this.trigger = opt.trigger || "";
    this.init();
}
Tooltip.prototype.init = function () {
    this.createDom();
    this.bindEvent();
};

Tooltip.prototype.createDom = function () {
    this.tooltipDiv.setAttribute('class', 'tooltip top');
    this.tooltipDiv.innerHTML = '<div class="tooltip-arrow"></div>' +
        '<div class="tooltip-inner">' +
        this.content +
        '</div>';
    this.container.style.position = "relative";
    this.container.appendChild(this.tooltipDiv);
};

Tooltip.prototype.show = function () {
    this.tooltipDiv.classList.add("active");
};
Tooltip.prototype.hide = function () {
    this.tooltipDiv.classList.remove("active");
};
Tooltip.prototype.toggle = function () {
    this.tooltipDiv.classList.toggle("active");
};
Tooltip.prototype.bindEvent = function () {
    var This = this;
    switch (this.trigger) {
        case "click" :
            this.container.onclick = function () {
                This.toggle();
            };
            break;
        default: break;
    }
};


