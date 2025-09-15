from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import os

# Initialize extensions
bcrypt = Bcrypt()

# MongoDB connection
def get_db():
    client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/'))
    return client[os.getenv('MONGO_DB', 'kirana_db')]

# Get database instance
db = get_db()
