import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Computer, DollarSign, TrendingUp, Database, Cpu, HardDrive, Zap, Calendar } from 'lucide-react';
import './App.css';

const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';

function App() {
  const [activeTab, setActiveTab] = useState('estimate');
  const [formData, setFormData] = useState({
    cpu: 'Intel i5-10400F',
    gpu: 'RTX 3060',
    ram: 16,
    storage: 500,
    storage_type: 'SSD',
    condition: 'Good',
    age_years: 2
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pcs, setPcs] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    fetchPcs();
    fetchTrends();
  }, []);

  const fetchPcs = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/pcs`);
      setPcs(response.data);
    } catch (error) {
      console.error('Error fetching PCs:', error);
    }
  };

  const fetchTrends = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/trends`);
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ram' || name === 'storage' || name === 'age_years' ? parseInt(value) : value
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Making prediction request to:', `${API_BASE}/api/predict`);
    console.log('Request data:', formData);
    
    try {
      const response = await axios.post(`${API_BASE}/api/predict`, formData);
      console.log('Success! Response:', response.data);
      setPrediction(response.data);
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.response) {
        // Server responded with error
        errorMessage = `Server Error (${error.response.status}): ${error.response.data?.error || error.response.data?.details || 'Unknown server error'}`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = 'Cannot connect to server. Make sure backend is running on port 5001.';
      } else {
        // Something else happened
        errorMessage = error.message;
      }
      
      alert(`Prediction Error: ${errorMessage}\n\nCheck browser console (F12) for more details.`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPc = async (e) => {
    e.preventDefault();
    const price = prompt('Enter the actual selling price for this PC:');
    if (!price || isNaN(price)) return;

    try {
      await axios.post(`${API_BASE}/api/pcs`, {
        ...formData,
        price: parseFloat(price)
      });
      alert('PC added successfully!');
      fetchPcs();
      fetchTrends();
    } catch (error) {
      console.error('Error adding PC:', error);
      alert('Error adding PC. Please try again.');
    }
  };

  const renderEstimateTab = () => (
    <div className="tab-content">
      <div className="estimate-container">
        <div className="form-section">
          <div className="card">
            <div className="card-header">
              <Computer className="icon" />
              <h2>PC Specifications</h2>
            </div>
            <form onSubmit={handlePredict} className="pc-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <Cpu className="icon" />
                    CPU
                  </label>
                  <select name="cpu" value={formData.cpu} onChange={handleInputChange}>
                    <option value="Intel i3-10100F">Intel i3-10100F</option>
                    <option value="Intel i5-10400F">Intel i5-10400F</option>
                    <option value="Intel i5-11400F">Intel i5-11400F</option>
                    <option value="Intel i5-12400F">Intel i5-12400F</option>
                    <option value="Intel i7-10700K">Intel i7-10700K</option>
                    <option value="Intel i7-9700K">Intel i7-9700K</option>
                    <option value="Intel i7-8700K">Intel i7-8700K</option>
                    <option value="AMD Ryzen 3 3300X">AMD Ryzen 3 3300X</option>
                    <option value="AMD Ryzen 5 2600">AMD Ryzen 5 2600</option>
                    <option value="AMD Ryzen 5 3600">AMD Ryzen 5 3600</option>
                    <option value="AMD Ryzen 5 5600X">AMD Ryzen 5 5600X</option>
                    <option value="AMD Ryzen 7 3700X">AMD Ryzen 7 3700X</option>
                    <option value="AMD Ryzen 7 5700X">AMD Ryzen 7 5700X</option>
                    <option value="AMD Ryzen 9 3900X">AMD Ryzen 9 3900X</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <Zap className="icon" />
                    GPU
                  </label>
                  <select name="gpu" value={formData.gpu} onChange={handleInputChange}>
                    <option value="Integrated">Integrated Graphics</option>
                    <option value="GTX 1050 Ti">GTX 1050 Ti</option>
                    <option value="GTX 1060">GTX 1060</option>
                    <option value="GTX 1070">GTX 1070</option>
                    <option value="GTX 1080">GTX 1080</option>
                    <option value="GTX 1650">GTX 1650</option>
                    <option value="GTX 1660 Super">GTX 1660 Super</option>
                    <option value="RTX 2060">RTX 2060</option>
                    <option value="RTX 2070">RTX 2070</option>
                    <option value="RTX 2080">RTX 2080</option>
                    <option value="RTX 3060">RTX 3060</option>
                    <option value="RTX 3060 Ti">RTX 3060 Ti</option>
                    <option value="RTX 3070">RTX 3070</option>
                    <option value="RTX 3080">RTX 3080</option>
                    <option value="RTX 3090">RTX 3090</option>
                    <option value="RX 580">RX 580</option>
                    <option value="RX 6600">RX 6600</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>RAM (GB)</label>
                  <select name="ram" value={formData.ram} onChange={handleInputChange}>
                    <option value={8}>8 GB</option>
                    <option value={16}>16 GB</option>
                    <option value={32}>32 GB</option>
                    <option value={64}>64 GB</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <HardDrive className="icon" />
                    Storage (GB)
                  </label>
                  <select name="storage" value={formData.storage} onChange={handleInputChange}>
                    <option value={250}>250 GB</option>
                    <option value={500}>500 GB</option>
                    <option value={1000}>1000 GB (1TB)</option>
                    <option value={2000}>2000 GB (2TB)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Storage Type</label>
                  <select name="storage_type" value={formData.storage_type} onChange={handleInputChange}>
                    <option value="SSD">SSD</option>
                    <option value="HDD">HDD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleInputChange}>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <Calendar className="icon" />
                    Age (Years)
                  </label>
                  <select name="age_years" value={formData.age_years} onChange={handleInputChange}>
                    <option value={0}>Brand New</option>
                    <option value={1}>1 Year</option>
                    <option value={2}>2 Years</option>
                    <option value={3}>3 Years</option>
                    <option value={4}>4 Years</option>
                    <option value={5}>5 Years</option>
                    <option value={6}>6+ Years</option>
                  </select>
                </div>
              </div>

              <div className="button-group">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Calculating...' : 'Estimate Price'}
                </button>
                <button type="button" onClick={handleAddPc} className="btn-secondary">
                  Add to Database
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="result-section">
          {prediction && (
            <div className="card prediction-card">
              <div className="card-header">
                <DollarSign className="icon" />
                <h2>Price Estimate</h2>
              </div>
              <div className="prediction-content">
                <div className="main-price">
                  ${prediction.predicted_price}
                </div>
                <div className="price-range">
                  Range: ${prediction.price_range.min} - ${prediction.price_range.max}
                </div>
                <div className="confidence">
                  Confidence: {prediction.confidence}
                </div>
                
                {prediction.similar_pcs.length > 0 && (
                  <div className="similar-pcs">
                    <h3>Similar PCs in Database:</h3>
                    <div className="similar-list">
                      {prediction.similar_pcs.slice(0, 3).map((pc, index) => (
                        <div key={index} className="similar-item">
                          <div className="pc-specs">
                            {pc.cpu} • {pc.gpu} • {pc.ram}GB RAM
                          </div>
                          <div className="pc-price">${pc.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDatabaseTab = () => (
    <div className="tab-content">
      <div className="card">
        <div className="card-header">
          <Database className="icon" />
          <h2>PC Database ({pcs.length} entries)</h2>
        </div>
        <div className="database-content">
          <div className="table-container">
            <table className="pc-table">
              <thead>
                <tr>
                  <th>CPU</th>
                  <th>GPU</th>
                  <th>RAM</th>
                  <th>Storage</th>
                  <th>Condition</th>
                  <th>Age</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {pcs.map((pc) => (
                  <tr key={pc.id}>
                    <td>{pc.cpu}</td>
                    <td>{pc.gpu}</td>
                    <td>{pc.ram}GB</td>
                    <td>{pc.storage}GB {pc.storage_type}</td>
                    <td>
                      <span className={`condition-badge ${pc.condition.toLowerCase()}`}>
                        {pc.condition}
                      </span>
                    </td>
                    <td>{pc.age_years}y</td>
                    <td className="price">${pc.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => {
    const priceByAge = trends.reduce((acc, trend) => {
      const existing = acc.find(item => item.age === trend.age_years);
      if (existing) {
        existing.avgPrice = (existing.avgPrice + trend.avg_price) / 2;
      } else {
        acc.push({
          age: trend.age_years,
          avgPrice: Math.round(trend.avg_price),
          count: trend.count
        });
      }
      return acc;
    }, []).sort((a, b) => a.age - b.age);

    const priceByCondition = trends.reduce((acc, trend) => {
      const existing = acc.find(item => item.condition === trend.condition);
      if (existing) {
        existing.avgPrice = (existing.avgPrice + trend.avg_price) / 2;
        existing.count += trend.count;
      } else {
        acc.push({
          condition: trend.condition,
          avgPrice: Math.round(trend.avg_price),
          count: trend.count
        });
      }
      return acc;
    }, []);

    return (
      <div className="tab-content">
        <div className="analytics-grid">
          <div className="card">
            <div className="card-header">
              <TrendingUp className="icon" />
              <h2>Price by Age</h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceByAge}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" label={{ value: 'Age (Years)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Average Price']} />
                  <Legend />
                  <Line type="monotone" dataKey="avgPrice" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <BarChart className="icon" />
              <h2>Price by Condition</h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceByCondition}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="condition" />
                  <YAxis label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Average Price']} />
                  <Legend />
                  <Bar dataKey="avgPrice" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card stats-card">
            <div className="card-header">
              <Database className="icon" />
              <h2>Market Statistics</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{pcs.length}</div>
                <div className="stat-label">Total PCs</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  ${Math.round(pcs.reduce((sum, pc) => sum + pc.price, 0) / pcs.length) || 0}
                </div>
                <div className="stat-label">Avg Price</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  ${Math.max(...pcs.map(pc => pc.price)) || 0}
                </div>
                <div className="stat-label">Highest Price</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  ${Math.min(...pcs.map(pc => pc.price)) || 0}
                </div>
                <div className="stat-label">Lowest Price</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Computer className="logo-icon" />
            <h1>PC Price Estimator</h1>
          </div>
          <p className="subtitle">AI-powered second-hand PC valuation</p>
        </div>
      </header>

      <nav className="tab-nav">
        <button 
          className={activeTab === 'estimate' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('estimate')}
        >
          <DollarSign className="icon" />
          Price Estimate
        </button>
        <button 
          className={activeTab === 'database' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('database')}
        >
          <Database className="icon" />
          Database
        </button>
        <button 
          className={activeTab === 'analytics' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('analytics')}
        >
          <TrendingUp className="icon" />
          Analytics
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'estimate' && renderEstimateTab()}
        {activeTab === 'database' && renderDatabaseTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </main>

      <footer className="app-footer">
        <p>© 2025 PC Price Estimator - Built with React & Machine Learning</p>
      </footer>
    </div>
  );
}

export default App;