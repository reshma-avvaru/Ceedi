from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .firebase import firebaseInit,firebaseAuth
# Create your views here.


firebase = firebaseInit()

@api_view(['GET'])
def apiOverview(request):

    apis ={
        'firebase-auth':'api/fire-auth',
        'auth-user-type': '/api/auth-user/',
        'add-new-user':'/api/new-user',
        'details': '/api/details/',
        'product-lists':'/api/products/'
    }
    print(firebase)
    return Response(apis,status = status.HTTP_201_CREATED)


@api_view(['GET','POST'])
def fireAuth(requests):
    if requests.method == 'GET':
        return Response("firebase auth for user")
        
    if requests.method == 'POST':    
        token = requests.data.get('token')
        result = firebaseAuth(token)
        stat = result['status']
        email = result['user']        
        if stat == '203':
            return Response(email)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)




@api_view(['POST', 'GET'])
def userAuthType(requests):    
    if requests.method == 'GET':
        return Response("auth user-type API v0.1")
            
    users_ref = db.collection(u'users')
    docs = users_ref.stream()
    if requests.method == 'POST':
        token = requests.data.get('token')
        email = requests.data.get('email')
        result = firebaseAuth(token)
        stat = result['status']      
        if stat == '203':
                db = firestoreInit()
                users_ref = db.collection(u'users')
                docs = users_ref.stream()
                for doc in docs:
                    if email == f'{doc.id}':
                    #print(doc.to_dict()["userType"])
                        return Response(doc.to_dict()["userType"])
            
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
     
        
    #return Response("SUCCESS")
    
@api_view(['POST', 'GET'])
def addNewUser(requests):
    if request.method == 'GET':
        return Response("add new user to database")
        
    if request.method == 'POST':    
        user = request.data.get()
        token = requests.data.get('token')
        userType = requests.data.get('userType')
        
        result = firebaseAuth(token)
        stat = result['status']       
        email = result['user']
        if stat == '203':
            db = firestoreInit()
            db.collection(u'users').document(email).set({
                'userType': userType
            }
            )
            
            
            return Response("success",status = status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)