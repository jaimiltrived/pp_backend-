const { RFQ, RFQItem, Quotation } = require('../../config/db');

// List RFQs assigned to this seller (In this mock, we just show all open ones)
exports.listAssignedRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.findAll({
      where: { status: 'open' },
      include: [{ model: RFQItem, as: 'items' }]
    });
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get details of a specific RFQ
exports.getAssignedRFQDetails = async (req, res) => {
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

// Submit a quotation for an RFQ
exports.submitQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit_price, delivery_days, terms } = req.body;
    const SellerId = req.user.id;

    const quotation = await Quotation.create({
      RFQId: id,
      SellerId,
      unit_price,
      delivery_days,
      terms
    });

    res.status(201).json({
      message: 'Quotation submitted successfully',
      quotation
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Update an existing quotation
exports.updateQuotation = async (req, res) => {
  try {
    const { id } = req.params; // rfq id
    const { unit_price, delivery_days, terms } = req.body;
    const SellerId = req.user.id;

    const quotation = await Quotation.findOne({
      where: { RFQId: id, SellerId }
    });

    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });

    if (unit_price) quotation.unit_price = unit_price;
    if (delivery_days) quotation.delivery_days = delivery_days;
    if (terms) quotation.terms = terms;

    await quotation.save();

    res.json({ message: 'Quotation updated successfully', quotation });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
