# KiranaConnect Backend - Python Flask

A Python Flask backend for the KiranaConnect local store delivery application, converted from the original Node.js/Express backend.

## Features

- ✅ User authentication (JWT-based)
- ✅ Role-based access control (Customer/Vendor)
- ✅ Store management
- ✅ Product management
- ✅ Order management
- ✅ SQLAlchemy ORM with multiple database support
- ✅ Input validation with Marshmallow
- ✅ CORS support
- ✅ Error handling

## Tech Stack

- **Framework**: Flask
- **Database**: SQLAlchemy (SQLite/PostgreSQL/MySQL)
- **Authentication**: Flask-JWT-Extended
- **Password Hashing**: Flask-Bcrypt
- **Validation**: Marshmallow
- **Environment**: python-dotenv

## Installation

1. **Clone and navigate to the directory**
   ```bash
   cd kirana-backend-python
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET=jwt-secret-string
PORT=5000
DATABASE_URL=sqlite:///kirana.db
JWT_ACCESS_TOKEN_EXPIRES=24
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/{id}` - Get store by ID
- `GET /api/stores/{id}/products` - Get store products
- `POST /api/stores` - Create store (vendor only)
- `PUT /api/stores/{id}` - Update store (owner only)
- `DELETE /api/stores/{id}` - Delete store (owner only)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/store/{store_id}` - Get products by store
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/{id}` - Update product (owner only)
- `DELETE /api/products/{id}` - Delete product (owner only)

### Orders
- `POST /api/orders` - Create order (customer only)
- `GET /api/orders/customer` - Get customer orders
- `GET /api/orders/vendor` - Get vendor orders
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}/status` - Update order status

### Health Check
- `GET /api/health` - Health check endpoint

## Database Models

### User
- Authentication and profile information
- Roles: customer, vendor
- Password hashing with bcrypt

### Store
- Store information and settings
- Owned by vendor users
- Location and operating hours

### Product
- Product catalog for stores
- Categories and inventory management
- Availability status

### Order & OrderItem
- Order management system
- Order status tracking
- Payment method support

## Usage Examples

### Register a new user
```python
import requests

response = requests.post('http://localhost:5000/api/auth/register', json={
    'username': 'john_doe',
    'email': 'john@example.com',
    'password': 'password123',
    'phone': '+1234567890',
    'address': '123 Main St',
    'role': 'customer'
})
```

### Login
```python
response = requests.post('http://localhost:5000/api/auth/login', json={
    'username': 'john_doe',
    'password': 'password123'
})

token = response.json()['token']
```

### Create an order
```python
headers = {'Authorization': f'Bearer {token}'}
response = requests.post('http://localhost:5000/api/orders', 
    headers=headers,
    json={
        'store_id': 1,
        'items': [
            {'product_id': 1, 'quantity': 2},
            {'product_id': 2, 'quantity': 1}
        ],
        'delivery_address': '456 Oak St',
        'payment_method': 'cash'
    }
)
```

## Development

### Running in Development Mode
```bash
export FLASK_ENV=development
python app.py
```

### Database Migration
The application automatically creates tables on first run. For production, consider using Flask-Migrate for database migrations.

## Differences from Node.js Version

1. **Database**: Uses SQLAlchemy instead of Mongoose
2. **Validation**: Uses Marshmallow instead of express-validator
3. **Authentication**: Uses Flask-JWT-Extended instead of jsonwebtoken
4. **Structure**: Uses Flask Blueprints instead of Express routers
5. **ORM**: Relational database approach vs MongoDB document approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
