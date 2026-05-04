const { sequelize, User, Order } = require('./config/db');

async function fixGraphData() {
  try {
    console.log('Spreading order data over the last 7 days for better graphs...');
    await sequelize.authenticate();

    const buyer = await User.findOne({ where: { email: 'buyer@purchasepoint.com' } });
    if (!buyer) {
      console.error('Buyer user missing.');
      process.exit(1);
    }

    // Delete existing dummy orders to start fresh for the graph
    await Order.destroy({ where: { UserId: buyer.id } });

    const statuses = ['completed', 'processing', 'pending', 'completed', 'completed', 'pending', 'completed'];
    const amounts = [2000, 1500, 3000, 2500, 4000, 1200, 5000];
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const orderDate = new Date();
      orderDate.setDate(today.getDate() - (6 - i)); // Spread over last 7 days

      await Order.create({
        UserId: buyer.id,
        totalAmount: amounts[i],
        status: statuses[i],
        items: JSON.stringify([{ product: 'Industrial Tool ' + i, qty: 1, price: amounts[i] }]),
        createdAt: orderDate,
        updatedAt: orderDate
      });
      console.log(`Created order for ${orderDate.toDateString()}`);
    }

    console.log('Graph data fixed! Refresh your dashboard.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to fix graph data:', error);
    process.exit(1);
  }
}

fixGraphData();
