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
                console.log('编译元素' + node.nodeName);
            } else if(this.isInterpolation(node)) {
                // 文本
                console.log('编译文本' + node.textContent);
            }

            // 递归子节点
            if(node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }

    isElement(node) {
        return node.nodeType === 1;
    }

    // 差值文本
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}
