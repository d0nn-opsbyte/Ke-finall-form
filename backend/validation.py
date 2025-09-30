from flask import jsonify, request
import re

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone) is not None

def validate_user_data(data, is_update=False):
    errors = []
    
    if not is_update:
        if not data.get('name') or len(data['name']) < 2:
            errors.append('Name must be at least 2 characters long')
        
        if not data.get('email') or not validate_email(data['email']):
            errors.append('Valid email is required')
        
        if not data.get('password') or len(data['password']) < 6:
            errors.append('Password must be at least 6 characters long')
    
    if data.get('phone') and not validate_phone(data['phone']):
        errors.append('Valid phone number is required')
    
    if data.get('role') and data['role'] not in ['provider', 'buyer']:
        errors.append('Role must be either "provider" or "buyer"')
    
    return errors

def validate_service_data(data):
    errors = []
    
    if not data.get('title') or len(data['title']) < 5:
        errors.append('Title must be at least 5 characters long')
    
    if not data.get('description') or len(data['description']) < 10:
        errors.append('Description must be at least 10 characters long')
    
    if not data.get('category'):
        errors.append('Category is required')
    
    if not data.get('price') or float(data['price']) <= 0:
        errors.append('Valid price is required')
    
    if not data.get('city'):
        errors.append('City is required')
    
    return errors

def validate_booking_data(data):
    errors = []
    
    if not data.get('service_id'):
        errors.append('Service ID is required')
    
    if not data.get('booking_date'):
        errors.append('Booking date is required')
    
    return errors