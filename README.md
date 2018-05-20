#### 监控进程部分
----
    自动化部署系统 - 监控服务进程
    监听由git-service，hooks发出的请求


##### 依赖
----
    nodeJs Version 8.0.0
    pm2: 通过 npm install -g pm2 安装
    nginx: 暂时不需要
    docker: 暂时不需要


##### 安装
----
    1. 在所有需要自动化部署项目的主机上部署此项目
    2. 建议将此项目与 其他项目 放在同一用户家目录下
    3. 进入此项目执行 npm install 
    4. 配置 config.yaml 文件, 具体看下面 配置说明
    5. 执行 npm run pro 运行项目
    6. 默认监听3034端口, 在.env文件内配置

    注: 如果此主机上还未拉取过git仓库主机上的任意一个项目，建议先拉取一个，它会自动将主机的认证hash写入~/.ssh/known_hosts文件内, 之后可以通过此项目自动化拉取新项目了

##### 配置
----
    config.yaml:
        dir_path:       项目存放地址
            e.g /home/www/product
        git_servicer:   git仓库信息配置, 当项目不存在时，向git仓库拉取项目
            ip: git仓库所在主机的ip
                e.g 120.45.56.7
            username: git仓库在哪个用户家目录下
                e.g git
            git_dir_path: 家目录下详细的目录路径
                e.g data/git_dir

    deplay.yaml:  当前项目自动化部署时需要额外执行的命令
        run: 拉取代码后, 执行的命令, 以数组形式依次执行
        service: 是否需要自动重启服务, 不写则不自动重启
            mode: 重启的方式, 目前就提供 pm2 形式
            entrypoint: 项目的主入口文件


    注: deplay.yaml 如果不存在, 只执行git pull后结束


###### 接口 
----
> /api/post-receive
>> 由git-service - hooks: post-receive 调用，对 `其他项目` 及 `自身(你需要先建立此项目的仓库)` 执行自动化部署
    
    Content-Type: application/json
    params: {
        warehourse: string, 仓库名称, e.g: "test"
        branchs: array, push的分支, e.g: [ "master", "debug" ]
    }

> /api/is-running
>> 由git-service - hooks: post-receive 调用，类似`心跳机制`，检测当前项目是否处于运行状态
>
> 注: 自动部署系统的hooks部分只接收 `Content-Type` 为 `application/json` 的响应


##### 后续待开发与改进的内容
----
1.  增加docker的启动模式
2.  增加nginx对项目的端口映射
3.  增加页面, 展示当前主机内项目的更新情况

