import os

import firebase_admin
from firebase_admin import credentials, firestore


def initialize_firebase_admin():
    if firebase_admin._apps:
        return

    service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if service_account_path:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        return

    firebase_admin.initialize_app(credentials.ApplicationDefault())


initialize_firebase_admin()
db = firestore.client()
