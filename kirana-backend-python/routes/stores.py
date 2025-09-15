from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from models.store import Store
from models.product import Product
from models.user import User

stores_bp = Blueprint('stores', __name__)

# Validation schemas
class StoreSchema(Schema):
    name = fields.Str(required=True)
    description = fields.Str(load_default='')
    address = fields.Str(required=True)
    phone = fields.Str(required=True)
    email = fields.Email(load_default='')
    store_type = fields.Str(required=True, validate=lambda x: x in ['kirana', 'grocery', 'vegetables', 'dairy', 'general'])
    gst_number = fields.Str(load_default='')
    delivery_time = fields.Str(load_default='15-30 min')
    delivery_radius = fields.Float(load_default=5.0)
    opening_time = fields.Str(load_default='08:00')
    closing_time = fields.Str(load_default='22:00')
    latitude = fields.Float(allow_none=True, load_default=None)
    longitude = fields.Float(allow_none=True, load_default=None)
    image = fields.Str(load_default='')

# Get all stores
@stores_bp.route('/', methods=['GET'])
def get_all_stores():
    try:
        stores = Store.find_all_open()
        stores_data = [store.to_dict(include_owner=True) for store in stores]
        
        return jsonify(stores_data), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Get store by ID
@stores_bp.route('/<store_id>', methods=['GET'])
def get_store_by_id(store_id):
    try:
        store = Store.find_by_id(store_id)
        
        if not store:
            return jsonify({'message': 'Store not found'}), 404
        
        return jsonify(store.to_dict(include_owner=True)), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Get store products
@stores_bp.route('/<store_id>/products', methods=['GET'])
def get_store_products(store_id):
    try:
        products = Product.find_by_store_id(store_id, available_only=True)
        products_data = [product.to_dict() for product in products]
        
        return jsonify(products_data), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Create store (vendor only)
@stores_bp.route('/', methods=['POST'])
@jwt_required()
def create_store():
    try:
        current_user_data = get_jwt_identity()
        
        if current_user_data['role'] != 'vendor':
            return jsonify({'message': 'Access denied'}), 403
        
        # Validate input data
        schema = StoreSchema()
        data = schema.load(request.json)
        
        # Create new store
        store = Store(
            owner_id=current_user_data['id'],
            name=data['name'],
            store_type=data['store_type'],
            address=data['address'],
            phone=data['phone'],
            email=data['email'],
            description=data['description'],
            gst_number=data['gst_number']
        )
        
        # Set optional fields
        store.delivery_time = data['delivery_time']
        store.delivery_radius = data['delivery_radius']
        store.opening_time = data['opening_time']
        store.closing_time = data['closing_time']
        store.latitude = data['latitude']
        store.longitude = data['longitude']
        store.image = data['image']
        
        store.save()
        
        return jsonify(store.to_dict()), 201
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Update store
@stores_bp.route('/<store_id>', methods=['PUT'])
@jwt_required()
def update_store(store_id):
    try:
        current_user_data = get_jwt_identity()
        
        store = Store.find_by_id(store_id)
        if not store:
            return jsonify({'message': 'Store not found'}), 404
        
        if store.owner_id != current_user_data['id']:
            return jsonify({'message': 'Access denied'}), 403
        
        # Validate input data
        schema = StoreSchema()
        data = schema.load(request.json, partial=True)
        
        # Update store fields
        for key, value in data.items():
            if hasattr(store, key):
                setattr(store, key, value)
        
        # Update in database
        from database import db
        from datetime import datetime
        update_data = data.copy()
        update_data['updated_at'] = datetime.utcnow()
        db.stores.update_one({'_id': store._id}, {'$set': update_data})
        
        return jsonify(store.to_dict()), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Delete store
@stores_bp.route('/<store_id>', methods=['DELETE'])
@jwt_required()
def delete_store(store_id):
    try:
        current_user_data = get_jwt_identity()
        
        store = Store.find_by_id(store_id)
        if not store:
            return jsonify({'message': 'Store not found'}), 404
        
        if store.owner_id != current_user_data['id']:
            return jsonify({'message': 'Access denied'}), 403
        
        from database import db
        db.stores.delete_one({'_id': store._id})
        
        return jsonify({'message': 'Store deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500
