const { User, Product, Order, RFQ, Message, sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced.');

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // 1. Users
    const users = [
      { email: 'admin@purchasepoint.com', name: 'Jenil Admin', role: 'admin', user_id: 'ADM-001' },
      { email: 'buyer@industrial.com', name: 'John Procurement', role: 'buyer', user_id: 'BUY-001' },
      { email: 'seller@factory.com', name: 'Precision Mfg Ltd', role: 'seller', user_id: 'SEL-001' },
      { email: 'supplier@logistics.com', name: 'Global Logistics Corp', role: 'seller', user_id: 'SEL-002' },
      { email: 'corp@buyer.com', name: 'Industrial Giants Inc', role: 'buyer', user_id: 'BUY-002' }
    ];

    const seededUsers = [];
    for (const u of users) {
      const [user] = await User.findOrCreate({
        where: { email: u.email },
        defaults: { ...u, password: hashedPassword, account_status: 'active' }
      });
      seededUsers.push(user);
    }
    console.log('Users seeded.');

    // 2. Products (Supplier Stock)
    const products = [
      { name: 'Titanium Engine Valve', category: 'Mechanical', price: 1250, stock: 45, description: 'High-temp aerospace grade valve.' },
      { name: 'Modular PLC Unit', category: 'Electronics', price: 2100, stock: 12, description: 'Programmable logic controller with IoT.' },
      { name: 'Heavy Duty Casing', category: 'Materials', price: 450, stock: 150, description: 'Reinforced steel outer shell.' },
      { name: 'Hydraulic Pump X1', category: 'Hydraulics', price: 3400, stock: 8, description: 'Variable displacement pump.' },
      { name: 'Ceramic Insulation', category: 'Materials', price: 85, stock: 1000, description: 'High efficiency thermal barrier.' }
    ];

    for (const p of products) {
      await Product.findOrCreate({ where: { name: p.name }, defaults: p });
    }
    console.log('Products seeded.');

    // 3. RFQs (Procurement/Bid Generator)
    const rfqs = [
      { title: 'Annual Steel Supply 2024', rfq_number: 'RFQ-001', category: 'Materials', status: 'open', deadline: new Date('2024-12-31'), BuyerId: seededUsers[1].id },
      { title: 'Electronic Control Module', rfq_number: 'RFQ-002', category: 'Electronics', status: 'awarded', deadline: new Date('2024-06-15'), BuyerId: seededUsers[1].id },
      { title: 'Custom Gasket Batch', rfq_number: 'RFQ-003', category: 'Mechanical', status: 'closed', deadline: new Date('2024-03-20'), BuyerId: seededUsers[4].id }
    ];

    for (const r of rfqs) {
      await RFQ.findOrCreate({ where: { rfq_number: r.rfq_number }, defaults: r });
    }
    console.log('RFQs seeded.');

    // 4. Orders (Order Intelligence)
    const orderData = [];
    for (let i = 1; i <= 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (15 - i));
      orderData.push({
        totalAmount: 1000 + Math.random() * 5000,
        status: i % 5 === 0 ? 'cancelled' : 'completed',
        items: { productId: 1, qty: i },
        UserId: seededUsers[1].id,
        createdAt: date
      });
    }

    for (const o of orderData) {
      await Order.create(o);
    }
    console.log('Orders seeded for analytics.');

    // 5. Messages (Inbox)
    const messages = [
      { subject: 'Registration Approved', content: 'Welcome to Purchase Point! Your account is now active.', sender_id: 'SYSTEM', receiver_id: seededUsers[1].user_id, type: 'system' },
      { subject: 'New Quote for RFQ-001', content: 'You have received a new quotation from Precision Mfg Ltd.', sender_id: seededUsers[2].user_id, receiver_id: seededUsers[1].user_id, type: 'user' },
      { subject: 'Inventory Low Alert', content: 'Your stock for Titanium Engine Valve is below the threshold.', sender_id: 'SYSTEM', receiver_id: seededUsers[2].user_id, type: 'system' }
    ];

    for (const m of messages) {
      await Message.create(m);
    }
    console.log('Messages seeded.');

    console.log('Final Demo Seeding Completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
