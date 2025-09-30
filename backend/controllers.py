from flask import request, jsonify
from extensions import db  # Import from extensions
from models import User, Service, Booking, Review
from sqlalchemy import or_, and_
from datetime import datetime

# ===== USER CONTROLLERS =====
def register_user():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'User already exists'}), 400
    
    user = User(
        name=data['name'],
        email=data['email'],
        role=data['role'],
        phone=data.get('phone'),
        city=data.get('city'),
        state=data.get('state')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User created successfully', 
        'user_id': user.id,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 201

def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'city': user.city
            }
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

# ===== SERVICE CONTROLLERS =====
def get_services():
    category = request.args.get('category')
    city = request.args.get('city')
    min_rating = request.args.get('min_rating')
    
    query = Service.query.filter_by(is_active=True)
    
    if category:
        query = query.filter(Service.category == category)
    if city:
        query = query.filter(Service.city.ilike(f'%{city}%'))
    if min_rating:
        query = query.filter(Service.rating >= float(min_rating))
    
    services = query.all()
    
    result = []
    for service in services:
        result.append({
            'id': service.id,
            'title': service.title,
            'description': service.description,
            'category': service.category,
            'price': service.price,
            'price_type': service.price_type,
            'city': service.city,
            'rating': service.rating,
            'review_count': service.review_count,
            'provider_name': service.provider.name
        })
    
    return jsonify(result)

def create_service():
    data = request.get_json()
    
    service = Service(
        title=data['title'],
        description=data['description'],
        category=data['category'],
        provider_id=data['provider_id'],
        price=data['price'],
        price_type=data.get('price_type', 'hourly'),
        city=data['city'],
        state=data.get('state', ''),
        serves_area=data.get('serves_area', ''),
        availability_days=data.get('availability_days', ''),
        availability_start=data.get('availability_start', '09:00'),
        availability_end=data.get('availability_end', '17:00')
    )
    
    db.session.add(service)
    db.session.commit()
    
    return jsonify({'message': 'Service created successfully', 'service_id': service.id}), 201

def get_service(service_id):
    service = Service.query.get_or_404(service_id)
    
    service_data = {
        'id': service.id,
        'title': service.title,
        'description': service.description,
        'category': service.category,
        'price': service.price,
        'price_type': service.price_type,
        'city': service.city,
        'rating': service.rating,
        'review_count': service.review_count,
        'availability_days': service.availability_days,
        'availability_start': service.availability_start,
        'availability_end': service.availability_end,
        'provider': {
            'id': service.provider.id,
            'name': service.provider.name,
            'phone': service.provider.phone,
            'city': service.provider.city
        }
    }
    
    return jsonify(service_data)

def get_provider_services(provider_id):
    services = Service.query.filter_by(provider_id=provider_id, is_active=True).all()
    result = [{
        'id': service.id,
        'title': service.title,
        'description': service.description,
        'category': service.category,
        'price': service.price,
        'rating': service.rating,
        'review_count': service.review_count
    } for service in services]
    
    return jsonify(result)

def get_my_services():
    user_id = request.args.get('user_id')
    services = Service.query.filter_by(provider_id=user_id).all()
    
    result = [{
        'id': service.id,
        'title': service.title,
        'description': service.description,
        'category': service.category,
        'price': service.price,
        'rating': service.rating,
        'review_count': service.review_count,
        'is_active': service.is_active
    } for service in services]
    
    return jsonify(result)

# ===== BOOKING CONTROLLERS =====
def create_booking():
    data = request.get_json()
    service = Service.query.get(data['service_id'])
    
    if not service:
        return jsonify({'error': 'Service not found'}), 404
    
    booking = Booking(
        service_id=data['service_id'],
        buyer_id=data['buyer_id'],
        provider_id=service.provider_id,
        booking_date=datetime.fromisoformat(data['booking_date']),
        duration=data.get('duration', 1),
        total_price=service.price * (data.get('duration', 1)),
        location_address=data.get('location_address'),
        special_requests=data.get('special_requests')
    )
    
    db.session.add(booking)
    db.session.commit()
    
    return jsonify({'message': 'Booking created successfully', 'booking_id': booking.id}), 201

def get_user_bookings(user_id):
    bookings = Booking.query.filter(
        or_(Booking.buyer_id == user_id, Booking.provider_id == user_id)
    ).all()
    
    result = []
    for booking in bookings:
        result.append({
            'id': booking.id,
            'service_title': booking.service.title,
            'booking_date': booking.booking_date.isoformat(),
            'total_price': booking.total_price,
            'status': booking.status,
            'buyer_name': booking.buyer.name,
            'provider_name': booking.provider_rel.name
        })
    
    return jsonify(result)

def update_booking_status(booking_id):
    data = request.get_json()
    booking = Booking.query.get_or_404(booking_id)
    
    booking.status = data['status']
    db.session.commit()
    
    return jsonify({'message': 'Booking status updated successfully'})

# ===== REVIEW CONTROLLERS =====
def create_review():
    data = request.get_json()
    
    review = Review(
        booking_id=data['booking_id'],
        reviewer_id=data['reviewer_id'],
        reviewee_id=data['reviewee_id'],
        rating=data['rating'],
        comment=data.get('comment', '')
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify({'message': 'Review created successfully'}), 201

def get_service_reviews(service_id):
    reviews = Review.query.join(Booking).filter(Booking.service_id == service_id).all()
    
    result = []
    for review in reviews:
        result.append({
            'id': review.id,
            'rating': review.rating,
            'comment': review.comment,
            'reviewer_name': review.reviewer.name,
            'created_at': review.created_at.isoformat()
        })
    
    return jsonify(result)

def get_provider_reviews(provider_id):
    reviews = Review.query.filter_by(reviewee_id=provider_id).all()
    
    result = []
    for review in reviews:
        result.append({
            'id': review.id,
            'rating': review.rating,
            'comment': review.comment,
            'reviewer_name': review.reviewer.name,
            'created_at': review.created_at.isoformat()
        })
    
    return jsonify(result)

# ===== SEARCH & CATEGORY CONTROLLERS =====
def get_categories():
    categories = db.session.query(Service.category).distinct().all()
    category_list = [cat[0] for cat in categories if cat[0]]
    return jsonify(category_list)

def search_services():
    query = request.args.get('q', '')
    category = request.args.get('category')
    city = request.args.get('city')
    max_price = request.args.get('max_price')
    min_rating = request.args.get('min_rating')
    
    search_query = Service.query.filter_by(is_active=True)
    
    if query:
        search_query = search_query.filter(
            or_(
                Service.title.ilike(f'%{query}%'),
                Service.description.ilike(f'%{query}%')
            )
        )
    
    if category:
        search_query = search_query.filter(Service.category == category)
    if city:
        search_query = search_query.filter(Service.city.ilike(f'%{city}%'))
    if max_price:
        search_query = search_query.filter(Service.price <= float(max_price))
    if min_rating:
        search_query = search_query.filter(Service.rating >= float(min_rating))
    
    services = search_query.all()
    
    result = []
    for service in services:
        result.append({
            'id': service.id,
            'title': service.title,
            'description': service.description,
            'category': service.category,
            'price': service.price,
            'city': service.city,
            'rating': service.rating,
            'provider_name': service.provider.name
        })
    
    return jsonify(result)

# ===== DASHBOARD CONTROLLERS =====
def get_provider_dashboard(provider_id):
    """Get provider dashboard data"""
    services = Service.query.filter_by(provider_id=provider_id).all()
    bookings = Booking.query.filter_by(provider_id=provider_id).all()
    
    total_earnings = sum(booking.total_price for booking in bookings if booking.status == 'completed')
    pending_bookings = len([b for b in bookings if b.status == 'pending'])
    
    return jsonify({
        'stats': {
            'total_services': len(services),
            'total_bookings': len(bookings),
            'pending_bookings': pending_bookings,
            'total_earnings': total_earnings
        },
        'recent_bookings': [{
            'id': booking.id,
            'service_title': booking.service.title,
            'booking_date': booking.booking_date.isoformat(),
            'status': booking.status,
            'total_price': booking.total_price
        } for booking in bookings[:5]]
    })

def get_provider_bookings(provider_id):
    """Get all bookings for a provider"""
    bookings = Booking.query.filter_by(provider_id=provider_id).all()
    
    result = []
    for booking in bookings:
        result.append({
            'id': booking.id,
            'service_title': booking.service.title,
            'booking_date': booking.booking_date.isoformat(),
            'total_price': booking.total_price,
            'status': booking.status,
            'buyer_name': booking.buyer.name,
            'buyer_phone': booking.buyer.phone
        })
    
    return jsonify(result)