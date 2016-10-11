#!/usr/bin/python
#coding=utf-8

# from django.conf.urls import patterns, include, url
from django.conf.urls import patterns, url, include

urlpatterns = patterns('demo.views',

    # 首页
    url(r'^$', 'index', name='index'),
)
