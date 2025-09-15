from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from models.order import Order
from models.store import Store
from models.product import Product
from models.user import User

orders_bp = Blueprint('orders', __name__)

# Validation schemas
class OrderItemSchema(Schema):
    product_id = fields.Str(required=True)
    quantity = fields.Int(required=True, validate=lambda x: x > 0)

class CreateOrderSchema(Schema):
    store_id = fields.Str(required=True)
    items = fields.List(fields.Nested(OrderItemSchema), required=True)
    delivery_address = fields.Str(required=True)
    payment_method = fields.Str(load_default='cash', validate=lambda x: x in ['cash', 'card', 'upi', 'wallet'])
    notes = fields.Str(load_default='')

class UpdateOrderStatusSchema(Schema):
    status = fields.Str(required=True, validate=lambda x: x in [
        'pending', 'accepted', 'rejected', 'preparing', 'ready', 
        'out_for_delivery', 'delivered', 'cancelled'
    ])

# Create order
@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    try:
        current_user_data = get_jwt_identity()
        
        if current_user_data['role'] != 'customer':
            return jsonify({'message': 'Access denied'}), 403
        
        # Validate input data
        schema = CreateOrderSchema()
        data = schema.load(request.json)
        
        # Calculate total amount and prepare order items
        total_amount = 0
        
        # Create order
        order = Order(
            customer_id=current_user_data['id'],
            store_id=data['store_id'],
            total_amount=0,  # Will be calculated
            delivery_address=data['delivery_address'],
            payment_method=data['payment_method'],
            notes=data['notes']
        )
        
        # Add items to order
        for item_data in data['items']:
            product = Product.find_by_id(item_data['product_id'])
            if not product:
                return jsonify({'message': f'Product {item_data["product_id"]} not found'}), 400
            
            if not product.is_available:
                return jsonify({'message': f'Product {product.name} is not available'}), 400
            
            item_total = product.price * item_data['quantity']
            total_amount += item_total
            
            order.add_item(item_data['product_id'], item_data['quantity'], product.price)
        
        # Update total amount
        order.total_amount = total_amount
        order.save()
        
        return jsonify(order.to_dict(include_relations=True)), 201
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Get customer orders
@orders_bp.route('/customer', methods=['GET'])
@jwt_required()
def get_customer_orders():
    try:
        current_user_data = get_jwt_identity()
        
        orders = Order.find_by_customer_id(current_user_data['id'])
        
        orders_data = [order.to_dict(include_relations=True) for order in orders]
        
        return jsonify(orders_data), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Get vendor orders
@orders_bp.route('/vendor', methods=['GET'])
@jwt_required()
def get_vendor_orders():
    try:
        current_user_data = get_jwt_identity()
        
        if current_user_data['role'] != 'vendor':
            return jsonify({'message': 'Access denied'}), 403
        
        store = Store.find_by_owner_id(current_user_data['id'])
        if not store:
            return jsonify({'message': 'Store not found'}), 404
        
        orders = Order.find_by_store_id(str(store._id))
        
        orders_data = [order.to_dict(include_relations=True) for order in orders]
        
        return jsonify(orders_data), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Update order status
@orders_bp.route('/<order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    try:
        current_user_data = get_jwt_identity()
        
        # Validate input data
        schema = UpdateOrderStatusSchema()
        data = schema.load(request.json)
        
        order = Order.find_by_id(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        # Check authorization
        if current_user_data['role'] == 'vendor':
            store = Store.find_by_owner_id(current_user_data['id'])
            if not store or order.store_id != str(store._id):
                return jsonify({'message': 'Access denied'}), 403
        elif current_user_data['role'] == 'customer':
            if order.customer_id != current_user_data['id']:
                return jsonify({'message': 'Access denied'}), 403
        else:
            return jsonify({'message': 'Access denied'}), 403
        
        # Update order status
        order.update_status(data['status'])
        
        return jsonify(order.to_dict(include_relations=True)), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Get order by ID
@orders_bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order_by_id(order_id):
    try:
        current_user_data = get_jwt_identity()
        
        order = Order.find_by_id(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        # Check authorization
        if current_user_data['role'] == 'vendor':
            store = Store.find_by_owner_id(current_user_data['id'])
            if not store or order.store_id != str(store._id):
                return jsonify({'message': 'Access denied'}), 403
        elif current_user_data['role'] == 'customer':
            if order.customer_id != current_user_data['id']:
                return jsonify({'message': 'Access denied'}), 403
        else:
            return jsonify({'message': 'Access denied'}), 403
        
        return jsonify(order.to_dict(include_relations=True)), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500
