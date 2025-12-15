import { stat } from "fs";
import pool from "../db.js";
import { getIO } from "../socket.js";
import { v4 as uuidv4 } from "uuid";

// Show products of a specific user
export const showproduct = async (req, res) => {
  const { userid } = req.body;
  try {
    const [products] = await pool.query(
      `SELECT 
          p.*,
          COALESCE(JSON_ARRAYAGG(i.image), JSON_ARRAY()) AS images
       FROM products p
       LEFT JOIN product_images i ON p.productid = i.productid
       WHERE p.userid = ?
       GROUP BY p.productid
       ORDER BY p.created_at DESC`,
      [userid]
    );

    if (products.length > 0) {
      res.status(200).json({ message: "Has product", products });
    } else {
      res.status(200).json({ message: "No products", products: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Display all active products publicly
export const publicdisplay = async (req, res) => {
  const { userid } = req.body;

  try {
    let products;
    if (userid) {
      [products] = await pool.query(
        `SELECT 
          p.*,
          COALESCE(JSON_ARRAYAGG(i.image), JSON_ARRAY()) AS images,
          CASE WHEN c.productid IS NULL THEN 0 ELSE 1 END AS in_cart
        FROM products p
        LEFT JOIN product_images i ON p.productid = i.productid
        LEFT JOIN carts c ON p.productid = c.productid AND c.userid = ?
        GROUP BY p.productid
        ORDER BY p.created_at DESC`,
        [userid]
      );
    } else {
      [products] = await pool.query(
        `SELECT 
          p.*,
          COALESCE(JSON_ARRAYAGG(i.image), JSON_ARRAY()) AS images
        FROM products p
        LEFT JOIN product_images i ON p.productid = i.productid
        GROUP BY p.productid
        ORDER BY p.created_at DESC`
      );
    }

    if (products.length > 0) {
      res.status(200).json({ message: "Has product", products });
    } else {
      res.status(200).json({ message: "No products", products: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a product with images
export const addproduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      userid,
      name,
      description,
      price,
      quantity,
      valid_from,
      valid_to,
      status,
      category,
    } = req.body;

    if (!userid || !name || !description || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const productid = uuidv4();

    await connection.query(
      `INSERT INTO products 
       (productid, userid, name, description, quantity, price, valid_from, valid_to, status, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productid,
        userid,
        name,
        description,
        quantity || 0,
        price,
        valid_from || null,
        valid_to || null,
        status || "ACTIVE",
        category || "general",
      ]
    );

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await connection.query(
          `INSERT INTO product_images (product_imagesid, productid, image) VALUES (?, ?, ?)`,
          [uuidv4(), productid, file.filename]
        );
      }
    }

    await connection.commit();
    getIO().emit("product_updated");
    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// View a specific product
export const viewproduct = async (req, res) => {
  try {
    const { productid, userid } = req.body;

    if (!productid) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const [rows] = await pool.query(
      `SELECT 
          p.productid,
          p.userid AS sellerid,
          p.name,
          p.description,
          p.quantity,
          p.price,
          p.valid_from,
          p.valid_to,
          p.status,
          p.category,
          p.created_at,
          u.firstname,
          u.lastname,
          u.middlename,
          u.avatar,
          i.image,
          CASE WHEN c.productid IS NULL THEN 0 ELSE 1 END AS in_cart,
          CASE WHEN l.likesid IS NULL THEN 0 ELSE 1 END AS in_liked
       FROM products p
       INNER JOIN users u ON p.userid = u.userid
       LEFT JOIN product_images i ON p.productid = i.productid
       LEFT JOIN carts c ON p.productid = c.productid AND c.userid = ?
       LEFT JOIN likes l ON p.productid = l.productid AND l.userid = ?
       WHERE p.productid = ?`,
      [userid, userid, productid]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Product not found", product: null });
    }

    const seller = {
      userid: rows[0].sellerid,
      firstname: rows[0].firstname,
      lastname: rows[0].lastname,
      middlename: rows[0].middlename,
      avatar: rows[0].avatar,
    };

    const product = {
      productid: rows[0].productid,
      name: rows[0].name,
      description: rows[0].description,
      quantity: rows[0].quantity,
      price: rows[0].price,
      valid_from: rows[0].valid_from,
      valid_to: rows[0].valid_to,
      status: rows[0].status,
      category: rows[0].category,
      created_at: rows[0].created_at,
      in_cart: rows[0].in_cart,
      in_liked: rows[0].in_liked,
      images: rows.map((r) => r.image).filter((img) => img !== null),
    };
    return res
      .status(200)
      .json({ message: "Product retrieved successfully", product, seller });
  } catch (error) {
    console.error("View Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get store data
export const storedata = async (req, res) => {
  try {
    const { userid } = req.body;

    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const [rows] = await pool.query(
      `SELECT 
        u.userid,
        u.firstname,
        u.lastname,
        u.avatar,
        p.productid,
        p.name AS product_name,
        p.description,
        p.quantity,
        p.price,
        p.status,
        p.category,
        pi.product_imagesid,
        pi.image
      FROM users u
      LEFT JOIN products p ON u.userid = p.userid
      LEFT JOIN product_images pi ON p.productid = pi.productid
      WHERE u.userid = ?
      ORDER BY p.created_at DESC`,
      [userid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const user = {
      userid: rows[0].userid,
      firstname: rows[0].firstname,
      lastname: rows[0].lastname,
      avatar: rows[0].avatar,
    };

    const productMap = {};
    rows.forEach((row) => {
      if (!row.productid) return;

      if (!productMap[row.productid]) {
        productMap[row.productid] = {
          productid: row.productid,
          name: row.product_name,
          description: row.description,
          quantity: row.quantity,
          price: row.price,
          status: row.status,
          category: row.category,
          images: [],
        };
      }

      if (row.image) {
        productMap[row.productid].images.push({
          product_imagesid: row.product_imagesid,
          image: row.image,
        });
      }
    });

    const products = Object.values(productMap);

    getIO().emit("product_updated");
    return res
      .status(200)
      .json({ message: "Store data loaded", user, products });
  } catch (error) {
    console.error("Storedata Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cart controller
export const addtocart = async (req, res) => {
  const { productid, userid } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM carts WHERE userid=? AND productid=?",
      [userid, productid]
    );

    if (existing.length > 0) {
      await pool.query("DELETE FROM carts WHERE userid=? AND productid=?", [
        userid,
        productid,
      ]);
      return res.json({ message: "Removed from cart", in_cart: 0 });
    }

    await pool.query(
      "INSERT INTO carts (cartid, userid, productid, status) VALUES (UUID(), ?, ?, 'PENDING')",
      [userid, productid]
    );
    getIO().emit("product_updated");
    return res.json({ message: "Added to cart", in_cart: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Likes controller
export const likedproduct = async (req, res) => {
  const { productid, userid } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM likes WHERE userid=? AND productid=?",
      [userid, productid]
    );

    if (existing.length > 0) {
      await pool.query("DELETE FROM likes WHERE userid=? AND productid=?", [
        userid,
        productid,
      ]);
      return res.json({ message: "Unliked", in_liked: 0 });
    }

    await pool.query(
      "INSERT INTO likes (likesid, userid, productid) VALUES (UUID(), ?, ?)",
      [userid, productid]
    );
    getIO().emit("product_updated");
    return res.json({ message: "Liked", in_liked: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const productdata = async (req, res) => {
  const { productid } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT 
      p.productid,
      p.userid,
      p.name,
      p.description,
      p.quantity,
      p.price,
      p.valid_from,
      p.valid_to,
      p.status,
      p.category,
      p.created_at,

      -- Images (separate aggregation)
      (
        SELECT COALESCE(JSON_ARRAYAGG(pi.image), JSON_ARRAY())
        FROM product_images pi
        WHERE pi.productid = p.productid
      ) AS images,

      -- Orders (separate aggregation)
      (
        SELECT COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'orderid', o.orderid,
              'buyerid', o.buyerid,
              'buyer', (
                SELECT JSON_OBJECT(
                  'userid', u.userid,
                  'firstname', u.firstname,
                  'lastname', u.lastname,
                  'avatar', u.avatar,
                  'email', u.email
                )
                FROM users u
                WHERE u.userid = o.buyerid
              ),
              'addressid', o.addressid,
              'address', (
                SELECT JSON_OBJECT(
                  'addressid', a.addressid,
                  'street', a.street,
                  'barangay', a.barangay,
                  'municipality', a.municipality,
                  'state', a.state,
                  'country', a.country,
                  'status', a.status
                )
                FROM address a
                WHERE a.addressid = o.addressid
              ),
              'description', o.description,
              'ref_no', o.ref_no,
              'payment_method', o.payment_method,
              'quantity', o.quantity,
              'total_amount', o.total_amount,
              'created_at', o.created_at,
              'order_stats', (
                SELECT COALESCE(
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'order_statusid', os.order_statusid,
                      'description', os.description,
                      'status', os.status,
                      'created_at', os.created_at
                    )
                  ),
                  JSON_ARRAY()
                )
                FROM order_status os
                WHERE os.orderid = o.orderid
              )
            )
          ),
          JSON_ARRAY()
        )
        FROM orders o
        WHERE o.productid = p.productid
      ) AS orders

   FROM products p
   WHERE p.productid = ?`,
      [productid]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(rows[0]); // Send the product with images, orders, and statuses
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const order_bulk_action = async (req, res) => {
  const { orders, status } = req.body;

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ message: "Orders array is required" });
  }

  try {
    await Promise.all(
      orders.map((orderid) =>
        pool.query(
          `UPDATE order_status 
           SET status = ?, created_at = NOW()
           WHERE orderid = ?`,
          [status, orderid]
        )
      )
    );
    getIO().emit("product_updated");
    res.status(200).json({
      message: "Orders approved successfully",
      approved_count: orders.length,
    });
  } catch (error) {
    console.error("Approve bulk orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const showcase = async (req, res) => {
  const { userid } = req.body;
  try {
    const [products] = await pool.query(
      `SELECT 
         p.*,
         COALESCE(
           (SELECT JSON_ARRAYAGG(pi.image)
            FROM product_images pi
            WHERE pi.productid = p.productid),
           JSON_ARRAY()
         ) AS images
       FROM products p
       WHERE p.userid = ?`,
      [userid]
    );

    res.json({ success: true, products: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  } finally {
  }
};



