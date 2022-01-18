from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .firebase import firebaseInit
# Create your views here.


db = firebaseInit()

@api_view(['GET'])
def apiOverview(request):

    apis ={
        'authenticate': '/api/auth/<slug:id>',
        'details': '/api/details/<slug:email>',
        'product-lists':'/api/products/<slug:item>'
    }
    print(db)
    return Response(apis)


@api_view(['GET'])
def userAuthType(requests, email):

    users_ref = db.collection(u'users')
    docs = users_ref.stream()
    for doc in docs:
        if email == f'{doc.id}':
            print()
            return Response(f'{doc.to_dict()["userType"]}')
    
    #return Response("SUCCESS")