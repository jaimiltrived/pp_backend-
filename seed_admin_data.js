const { User, RFQ, RFQItem, Quotation, Message, sequelize } = require('./config/db');

async function sed() {
  try {
    await sequelize.sync();
    
    // 1. Create Demo RFQs and Items for Analytics
    const buyer = await User.findOne({ where: { role: 'buyer' } });
    const seller = await User.findOne({ where: { role: 'seller' } });
    const rfqId = buyer ? buyer.id : 1;
    const sellerId = seller ? seller.id : 2;

    const rfq1 = await RFQ.create({
      title: 'Industrial Turbine Parts Q3',
      status: 'open',
      BuyerId: rfqId
    });

    await RFQItem.create({
      RFQId: rfq1.id,
      name: 'High Pressure Turbine Blade',
      part_number: 'TRB-900',
      description: 'High pressure turbine blade',
      quantity: 50,
      target_price: 1200,
      comparison_price: 1550
    });

    await RFQItem.create({
      RFQId: rfq1.id,
      name: 'Stator Vane Assembly',
      part_number: 'TRB-450',
      description: 'Stator Vane Assembly',
      quantity: 200,
      target_price: 450,
      comparison_price: 580
    });

    // 2. Create Quotations for Analytics variance
    await Quotation.create({
      RFQId: rfq1.id,
      SellerId: sellerId,
      unit_price: 1100,
      total_amount: 55000,
      delivery_days: 14,
      status: 'pending',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // 3. Create Demo Messages for Inbox
    await Message.create({
      sender_id: 'SYSTEM',
      receiver_id: 'admin@purchasepoint.com',
      subject: 'Registry Node Optimization Complete',
      content: 'The industrial registry nodes have been successfully synchronized with the global distribution matrix A1.',
      type: 'system',
      status: 'unread'
    });

    await Message.create({
      sender_id: 'Industrial Global Inc',
      receiver_id: 'admin@purchasepoint.com',
      subject: 'Update on Bid TRB-900',
      content: 'We have updated our quotation for the turbine parts to reflect current logistics availability.',
      type: 'user',
      status: 'unread'
    });

    console.log('Industrial Data Seeding Successful.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

sed();
