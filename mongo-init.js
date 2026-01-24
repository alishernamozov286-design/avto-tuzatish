// MongoDB initialization script
db = db.getSiblingDB('car-repair-workshop');

// Create collections with indexes
db.createCollection('users');
db.createCollection('cars');
db.createCollection('carservices');
db.createCollection('subscriptions');
db.createCollection('conversations');

// Create indexes for better performance
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.cars.createIndex({ "plateNumber": 1 });
db.cars.createIndex({ "owner.phone": 1 });
db.carservices.createIndex({ "car": 1 });
db.carservices.createIndex({ "createdAt": -1 });
db.subscriptions.createIndex({ "userId": 1 });
db.conversations.createIndex({ "userId": 1 });
db.conversations.createIndex({ "createdAt": -1 });

print('Database initialized successfully!');