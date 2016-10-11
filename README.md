# 概述
Django1.8大型项目架构，主要是面向模块化开发，前后端都可以进行构建

## Demo解读
Demo中包含一个模块名为demo，当然你也可以新建多个模块，模块下的目录结构如下：
```
demo/static/demo/img        	# 图片文件
demo/static/demo/js				# js文件
demo/static/demo/css			# css文件
demo/templates/demo/			# 模板文件
```
【注意】此处在static目录下继续新建一个demo的文件夹是为了防止在后面收集静态文件时（python manage.py collectstatic）造成的覆盖

【备注】我们把所有该demo相关的静态文件（包括图片/css/js等）以及template文件都放在一起，这样更方便维护。


## 国际化，本地化

## 前端构建

## 运行方式
#### Step1.安装django
此处我们使用的是django1.8。why？因为django1.8是一个LTS版本，详细可以看[Django官方文档](https://www.djangoproject.com/download/)

![](https://www.djangoproject.com/s/img/release-roadmap.e844db08610e.png)
#### Step2.运行服务
使用如下命令运行
> python manage.py runserver


#### Step3.测试
访问页面：
1. 首页：http://127.0.0.1:8000
2. Demo页：http://127.0.0.1:8000/demo/

## 部署方式

### nginx

#### Step1.收集静态文件
将整个app中所有的模块收集到settings.STATIC_ROOT对应的目录中（注意会覆盖!）
```
python manage.py collectstatic
```
#### Step2.nginx配置

将nginx配置文件中添加location静态文件指向
```
location ^~/assets {
    alias /www-data/web/assets;
}
```
【备注：assets目录为我settings.STATIC_ROOT对应的目录】

#### Step3. 运行uwsgi、gunicorn服务
> uwsgi --ini
> gunicorn -w 1 -k gevent usample.wsgi:application
