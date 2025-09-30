from flask import jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app import db
from models import User

jwt = JWTManager()

def init_auth(app):
    jwt.init_app(app)

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({'error': 'Missing authorization token'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(callback):
    return jsonify({'error': 'Invalid token'}), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token has expired'}), 401

def require_role(role):
    def decorator(f):
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or user.role != role:
                return jsonify({'error': 'Insufficient permissions'}), 403
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator