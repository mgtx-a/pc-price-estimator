const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database directory if it doesn't exist
const fs = require('fs');
const serverDir = path.join(__dirname, 'server');
if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
}

const dbPath = path.join(serverDir, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log('Setting up database...');

db.serialize(() => {
  // Create PCs table
  db.run(`CREATE TABLE IF NOT EXISTS pcs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpu TEXT NOT NULL,
    gpu TEXT NOT NULL,
    ram INTEGER NOT NULL,
    storage INTEGER NOT NULL,
    storage_type TEXT NOT NULL,
    condition TEXT NOT NULL,
    age_years INTEGER NOT NULL,
    price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert comprehensive sample data
  const sampleData = [
    ['Intel i5-10400F', 'RTX 3060', 16, 500, 'SSD', 'Excellent', 2, 850],
    ['Intel i7-10700K', 'RTX 3070', 32, 1000, 'SSD', 'Good', 2, 1200],
    ['AMD Ryzen 5 3600', 'GTX 1660 Super', 16, 500, 'SSD', 'Good', 3, 600],
    ['Intel i5-9400F', 'RTX 2060', 16, 250, 'SSD', 'Fair', 4, 550],
    ['AMD Ryzen 7 3700X', 'RTX 3080', 32, 1000, 'SSD', 'Excellent', 1, 1800],
    ['Intel i3-10100F', 'GTX 1650', 8, 500, 'HDD', 'Good', 3, 350],
    ['AMD Ryzen 5 5600X', 'RTX 3070', 16, 1000, 'SSD', 'Excellent', 1, 1400],
    ['Intel i7-9700K', 'RTX 2070', 16, 500, 'SSD', 'Good', 3, 800],
    ['AMD Ryzen 3 3300X', 'GTX 1060', 16, 250, 'SSD', 'Fair', 4, 400],
    ['Intel i5-11400F', 'RTX 3060 Ti', 16, 500, 'SSD', 'Excellent', 1, 1000],
    ['AMD Ryzen 7 5700X', 'RTX 3080', 32, 1000, 'SSD', 'Good', 1, 1600],
    ['Intel i5-8400', 'GTX 1070', 16, 500, 'SSD', 'Good', 4, 500],
    ['AMD Ryzen 5 2600', 'RX 580', 16, 500, 'HDD', 'Fair', 5, 300],
    ['Intel i7-8700K', 'RTX 2080', 32, 1000, 'SSD', 'Good', 3, 900],
    ['AMD Ryzen 9 3900X', 'RTX 3090', 32, 1000, 'SSD', 'Excellent', 1, 2200],
    ['Intel i5-7500', 'GTX 1050 Ti', 8, 250, 'HDD', 'Fair', 6, 250],
    ['AMD Ryzen 5 3400G', 'Integrated', 16, 500, 'SSD', 'Good', 3, 280],
    ['Intel i7-6700K', 'GTX 1080', 16, 500, 'SSD', 'Fair', 6, 450],
    ['AMD Ryzen 7 2700X', 'RX 6600', 16, 500, 'SSD', 'Good', 4, 550],
    ['Intel i5-12400F', 'RTX 3070', 16, 1000, 'SSD', 'Excellent', 1, 1300],
    ['Intel i7-11700K', 'RTX 3080', 32, 1000, 'SSD', 'Excellent', 1, 1700],
    ['AMD Ryzen 5 4600G', 'Integrated', 16, 500, 'SSD', 'Good', 2, 320],
    ['Intel i5-10600K', 'RTX 2070 Super', 16, 500, 'SSD', 'Good', 3, 750],
    ['AMD Ryzen 7 3800X', 'RTX 2080 Ti', 32, 1000, 'SSD', 'Good', 3, 1100],
    ['Intel i3-12100F', 'GTX 1660', 16, 500, 'SSD', 'Excellent', 1, 450],
    ['AMD Ryzen 5 5500', 'RTX 3060', 16, 500, 'SSD', 'Good', 1, 700],
    ['Intel i7-12700K', 'RTX 3070 Ti', 32, 1000, 'SSD', 'Excellent', 1, 1500],
    ['AMD Ryzen 9 5900X', 'RTX 3080 Ti', 32, 1000, 'SSD', 'Excellent', 1, 2000],
    ['Intel i5-9600K', 'GTX 1660 Ti', 16, 500, 'SSD', 'Good', 4, 480],
    ['AMD Ryzen 3 4300G', 'Integrated', 8, 250, 'SSD', 'Good', 2, 200],
    ['Intel i7-10700F', 'RTX 2060 Super', 16, 1000, 'SSD', 'Good', 3, 700],
    ['AMD Ryzen 5 3500X', 'GTX 1070 Ti', 16, 500, 'SSD', 'Fair', 4, 420],
    ['Intel i5-11600K', 'RTX 3060 Ti', 16, 500, 'SSD', 'Excellent', 1, 950],
    ['AMD Ryzen 7 5700G', 'Integrated', 32, 1000, 'SSD', 'Excellent', 1, 450],
    ['Intel i9-10900K', 'RTX 3090', 32, 1000, 'SSD', 'Good', 2, 2100],
    ['AMD Ryzen 5 2600X', 'RX 5700 XT', 16, 500, 'SSD', 'Good', 4, 520],
    ['Intel i5-8600K', 'GTX 1080 Ti', 16, 500, 'SSD', 'Fair', 5, 480],
    ['AMD Ryzen 9 5950X', 'RTX 4080', 64, 2000, 'SSD', 'Excellent', 1, 2800],
    ['Intel i3-10105F', 'GTX 1050', 8, 250, 'HDD', 'Fair', 3, 220],
    ['AMD Ryzen 7 2700', 'RX 580', 32, 500, 'HDD', 'Good', 5, 380],
    ['Intel i7-9700F', 'RTX 2060', 16, 500, 'SSD', 'Good', 3, 650]
  ];

  db.get("SELECT COUNT(*) as count FROM pcs", (err, row) => {
    if (!err && row.count === 0) {
      const stmt = db.prepare(`INSERT INTO pcs (cpu, gpu, ram, storage, storage_type, condition, age_years, price) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      
      sampleData.forEach(data => {
        stmt.run(data);
      });
      stmt.finalize();
      console.log(`Inserted ${sampleData.length} sample PCs into database`);
    } else {
      console.log('Database already contains data, skipping sample data insertion');
    }
    
    console.log('Database setup complete!');
    db.close();
  });
});

console.log('Database created at:', dbPath);