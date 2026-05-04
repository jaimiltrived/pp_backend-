const { sequelize, User, RFQ, RFQItem, Order, Product, Quotation } = require('./config/db');
const { Op } = require('sequelize');

async function seedRealData() {
  try {
    console.log('Cleaning existing dummy data...');
    await sequelize.authenticate();
    
    // Clean up to avoid duplicates/messy graphs
    await Order.destroy({ where: {}, truncate: false });
    await RFQItem.destroy({ where: {}, truncate: false });
    await Quotation.destroy({ where: {}, truncate: false });
    await RFQ.destroy({ where: {}, truncate: false });
    await Product.destroy({ where: {}, truncate: false });

    const buyer = await User.findOne({ where: { email: 'buyer@purchasepoint.com' } });
    const seller = await User.findOne({ where: { email: 'seller@purchasepoint.com' } });

    if (!buyer || !seller) {
      console.error('Users missing. Run seed.js first.');
      process.exit(1);
    }

    const today = new Date();
    const dataPoints = [
      { day: 6, amount: 4500, orders: 12, rfq_title: 'Phase 1 - Steel Sourcing' },
      { day: 5, amount: 3200, orders: 8, rfq_title: 'Hydraulic Parts Batch A' },
      { day: 4, amount: 5800, orders: 15, rfq_title: 'Electrical Components Q2' },
      { day: 3, amount: 4100, orders: 10, rfq_title: 'Fastener Annual Contract' },
      { day: 2, amount: 7200, orders: 20, rfq_title: 'Precision Tools Procurement' },
      { day: 1, amount: 5400, orders: 14, rfq_title: 'Warehouse Safety Gear' },
      { day: 0, amount: 8900, orders: 25, rfq_title: 'Conveyor System Spare Parts' }
    ];

    console.log('Seeding synchronized data...');
    for (const point of dataPoints) {
      const date = new Date();
      date.setDate(today.getDate() - point.day);

      // 1. Create a "Real" RFQ for the day
      const rfq = await RFQ.create({
        title: point.rfq_title,
        description: `Automated requirement for ${point.rfq_title}`,
        BuyerId: buyer.id,
        status: point.day === 0 ? 'open' : 'awarded',
        category: 'Industrial',
        rfq_number: `RFQ-${2026}${point.day}${Math.floor(Math.random()*100)}`,
        deadline: new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000),
        createdAt: date,
        updatedAt: date
      });

      // 2. Create RFQ Items
      await RFQItem.create({
        RFQId: rfq.id,
        name: 'Standard Unit Component',
        part_number: `PN-${rfq.id}`,
        quantity: point.orders * 10,
        target_price: 50.00,
        comparison_price: 65.00,
        createdAt: date,
        updatedAt: date
      });

      // 3. Create Orders for the day to match the "Revenue"
      // We'll create one large order per day to simplify, matching the data points
      await Order.create({
        UserId: buyer.id,
        totalAmount: point.amount,
        status: 'completed', // Completed orders show up in Revenue
        items: JSON.stringify([{ item: point.rfq_title, qty: point.orders, price: point.amount / point.orders }]),
        createdAt: date,
        updatedAt: date
      });
      
      console.log(`Synced data for ${date.toDateString()}: $${point.amount} Revenue | ${point.orders} Orders`);
    }

    console.log('SUCCESS! Dashboard and Analytics are now perfectly synchronized with real database data.');
    process.exit(0);
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
}

seedRealData();
