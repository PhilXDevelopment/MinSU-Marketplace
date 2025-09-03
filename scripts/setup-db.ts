import initializeDatabase from "../lib/init-db"

async function main() {
  try {
    await initializeDatabase()
    console.log("Database setup complete")
    process.exit(0)
  } catch (error) {
    console.error("Database setup failed:", error)
    process.exit(1)
  }
}

main()
