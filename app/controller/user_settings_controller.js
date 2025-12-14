import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

// Get addresses
export const getAddress = async (req, res) => {
  try {
    const { userid } = req.body;
    if (!userid) return res.status(400).json({ message: "User ID required" });

    const [rows] = await pool.query("SELECT * FROM address WHERE userid = ?", [
      userid,
    ]);
    res.json({ address: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add address
export const addAddress = async (req, res) => {
  try {
    const { userid, street, barangay, municipality, state, country, status } =
      req.body;
    if (!userid || !street || !barangay || !municipality || !state || !country)
      return res.status(400).json({ message: "All fields required" });

    const addressid = uuidv4();
    await pool.query(
      `INSERT INTO address 
      (addressid, userid, street, barangay, municipality, state, country, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        addressid,
        userid,
        street,
        barangay,
        municipality,
        state,
        country,
        status,
      ]
    );

    res.status(201).json({ message: "Address added", addressid });
  } catch (err) {
    console.error(err); // <-- check what this prints
    res.status(500).json({ message: "Server error" });
  }
};

