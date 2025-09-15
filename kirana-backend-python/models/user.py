from database import db, bcrypt
from datetime import datetime
from bson.objectid import ObjectId

class User:
    def __init__(self, username, email, password, phone, address, role):
        self.username = username
        self.email = email.lower()
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.phone = phone
        self.address = address
        self.role = role
        self.is_active = True
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def save(self):
        """Save user to MongoDB"""
        user_data = {
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'phone': self.phone,
            'address': self.address,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.users.insert_one(user_data)
        self._id = result.inserted_id
        return result
    
    @staticmethod
    def find_by_username(username):
        """Find user by username"""
        user_data = db.users.find_one({'username': username})
        if user_data:
            return User.from_dict(user_data)
        return None
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        user_data = db.users.find_one({'email': email.lower()})
        if user_data:
            return User.from_dict(user_data)
        return None
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        user_data = db.users.find_one({'_id': user_id})
        if user_data:
            return User.from_dict(user_data)
        return None
    
    @staticmethod
    def find_by_username_or_email(username, email):
        """Find user by username or email"""
        user_data = db.users.find_one({
            '$or': [
                {'username': username},
                {'email': email.lower()}
            ]
        })
        if user_data:
            return User.from_dict(user_data)
        return None
    
    @staticmethod
    def from_dict(user_data):
        """Create User object from dictionary"""
        user = User.__new__(User)
        user._id = user_data.get('_id')
        user.username = user_data.get('username')
        user.email = user_data.get('email')
        user.password = user_data.get('password')
        user.phone = user_data.get('phone')
        user.address = user_data.get('address')
        user.role = user_data.get('role')
        user.is_active = user_data.get('is_active', True)
        user.created_at = user_data.get('created_at')
        user.updated_at = user_data.get('updated_at')
        return user
    
    def check_password(self, password):
        """Check if provided password matches user's password"""
        return bcrypt.check_password_hash(self.password, password)
    
    def to_dict(self, include_password=False):
        """Convert user object to dictionary"""
        user_dict = {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_password:
            user_dict['password'] = self.password
            
        return user_dict
    
    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.role}')"
