Linux 新建用户和权限设置

> 环境 centOS 7.2.1511

本文主要内容为建立用户和分配权限等工作，所以所以命令在 root 权限下执行

1、新建用户

我们建立一个名为 gin 的用户

```shell
adduser gin
```

> 注：删除 gin 用户（userdel -rf gin）

2、设置(修改)密码

```shell
passwd gin
```

3、设置权限

```shell
chmod -v 640 /etc/sudoers
vim /etc/sudoers
```

在 'root ALL=(ALL)   ALL' 之后插入一行如下：

```shell
root ALL=(ALL)   ALL
gin ALL=(ALL)   ALL   #这个是新用户
```

恢复文件访问权限

```shell
chmod -v 400 /etc/sudoers
```

注：建议修改权限前后查看 /etc/sudoers 的权限（ls -l /etc/sudoers)

