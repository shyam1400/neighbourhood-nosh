from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import os
from dotenv import load_dotenv
from database import bcrypt

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
bcrypt.init_app(app)
jwt = JWTManager(app)
CORS(app)

# Import models and routes after app initialization
from models import User, Store, Product, Order
from routes.auth import auth_bp
from routes.stores import stores_bp
from routes.orders import orders_bp
from routes.products import products_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(stores_bp, url_prefix='/api/stores')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(products_bp, url_prefix='/api/products')

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'message': 'KiranaConnect Backend is running!', 'status': 'OK'})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Route not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Something went wrong!', 'error': str(error)}), 500

# Test MongoDB connection
@app.before_first_request
def test_db_connection():
    try:
        from database import db
        # Test connection by listing collections
        collections = db.list_collection_names()
        print('✅ MongoDB connected successfully')
        print(f'Available collections: {collections}')
    except Exception as e:
        print(f'❌ MongoDB connection error: {e}')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f'🚀 Server is running on port {port}')
    app.run(debug=True, host='0.0.0.0', port=port)
