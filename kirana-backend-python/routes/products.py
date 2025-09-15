from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from models.product import Product, db
from models.store import Store

products_bp = Blueprint('products', __name__)

# Validation schemas
class ProductSchema(Schema):
    name = fields.Str(required=True)
    description = fields.Str(missing='')
    price = fields.Float(required=True, validate=lambda x: x > 0)
    category = fields.Str(required=True, validate=lambda x: x in [
        'groceries', 'fruits', 'vegetables', 'dairy', 'snacks', 'beverages', 'others'
    ])
    image = fields.Str(missing='')
    stock = fields.Int(missing=0, validate=lambda x: x >= 0)
    unit = fields.Str(missing='piece')
    is_available = fields.Bool(missing=True)

# Get all products
@products_bp.route('/', methods=['GET'])
def get_all_products():
    try:
        category = request.args.get('category')
        store_id = request.args.get('store_id')
        
        query = Product.query.filter_by(is_available=True)
        
        if category:
            query = query.filter_by(category=category)
        
        if store_id:
            query = query.filter_by(store_id=store_id)
        
        products = query.all()
        products_data = [product.to_dict(include_store=True) for product in products]
        
        return jsonify(products_data), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Get product by ID
@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        return jsonify(product.to_dict(include_store=True)), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Create product (vendor only)
@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    try:
        current_user_data = get_jwt_identity()
        
        if current_user_data['role'] != 'vendor':
            return jsonify({'message': 'Access denied'}), 403
        
        # Get vendor's store
        store = Store.query.filter_by(owner_id=current_user_data['id']).first()
        if not store:
            return jsonify({'message': 'Store not found'}), 404
        
        # Validate input data
        schema = ProductSchema()
        data = schema.load(request.json)
        
        # Create new product
        product = Product(
            store_id=store.id,
            name=data['name'],
            description=data['description'],
            price=data['price'],
            category=data['category'],
            image=data['image'],
            stock=data['stock'],
            unit=data['unit'],
            is_available=data['is_available']
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify(product.to_dict()), 201
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Update product
@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        current_user_data = get_jwt_identity()
        
        if current_user_data['role'] != 'vendor':
            return jsonify({'message': 'Access denied'}), 403
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Check if user owns the store
        store = Store.query.get(product.store_id)
        if store.owner_id != current_user_data['id']:
            return jsonify({'message': 'Access denied'}), 403
        
        # Validate input data
        schema = ProductSchema()
        data = schema.load(request.json, partial=True)
        
        # Update product fields
        for key, value in data.items():
            if hasattr(product, key):
                setattr(product, key, value)
        
        db.session.commit()
        
        return jsonify(product.to_dict()), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Delete product
@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        current_user_data = get_jwt_identity()
        
        if current_user_data['role'] != 'vendor':
            return jsonify({'message': 'Access denied'}), 403
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Check if user owns the store
        store = Store.query.get(product.store_id)
        if store.owner_id != current_user_data['id']:
            return jsonify({'message': 'Access denied'}), 403
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Get products by store
@products_bp.route('/store/<int:store_id>', methods=['GET'])
def get_products_by_store(store_id):
    try:
        products = Product.query.filter_by(
            store_id=store_id, 
            is_available=True
        ).all()
        
        products_data = [product.to_dict() for product in products]
        
        return jsonify(products_data), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500
