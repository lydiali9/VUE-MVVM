// 用法 new Compile(el, vm)

class Compile {
    constructor(el, vm) {
        // 要遍历的宿主节点
        this.$el = document.querySelector(el);
        this.$vm = vm;
        // 编译
        if(this.$el) {
            // 转化内部内容为片段fragment
            this.$fragment = this.node2Gragment(this.$el);
            // 执行编译过程
            this.compile(this.$fragment);
            // 将编译完的html结果追加到$el
            this.$el.appendChild(this.$fragment);
        }
    }

    // 将宿主元素中的代码片段拿出来遍历，这样做比较高效
    node2Gragment(el) {
        const frag = document.createDocumentFragment();
        // 将el中所有子元素搬家至frag中
        let child;
        while (child = el.firstChild) {
            frag.appendChild(child);
        }
        return frag;
    }

    // 编译过程
    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            // 类型判断
            if(this.isElement(node)) {
                // 元素
                // console.log('编译元素' + node.nodeName);
                // 查找k-，@，：开头的指令
                const nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr => {
                    const attrName = attr.name; // 属性名
                    const exp = attr.value; // 属性值
                    if(this.isDirective(attrName)) {
                        // k-text
                        const dir = attrName.substring(2);
                        // 执行指令
                        this[dir] && this[dir](node, this.$vm, exp); // text(node, this.$vm, exp)
                    }
                    if(this.isEvent(attrName)) {
                        const dir = attrName.substring(1); // @click
                        this.eventHandler(node, this.$vm, exp, dir);
                    }
                })
            } else if(this.isInterpolation(node)) {
                // 文本
                // console.log('编译文本' + node.textContent);
                this.compileText(node);
            }

            // 递归子节点
            if(node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }

    // 更新函数
    update(node, vm, exp, dir) {
        const updaterFn = this[dir + 'Updater'];
        // 初始化
        updaterFn && updaterFn(node, vm[exp]);
        // 依赖收集
        new Watcher(vm, exp, function (value) {
            updaterFn && updaterFn(node, value);
        });
    }

    compileText(node) {
        console.log(RegExp.$1);
        this.update(node, this.$vm, RegExp.$1, 'text');
    }

    text(node, vm, exp) {
        this.update(node, vm, exp, 'text');
    }

    // 双向绑定的处理
    model(node, vm, exp) {
        // 指定input的value属性
        this.update(node, vm, exp, 'model');
        // 视图对于模型的响应
        node.addEventListener('input', e => {
            vm[exp] = e.target.value;
        })
    }

    html(node, vm, exp) {
        this.update(node, vm, exp, 'html');
    }

    htmlUpdater(node, value) {
        node.innerHTML = value;
    }

    modelUpdater(node, value) {
        node.value = value;
    }

    textUpdater(node, value) {
        node.textContent = value;
    }

    eventHandler(node, vm, exp, dir) {
        // @click="onClick"
        const fn = vm.$options.methods && vm.$options.methods[exp]; // vm.$options.method[exp] == onClick
        if(dir && fn) {
            node.addEventListener(dir, fn.bind(vm));
        }
    }

    isDirective(attr) {
        return attr.indexOf('k-') == 0;
    }

    isEvent(attr) {
        return attr.indexOf('@') == 0;
    }

    isElement(node) {
        return node.nodeType === 1;
    }

    // 差值文本
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}
