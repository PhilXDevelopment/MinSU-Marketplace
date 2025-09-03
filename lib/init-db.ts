import sql from "./db"
import fs from "fs"
import path from "path"

async function initializeDatabase() {
  try {
    console.log("Initializing database...")

    // Read schema file
    const schemaPath = path.join(process.cwd(), "lib", "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    // Execute schema
    await sql.query(schema)
    console.log("Schema created successfully")

    // Check if we need to seed the database
    const userCount = await sql`SELECT COUNT(*) FROM users`

    if (Number.parseInt(userCount[0].count) === 0) {
      console.log("Seeding database...")

      // Read seed file
      const seedPath = path.join(process.cwd(), "lib", "seed.sql")
      const seed = fs.readFileSync(seedPath, "utf8")

      // Execute seed
      await sql.query(seed)
      console.log("Database seeded successfully")
    } else {
      console.log("Database already has data, skipping seed")
    }

    console.log("Database initialization complete")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

export default initializeDatabase
