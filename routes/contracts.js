const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// เชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: 'db', // ใช้ชื่อ service ของ MySQL
  user: 'admin',
  password: '1111',
  database: 'database_contracts',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('การเชื่อมต่อฐานข้อมูลล้มเหลว:', err);
  } else {
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
  }
});

// ดึงข้อมูล contracts ทั้งหมด
router.get('/contracts', (req, res) => {
  db.query('SELECT * FROM contracts ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// เพิ่มข้อมูล contract ใหม่
router.post('/contracts', (req, res) => {
  const { id_contracts } = req.body;

  if (!id_contracts) {
    return res.status(400).json({ error: 'กรุณาระบุ id_contracts' });
  }

  db.query('INSERT INTO contracts (id_contracts) VALUES (?)', [id_contracts], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.status(201).json({ message: 'บันทึก Smart Contract สำเร็จ' });
  });
});

module.exports = router;
