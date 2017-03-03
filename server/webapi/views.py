from django.shortcuts import render, HttpResponse, HttpResponseRedirect

def index(r):
    return render(r, "index.html", {})