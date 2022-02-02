from django.contrib.auth.models import User, Group
from rest_framework import serializers
from firebase_admin import firestore
import reverse_geocoder as rg
import geocoder
class my_dictionary(dict): 
    i =0
    # __init__ function 
    def __init__(self): 
        self = dict()   
    # Function to add key:value 
    
    
    def add(self, keyid, value): 
        for key in value:
            if isinstance(value[key],firestore.GeoPoint):
                
                lat = value['location'].latitude
                lon = value['location'].longitude
                value[key] = {
                'latitude':lat, 
                'longitude':lon,
                }    
               
           
            
        self[keyid] = value 
 
    def addOrder(self, keyid, value): 
        for key in value:
            if isinstance(value[key],firestore.GeoPoint):
                
                lat = value['address'].latitude
                lon = value['address'].longitude
                value[key] = {
                'latitude':lat, 
                'longitude':lon,
                }    
                g = geocoder.mapquest([lat, lon], method='reverse', key = 'QxCpYNilIEQbPoMTG3X5FqjoqqBzGuFG')
                print(g.json)
            
        self[keyid] = value        
    