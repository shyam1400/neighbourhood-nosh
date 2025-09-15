from database import db
from datetime import datetime
from bson.objectid import ObjectId

class Store:
    def __init__(self, owner_id, name, store_type, address, phone, email='', description='', gst_number=''):
        self.owner_id = owner_id
        self.name = name
        self.description = description
        self.address = address
        self.phone = phone
        self.email = email
        self.store_type = store_type
        self.gst_number = gst_number
        self.rating = 0.0
        self.delivery_time = "15-30 min"
        self.delivery_radius = 5.0
        self.is_open = True
        self.opening_time = "08:00"
        self.closing_time = "22:00"
        self.latitude = None
        self.longitude = None
        self.image = ""
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def save(self):
        """Save store to MongoDB"""
        store_data = {
            'owner_id': self.owner_id,
            'name': self.name,
            'description': self.description,
            'address': self.address,
            'phone': self.phone,
            'email': self.email,
            'store_type': self.store_type,
            'gst_number': self.gst_number,
            'rating': self.rating,
            'delivery_time': self.delivery_time,
            'delivery_radius': self.delivery_radius,
            'is_open': self.is_open,
            'opening_time': self.opening_time,
            'closing_time': self.closing_time,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'image': self.image,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.stores.insert_one(store_data)
        self._id = result.inserted_id
        return result
    
    @staticmethod
    def find_by_id(store_id):
        """Find store by ID"""
        if isinstance(store_id, str):
            store_id = ObjectId(store_id)
        store_data = db.stores.find_one({'_id': store_id})
        if store_data:
            return Store.from_dict(store_data)
        return None
    
    @staticmethod
    def find_by_owner_id(owner_id):
        """Find store by owner ID"""
        store_data = db.stores.find_one({'owner_id': owner_id})
        if store_data:
            return Store.from_dict(store_data)
        return None
    
    @staticmethod
    def find_all_open():
        """Find all open stores"""
        stores_data = db.stores.find({'is_open': True})
        return [Store.from_dict(store_data) for store_data in stores_data]
    
    @staticmethod
    def from_dict(store_data):
        """Create Store object from dictionary"""
        store = Store.__new__(Store)
        store._id = store_data.get('_id')
        store.owner_id = store_data.get('owner_id')
        store.name = store_data.get('name')
        store.description = store_data.get('description', '')
        store.address = store_data.get('address')
        store.phone = store_data.get('phone')
        store.email = store_data.get('email', '')
        store.store_type = store_data.get('store_type')
        store.gst_number = store_data.get('gst_number', '')
        store.rating = store_data.get('rating', 0.0)
        store.delivery_time = store_data.get('delivery_time', '15-30 min')
        store.delivery_radius = store_data.get('delivery_radius', 5.0)
        store.is_open = store_data.get('is_open', True)
        store.opening_time = store_data.get('opening_time', '08:00')
        store.closing_time = store_data.get('closing_time', '22:00')
        store.latitude = store_data.get('latitude')
        store.longitude = store_data.get('longitude')
        store.image = store_data.get('image', '')
        store.created_at = store_data.get('created_at')
        store.updated_at = store_data.get('updated_at')
        return store
    
    def to_dict(self, include_owner=False):
        """Convert store object to dictionary"""
        store_dict = {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'owner_id': self.owner_id,
            'name': self.name,
            'description': self.description,
            'address': self.address,
            'phone': self.phone,
            'email': self.email,
            'store_type': self.store_type,
            'gst_number': self.gst_number,
            'rating': self.rating,
            'delivery_time': self.delivery_time,
            'delivery_radius': self.delivery_radius,
            'is_open': self.is_open,
            'opening_hours': {
                'open': self.opening_time,
                'close': self.closing_time
            },
            'location': {
                'latitude': self.latitude,
                'longitude': self.longitude
            },
            'image': self.image,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_owner:
            from models.user import User
            owner = User.find_by_id(self.owner_id)
            if owner:
                store_dict['owner'] = {
                    'id': str(owner._id),
                    'username': owner.username,
                    'email': owner.email,
                    'phone': owner.phone
                }
            
        return store_dict
    
    def __repr__(self):
        return f"Store('{self.name}', '{self.store_type}', '{self.address}')"
