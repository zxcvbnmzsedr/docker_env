# 115网盘VNC环境

> 因为115网盘着实有些贵，下载一些学习资料不值得开个会员
>
> 用docker跑着慢慢下吧😏

使用命令直接启动:

```shell
docker-compose up -d
```

环境变量

| 参数        |               | 说明              |
| ----------- | ------------- | ----------------- |
| port        | 5800          | Web界面的访问端口 |
|             | 5900          | VNC协议访问端口   |
| environment | USER_ID=1000  | uid设置，默认1000 |
|             | GROUP_ID=1000 | gid设置，默认1000 |
