#### Git Hooks Service

    自动化部署系统 - 监控服务进程
    监听由git-service，hooks发出的请求

##### Explain

> config.yaml: 线上项目的部署目录
> deplay.yaml: 当前项目自动化部署时需要额外执行的命令


###### Interface 

> /api/post-receive
>> 由git-service - hooks: post-receive 调用，对 `其他项目` 及 `自身` 执行自动化部署
    
    Content-Type: application/json
    params: {
        warehourse: string, 仓库名称, eg: "test"
        branchs: array, push的分支, eg: [ "master", "debug" ]
    }

> /api/is-running
>> 由git-service - hooks: post-receive 调用，类似`心跳机制`，检测当前项目是否处于运行状态




