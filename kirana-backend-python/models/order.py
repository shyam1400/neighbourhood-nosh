from database import db
from datetime import datetime
from bson.objectid import ObjectId

class Order:
    def __init__(self, customer_id, store_id, total_amount, delivery_address, payment_method='cash', notes=''):
        self.customer_id = customer_id
        self.store_id = store_id
        self.total_amount = total_amount
        self.delivery_address = delivery_address
        self.status = 'pending'
        self.payment_status = 'pending'
        self.payment_method = payment_method
        self.delivery_time = "15-30 min"
        self.notes = notes
        self.items = []
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def add_item(self, product_id, quantity, price):
        """Add item to order"""
        item = {
            'product_id': product_id,
            'quantity': quantity,
            'price': price
        }
        self.items.append(item)
    
    def save(self):
        """Save order to MongoDB"""
        order_data = {
            'customer_id': self.customer_id,
            'store_id': self.store_id,
            'total_amount': self.total_amount,
            'delivery_address': self.delivery_address,
            'status': self.status,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'delivery_time': self.delivery_time,
            'notes': self.notes,
            'items': self.items,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.orders.insert_one(order_data)
        self._id = result.inserted_id
        return result
    
    def update_status(self, status):
        """Update order status"""
        self.status = status
        self.updated_at = datetime.utcnow()
        db.orders.update_one(
            {'_id': self._id},
            {'$set': {'status': status, 'updated_at': self.updated_at}}
        )
    
    @staticmethod
    def find_by_id(order_id):
        """Find order by ID"""
        if isinstance(order_id, str):
            order_id = ObjectId(order_id)
        order_data = db.orders.find_one({'_id': order_id})
        if order_data:
            return Order.from_dict(order_data)
        return None
    
    @staticmethod
    def find_by_customer_id(customer_id):
        """Find orders by customer ID"""
        orders_data = db.orders.find({'customer_id': customer_id}).sort('created_at', -1)
        return [Order.from_dict(order_data) for order_data in orders_data]
    
    @staticmethod
    def find_by_store_id(store_id):
        """Find orders by store ID"""
        orders_data = db.orders.find({'store_id': store_id}).sort('created_at', -1)
        return [Order.from_dict(order_data) for order_data in orders_data]
    
    @staticmethod
    def from_dict(order_data):
        """Create Order object from dictionary"""
        order = Order.__new__(Order)
        order._id = order_data.get('_id')
        order.customer_id = order_data.get('customer_id')
        order.store_id = order_data.get('store_id')
        order.total_amount = order_data.get('total_amount')
        order.delivery_address = order_data.get('delivery_address')
        order.status = order_data.get('status', 'pending')
        order.payment_status = order_data.get('payment_status', 'pending')
        order.payment_method = order_data.get('payment_method', 'cash')
        order.delivery_time = order_data.get('delivery_time', '15-30 min')
        order.notes = order_data.get('notes', '')
        order.items = order_data.get('items', [])
        order.created_at = order_data.get('created_at')
        order.updated_at = order_data.get('updated_at')
        return order
    
    def to_dict(self, include_relations=False):
        """Convert order object to dictionary"""
        order_dict = {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'customer_id': self.customer_id,
            'store_id': self.store_id,
            'total_amount': self.total_amount,
            'delivery_address': self.delivery_address,
            'status': self.status,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'delivery_time': self.delivery_time,
            'notes': self.notes,
            'items': self.items,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_relations:
            from models.user import User
            from models.store import Store
            from models.product import Product
            
            customer = User.find_by_id(self.customer_id)
            if customer:
                order_dict['customer'] = {
                    'id': str(customer._id),
                    'username': customer.username,
                    'email': customer.email,
                    'phone': customer.phone
                }
            
            store = Store.find_by_id(self.store_id)
            if store:
                order_dict['store'] = {
                    'id': str(store._id),
                    'name': store.name,
                    'address': store.address,
                    'phone': store.phone
                }
            
            # Populate product details in items
            populated_items = []
            for item in self.items:
                product = Product.find_by_id(item['product_id'])
                populated_item = item.copy()
                if product:
                    populated_item['product'] = {
                        'id': str(product._id),
                        'name': product.name,
                        'price': product.price,
                        'image': product.image
                    }
                populated_items.append(populated_item)
            order_dict['items'] = populated_items
            
        return order_dict
    
    def __repr__(self):
        return f"Order({str(self._id) if hasattr(self, '_id') else 'new'}, '{self.status}', ${self.total_amount})"
