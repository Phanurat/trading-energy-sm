const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const contractsRoutes = require('./routes/contracts');

const app = express();

// ตั้งค่า body parser
app.use(express.json());

// ตั้งค่า static files
app.use(express.static(path.join(__dirname, 'public')));

// ใช้ routes สำหรับ contracts
app.use('/api', contractsRoutes);

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
  host: 'db', // ใช้ชื่อ service ของ MySQL ที่กำหนดใน docker-compose.yml
  user: 'admin',
  password: '1111',
  database: 'database_contracts',
  port: 3306
});

// ทดสอบการเชื่อมต่อฐานข้อมูล
db.connect((err) => {
  if (err) {
    console.error('การเชื่อมต่อฐานข้อมูลล้มเหลว:', err);
  } else {
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
  }
});

// เริ่มต้นเซิร์ฟเวอร์
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
