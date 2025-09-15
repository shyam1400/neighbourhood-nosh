from database import db
from datetime import datetime
from bson.objectid import ObjectId

class Product:
    def __init__(self, store_id, name, price, category, description='', image='', stock=0, unit='piece'):
        self.store_id = store_id
        self.name = name
        self.description = description
        self.price = price
        self.category = category
        self.image = image
        self.stock = stock
        self.unit = unit
        self.is_available = True
        self.rating = 0.0
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def save(self):
        """Save product to MongoDB"""
        product_data = {
            'store_id': self.store_id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'image': self.image,
            'stock': self.stock,
            'unit': self.unit,
            'is_available': self.is_available,
            'rating': self.rating,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.products.insert_one(product_data)
        self._id = result.inserted_id
        return result
    
    @staticmethod
    def find_by_id(product_id):
        """Find product by ID"""
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)
        product_data = db.products.find_one({'_id': product_id})
        if product_data:
            return Product.from_dict(product_data)
        return None
    
    @staticmethod
    def find_by_store_id(store_id, available_only=True):
        """Find products by store ID"""
        query = {'store_id': store_id}
        if available_only:
            query['is_available'] = True
        products_data = db.products.find(query)
        return [Product.from_dict(product_data) for product_data in products_data]
    
    @staticmethod
    def find_all(category=None, store_id=None, available_only=True):
        """Find all products with optional filters"""
        query = {}
        if available_only:
            query['is_available'] = True
        if category:
            query['category'] = category
        if store_id:
            query['store_id'] = store_id
        
        products_data = db.products.find(query)
        return [Product.from_dict(product_data) for product_data in products_data]
    
    @staticmethod
    def from_dict(product_data):
        """Create Product object from dictionary"""
        product = Product.__new__(Product)
        product._id = product_data.get('_id')
        product.store_id = product_data.get('store_id')
        product.name = product_data.get('name')
        product.description = product_data.get('description', '')
        product.price = product_data.get('price')
        product.category = product_data.get('category')
        product.image = product_data.get('image', '')
        product.stock = product_data.get('stock', 0)
        product.unit = product_data.get('unit', 'piece')
        product.is_available = product_data.get('is_available', True)
        product.rating = product_data.get('rating', 0.0)
        product.created_at = product_data.get('created_at')
        product.updated_at = product_data.get('updated_at')
        return product
    
    def to_dict(self, include_store=False):
        """Convert product object to dictionary"""
        product_dict = {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'store_id': self.store_id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'image': self.image,
            'stock': self.stock,
            'unit': self.unit,
            'is_available': self.is_available,
            'rating': self.rating,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_store:
            from models.store import Store
            store = Store.find_by_id(self.store_id)
            if store:
                product_dict['store'] = {
                    'id': str(store._id),
                    'name': store.name,
                    'address': store.address
                }
            
        return product_dict
    
    def __repr__(self):
        return f"Product('{self.name}', '{self.category}', ${self.price})"
