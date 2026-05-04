const { sequelize, User, RFQ, RFQItem, Order, Product, Organization } = require('./config/db');
const bcrypt = require('bcryptjs');

async function seedData() {
  try {
    console.log('Connecting to Railway for seeding...');
    await sequelize.authenticate();
    
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    console.log('Creating Admin User...');
    const admin = await User.findOrCreate({
      where: { email: 'admin@purchasepoint.com' },
      defaults: {
        name: 'System Admin',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        account_status: 'active'
      }
    });

    console.log('Creating Buyer User...');
    const [buyer, createdBuyer] = await User.findOrCreate({
      where: { email: 'buyer@purchasepoint.com' },
      defaults: {
        name: 'John Buyer',
        password: hashedPassword,
        role: 'buyer',
        status: 'active',
        account_status: 'active'
      }
    });

    console.log('Creating Seller User...');
    const [seller, createdSeller] = await User.findOrCreate({
      where: { email: 'seller@purchasepoint.com' },
      defaults: {
        name: 'Jane Seller',
        password: hashedPassword,
        role: 'seller',
        status: 'active',
        account_status: 'active'
      }
    });

    console.log('Adding Dummy RFQ...');
    const rfq = await RFQ.create({
      title: 'Industrial Pumps for Q3',
      description: 'Requirement for 50 high-pressure water pumps.',
      BuyerId: buyer.id,
      status: 'open',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    await RFQItem.create({
      RFQId: rfq.id,
      name: 'High Pressure Water Pump',
      part_number: 'PUMP-101',
      description: 'Centrifugal Pump - 5HP',
      quantity: 50,
      target_price: 150.00
    });

    console.log('Adding Dummy Order...');
    await Order.create({
      UserId: buyer.id,
      totalAmount: 7500.00,
      status: 'pending',
      items: JSON.stringify([{ part: 'PUMP-101', qty: 50, price: 150 }])
    });

    console.log('Seed successful! Login with password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedData();
