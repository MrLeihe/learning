class Compiler {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);

    if (this.$el) {
      // node 节点转换为 fragment 提高效率
      this.$fragment = this.node2Fragment(this.$el);
      // 执行编译
      this.compile(this.$fragment);
      // 将生成的结果追加至宿主元素
      this.$el.appendChild(this.$fragment);
    }
  }

  node2Fragment(el) {
    // 创建一个 fragment
    const fragment = document.createDocumentFragment();
    let child;

    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }

  /**
   * 编译
   */
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        // 元素节点
        this.compileElement(node);
      } else if (this.isTextNode(node) && /\{\{(.*)\}\}/.test(node.textContent)) {
        // 文本节点
        this.compileText(node, RegExp.$1);
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }

  compileText(node, exp) {
    this.text(node, exp);
  }

  compileElement(node) {
    const attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      const attrName = attr.name;
      const value = attr.value;
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2);
        this[dir] && this[dir](node, value);
      } else if (this.isEventDirective(attrName)) {
      }
    });
  }

  /**
   * 是否为元素节点
   */
  isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }

  /**
   * 是否为文本节点
   */
  isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
  }

  /**
   * 是否为自定义指令
   * @param {string} attrName 属性名
   */
  isDirective(attrName) {
    return attrName.startsWith('s-');
  }

  /**
   * 自定义事件
   * @param {string} attrName 属性名
   */
  isEventDirective(attrName) {}

  text(node, exp) {
    this.update(node, exp, 'text');
  }

  html(node, exp) {
    this.update(node, exp, 'html');
  }

  model(node, exp) {
    this.update(node, exp, 'model');
    console.log('model', exp);
    node.addEventListener('input', e => {
      console.log('input', e.target.value);
      console.log('vm', this.$vm);
      this.$vm[exp] = e.target.value;
      console.log('input', this.$vm[exp]);
    });
  }

  update(node, exp, type) {
    console.log('update', exp);
    const updaterFn = this[`${type}Updater`];
    updaterFn && updaterFn(node, this.$vm[exp]);
    new Watcher(this.$vm, exp, value => {
      updaterFn && updaterFn(node, value);
    });
  }

  textUpdater(node, value) {
    node.textContent = value;
  }

  htmlUpdater(node, value) {
    console.log('htmlUpdater', value);
    node.innerHTML = value;
  }

  modelUpdater(node, value) {
    console.log('modelUpdater', value);
    node.value = value;
  }
}
