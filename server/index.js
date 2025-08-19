const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Initialize database and sample data
const initializeDatabase = () => {
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

    // Insert sample data
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
      ['AMD Ryzen 3 4300G', 'Integrated', 8, 250, 'SSD', 'Good', 2, 200]
    ];

    db.get("SELECT COUNT(*) as count FROM pcs", (err, row) => {
      if (!err && row.count === 0) {
        const stmt = db.prepare(`INSERT INTO pcs (cpu, gpu, ram, storage, storage_type, condition, age_years, price) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        
        sampleData.forEach(data => {
          stmt.run(data);
        });
        stmt.finalize();
        console.log('Sample data inserted successfully');
      }
    });
  });
};

// CPU scoring function
const getCpuScore = (cpu) => {
  const cpuScores = {
    'i3': 30, 'i5': 50, 'i7': 70, 'i9': 90,
    'ryzen 3': 35, 'ryzen 5': 55, 'ryzen 7': 75, 'ryzen 9': 95
  };
  
  const lowerCpu = cpu.toLowerCase();
  for (const [key, score] of Object.entries(cpuScores)) {
    if (lowerCpu.includes(key)) {
      return score;
    }
  }
  return 40; // default
};

// GPU scoring function
const getGpuScore = (gpu) => {
  const gpuScores = {
    'integrated': 5, 'gtx 1050': 15, 'gtx 1060': 25, 'gtx 1070': 35, 
    'gtx 1080': 45, 'gtx 1650': 20, 'gtx 1660': 30, 'rtx 2060': 40,
    'rtx 2070': 50, 'rtx 2080': 60, 'rtx 3060': 55, 'rtx 3070': 70,
    'rtx 3080': 85, 'rtx 3090': 100, 'rx 580': 25, 'rx 6600': 45
  };
  
  const lowerGpu = gpu.toLowerCase();
  for (const [key, score] of Object.entries(gpuScores)) {
    if (lowerGpu.includes(key)) {
      return score;
    }
  }
  return 30; // default
};

// Condition multiplier
const getConditionMultiplier = (condition) => {
  const multipliers = {
    'excellent': 1.0,
    'good': 0.85,
    'fair': 0.7,
    'poor': 0.5
  };
  return multipliers[condition.toLowerCase()] || 0.8;
};

// Storage type multiplier
const getStorageMultiplier = (storageType) => {
  return storageType.toLowerCase() === 'ssd' ? 1.1 : 1.0;
};

// Simple price prediction function
const predictPrice = (cpu, gpu, ram, storage, storageType, condition, age) => {
  const cpuScore = getCpuScore(cpu);
  const gpuScore = getGpuScore(gpu);
  const conditionMult = getConditionMultiplier(condition);
  const storageMult = getStorageMultiplier(storageType);
  const ageFactor = Math.max(0.3, 1 - (age * 0.15));

  const basePrice = (cpuScore * 10) + (gpuScore * 15) + (ram * 3) + (storage * 0.8);
  const adjustedPrice = basePrice * conditionMult * storageMult * ageFactor;
  
  return Math.max(100, Math.round(adjustedPrice));
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PC Price Estimator API is running' });
});

// Get all PCs
app.get('/api/pcs', (req, res) => {
  db.all("SELECT * FROM pcs ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new PC
app.post('/api/pcs', (req, res) => {
  const { cpu, gpu, ram, storage, storage_type, condition, age_years, price } = req.body;
  
  const stmt = db.prepare(`INSERT INTO pcs (cpu, gpu, ram, storage, storage_type, condition, age_years, price) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  
  stmt.run([cpu, gpu, ram, storage, storage_type, condition, age_years, price], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'PC added successfully' });
  });
  stmt.finalize();
});

// Predict price
app.post('/api/predict', (req, res) => {
  try {
    const { cpu, gpu, ram, storage, storage_type, condition, age_years } = req.body;
    
    console.log('Prediction request:', { cpu, gpu, ram, storage, storage_type, condition, age_years });
    
    const predictedPrice = predictPrice(cpu, gpu, ram, storage, storage_type, condition, age_years);
    
    console.log('Predicted price:', predictedPrice);
    
    // Get similar PCs for comparison
    db.all(`SELECT * FROM pcs WHERE 
            ram BETWEEN ? AND ? AND
            storage BETWEEN ? AND ? AND
            age_years BETWEEN ? AND ?
            ORDER BY ABS(price - ?) LIMIT 5`, 
           [ram * 0.8, ram * 1.2, storage * 0.8, storage * 1.2, 
            Math.max(0, age_years - 1), age_years + 1, predictedPrice], 
           (err, similarPcs) => {
      if (err) {
        console.error('Error finding similar PCs:', err);
      }
      
      res.json({
        predicted_price: predictedPrice,
        similar_pcs: similarPcs || [],
        confidence: 'Medium',
        price_range: {
          min: Math.round(predictedPrice * 0.85),
          max: Math.round(predictedPrice * 1.15)
        }
      });
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      error: 'Prediction failed', 
      details: error.message
    });
  }
});

// Get market trends
app.get('/api/trends', (req, res) => {
  db.all(`SELECT 
            AVG(price) as avg_price,
            COUNT(*) as count,
            condition,
            age_years
          FROM pcs 
          GROUP BY condition, age_years
          ORDER BY age_years`, (err, trends) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(trends);
  });
});

// Initialize everything
const startServer = () => {
  initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();