import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Activity } from 'lucide-react';

const INITIAL_POLL_DATA = [
  { time: '08:00', CandidateA: 40, CandidateB: 45 },
  { time: '10:00', CandidateA: 42, CandidateB: 44 },
  { time: '12:00', CandidateA: 45, CandidateB: 43 },
  { time: '14:00', CandidateA: 47, CandidateB: 46 },
  { time: '16:00', CandidateA: 48, CandidateB: 47 },
];

const DEMOGRAPHICS_DATA = [
  { name: '18-24', value: 15 },
  { name: '25-40', value: 35 },
  { name: '41-60', value: 30 },
  { name: '60+', value: 20 },
];

const REGIONAL_DATA = [
  { region: 'North', turnout: 65 },
  { region: 'South', turnout: 72 },
  { region: 'East', turnout: 58 },
  { region: 'West', turnout: 80 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#34d399', '#f87171', '#fbbf24'];

export default function DashboardView({ userState, setUserState, dict }) {
  const [pollData, setPollData] = useState(INITIAL_POLL_DATA);
  const [turnout, setTurnout] = useState(64.2);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPollData(prev => {
        const newData = [...prev];
        const last = newData[newData.length - 1];
        
        // Randomly adjust the last data point slightly to simulate live changes
        newData[newData.length - 1] = {
          ...last,
          CandidateA: Math.max(30, Math.min(60, last.CandidateA + (Math.random() - 0.5) * 2)),
          CandidateB: Math.max(30, Math.min(60, last.CandidateB + (Math.random() - 0.5) * 2))
        };
        return newData;
      });

      setTurnout(prev => +(prev + (Math.random() - 0.2) * 0.5).toFixed(1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-content dashboard-view">
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">{dict?.dashboard || 'Live Dashboard'}</h2>
          <p className="page-subtitle">Real-time simulation of polling and voter turnout data.</p>
        </div>
        <div className="live-indicator">
          <Activity size={18} className="pulse-icon" />
          <span>Live Updates</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card main-chart">
          <h3>Polling Trends (Simulated)</h3>
          <div className="chart-container" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pollData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" domain={[20, 70]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="CandidateA" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="CandidateB" stroke="var(--accent-secondary)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-card stat-card">
            <h3>National Turnout</h3>
            <div className="stat-value">{turnout}%</div>
            <p className="stat-desc">+2.4% higher than last election</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Voter Demographics</h3>
            <div className="chart-container" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEMOGRAPHICS_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {DEMOGRAPHICS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Regional Turnout</h3>
            <div className="chart-container" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REGIONAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="region" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                  <Bar dataKey="turnout" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
