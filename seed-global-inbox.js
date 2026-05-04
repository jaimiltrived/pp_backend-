const { User, Message } = require('./config/db');

async function seedGlobalInbox() {
  try {
    console.log('Seeding global inbox messages for all roles...');
    
    const buyer = await User.findOne({ where: { email: 'buyer@purchasepoint.com' } });
    const seller = await User.findOne({ where: { email: 'seller@purchasepoint.com' } });

    if (!buyer || !seller) {
      console.error('Core users missing.');
      process.exit(1);
    }

    const messages = [
      // For Buyer
      {
        subject: 'RFQ Approval: Phase 2 Steel',
        content: 'Your RFQ for Steel Section Phase 2 has been approved and moved to the public marketplace.',
        sender_id: 'SYSTEM',
        receiver_id: buyer.user_id,
        type: 'system'
      },
      {
        subject: 'New Bid Received: RFQ-1002',
        content: 'Seller Jaimil Engineering has submitted a high-value bid for your latest requirement. Please review.',
        sender_id: 'NOTIFICATION_BOT',
        receiver_id: buyer.user_id,
        type: 'system'
      },
      // For Seller
      {
        subject: 'New Opportunity: Industrial Pumps',
        content: 'A new high-priority RFQ for industrial pumps matches your vendor categories.',
        sender_id: 'SMART_MATCH',
        receiver_id: seller.user_id,
        type: 'system'
      },
      {
        subject: 'Payment Remittance: Order #4412',
        content: 'Your payment for Order #4412 has been processed and will reach your account in 3-5 business days.',
        sender_id: 'BILLING_SYSTEM',
        receiver_id: seller.user_id,
        type: 'system'
      }
    ];

    for (const msg of messages) {
      await Message.create(msg);
    }

    console.log('Global inbox seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedGlobalInbox();
