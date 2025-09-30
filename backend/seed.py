from extensions import db

def seed_database():
    """Seed the database with Kenya-specific sample data"""
    print("Starting database seeding with Kenya data...")
    
    # Import inside function to avoid circular imports
    from app import app
    from models import User, Service, Booking, Review
    
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        
        print("Clearing existing data...")
        try:
            db.session.query(Review).delete()
            db.session.query(Booking).delete()
            db.session.query(Service).delete()
            db.session.query(User).delete()
            db.session.commit()
            print("✅ Old data cleared successfully")
        except Exception as e:
            print(f"ℹ️  No existing data to clear: {e}")
            db.session.rollback()
        
        print("Creating Kenyan users...")
        # Create sample users with Kenyan names and locations
        provider1 = User(
            name="John Kamau",
            email="john.kamau@example.com",
            role="provider",
            phone="+254712345678",
            city="Nairobi",
            state="Nairobi County"
        )
        provider1.set_password("password123")
        
        provider2 = User(
            name="Grace Wanjiku", 
            email="grace.wanjiku@example.com",
            role="provider",
            phone="+254723456789", 
            city="Mombasa",
            state="Mombasa County"
        )
        provider2.set_password("password123")
        
        provider3 = User(
            name="David Ochieng",
            email="david.ochieng@example.com",
            role="provider",
            phone="+254734567890",
            city="Kisumu",
            state="Kisumu County"
        )
        provider3.set_password("password123")
        
        buyer1 = User(
            name="Sarah Achieng",
            email="sarah.achieng@example.com", 
            role="buyer",
            phone="+254745678901",
            city="Nairobi",
            state="Nairobi County"
        )
        buyer1.set_password("password123")
        
        buyer2 = User(
            name="Michael Njoroge",
            email="michael.njoroge@example.com",
            role="buyer", 
            phone="+254756789012",
            city="Nakuru",
            state="Nakuru County"
        )
        buyer2.set_password("password123")
        
        # Add users to session
        db.session.add_all([provider1, provider2, provider3, buyer1, buyer2])
        db.session.commit()
        
        print("Creating Kenyan services with KSh pricing...")
        # Create services with realistic Kenyan Shilling prices
        service1 = Service(
            title="Professional Home Cleaning Services",
            description="Thorough home cleaning including living rooms, bedrooms, kitchen, and bathrooms. We use eco-friendly cleaning products. Perfect for busy Nairobi families.",
            category="cleaning",
            provider_id=provider1.id,
            price=1500.00,  # KSh 1,500
            price_type="fixed",
            city="Nairobi",
            state="Nairobi County",
            serves_area="Westlands, Kilimani, Lavington, Karen",
            availability_days="mon,tue,wed,thu,fri,sat",
            availability_start="08:00",
            availability_end="18:00",
            rating=4.8,
            review_count=47
        )
        
        service2 = Service(
            title="KCSE Mathematics Tutoring", 
            description="Experienced mathematics tutor specializing in KCSE exam preparation. Former high school teacher with 8 years experience. Covers Form 1-4 syllabus.",
            category="tutoring",
            provider_id=provider2.id,
            price=800.00,  # KSh 800 per hour
            price_type="hourly",
            city="Mombasa", 
            state="Mombasa County",
            serves_area="Nyali, Bamburi, Mombasa Island, Likoni",
            availability_days="mon,wed,fri,sat,sun",
            availability_start="14:00",
            availability_end="20:00", 
            rating=4.9,
            review_count=32
        )
        
        service3 = Service(
            title="Emergency Plumbing & Pipe Repair",
            description="Licensed plumber for all your plumbing needs in Kisumu. Leak repairs, pipe installation, toilet fixes, and water heater maintenance. 24/7 emergency service available.",
            category="plumbing",
            provider_id=provider3.id, 
            price=2500.00,  # KSh 2,500
            price_type="fixed",
            city="Kisumu",
            state="Kisumu County",
            serves_area="Milimani, Tom Mboya, Nyalenda, Kondele",
            availability_days="mon,tue,wed,thu,fri,sat,sun",
            availability_start="06:00", 
            availability_end="22:00",
            rating=4.7,
            review_count=89
        )
        
        service4 = Service(
            title="M-Pesa Till Graphic Design",
            description="Professional graphic designer for M-Pesa till numbers, business cards, flyers, and social media graphics. Specializing in small business branding in Kenya.",
            category="design",
            provider_id=provider1.id,
            price=3000.00,  # KSh 3,000
            price_type="fixed",
            city="Nairobi",
            state="Nairobi County", 
            serves_area="Nairobi CBD, Thika Road, Ngong Road",
            availability_days="tue,wed,thu,fri",
            availability_start="09:00",
            availability_end="17:00",
            rating=4.6,
            review_count=23
        )

        service5 = Service(
            title="Matatu Sound System Installation",
            description="Professional car audio installation specializing in matatus and personal vehicles. We install speakers, amplifiers, and complete sound systems. Free consultation.",
            category="electronics",
            provider_id=provider2.id,
            price=8000.00,  # KSh 8,000
            price_type="fixed",
            city="Mombasa",
            state="Mombasa County",
            serves_area="Mombasa Island, Mikindani, Changamwe",
            availability_days="mon,tue,wed,thu,fri,sat",
            availability_start="08:00",
            availability_end="18:00",
            rating=4.5,
            review_count=67
        )

        service6 = Service(
            title="Traditional Catering for Events",
            description="Authentic Kenyan catering for weddings, parties, and corporate events. Specializing in traditional dishes: nyama choma, ugali, sukuma wiki, and pilau. 50+ guests capacity.",
            category="catering",
            provider_id=provider3.id,
            price=25000.00,  # KSh 25,000
            price_type="fixed",
            city="Kisumu",
            state="Kisumu County",
            serves_area="Kisumu City, Ahero, Maseno",
            availability_days="mon,tue,wed,thu,fri,sat,sun",
            availability_start="06:00",
            availability_end="23:00",
            rating=4.8,
            review_count=124
        )

        service7 = Service(
            title="Hair Braiding & Plaiting",
            description="Professional hair braiding services for all hair types. Specializing in box braids, cornrows, and traditional African styles. We use quality hair products.",
            category="beauty",
            provider_id=provider1.id,
            price=1200.00,  # KSh 1,200
            price_type="fixed",
            city="Nairobi",
            state="Nairobi County",
            serves_area="Eastleigh, Buruburu, Umoja, Donholm",
            availability_days="tue,wed,thu,fri,sat",
            availability_start="09:00",
            availability_end="19:00",
            rating=4.7,
            review_count=156
        )

        service8 = Service(
            title="Motorcycle (Boda Boda) Delivery",
            description="Reliable motorcycle delivery service for packages, documents, and small items within Nairobi. Fast and affordable delivery with real-time tracking.",
            category="delivery",
            provider_id=provider2.id,
            price=300.00,  # KSh 300
            price_type="fixed",
            city="Nairobi",
            state="Nairobi County",
            serves_area="Nairobi CBD, Industrial Area, South B, South C",
            availability_days="mon,tue,wed,thu,fri,sat",
            availability_start="07:00",
            availability_end="21:00",
            rating=4.4,
            review_count=203
        )
        
        db.session.add_all([service1, service2, service3, service4, service5, service6, service7, service8])
        db.session.commit()
        
        print("Creating sample bookings...")
        from datetime import datetime, timedelta
        
        booking1 = Booking(
            service_id=service1.id,
            buyer_id=buyer1.id,
            provider_id=provider1.id,
            booking_date=datetime.now() + timedelta(days=2),
            duration=1,
            total_price=1500.00,  # KSh
            location_address="Pioneer House, Moi Avenue, Nairobi",
            status="confirmed"
        )
        
        booking2 = Booking(
            service_id=service2.id,
            buyer_id=buyer2.id, 
            provider_id=provider2.id,
            booking_date=datetime.now() + timedelta(days=5),
            duration=2,
            total_price=1600.00,  # KSh
            location_address="Nyali Centre, Mombasa",
            status="pending"
        )
        
        db.session.add_all([booking1, booking2])
        db.session.commit()
        
        print("Creating sample reviews...")
        review1 = Review(
            booking_id=booking1.id,
            reviewer_id=buyer1.id,
            reviewee_id=provider1.id,
            rating=5,
            comment="John did an excellent job cleaning my apartment! Very professional and thorough. Asante sana!"
        )
        
        review2 = Review(
            booking_id=booking2.id,
            reviewer_id=buyer2.id,
            reviewee_id=provider2.id, 
            rating=4,
            comment="Grace is a wonderful tutor. My son's math grades have improved significantly. Pole pole, she explains concepts very well."
        )
        
        db.session.add_all([review1, review2])
        db.session.commit()
        
        print("✅ Database seeded successfully with Kenya data!")
        print(f"   - Created {User.query.count()} Kenyan users")
        print(f"   - Created {Service.query.count()} local services") 
        print(f"   - Created {Booking.query.count()} bookings")
        print(f"   - Created {Review.query.count()} reviews")
        print("\n📝 Sample Kenyan Login Credentials:")
        print("   Cleaner: john.kamau@example.com / password123")
        print("   Tutor: grace.wanjiku@example.com / password123") 
        print("   Plumber: david.ochieng@example.com / password123")
        print("   Customer: sarah.achieng@example.com / password123")
        print("   Customer: michael.njoroge@example.com / password123")
        print("\n💰 Realistic Kenyan Pricing:")
        print("   - Home cleaning: KSh 1,500")
        print("   - Tutoring: KSh 800/hour")
        print("   - Plumbing: KSh 2,500")
        print("   - Graphic design: KSh 3,000")
        print("   - Sound system: KSh 8,000")
        print("   - Catering: KSh 25,000")
        print("   - Hair braiding: KSh 1,200")
        print("   - Boda delivery: KSh 300")

if __name__ == '__main__':
    seed_database()