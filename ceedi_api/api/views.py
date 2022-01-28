from email import message
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .firebase import  firebaseInit, firebaseAuth, firestoreInit, relatimedbInit
# Create your views here.


firebase = firebaseInit()

@api_view(['GET'])
def apiOverview(request):

    apis ={
        'firebase-auth':
            {
                'URL': '/api/fire-auth',
                'POST - {token}': 'returns verify token '
            },
        'auth-user-type': 
            {
                'URL': ' /api/auth-user/',
                'POST - {token}': 'returns user-type'
            },
        'add-new-user':  
            {
                'URL': ' /api/new-user',
                'POST - {token,email,userType}': 'adds new user'
            },
        'product-lists':
            {
                'URL': '/api/products/list/<token>',
                'GET': 'get list of products',
                'POST - {item:{itemDetails}}': 'add new products'
            },
           
        'product-update':
            {
                'URL': 'products/<item>/<token>',
                'GET ': 'get updated item details',
                'PUT - {fieldname,fieldvalue}': 'updates item field values',
                'DELETE': 'delete item from product'
            },
    }
    print(firebase)
    return Response(apis,status = status.HTTP_201_CREATED)


@api_view(['GET','POST'])
def fireAuth(requests):
    if requests.method == 'GET':
        return Response("firebase auth for user")
        
    elif requests.method == 'POST':    
        token = requests.data.get('token')
        result = firebaseAuth(token)
        stat = result['status']
        email = result['user']        
        if stat == '200':
            return Response(email)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        return Response(status =status.HTTP_400_BAD_REQUEST)




@api_view(['POST', 'GET'])
def userAuthType(requests):   
    if requests.method == 'GET':        
        return Response("auth user-type API v0.1")
            
    elif requests.method == 'POST':
        print('post request')
        token = requests.data.get('token')
        email = requests.data.get('email')
        result = firebaseAuth(token)
        stat = result['status']      
        print(stat)
        if stat == '200':
                db = firestoreInit()
                users_ref = db.collection(u'users')
                docs = users_ref.stream()
                for doc in docs:
                    if email == f'{doc.id}':
                    #print(doc.to_dict()["userType"])
                        print(doc.to_dict()["userType"])
                        return Response(doc.to_dict()["userType"])
            
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        return Response(status =status.HTTP_400_BAD_REQUEST)
     
        
    #return Response("SUCCESS")
    
@api_view(['POST', 'GET'])
def addNewUser(requests):
    print("function")
    if requests.method == 'GET':
        return Response("add new user to database")
        
    elif requests.method == 'POST': 
        print("POST")
        docid = requests.data.get('email')
        userType = requests.data.get('userType')
        token = requests.data.get('token')
        result = firebaseAuth(token)
        stat = result['status']       
        email = result['user']
        if stat == '200' and email == docid:
            db = firestoreInit()
            db.collection(u'users').document(email).set({
                'userType': userType
            }
            )
            return Response("success",status = status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        return Response(status =status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET', 'POST'])
def getProductList(requests, token):
    if requests.method == 'GET':
        result = firebaseAuth(token)
        stat = result['status']
        if stat == '200':
           
            prod = relatimedbInit()
            return Response(prod.get())
        else:
            return Response(status = status.HTTP_403_FORBIDDEN)
        
    #ADD NEW PRODUCT
    elif requests.method == 'POST':
        result = firebaseAuth(token)
        stat = result['status']
        if stat == '200':
            item = requests.data
            prod = relatimedbInit()
            for key in item.keys():
                item = key
                data = requests.data.get(item)
                print(data)
                prod.child(item).set(data)
            return Response(prod.get())
        else:
            return Response(status = status.HTTP_403_FORBIDDEN)
    else:
        return Response(status = status.HTTP_400_BAD_REQUEST)    
    
      
@api_view(['DELETE', 'PUT', 'GET'])
def updateProduct(requests, item , token):
    
    #DELETE PRODUCT
    if requests.method == 'DELETE':
        result = firebaseAuth(token)
        stat = result['status']
        if stat == '200':
            prod = relatimedbInit()
            prod.child(item).delete()
            
            return Response(prod.get())

        return Response("d")
    
    #GET PRODUCT
    elif requests.method == 'GET':
        result = firebaseAuth(token)
        stat = result['status']
        if stat == '200':
            prod = relatimedbInit()
            return Response(prod.child(item).get())
        else:
            return Response(status = status.HTTP_403_FORBIDDEN)
        
    #UPDATE FIELDS               
    elif requests.method == 'PUT':
        field = requests.data.get('fieldname')
        value = requests.data.get('fieldvalue')
        result = firebaseAuth(token)
        stat = result['status']
        if stat == '200':
            des = 'description'
            prod = relatimedbInit()
            prod.child(item).update({
                field: value
            })
            return Response(prod.child(item).get())
        else:
            return Response(status = status.HTTP_403_FORBIDDEN)
        
    else:
        return Response(status = status.HTTP_400_BAD_REQUEST )