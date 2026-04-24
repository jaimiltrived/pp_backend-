# RFQ API Documentation

This document describes the complete RFQ (Request For Quotation) API endpoints based on the Purchase point_Analysis 1.xlsx structure.

## Base URL
```
http://localhost:5000/api/rfq
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## RFQ-Tracking Endpoints

### 1. Get All RFQs
**GET** `/tracking`

Get a list of all RFQs with their basic information.

**Response:**
```json
[
  {
    "id": 1,
    "rfq_number": "RFQ-2026-001",
    "status": "Open",
    "created_date": "2026-03-11T10:00:00Z",
    "deadline": "2026-03-20T23:59:59Z",
    "supplier_count": 4
  }
]
```

---

### 2. Get Specific RFQ
**GET** `/tracking/:id`

Get detailed information about a specific RFQ.

**Parameters:**
- `id` (URL param): RFQ ID

**Response:**
```json
{
  "id": 1,
  "rfq_number": "RFQ-2026-001",
  "status": "Open",
  "created_date": "2026-03-11T10:00:00Z",
  "deadline": "2026-03-20T23:59:59Z",
  "supplier_count": 4,
  "notes": "Q1 procurement"
}
```

---

### 3. Create New RFQ
**POST** `/tracking` *(Auth Required)*

Create a new RFQ request.

**Request Body:**
```json
{
  "rfq_number": "RFQ-2026-002",
  "status": "Open",
  "deadline": "2026-04-15T23:59:59Z",
  "supplier_count": 3
}
```

**Response:**
```json
{
  "id": 2,
  "message": "RFQ created successfully"
}
```

---

### 4. Update RFQ Status
**PUT** `/tracking/:id/status` *(Auth Required)*

Update the status of an existing RFQ.

**Parameters:**
- `id` (URL param): RFQ ID

**Request Body:**
```json
{
  "status": "Closed"
}
```

**Response:**
```json
{
  "message": "RFQ status updated successfully"
}
```

---

## Detail Analysis Endpoints

### 5. Get Detail Analysis (Part/BOM Level)
**GET** `/analysis/:rfq_id`

Get granular information at the part number and BOM level with supplier quotes and variance calculations.

**Parameters:**
- `rfq_id` (URL param): RFQ ID

**Response:**
```json
[
  {
    "id": 1,
    "part_number": "111-1",
    "requested_quantity": 100,
    "target_price": 50.00,
    "comparison_price": 55.00,
    "best_price": 45.00,
    "deviation_to_comparison": -18.18,
    "deviation_to_best": 22.22,
    "bom_level": 1,
    "rfq_id": 1
  }
]
```

**Fields:**
- `deviation_to_comparison`: Percentage difference between best price and comparison price
- `deviation_to_best`: Percentage difference between best price and target price

---

### 6. Get Quotes by Part Number
**GET** `/quotes/:part_number`

Get all supplier quotes for a specific part number.

**Parameters:**
- `part_number` (URL param): Part number (e.g., "111-1")

**Response:**
```json
[
  {
    "id": 1,
    "supplier_id": 1,
    "unit_price": 45.00,
    "nre_cost": 500.00,
    "total_cost": 5000.00,
    "supplier_name": "Lieferant 1"
  },
  {
    "id": 2,
    "supplier_id": 2,
    "unit_price": 48.00,
    "nre_cost": 300.00,
    "total_cost": 4800.00,
    "supplier_name": "Lieferant 2"
  }
]
```

---

## Supplier Selection Endpoints

### 7. Get Best Suppliers for Part
**GET** `/suppliers/best/:part_number`

Get the top 3 suppliers with the best prices for a specific part.

**Parameters:**
- `part_number` (URL param): Part number

**Response:**
```json
[
  {
    "rank": 1,
    "id": 1,
    "name": "Lieferant 1",
    "unit_price": 45.00,
    "nre_cost": 500.00,
    "total_cost": 5000.00
  },
  {
    "rank": 2,
    "id": 2,
    "name": "Lieferant 2",
    "unit_price": 48.00,
    "nre_cost": 300.00,
    "total_cost": 4800.00
  },
  {
    "rank": 3,
    "id": 3,
    "name": "Lieferant 3",
    "unit_price": 50.00,
    "nre_cost": 0.00,
    "total_cost": 5000.00
  }
]
```

---

### 8. Calculate Maximum Savings
**POST** `/savings/calculate` *(Auth Required)*

Calculate total potential savings for all parts in an RFQ by comparing supplier quotes with comparison prices.

**Request Body:**
```json
{
  "rfq_id": 1
}
```

**Response:**
```json
{
  "breakdown": [
    {
      "part_number": "111-1",
      "comparison_price": 55.00,
      "best_price": 45.00,
      "savings_per_unit": 10.00,
      "total_savings": 1000.00
    },
    {
      "part_number": "222-2",
      "comparison_price": 120.00,
      "best_price": 100.00,
      "savings_per_unit": 20.00,
      "total_savings": 2000.00
    }
  ],
  "total_savings": 3000.00
}
```

---

## RFQ-Input Endpoints

### 9. Get RFQ Input Data
**GET** `/input/:rfq_id`

Get the raw input data for an RFQ including unit prices and NRE costs from all suppliers.

**Parameters:**
- `rfq_id` (URL param): RFQ ID

**Response:**
```json
[
  {
    "id": 1,
    "part_number": "111-1",
    "requested_quantity": 100,
    "supplier1_price": 48.00,
    "supplier2_price": 50.00,
    "supplier3_price": 52.00,
    "supplier4_price": 55.00,
    "nre_cost1": 500.00,
    "nre_cost2": 0.00,
    "nre_cost3": 0.00,
    "nre_cost4": 0.00,
    "comparison_price": 55.00,
    "rfq_id": 1
  }
]
```

---

### 10. Create RFQ Input
**POST** `/input` *(Auth Required)*

Create new input data for an RFQ.

**Request Body:**
```json
{
  "rfq_id": 1,
  "part_number": "111-1",
  "requested_quantity": 100,
  "supplier_prices": [48.00, 50.00, 52.00, 55.00],
  "nre_costs": [500.00, 0.00, 0.00, 0.00],
  "comparison_price": 55.00
}
```

**Response:**
```json
{
  "id": 1,
  "message": "RFQ input created successfully"
}
```

---

## Adapter RFQ-Generator Endpoints

### 11. Get Part Mappings
**GET** `/mappings`

Get all part number mappings used for streamlining data generation.

**Response:**
```json
[
  {
    "id": 1,
    "part_number": "111-1",
    "mapped_code": "ADAPTER-001",
    "description": "Standard adapter connector"
  },
  {
    "id": 2,
    "part_number": "333-1",
    "mapped_code": "ADAPTER-003",
    "description": "High-speed adapter connector"
  }
]
```

---

### 12. Create Part Mapping
**POST** `/mappings` *(Auth Required)*

Create a new part number mapping.

**Request Body:**
```json
{
  "part_number": "444-1",
  "mapped_code": "ADAPTER-004",
  "description": "Precision adapter connector"
}
```

**Response:**
```json
{
  "id": 3,
  "message": "Part mapping created successfully"
}
```

---

## RFQ-Supplier & DropDown Endpoints

### 13. Get All Suppliers
**GET** `/suppliers`

Get a list of all suppliers.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Lieferant 1",
    "contact_info": "contact@lieferant1.de",
    "country": "Germany"
  },
  {
    "id": 2,
    "name": "Lieferant 2",
    "contact_info": "contact@lieferant2.de",
    "country": "Germany"
  },
  {
    "id": 3,
    "name": "Lieferant 3",
    "contact_info": "contact@lieferant3.de",
    "country": "Germany"
  },
  {
    "id": 4,
    "name": "Lieferant 4",
    "contact_info": "contact@lieferant4.de",
    "country": "Germany"
  }
]
```

---

### 14. Get Dropdown Options
**GET** `/dropdown/:category`

Get dropdown list options for dynamic data validation.

**Parameters:**
- `category` (URL param): Category name (e.g., "status", "supplier", "priority")

**Response:**
```json
[
  {
    "id": 1,
    "label": "Open",
    "value": "open",
    "category": "status"
  },
  {
    "id": 2,
    "label": "In Progress",
    "value": "in_progress",
    "category": "status"
  },
  {
    "id": 3,
    "label": "Closed",
    "value": "closed",
    "category": "status"
  }
]
```

---

## Dashboard Endpoints

### 15. Get RFQ Dashboard Summary
**GET** `/dashboard/summary`

Get a high-level dashboard summary with key metrics.

**Response:**
```json
{
  "total_rfqs": 5,
  "open_rfqs": 2,
  "closed_rfqs": 3,
  "total_suppliers": 4,
  "total_potential_savings": 15000.00
}
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid request parameters"
}
```

**404 Not Found:**
```json
{
  "message": "RFQ not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error message"
}
```

---

## Example Usage

### Complete RFQ Workflow

1. **Create an RFQ**
   ```bash
   curl -X POST http://localhost:5000/api/rfq/tracking \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "rfq_number": "RFQ-2026-001",
       "status": "Open",
       "deadline": "2026-03-20T23:59:59Z",
       "supplier_count": 4
     }'
   ```

2. **Add Input Data**
   ```bash
   curl -X POST http://localhost:5000/api/rfq/input \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "rfq_id": 1,
       "part_number": "111-1",
       "requested_quantity": 100,
       "supplier_prices": [48.00, 50.00, 52.00, 55.00],
       "nre_costs": [500.00, 0.00, 0.00, 0.00],
       "comparison_price": 55.00
     }'
   ```

3. **Get Detail Analysis**
   ```bash
   curl -X GET http://localhost:5000/api/rfq/analysis/1 \
     -H "Authorization: Bearer <token>"
   ```

4. **Calculate Savings**
   ```bash
   curl -X POST http://localhost:5000/api/rfq/savings/calculate \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"rfq_id": 1}'
   ```

5. **Get Best Suppliers**
   ```bash
   curl -X GET http://localhost:5000/api/rfq/suppliers/best/111-1
   ```

6. **Update RFQ Status**
   ```bash
   curl -X PUT http://localhost:5000/api/rfq/tracking/1/status \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"status": "Closed"}'
   ```

---

## Notes

- All date fields use ISO 8601 format
- Prices are in the currency of your comparison baseline
- The API automatically calculates deviations and savings percentages
- Authentication is required for POST, PUT, and DELETE operations
- GET requests for public data (suppliers, quotes) do not require authentication
