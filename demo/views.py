#!usr/bin/python
#coding=utf-8
import os
import json
import logging
import traceback

from django.conf import settings
from django.db import transaction
from django.contrib import messages
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, RequestContext
from django.views.decorators.csrf import csrf_protect


@csrf_protect
def index(request, template_name='demo/index.html'):
    
    return render_to_response(template_name, {
    }, context_instance=RequestContext(request))
