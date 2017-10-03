
> 由于博主通常使用是都是 Sublime , 所以本文有点倾向这款编辑器。
> 文本配置在 mac 环境， linux 和 windows 环境也一样，因为用到的都是命令行和 sublime 插件
> 本文需要有 npm, 没有安装的请安装 [nodejs](https://nodejs.org/en/download/)
> 必步骤需要 root 权限，mac 和 Linux 用户使用 sudo, windows 用户请用管理员权限运行 cmd

<!-- MarkdownTOC -->

- [less 配置](#less-%E9%85%8D%E7%BD%AE)
  - [全局配置](#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE)
  - [sublime 配置](#sublime-%E9%85%8D%E7%BD%AE)
- [Sass 配置](#sass-%E9%85%8D%E7%BD%AE)
  - [全局配置](#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE-1)
  - [sublime 配置](#sublime-%E9%85%8D%E7%BD%AE-1)

<!-- /MarkdownTOC -->

## less 配置

### 全局配置

全局安装 less 包：
```
npm install -g less
npm install -g less-plugin-clean-css
npm install -g less-plugin-autoprefix
```
解决方法是将安装目录中的 lessc 添加到环境变量中。mac 中操作方法如下：
```
ln -s /usr/local/lib/node_modules/less/bin/lessc /usr/local/bin/lessc
```
windows 中把 node_modules/less/bin/lessc 加入环境变量就好了。

之后我们就可以使用 less 了：
```
# 编译一个文件(生成同名文件)
lessc <.scss文件>
# 编译一个文件
lessc <.scss文件> <.css文件>
```

也可以在 js 中使用：
```js
var less = require('less');

less.render('.class { width: (1 + 1) }', {
  paths: ['.', './lib'],  // Specify search paths for @import directives
  filename: 'style.less', // Specify a filename, for better error messages
  compress: true          // Minify CSS output
}, function (e, output) {
   console.log(output.css);
});
```

或者在 html 中使用：
```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<body>
  <p>Make sure you include your stylesheets before the script.</p>
  <p>When you link more than one .less stylesheet each of them is compiled independently. So any variables, mixins or namespaces you define in a stylesheet are not accessible in any other.</p>
  <p>Due to the same origin policy of browsers loading external resources requires enabling CORS</p>
</body>

<script>
  less = {
    env: "development",
    async: false,
    fileAsync: false,
    poll: 1000,
    functions: {},
    dumpLineNumbers: "comments",
    relativeUrls: false,
    rootpath: ":/a.com/"
  };
</script>
<script src="less.js" type="text/javascript"></script>
```

详细配置请参考 [less 手册](http://lesscss.cn/)

### sublime 配置

打开 sublime 点击 `command+shift+p`(win: `ctrl+shift+p`), 输入 Package Install 安装一下 3 个插件。对于还没有安装Package Control 的可以查看 [sublime配置及使用技巧](http://blog.csdn.net/faremax/article/details/54097875)

- less 提供 less 语法高亮
- less2css 保存 less 时自动代码转换, 依赖 npm 安装的 less

sublime 中会遇到一个问题: less2css error: 'lessc' is not available。也是上一步没有配置环境变量导致的
配置完这些后就可以自动在当前 less 文件目录下生成同名的 css 文件。

## Sass 配置

> 由于 Sass 是 ruby 开发的，所以要首先安装 ruby。这里不重复这个部分，

### 全局配置

安装compass, 一个 sass 集成环境, 其中包括 Sass：
```
gem install compass
```

之后就可以使用 sass 了。创建一个工程目录：
```shell
compass create myproject
```
当前路径就会有一个名为 myproject 的工程目录，里面有一些初始化文件，`./sass/` 目录是放 sass 文件的，`./stylesheets` 是放编译后的 css 文件的，`config.rb` 是一个 ruby 语言的配置文件。

文件编译:
```shell
# 编译一个文件
sass <.scss文件> <.css文件>
# 编译整个目录(只编译发生变化的文件)
sass <.scss文件目录> <.css文件目录>
# 编译整个目录(编译全部文件)
sass --force <.scss文件目录> <.css文件目录>
# 利用 compass 编译整个工程目录(接受同样的参数)
compass compile
# 利用 compass 监视
compass watch
```
除了`--force` 参数，还有如下参数
```
--watch 监视对应操作，当其中文件保存时自动编译， ctrl+C 结束监视
--style 指定输出格式，参数值为：
  nested: '}' 和 '{' 都不单独一行
  compressed: 所以内容1行，压缩格式用于发布
  expended: '}' 单独一行; '{' 不单独一行
  compact: 一个 '{...}' 占一行
```

详细配置请参考 [compass 手册](http://compass-style.org/help/tutorials/production-css/), [Sass 手册](http://www.sass-lang.com/documentation/file.SASS_REFERENCE.html)

修复中文注释会乱码的问题：
> 这是个 ruby 插件的问题，去 ruby 目录中的 gem 中找到 `engine.rb`，mac 操作如下：
```shell
sudo vim /usr/local/lib/ruby/gems/2.4.0/gems/sass-3.4.24/lib/sass/engine.rb
```
大约在55行附近 找到 "module Sass", 在其后面插入2行：
```
# let sass support chinese comments
Encoding.default_external = Encoding.find('utf-8')
```

### sublime 配置

打开 sublime 点击 `command+shift+p`(win: `ctrl+shift+p`), 输入 Package Install 安装一下 2 个插件。对于还没有安装Package Control 的可以查看 [sublime配置及使用技巧](http://blog.csdn.net/faremax/article/details/54097875)

- Sass 提供 Sass 语法高亮

sublime 对 sass 不需要多余的配置，所有功能依然通过命令行完成。
