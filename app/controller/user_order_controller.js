import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

// Helper function to generate random reference numbers
function mt_rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const create_order = async (req, res) => {
  const connection = await pool.getConnection();
  const {
    productid,
    buyerid,
    addressid,
    description,
    payment_method,
    quantity,
    total_amount,
  } = req.body;

  const ref_no = mt_rand(111111111, 999999999);

  await connection.beginTransaction();

  try {
    const orderid = uuidv4();
    const order_statusid = uuidv4();

    // Always provide a default empty string for description
    const orderDescription = description || "";

    // Insert into orders table
    const query = `
      INSERT INTO orders (
        orderid,
        productid,
        buyerid,
        addressid,
        ref_no,
        description,
        quantity,
        payment_method,
        total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      orderid,
      productid,
      buyerid,
      addressid,
      ref_no,
      orderDescription, // <- guaranteed to be a string
      quantity,
      payment_method,
      total_amount,
    ];

    const orderResult = await connection.query(query, values);

    if (!orderResult) {
      await connection.rollback();
      return res.status(500).json({ message: "Failed to create order" });
    }

    // Insert into order_status table
    const status_query = `
      INSERT INTO order_status (
        order_statusid,
        orderid,
        status
      ) VALUES (?, ?, ?)
    `;

    const status_value = [order_statusid, orderid, "PENDING"];
    const statusResult = await connection.query(status_query, status_value);

    if (!statusResult) {
      await connection.rollback();
      return res.status(500).json({ message: "Failed to create order status" });
    }

    // Commit transaction
    await connection.commit();
    connection.release();
    getIO().emit("order_update");
    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderid,
      ref_no,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: error.message,
    });
  }
};

export const mypurchases = async (req, res) => {
  const { userid } = req.body;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        o.orderid,
        o.ref_no,
        o.payment_method,
        o.quantity,
        o.total_amount,
        o.created_at AS order_date,

        -- PRODUCT
        p.productid,
        p.name AS product_name,
        p.description AS product_description,
        p.price,

        -- PRODUCT IMAGES
        (
          SELECT JSON_ARRAYAGG(pi.image)
          FROM product_images pi
          WHERE pi.productid = p.productid
        ) AS product_images,

        -- ORDER STATUS (latest)
        (
          SELECT os.status
          FROM order_status os
          WHERE os.orderid = o.orderid
          ORDER BY os.created_at DESC
          LIMIT 1
        ) AS order_status,

        (
          SELECT os.description
          FROM order_status os
          WHERE os.orderid = o.orderid
          ORDER BY os.created_at DESC
          LIMIT 1
        ) AS order_status_description,

        -- ADDRESS
        a.addressid,
        a.street,
        a.barangay,
        a.municipality,
        a.state,
        a.country,

        -- DELIVERY
        d.deliveryid,
        d.status AS delivery_status,

        -- DELIVERY TRACKER (latest)
        (
          SELECT dt.latitude
          FROM delivery_tracker dt
          WHERE dt.deliveryid = d.deliveryid
          ORDER BY dt.created_at DESC
          LIMIT 1
        ) AS latitude,

        (
          SELECT dt.longitude
          FROM delivery_tracker dt
          WHERE dt.deliveryid = d.deliveryid
          ORDER BY dt.created_at DESC
          LIMIT 1
        ) AS longitude,

        (
          SELECT dt.status
          FROM delivery_tracker dt
          WHERE dt.deliveryid = d.deliveryid
          ORDER BY dt.created_at DESC
          LIMIT 1
        ) AS tracker_status,

        -- CARRIER
        c.carrierid,
        CONCAT(c.firstname, ' ', c.lastname) AS rider_name,
        c.service AS rider_service

      FROM orders o
      JOIN products p ON p.productid = o.productid
      JOIN address a ON a.addressid = o.addressid
      LEFT JOIN delivery d ON d.orderid = o.orderid
      LEFT JOIN carriers c ON c.carrierid = d.riderid

      WHERE o.buyerid = ?
      ORDER BY o.created_at DESC
      `,
      [userid]
    );
    getIO().emit("order_update");
    return res.status(200).json({
      status: true,
      purchases: rows,
    });
  } catch (error) {
    console.error("mypurchases error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch purchases",
    });
  }
};
