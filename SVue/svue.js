class SVue {
  // 数据响应
  // 依赖收集
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    // 添加响应式
    this.observe(this.$data);

    // 创建编译器
    new Compiler(options.el, this);
  }

  observe(datas) {
    if (!datas || typeof datas !== 'object') {
      return;
    }

    Object.keys(datas).forEach(key => {
      // 为 key 定义响应式
      this.defineReactive(datas, key, datas[key]);
      // 为 vue 的 data 属性设置代理
      this.proxyData(key);
    });
  }

  /**
   *  defineProperty 重写属性
   */
  defineReactive(datas, key, val) {
    // 递归重写嵌套属性
    this.observe(val);
    const dep = new Dep();

    Object.defineProperty(datas, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set: newVal => {
        if (newVal === val) {
          return;
        }
        val = newVal;
        dep.notify();
      }
    });
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get: () => {
        return this.$data[key];
      },
      set: newVal => {
        this.$data[key] = newVal;
      }
    });
  }
}

/**
 * 事件收集者
 */
class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(dep) {
    this.deps.push(dep);
  }

  notify() {
    this.deps.forEach(dep => {
      dep.update();
    });
  }
}

/**
 * 更新执行者
 */
class Watcher {
  constructor(vm, key, cb) {
    this.$vm = vm;
    this.$key = key;
    this.$cb = cb;

    Dep.target = this;
    this.$vm[key];
    Dep.target = null;
  }

  update() {
    console.log('视图更新了！');
    this.$cb.call(this.$vm, this.$vm[this.$key]);
  }
}
