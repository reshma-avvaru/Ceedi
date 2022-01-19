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
        'auth-user-type': '/api/auth-user/',
        'details': '/api/details/',
        'product-lists':'/api/products/'
    }
    print(db)
    return Response(apis)


@api_view(['POST', 'GET'])
def userAuthType(requests):
    if requests.method == 'GET':
        return Response("auth user-type API v0.1")
        
    users_ref = db.collection(u'users')
    docs = users_ref.stream()
    if requests.method == 'POST':
        email = requests.data.get('email')
        for doc in docs:
            if email == f'{doc.id}':
                #print(doc.to_dict()["userType"])
                return Response(doc.to_dict()["userType"])
        
    #return Response("SUCCESS")