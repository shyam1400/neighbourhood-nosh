from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from models.user import User
from models.store import Store

auth_bp = Blueprint('auth', __name__)

# Validation schemas
class RegisterSchema(Schema):
    username = fields.Str(required=True, validate=lambda x: len(x) >= 3)
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 6)
    phone = fields.Str(required=True)
    address = fields.Str(required=True)
    role = fields.Str(required=True, validate=lambda x: x in ['customer', 'vendor'])
    store_name = fields.Str(allow_none=True, load_default=None)
    store_type = fields.Str(load_default='general')
    gst_number = fields.Str(load_default='')

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)

# Register endpoint
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        # Validate input data
        schema = RegisterSchema()
        data = schema.load(request.json)
        
        # Check if user already exists
        existing_user = User.find_by_username_or_email(data['username'], data['email'])
        
        if existing_user:
            return jsonify({'message': 'User already exists'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            phone=data['phone'],
            address=data['address'],
            role=data['role']
        )
        
        user.save()
        
        # If vendor, create store
        if data['role'] == 'vendor' and data['store_name']:
            store = Store(
                owner_id=str(user._id),
                name=data['store_name'],
                store_type=data['store_type'],
                gst_number=data['gst_number'],
                address=user.address,
                phone=user.phone,
                email=user.email
            )
            store.save()
        
        # Generate JWT token
        access_token = create_access_token(
            identity={'id': str(user._id), 'role': user.role}
        )
        
        return jsonify({
            'message': 'User registered successfully',
            'token': access_token,
            'user': {
                'id': str(user._id),
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        }), 201
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Login endpoint
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        # Validate input data
        schema = LoginSchema()
        data = schema.load(request.json)
        
        # Find user
        user = User.find_by_username(data['username'])
        
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Invalid credentials'}), 400
        
        # Generate JWT token
        access_token = create_access_token(
            identity={'id': str(user._id), 'role': user.role}
        )
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': {
                'id': str(user._id),
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        }), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

# Get current user endpoint
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_data = get_jwt_identity()
        user = User.find_by_id(current_user_data['id'])
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500
