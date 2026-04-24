const db = require('../config/db');

// RFQ-Tracking: Get all RFQs
exports.getAllRFQs = async (req, res) => {
  try {
    const query = `
      SELECT id, rfq_number, status, created_date, deadline, supplier_count
      FROM rfq_tracking
      ORDER BY created_date DESC
    `;
    const [rfqs] = await db.query(query);
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RFQ-Tracking: Get a specific RFQ
exports.getRFQById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT * FROM rfq_tracking WHERE id = ?
    `;
    const [rfq] = await db.query(query, [id]);
    if (rfq.length === 0) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    res.json(rfq[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RFQ-Tracking: Create new RFQ
exports.createRFQ = async (req, res) => {
  try {
    const { rfq_number, status, deadline, supplier_count } = req.body;
    const query = `
      INSERT INTO rfq_tracking (rfq_number, status, created_date, deadline, supplier_count)
      VALUES (?, ?, NOW(), ?, ?)
    `;
    const result = await db.query(query, [rfq_number, status, deadline, supplier_count]);
    res.status(201).json({ id: result[0].insertId, message: 'RFQ created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RFQ-Tracking: Update RFQ status
exports.updateRFQStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const query = `
      UPDATE rfq_tracking SET status = ? WHERE id = ?
    `;
    await db.query(query, [status, id]);
    res.json({ message: 'RFQ status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Detail Analysis: Get part details with supplier quotes
exports.getDetailAnalysis = async (req, res) => {
  try {
    const { rfq_id } = req.params;
    const query = `
      SELECT 
        da.id, da.part_number, da.requested_quantity, da.target_price,
        da.comparison_price, da.best_price,
        ROUND(((da.best_price - da.comparison_price) / da.comparison_price * 100), 2) as deviation_to_comparison,
        ROUND(((da.best_price - da.comparison_price) / da.best_price * 100), 2) as deviation_to_best,
        da.bom_level, da.rfq_id
      FROM detail_analysis da
      WHERE da.rfq_id = ?
      ORDER BY da.part_number ASC
    `;
    const [details] = await db.query(query, [rfq_id]);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Detail Analysis: Get quotes by part
exports.getQuotesByPart = async (req, res) => {
  try {
    const { part_number } = req.params;
    const query = `
      SELECT 
        sq.id, sq.supplier_id, sq.unit_price, sq.nre_cost, sq.total_cost,
        s.name as supplier_name
      FROM supplier_quotes sq
      JOIN rfq_suppliers s ON sq.supplier_id = s.id
      WHERE sq.part_number = ?
      ORDER BY sq.unit_price ASC
    `;
    const [quotes] = await db.query(query, [part_number]);
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supplier Selection: Get best suppliers for a part
exports.getBestSuppliers = async (req, res) => {
  try {
    const { part_number } = req.params;
    const query = `
      SELECT 
        ROW_NUMBER() OVER (ORDER BY sq.unit_price ASC) as rank,
        s.id, s.name, sq.unit_price, sq.nre_cost, sq.total_cost
      FROM supplier_quotes sq
      JOIN rfq_suppliers s ON sq.supplier_id = s.id
      WHERE sq.part_number = ?
      LIMIT 3
    `;
    const [suppliers] = await db.query(query, [part_number]);
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supplier Selection: Calculate maximum savings
exports.calculateSavings = async (req, res) => {
  try {
    const { rfq_id } = req.body;
    const query = `
      SELECT 
        da.part_number,
        da.comparison_price,
        MIN(sq.unit_price) as best_price,
        (da.comparison_price - MIN(sq.unit_price)) as savings_per_unit,
        ((da.comparison_price - MIN(sq.unit_price)) * da.requested_quantity) as total_savings
      FROM detail_analysis da
      LEFT JOIN supplier_quotes sq ON da.part_number = sq.part_number
      WHERE da.rfq_id = ?
      GROUP BY da.id, da.part_number, da.comparison_price, da.requested_quantity
    `;
    const [savings] = await db.query(query, [rfq_id]);
    
    const totalSavings = savings.reduce((sum, item) => sum + (item.total_savings || 0), 0);
    
    res.json({
      breakdown: savings,
      total_savings: totalSavings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RFQ-Input: Get input data for a RFQ
exports.getRFQInput = async (req, res) => {
  try {
    const { rfq_id } = req.params;
    const query = `
      SELECT 
        ri.id, ri.part_number, ri.requested_quantity,
        ri.supplier1_price, ri.supplier2_price, ri.supplier3_price, ri.supplier4_price,
        ri.nre_cost1, ri.nre_cost2, ri.nre_cost3, ri.nre_cost4,
        ri.comparison_price, ri.rfq_id
      FROM rfq_input ri
      WHERE ri.rfq_id = ?
    `;
    const [inputs] = await db.query(query, [rfq_id]);
    res.json(inputs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RFQ-Input: Create input data
exports.createRFQInput = async (req, res) => {
  try {
    const { rfq_id, part_number, requested_quantity, supplier_prices, nre_costs, comparison_price } = req.body;
    const query = `
      INSERT INTO rfq_input 
      (rfq_id, part_number, requested_quantity, supplier1_price, supplier2_price, supplier3_price, supplier4_price,
       nre_cost1, nre_cost2, nre_cost3, nre_cost4, comparison_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, [
      rfq_id, part_number, requested_quantity,
      supplier_prices[0], supplier_prices[1], supplier_prices[2], supplier_prices[3],
      nre_costs[0], nre_costs[1], nre_costs[2], nre_costs[3],
      comparison_price
    ]);
    res.status(201).json({ id: result[0].insertId, message: 'RFQ input created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Adapter RFQ-Generator: Get mapped part numbers
exports.getPartMappings = async (req, res) => {
  try {
    const query = `
      SELECT id, part_number, mapped_code, description
      FROM adapter_rfq_generator
      ORDER BY part_number ASC
    `;
    const [mappings] = await db.query(query);
    res.json(mappings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Adapter RFQ-Generator: Create part mapping
exports.createPartMapping = async (req, res) => {
  try {
    const { part_number, mapped_code, description } = req.body;
    const query = `
      INSERT INTO adapter_rfq_generator (part_number, mapped_code, description)
      VALUES (?, ?, ?)
    `;
    const result = await db.query(query, [part_number, mapped_code, description]);
    res.status(201).json({ id: result[0].insertId, message: 'Part mapping created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RFQ-Supplier & DropDown: Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const query = `
      SELECT id, name, contact_info, country
      FROM rfq_suppliers
      ORDER BY name ASC
    `;
    const [suppliers] = await db.query(query);
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RFQ-Supplier & DropDown: Get dropdown options
exports.getDropdownOptions = async (req, res) => {
  try {
    const { category } = req.params;
    const query = `
      SELECT id, label, value, category
      FROM dropdown_options
      WHERE category = ?
    `;
    const [options] = await db.query(query, [category]);
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get RFQ dashboard with summary
exports.getDashboard = async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(DISTINCT rt.id) as total_rfqs,
        SUM(CASE WHEN rt.status = 'Open' THEN 1 ELSE 0 END) as open_rfqs,
        SUM(CASE WHEN rt.status = 'Closed' THEN 1 ELSE 0 END) as closed_rfqs,
        COUNT(DISTINCT rs.id) as total_suppliers,
        ROUND(SUM(COALESCE(da.comparison_price - (SELECT MIN(unit_price) FROM supplier_quotes sq WHERE sq.part_number = da.part_number), 0)) * COALESCE(da.requested_quantity, 1), 2) as total_potential_savings
      FROM rfq_tracking rt
      LEFT JOIN detail_analysis da ON rt.id = da.rfq_id
      LEFT JOIN rfq_suppliers rs ON 1=1
    `;
    const [dashboard] = await db.query(query);
    res.json(dashboard[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
