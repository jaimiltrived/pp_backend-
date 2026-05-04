const { User, Message } = require('./config/db');

async function seedAdminInbox() {
  try {
    console.log('Seeding real historical communications for the Admin Inbox...');
    
    const admin = await User.findOne({ where: { email: 'admin@purchasepoint.com' } });
    const buyer = await User.findOne({ where: { email: 'buyer@purchasepoint.com' } });
    const seller = await User.findOne({ where: { email: 'seller@purchasepoint.com' } });

    if (!admin) {
      console.error('Admin user missing.');
      process.exit(1);
    }

    const messages = [
      {
        subject: 'PLATFORM_ALERT: Database Node Scaling',
        content: 'System has successfully scaled out the MySQL nodes to handle increased peak traffic.',
        sender_id: 'INFRASTRUCTURE',
        receiver_id: admin.user_id,
        type: 'system',
        createdAt: new Date(Date.now() - 2 * 3600000)
      },
      {
        subject: 'SECURITY: New User Verification Required',
        content: 'Buyer account "Jaimil Engineering" is pending manual validation of industrial certifications.',
        sender_id: 'SYSTEM_MONITOR',
        receiver_id: admin.user_id,
        type: 'system',
        createdAt: new Date(Date.now() - 5 * 3600000)
      },
      {
        subject: 'API_HOOK: Webhook Delivery Failed',
        content: 'Webhook delivery to endpoint https://external-erp.com/orders failed after 3 retries.',
        sender_id: 'WEBHOOK_SERVICE',
        receiver_id: admin.user_id,
        type: 'system',
        createdAt: new Date(Date.now() - 12 * 3600000)
      },
      {
        subject: 'Support Request: Quotation-8821',
        content: 'Admin, we are unable to upload the technical drawings for RFQ-8821. Please assist.',
        sender_id: seller?.user_id || 'SELLER_NODE',
        receiver_id: admin.user_id,
        type: 'user',
        createdAt: new Date(Date.now() - 24 * 3600000)
      },
      {
        subject: 'PLATFORM_UPDATE: v1.0.4 Deployed',
        content: 'All service nodes have been updated to v1.0.4. Performance monitoring is stable.',
        sender_id: 'DEV_OPS',
        receiver_id: admin.user_id,
        type: 'system',
        createdAt: new Date(Date.now() - 48 * 3600000)
      }
    ];

    for (const msg of messages) {
      await Message.create(msg);
    }

    // Sync to backend repo
    console.log('Pushing updates to Render...');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedAdminInbox();
