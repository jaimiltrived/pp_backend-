// Procurement RFQ Controller Stubs
module.exports = {
  createRFQ: (req, res) => res.json({ message: 'Create RFQ - stub' }),
  importBOM: (req, res) => res.json({ message: 'Import BOM - stub' }),
  assignSuppliers: (req, res) => res.json({ message: 'Assign Suppliers - stub' }),
  getComparison: (req, res) => res.json({ message: 'Get Comparison - stub' }),
  selectSupplier: (req, res) => res.json({ message: 'Select Supplier - stub' }),
  listByStatus: (req, res) => res.json({ message: 'List RFQs by Status - stub' }),
  getRFQDetails: (req, res) => res.json({ message: 'Get RFQ Details - stub' }),
  listRFQs: (req, res) => res.json({ message: 'List All RFQs - stub' })
};
