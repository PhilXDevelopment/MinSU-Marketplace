import mysql from 'mysql2/promise';

// create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // your password
    database: 'marketplace', // make sure this database exists
});

export default pool;