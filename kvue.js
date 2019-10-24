// new KVue({data: {}})
// 1. 数据响应式的实现 defineProperty
// 2. 发布订阅模式实现
// 3. 编译器的实现
// 我们在添加了一个Dep类的对象，用来收集Watcher对象。读数据的时候，会触发getter函数把当前的Watcher对象（存放在Dep.target中）
// 收集到Dep类中去。写数据的时候，会出发setter方法，通知Dep类调用notify来触发所有的watcher对象的update方法更新对应的视图；
// 通过getter触发依赖收集，把watcher放在dep中，数据变化的时候调用dep的notify方法通知watcher进行视图更新
class KVue {
    constructor(options) {
        this.$options = options;

        // 数据响应化
        this.$data = options.data;
        this.observe(this.$data);

        // 模拟一下watcher的创建过程
        // new Watcher();
        // this.$data.test;
        // new Watcher();
        // this.$data.foo.bar;

        new Compile(options.el, this);
    }

    observe(value) {
        if(!value || typeof value !== 'object') {
            return false;
        }

        // 遍历该对象
        Object.keys(value).forEach(key => {
            this.defineReactive(value, key, value[key]);
        })
    }
    defineReactive(obj, key, value) {
        this.observe(value); //  递归解决数据的嵌套的问题

        // compile
        const dep = new Dep();

        Object.defineProperty(obj, key, {
            get() {
                // compile
                Dep.target && dep.addDep(Dep.target);
                return value;
            },
            set(newVal) {
                if(newVal === value) {
                    return;
                }
                value = newVal;
                // console.log(`${key}属性更新了： ${value}`);
                // compile
                dep.notify();
            }
        })
    }
}

// Dep： 用来管理Watcher
class Dep {
    constructor() {
        // 这里存放若干依赖
        this.deps = [];
    }

    addDep(dep) {
        this.deps.push(dep);
    }

    notify() {
        this.deps.forEach(dep => {
            dep.update();
        })
    }
}

class Watcher {
    constructor() {
        // 将当前watcher的实例指定到Dep静态属性target
        Dep.target = this;
    }

    update() {
        console.log('属性更新了');
    }
}