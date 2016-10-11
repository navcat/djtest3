#!/usr/bin/python
#coding=utf-8

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template.context import RequestContext

def index(request, template_name='index.html'):
	return render_to_response(template_name, {
    }, context_instance=RequestContext(request))