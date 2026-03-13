const { RFQ, RFQItem, Quotation, User } = require('../../config/db');

// Create a new RFQ
exports.createRFQ = async (req, res) => {
  try {
    const { title, description, category, deadline, items } = req.body;
    const BuyerId = req.user.id;

    const rfq = await RFQ.create({
      title,
      description,
      category,
      deadline,
      BuyerId
    });

    if (items && items.length > 0) {
      const rfqItems = items.map(item => ({
        ...item,
        RFQId: rfq.id
      }));
      await RFQItem.bulkCreate(rfqItems);
    }

    const fullRFQ = await RFQ.findByPk(rfq.id, {
      include: [{ model: RFQItem, as: 'items' }]
    });

    res.status(201).json({
      message: 'RFQ created successfully',
      rfq: fullRFQ
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Assign suppliers to RFQ (In this simple version, we just log it or link them)
exports.assignSuppliers = async (req, res) => {
  try {
    const { rfq_id, suppliers } = req.body;
    // Mock logic: In a real app, you might create notifications or junction table entries
    res.json({ message: 'Suppliers assigned successfully', rfq_id, suppliers });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get comparison of quotations for an RFQ
exports.getComparison = async (req, res) => {
  try {
    const { id } = req.params;
    const rfq = await RFQ.findByPk(id, {
      include: [
        { model: RFQItem, as: 'items' },
        { 
          model: Quotation, 
          as: 'quotations',
          include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }]
        }
      ]
    });

    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    // Calculate best prices and deviations for each item
    const analysis = rfq.items.map(item => {
      const itemQuotes = rfq.quotations.filter(q => q.RFQId === rfq.id); // This is simplified; ideally link quotes to items
      // Note: In this simple schema, Quotations are for the WHOLE RFQ.
      // If we want per-item quotes, we'd need a separate model.
      // But let's assume Quotation.unit_price is the sum or we'll handle it logically.
      
      const bestPrice = itemQuotes.length > 0 
        ? Math.min(...itemQuotes.map(q => parseFloat(q.unit_price))) 
        : null;

      const deviationToComparison = (bestPrice && item.comparison_price)
        ? ((bestPrice - parseFloat(item.comparison_price)) / parseFloat(item.comparison_price) * 100).toFixed(2)
        : null;

      const deviationToTarget = (bestPrice && item.target_price)
        ? ((bestPrice - parseFloat(item.target_price)) / parseFloat(item.target_price) * 100).toFixed(2)
        : null;

      return {
        ...item.toJSON(),
        best_price: bestPrice,
        deviation_to_comparison: deviationToComparison,
        deviation_to_target: deviationToTarget
      };
    });

    res.json({ 
      rfq: {
        ...rfq.toJSON(),
        items: analysis
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Select a quotation
exports.selectSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotation_id } = req.body;

    const quotation = await Quotation.findByPk(quotation_id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });

    quotation.status = 'accepted';
    await quotation.save();

    const rfq = await RFQ.findByPk(id);
    rfq.status = 'awarded';
    await rfq.save();

    res.json({ message: 'Supplier selected and RFQ awarded', quotation });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// List RFQs by status
exports.listByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const rfqs = await RFQ.findAll({ where, include: [{ model: RFQItem, as: 'items' }] });
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get RFQ details
exports.getRFQDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const rfq = await RFQ.findByPk(id, {
      include: [{ model: RFQItem, as: 'items' }]
    });
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    res.json(rfq);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// List all RFQs
exports.listRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.findAll({
      include: [{ model: RFQItem, as: 'items' }]
    });
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Calculate maximum savings for an RFQ
exports.calculateSavings = async (req, res) => {
  try {
    const { rfq_id } = req.body;
    const rfq = await RFQ.findByPk(rfq_id, {
      include: [{ model: RFQItem, as: 'items' }]
    });

    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    const allQuotes = await Quotation.findAll({ where: { RFQId: rfq_id } });
    
    const breakdown = rfq.items.map(item => {
      const bestPrice = allQuotes.length > 0 
        ? Math.min(...allQuotes.map(q => parseFloat(q.unit_price))) 
        : null;
      
      const comparisonPrice = parseFloat(item.comparison_price || 0);
      const savingsPerUnit = bestPrice ? (comparisonPrice - bestPrice) : 0;
      
      return {
        part_number: item.part_number,
        comparison_price: comparisonPrice,
        best_price: bestPrice,
        savings_per_unit: savingsPerUnit ? savingsPerUnit.toFixed(2) : 0,
        total_savings: (savingsPerUnit * item.quantity).toFixed(2)
      };
    });

    const totalSavings = breakdown.reduce((sum, b) => sum + parseFloat(b.total_savings), 0);

    res.json({
      breakdown,
      total_savings: totalSavings.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get high-level dashboard metrics
exports.getDashboard = async (req, res) => {
  try {
    const totalRFQs = await RFQ.count();
    const openRFQs = await RFQ.count({ where: { status: 'open' } });
    const awardedRFQs = await RFQ.count({ where: { status: 'awarded' } });
    
    // Potental savings calculation
    const allItems = await RFQItem.findAll();
    const allQuotes = await Quotation.findAll();
    
    let totalSavings = 0;
    allItems.forEach(item => {
      const itemQuotes = allQuotes.filter(q => q.RFQId === item.RFQId);
      if (itemQuotes.length > 0 && item.comparison_price) {
        const bestPrice = Math.min(...itemQuotes.map(q => parseFloat(q.unit_price)));
        const savingsPerUnit = parseFloat(item.comparison_price) - bestPrice;
        if (savingsPerUnit > 0) {
          totalSavings += savingsPerUnit * item.quantity;
        }
      }
    });

    res.json({
      total_rfqs: totalRFQs,
      open_rfqs: openRFQs,
      closed_rfqs: totalRFQs - openRFQs,
      awarded_rfqs: awardedRFQs,
      total_potential_savings: totalSavings.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

exports.importBOM = (req, res) => res.json({ id: 'BOM-456', message: 'Import BOM - stub' });
