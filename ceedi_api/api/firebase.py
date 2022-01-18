import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account

config = {
  "type": "service_account",
  "project_id": "ceedi-c48e9",
  "private_key_id": "704bf1b03ba930c40f12e1da3969bfa2f17a52dc",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDEBcrIDsLh00M7\n/Y9zxcVC6PjCMqjzT4NKOcKzlI6wg+YRqI3f3AD34EvpNoWVro7lt+10Hc0+DzC2\n3lw9mw4XXHv+Zy3/HZEl+6E2tKILGIl2N2P+Hcod3be+dWckioRIbiv31gkhFjqo\n5dyPyt6lqtO9BApOnRjoHLY4fb4XOwZJhAHh8D41LfJV9vM/YczkINGuIM8m+pF5\nyjTqPJnlpfO0RffGjpsFKL7rElKsDtyhHWNLQCKKxTeMfyBRcyKVH7Fe+O4aRMz8\n01AkX1V3nPfxTthx0+qoI2C9NRcZCbJDntuoL9JnVWeLNF9TT+zrSgX1A4KqVC0E\nvuaS9s2BAgMBAAECggEAFrpP3LT5cOg8hMQi0drobZhINMay7Xhr/JCIkVHJiZCB\nfc1RRddjCq/S8riuRxX03jsJKSFwyUqcQgJeJ4vG19E9VINEw1j7mgUm7V+G5PUf\nWw7pD8RcdEIKKpG/jRkSZWOAwueU1LqYao+G7JUqY4L/BzdktTYPITp9q5HIweCT\nYO4A1YOwjAr9QG8RT0SCTHz32BzffQg5f/Q6CIhMQD0eC0BfjFCkeRz7TvX/tPLj\nDn+Qlmd/Ct564BPFWpHuMM+BjxUgsf5xPTlTUrSW7OQXu6opjtXTUpFAP/KkGSfA\n5zA3K3qWKtT+UF+0e3w+5tLnFnq0xn77cVPs7YudUQKBgQDvZayEK2stn1kLgqUk\nDvz0OwGzARzWsm/8k4hGR7uX0lLzvJixYKjD8eES9R7I13cIdXNX9aNPkhxRa2Ly\nVfanQFsYYK7k7IllN0BwcxrtYWHyDbDxuXjl+lD670EHov3X4WcGCTUdoSzKpA45\n7lGckzI9q1F8KGlBjHwTDA3IwwKBgQDRngjBBQXIDFi+XzCweY1yQQV1j1gTEtmC\nymTQJ0Ea8XQHdOw0IyPZLB3hu2vVpW3rCH5HJYuSKWRKwRJLPIKFNgfDZoxYcoir\n4cl6cP1Jt0HrcHetjE9ELtAxByERn8g5SmrrSGdnA67ANYL3mmyDLh8hOmgzqBuj\nRcrEvl5MawKBgF6ib68TxtuTGU0uiP+XGTGmvcY4U2Efypsq6vz1UFf04avOSwIb\ndrt2u4WV9mRooHpsi3si9Dr5RE5/R+8KQmXdT+V0Gs8OHkYvsD6Dkgpyq5hXBzKX\nIg6vhCGeQLO3H+eeB+7f5upek2lLrwABkKt3mK2+MokFJI6v7UBOTIinAoGABfsq\naMeJ6LFhft0ceIyfWpk8XKRgcPritfasdbwJAYnOM8BEVSCDj1jQ6XX9l7UGs+Qk\nJkeN+fewYumrafYqCz8Fba/pZUSvXagtpY6/y3CtMticsZkFUf679gosCWKzxd63\nukrwmGHkhJuCRypi2kNgpAQUoRS05S3CoWaFLk0CgYAT4Vt+dFPXNYU3KGslTIVh\nnhJflIQS+mB7reJcEVpi9R0S0iddBhx3x1g3F5TigFQLQLsrmdF/O+jLPKfUMAID\n5srodV5u2BxlKusfrrUNLOIGgZkLpN1E2fPk7XKVrLP9qZMxPmqyfQMS9TnUDh3B\nR2/V1l+WdR1ESiwOjjZPFQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-ndzii@ceedi-c48e9.iam.gserviceaccount.com",
  "client_id": "104364019399137736496",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ndzii%40ceedi-c48e9.iam.gserviceaccount.com"
}


def firebaseInit():
    cred = credentials.Certificate(config)
    firebase_admin.initialize_app(cred,{
         'databaseURL': 'https://ceedi-c48e9-default-rtdb.firebaseio.com',
    })

    print(cred)
    db = firestore.client()
    
    users_ref = db.collection(u'users')
    docs = users_ref.stream()
    


    # for doc in docs:
    #     print(f'{doc.id}:{doc.to_dict()}')
        
    return(db)