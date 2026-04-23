const db = require('../config/db');
const { User, Product, Order, RFQ, RFQItem, Quotation, Organization, PersonalInfo } = db;
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Disable foreign key checks to allow dropping tables with constraints
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    // Force sync to reset the schema with new CASCADE constraints
    await db.sequelize.sync({ force: true });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Database synced.');

    // 1. Create Admin
    const adminEmail = 'admin@purchasepoint.com';
    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = await User.create({
        email: adminEmail,
        password: 'adminpassword',
        role: 'admin',
        name: 'Super Admin',
        status: 'active',
        account_status: 'active',
        user_id: 'PP-ADMIN-001'
      });
      console.log('Admin created.');
    }

    // 2. Create Users (Buyers & Sellers)
    const usersData = [
      { email: 'buyer1@gmail.com', role: 'buyer', name: 'John Logistics', status: 'active', account_status: 'active' },
      { email: 'buyer2@gmail.com', role: 'buyer', name: 'Global Tech Procurement', status: 'pending_approval', account_status: 'pending_approval' },
      { email: 'seller1@gmail.com', role: 'seller', name: 'Elite Pumps Ltd', status: 'active', account_status: 'active' },
      { email: 'seller2@gmail.com', role: 'seller', name: 'Precision Parts Corp', status: 'pending_approval', account_status: 'pending_approval' },
      { email: 'seller3@gmail.com', role: 'seller', name: 'Industrial Gears Inc', status: 'active', account_status: 'active' },
    ];

    for (const u of usersData) {
      const user = await User.create({
        ...u,
        password: 'password123',
      });
      if (u.role === 'buyer') {
        await Organization.create({ UserId: user.id, organization_name: u.name + ' Org', organization_type: 'Purchasing', country: 'USA' });
      }
      await PersonalInfo.create({ UserId: user.id, full_name: u.name.split(' ')[0], last_name: u.name.split(' ')[1] || 'User', contact_phone: '+1 555-0000' });
    }
    console.log('Dummy users created.');

    // 3. Create Products
    await Product.bulkCreate([
      { name: 'Hydraulic Press HP-500', category: 'Machinery', price: 45000.00, description: '500-ton hydraulic press', status: 'active' },
      { name: 'CNC Milling Machine M2', category: 'Machinery', price: 85000.00, description: '3-axis CNC milling machine', status: 'active' },
      { name: 'Welding Robot Arm', category: 'Automation', price: 32000.00, description: '6-axis industrial welding robot', status: 'active' },
      { name: 'Digital Multimeter', category: 'Electrical', price: 120.00, description: 'Professional digital multimeter', status: 'active' },
      { name: 'Air Compressor 10HP', category: 'Pneumatics', price: 2100.00, description: 'Industrial air compressor', status: 'active' },
      { name: 'Steel Sheet 2mm', category: 'Materials', price: 45.00, description: 'Cold rolled steel sheet', status: 'active' }
    ]);
    console.log('Products created.');

    // 4. Create RFQs
    const buyers = await User.findAll({ where: { role: 'buyer' } });
    if (buyers.length > 0) {
      const rfq1 = await RFQ.create({
        BuyerId: buyers[0].id,
        title: 'Urgent: 50x Industrial Motors',
        rfq_number: 'RFQ-2024- मोटर्स-01',
        description: 'Need high-efficiency 3-phase AC motors.',
        category: 'Electrical',
        status: 'open',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      });
      await RFQItem.create({ RFQId: rfq1.id, name: 'AC Motor 5HP', quantity: 50, target_price: 450 });

      const rfq2 = await RFQ.create({
        BuyerId: buyers[1] ? buyers[1].id : buyers[0].id,
        title: 'Custom Gearbox Manufacturing',
        rfq_number: 'RFQ-2024-GEAR-99',
        description: 'Monthly supply of custom gearboxes as per blueprints.',
        category: 'Mechanical',
        status: 'open',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      });
      await RFQItem.create({ RFQId: rfq2.id, name: 'Gearbox G1', quantity: 10, target_price: 1200 });
    }
    console.log('RFQs created.');

    // 5. Create Orders
    const buyer = buyers[0];
    await Order.bulkCreate([
      { UserId: buyer.id, totalAmount: 8500.00, status: 'completed', items: JSON.stringify([{ name: 'Motor', qty: 10 }]), createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { UserId: buyer.id, totalAmount: 4200.00, status: 'completed', items: JSON.stringify([{ name: 'Sensors', qty: 50 }]), createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { UserId: buyer.id, totalAmount: 125000.00, status: 'processing', items: JSON.stringify([{ name: 'Lathe', qty: 1 }]), createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { UserId: buyer.id, totalAmount: 1500.00, status: 'pending', items: JSON.stringify([{ name: 'Parts', qty: 5 }]), createdAt: new Date() }
    ]);
    console.log('Orders created.');

    // 6. Create Quotations (Bids)
    const sellers = await User.findAll({ where: { role: 'seller' } });
    const allRFQs = await RFQ.findAll();
    if (sellers.length > 0 && allRFQs.length > 0) {
      await Quotation.bulkCreate([
        { 
          RFQId: allRFQs[0].id, 
          SellerId: sellers[0].id, 
          unit_price: 440.00, 
          delivery_days: 7, 
          status: 'pending', 
          notes: 'High quality industrial motors with warranty.' 
        },
        { 
          RFQId: allRFQs[0].id, 
          SellerId: sellers[1] ? sellers[1].id : sellers[0].id, 
          unit_price: 435.00, 
          delivery_days: 10, 
          status: 'pending', 
          notes: 'Best price in the market. Local support available.' 
        },
        { 
          RFQId: allRFQs[1].id, 
          SellerId: sellers[2] ? sellers[2].id : sellers[0].id, 
          unit_price: 1150.00, 
          delivery_days: 14, 
          status: 'pending', 
          notes: 'Precision engineering at its best.' 
        }
      ]);
      console.log('Quotations (Bids) created.');
    }

    console.log('--- SEEDING COMPLETED ---');
    console.log('Admin login: admin@purchasepoint.com / adminpassword');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
