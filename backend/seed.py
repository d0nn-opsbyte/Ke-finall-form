from extensions import db  # Import from extensions

def seed_database():
    """Seed the database with sample data"""
    print("Starting database seeding...")
    
    # Import inside function to avoid circular imports
    from app import app
    from models import User, Service, Booking, Review
    
    with app.app_context():
        print("Creating database tables...")
        # CREATE TABLES FIRST before trying to delete from them
        db.create_all()
        
        print("Clearing existing data...")
        # Clear existing data in correct order (due to foreign key constraints)
        try:
            # Try to delete in reverse order of dependencies
            db.session.query(Review).delete()
            db.session.query(Booking).delete()
            db.session.query(Service).delete()
            db.session.query(User).delete()
            db.session.commit()
            print("✅ Old data cleared successfully")
        except Exception as e:
            print(f"ℹ️  No existing data to clear (or tables are empty): {e}")
            db.session.rollback()
        
        # ... rest of your seeding code remains the same
        print("Creating sample users...")
        # Create sample users
        provider1 = User(
            name="John Handyman",
            email="john@example.com",
            role="provider",
            phone="+1234567890",
            city="New York",
            state="NY"
        )
        provider1.set_password("password123")
        
        provider2 = User(
            name="Sarah Tutor", 
            email="sarah@example.com",
            role="provider",
            phone="+1234567891", 
            city="Brooklyn",
            state="NY"
        )
        provider2.set_password("password123")
        
        buyer1 = User(
            name="Mike Customer",
            email="mike@example.com", 
            role="buyer",
            phone="+1234567892",
            city="Queens",
            state="NY"
        )
        buyer1.set_password("password123")
        
        # Add users and commit to get their IDs
        db.session.add_all([provider1, provider2, buyer1])
        db.session.commit()
        
        print("Creating sample services...")
        # Create sample services (same as before)
        service1 = Service(
            title="Professional Home Cleaning",
            description="Thorough home cleaning service including kitchen, bathrooms, and living areas. Eco-friendly products available.",
            category="cleaning",
            provider_id=provider1.id,
            price=45.00,
            price_type="hourly", 
            city="New York",
            state="NY",
            serves_area="Manhattan,Brooklyn,Queens",
            availability_days="mon,tue,wed,thu,fri",
            availability_start="08:00",
            availability_end="18:00",
            rating=4.8,
            review_count=127
        )
        
        service2 = Service(
            title="Math Tutoring - High School Level", 
            description="Experienced math tutor specializing in algebra, calculus, and test preparation. 5 years of teaching experience.",
            category="tutoring",
            provider_id=provider2.id,
            price=60.00,
            price_type="hourly",
            city="Brooklyn", 
            state="NY",
            serves_area="Brooklyn,Manhattan",
            availability_days="mon,wed,fri,sat",
            availability_start="15:00",
            availability_end="20:00", 
            rating=4.9,
            review_count=89
        )
        
        db.session.add_all([service1, service2])
        db.session.commit()
        
        print("✅ Database seeded successfully!")
        print(f"   - Created {User.query.count()} users")
        print(f"   - Created {Service.query.count()} services")

if __name__ == '__main__':
    seed_database()