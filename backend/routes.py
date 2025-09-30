from flask import app, jsonify, request
from controllers import *

def register_routes(app):
    
    # Health check
    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "healthy", "message": "Service Marketplace API is running"})
    
    # Auth routes
    @app.route('/api/auth/register', methods=['POST'])
    def register_user_route():
        return register_user()
    
    @app.route('/api/auth/login', methods=['POST'])
    def login_user_route():
        return login_user()
    
    # Service routes (public)
    @app.route('/api/services', methods=['GET'])
    def get_all_services_route():
        return get_services()
    
    @app.route('/api/services/<int:service_id>', methods=['GET'])
    def get_single_service_route(service_id):
        return get_service(service_id)
    
    @app.route('/api/services/provider/<int:provider_id>', methods=['GET'])
    def get_provider_services_route(provider_id):
        return get_provider_services(provider_id)
    
    # Service routes (protected - without auth for now)
    @app.route('/api/services', methods=['POST'])
    def create_new_service_route():
        return create_service()
    
    @app.route('/api/me/services', methods=['GET'])
    def get_my_services_route():
        return get_my_services()
    
    # Booking routes
    @app.route('/api/bookings', methods=['POST'])
    def create_new_booking_route():
        return create_booking()
    
    @app.route('/api/bookings/user/<int:user_id>', methods=['GET'])
    def get_user_bookings_route(user_id):
        return get_user_bookings(user_id)
    
    @app.route('/api/bookings/<int:booking_id>/status', methods=['PUT'])
    def update_booking_status_route(booking_id):
        return update_booking_status(booking_id)
    
    # Review routes
    @app.route('/api/reviews', methods=['POST'])
    def create_new_review_route():
        return create_review()
    
    @app.route('/api/reviews/service/<int:service_id>', methods=['GET'])
    def get_service_reviews_route(service_id):
        return get_service_reviews(service_id)
    
    @app.route('/api/reviews/provider/<int:provider_id>', methods=['GET'])
    def get_provider_reviews_route(provider_id):
        return get_provider_reviews(provider_id)
    
    # Search and categories
    @app.route('/api/categories', methods=['GET'])
    def get_all_categories_route():
        return get_categories()
    
    @app.route('/api/services/search', methods=['GET'])
    def search_services_route():
        return search_services()
    
    # Dashboard routes
    @app.route('/api/provider/<int:provider_id>/dashboard', methods=['GET'])
    def provider_dashboard_route(provider_id):
        return get_provider_dashboard(provider_id)
    
    @app.route('/api/provider/<int:provider_id>/bookings', methods=['GET'])
    def provider_bookings_route(provider_id):
        return get_provider_bookings(provider_id)
    
    # Payment routes
    @app.route('/api/payments/initiate', methods=['POST'])
    def initiate_payment_route():
        return initiate_payment()

    @app.route('/api/payments/confirm', methods=['POST'])
    def confirm_payment_route():
        return confirm_payment()

    @app.route('/api/payments/<int:payment_id>', methods=['GET'])
    def get_payment_route(payment_id):
        return get_payment_details(payment_id)

    @app.route('/api/providers/<int:provider_id>/earnings', methods=['GET'])
    def get_provider_earnings_route(provider_id):
        return get_provider_earnings(provider_id)
    
    # Add these routes
    @app.route('/api/bookings/complete', methods=['POST'])
    def complete_booking_route():
        return complete_booking()

    @app.route('/api/users/<int:user_id>/completed-unpaid', methods=['GET'])
    def get_completed_unpaid_bookings_route(user_id):
        return get_completed_unpaid_bookings(user_id)