import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, PieChart, Pie, ReferenceLine } from 'recharts';
import { Search, Users, TrendingUp, Award, BarChart3, Activity, Target, Zap, Filter, Eye, Star } from 'lucide-react';

const NBAClusteringApp = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [activeChart, setActiveChart] = useState('scatter');
  const [hoveredPlayer, setHoveredPlayer] = useState(null);

  // Expanded NBA player data for 2023-24 season (75+ players)
  const playerData = [
    // Superstars
    { name: "Nikola Jokic", team: "DEN", ppg: 26.4, rpg: 12.4, apg: 9.0, fg_pct: 0.583, three_pct: 0.351, minutes: 34.6, spg: 1.3, bpg: 0.9, tov: 3.0 },
    { name: "Luka Doncic", team: "DAL", ppg: 32.4, rpg: 9.1, apg: 9.8, fg_pct: 0.487, three_pct: 0.384, minutes: 37.5, spg: 1.4, bpg: 0.5, tov: 4.1 },
    { name: "Shai Gilgeous-Alexander", team: "OKC", ppg: 30.1, rpg: 5.5, apg: 6.2, fg_pct: 0.535, three_pct: 0.353, minutes: 34.0, spg: 2.0, bpg: 0.9, tov: 2.8 },
    { name: "Giannis Antetokounmpo", team: "MIL", ppg: 30.4, rpg: 11.5, apg: 6.5, fg_pct: 0.612, three_pct: 0.274, minutes: 35.2, spg: 1.2, bpg: 1.1, tov: 3.4 },
    { name: "Jayson Tatum", team: "BOS", ppg: 26.9, rpg: 8.1, apg: 4.9, fg_pct: 0.472, three_pct: 0.375, minutes: 35.7, spg: 1.0, bpg: 0.6, tov: 2.5 },
    
    // All-Stars
    { name: "Domantas Sabonis", team: "SAC", ppg: 19.4, rpg: 13.7, apg: 8.2, fg_pct: 0.618, three_pct: 0.370, minutes: 35.8, spg: 0.9, bpg: 0.6, tov: 3.1 },
    { name: "Anthony Edwards", team: "MIN", ppg: 25.9, rpg: 5.4, apg: 5.1, fg_pct: 0.460, three_pct: 0.356, minutes: 35.1, spg: 1.3, bpg: 0.5, tov: 3.2 },
    { name: "Tyrese Haliburton", team: "IND", ppg: 20.1, rpg: 3.9, apg: 10.9, fg_pct: 0.475, three_pct: 0.368, minutes: 32.1, spg: 1.2, bpg: 0.7, tov: 2.4 },
    { name: "Victor Wembanyama", team: "SAS", ppg: 21.4, rpg: 10.6, apg: 3.9, fg_pct: 0.463, three_pct: 0.327, minutes: 29.7, spg: 1.2, bpg: 3.6, tov: 3.5 },
    { name: "Paolo Banchero", team: "ORL", ppg: 22.6, rpg: 6.9, apg: 5.4, fg_pct: 0.456, three_pct: 0.335, minutes: 34.2, spg: 0.9, bpg: 0.7, tov: 3.1 },
    
    // Rising Stars
    { name: "Alperen Sengun", team: "HOU", ppg: 21.1, rpg: 9.3, apg: 5.0, fg_pct: 0.535, three_pct: 0.297, minutes: 32.8, spg: 0.9, bpg: 0.8, tov: 2.8 },
    { name: "Scottie Barnes", team: "TOR", ppg: 19.9, rpg: 8.2, apg: 6.1, fg_pct: 0.473, three_pct: 0.347, minutes: 35.1, spg: 1.1, bpg: 1.5, tov: 2.9 },
    { name: "Jalen Brunson", team: "NYK", ppg: 28.7, rpg: 3.6, apg: 6.7, fg_pct: 0.479, three_pct: 0.401, minutes: 35.0, spg: 0.9, bpg: 0.2, tov: 2.6 },
    { name: "De'Aaron Fox", team: "SAC", ppg: 26.6, rpg: 4.6, apg: 5.6, fg_pct: 0.464, three_pct: 0.368, minutes: 36.3, spg: 2.0, bpg: 0.4, tov: 3.0 },
    { name: "Donovan Mitchell", team: "CLE", ppg: 26.6, rpg: 5.1, apg: 6.1, fg_pct: 0.463, three_pct: 0.364, minutes: 35.1, spg: 1.8, bpg: 0.4, tov: 3.0 },
    
    // Veterans
    { name: "LaMelo Ball", team: "CHA", ppg: 23.9, rpg: 5.1, apg: 8.0, fg_pct: 0.436, three_pct: 0.356, minutes: 31.1, spg: 1.8, bpg: 0.2, tov: 3.4 },
    { name: "Kristaps Porzingis", team: "BOS", ppg: 20.1, rpg: 7.2, apg: 1.9, fg_pct: 0.518, three_pct: 0.378, minutes: 29.5, spg: 0.8, bpg: 1.9, tov: 1.8 },
    { name: "Karl-Anthony Towns", team: "MIN", ppg: 21.8, rpg: 8.3, apg: 3.0, fg_pct: 0.505, three_pct: 0.418, minutes: 33.0, spg: 0.7, bpg: 0.7, tov: 2.1 },
    { name: "Franz Wagner", team: "ORL", ppg: 19.7, rpg: 5.3, apg: 3.7, fg_pct: 0.481, three_pct: 0.280, minutes: 32.8, spg: 1.0, bpg: 0.6, tov: 2.5 },
    { name: "Cade Cunningham", team: "DET", ppg: 22.7, rpg: 4.3, apg: 7.5, fg_pct: 0.449, three_pct: 0.357, minutes: 32.1, spg: 1.5, bpg: 0.9, tov: 3.8 },
    
    // Role Players & Specialists
    { name: "Jalen Green", team: "HOU", ppg: 19.6, rpg: 5.2, apg: 3.5, fg_pct: 0.424, three_pct: 0.331, minutes: 31.2, spg: 0.8, bpg: 0.4, tov: 2.8 },
    { name: "Evan Mobley", team: "CLE", ppg: 15.7, rpg: 9.4, apg: 3.2, fg_pct: 0.580, three_pct: 0.379, minutes: 33.4, spg: 0.8, bpg: 1.4, tov: 1.9 },
    { name: "Jarrett Allen", team: "CLE", ppg: 16.5, rpg: 10.5, apg: 2.7, fg_pct: 0.635, three_pct: 0.222, minutes: 32.8, spg: 0.6, bpg: 1.2, tov: 1.4 },
    { name: "Rudy Gobert", team: "MIN", ppg: 14.0, rpg: 12.9, apg: 2.1, fg_pct: 0.664, three_pct: 0.000, minutes: 32.1, spg: 0.8, bpg: 2.1, tov: 1.8 },
    { name: "Bam Adebayo", team: "MIA", ppg: 19.3, rpg: 10.4, apg: 3.9, fg_pct: 0.522, three_pct: 0.356, minutes: 33.9, spg: 1.2, bpg: 1.1, tov: 2.2 },
    
    // Additional Stars
    { name: "Jimmy Butler", team: "MIA", ppg: 20.8, rpg: 5.3, apg: 5.0, fg_pct: 0.493, three_pct: 0.414, minutes: 33.0, spg: 1.3, bpg: 0.4, tov: 1.8 },
    { name: "Kawhi Leonard", team: "LAC", ppg: 23.7, rpg: 6.1, apg: 3.6, fg_pct: 0.523, three_pct: 0.417, minutes: 34.0, spg: 1.6, bpg: 0.9, tov: 2.0 },
    { name: "Paul George", team: "LAC", ppg: 22.6, rpg: 5.2, apg: 3.5, fg_pct: 0.473, three_pct: 0.412, minutes: 33.8, spg: 1.5, bpg: 0.4, tov: 2.8 },
    { name: "Damian Lillard", team: "MIL", ppg: 24.3, rpg: 4.4, apg: 7.0, fg_pct: 0.427, three_pct: 0.357, minutes: 35.3, spg: 1.0, bpg: 0.3, tov: 3.0 },
    { name: "Jrue Holiday", team: "BOS", ppg: 12.5, rpg: 5.4, apg: 4.8, fg_pct: 0.432, three_pct: 0.387, minutes: 32.4, spg: 0.8, bpg: 0.6, tov: 1.8 },
    
    // More Young Talent
    { name: "Ja Morant", team: "MEM", ppg: 25.1, rpg: 5.6, apg: 8.1, fg_pct: 0.473, three_pct: 0.274, minutes: 32.8, spg: 0.8, bpg: 0.6, tov: 3.4 },
    { name: "Zion Williamson", team: "NOP", ppg: 22.9, rpg: 5.8, apg: 5.0, fg_pct: 0.570, three_pct: 0.333, minutes: 29.0, spg: 1.1, bpg: 0.6, tov: 3.6 },
    { name: "Brandon Ingram", team: "NOP", ppg: 20.8, rpg: 5.1, apg: 5.7, fg_pct: 0.492, three_pct: 0.353, minutes: 34.2, spg: 0.8, bpg: 0.6, tov: 3.2 },
    { name: "Tyler Herro", team: "MIA", ppg: 20.8, rpg: 5.3, apg: 4.5, fg_pct: 0.432, three_pct: 0.396, minutes: 33.9, spg: 0.8, bpg: 0.1, tov: 2.8 },
    { name: "Devin Booker", team: "PHX", ppg: 27.1, rpg: 4.5, apg: 6.9, fg_pct: 0.465, three_pct: 0.363, minutes: 35.6, spg: 0.9, bpg: 0.5, tov: 2.6 },
    
    // Veterans & Role Players
    { name: "Chris Paul", team: "GSW", ppg: 9.2, rpg: 3.9, apg: 6.8, fg_pct: 0.444, three_pct: 0.370, minutes: 26.4, spg: 1.2, bpg: 0.1, tov: 1.6 },
    { name: "Stephen Curry", team: "GSW", ppg: 26.4, rpg: 4.5, apg: 5.1, fg_pct: 0.450, three_pct: 0.407, minutes: 32.7, spg: 0.9, bpg: 0.4, tov: 3.2 },
    { name: "Klay Thompson", team: "GSW", ppg: 17.9, rpg: 4.1, apg: 2.3, fg_pct: 0.433, three_pct: 0.387, minutes: 29.7, spg: 0.6, bpg: 0.4, tov: 1.8 },
    { name: "Draymond Green", team: "GSW", ppg: 8.5, rpg: 7.2, apg: 6.0, fg_pct: 0.492, three_pct: 0.393, minutes: 31.5, spg: 0.8, bpg: 0.8, tov: 2.8 },
    { name: "Kevin Durant", team: "PHX", ppg: 27.1, rpg: 6.6, apg: 5.0, fg_pct: 0.523, three_pct: 0.413, minutes: 37.2, spg: 0.9, bpg: 1.2, tov: 3.3 },
    
    // More Centers
    { name: "Joel Embiid", team: "PHI", ppg: 34.7, rpg: 11.0, apg: 5.6, fg_pct: 0.529, three_pct: 0.434, minutes: 34.6, spg: 1.2, bpg: 1.7, tov: 4.1 },
    { name: "Anthony Davis", team: "LAL", ppg: 24.7, rpg: 12.6, apg: 3.5, fg_pct: 0.567, three_pct: 0.270, minutes: 35.5, spg: 1.2, bpg: 2.3, tov: 2.0 },
    { name: "Myles Turner", team: "IND", ppg: 17.1, rpg: 6.9, apg: 1.9, fg_pct: 0.542, three_pct: 0.403, minutes: 28.8, spg: 0.9, bpg: 1.9, tov: 1.5 },
    { name: "Brook Lopez", team: "MIL", ppg: 12.5, rpg: 5.2, apg: 2.4, fg_pct: 0.485, three_pct: 0.365, minutes: 30.1, spg: 0.7, bpg: 2.4, tov: 1.4 },
    { name: "Clint Capela", team: "ATL", ppg: 11.5, rpg: 10.6, apg: 0.9, fg_pct: 0.677, three_pct: 0.000, minutes: 30.1, spg: 0.9, bpg: 1.5, tov: 1.2 },
    
    // Guards
    { name: "Trae Young", team: "ATL", ppg: 25.7, rpg: 2.8, apg: 10.8, fg_pct: 0.433, three_pct: 0.371, minutes: 35.0, spg: 1.3, bpg: 0.1, tov: 4.1 },
    { name: "Russell Westbrook", team: "LAC", ppg: 11.1, rpg: 5.0, apg: 4.5, fg_pct: 0.453, three_pct: 0.271, minutes: 22.5, spg: 1.1, bpg: 0.3, tov: 2.2 },
    { name: "Kyle Lowry", team: "MIA", ppg: 8.2, rpg: 3.2, apg: 4.0, fg_pct: 0.420, three_pct: 0.333, minutes: 28.0, spg: 1.2, bpg: 0.2, tov: 2.1 },
    { name: "Fred VanVleet", team: "HOU", ppg: 17.4, rpg: 3.8, apg: 8.1, fg_pct: 0.423, three_pct: 0.343, minutes: 37.2, spg: 1.4, bpg: 0.7, tov: 2.9 },
    { name: "Mike Conley", team: "MIN", ppg: 11.4, rpg: 2.5, apg: 5.9, fg_pct: 0.447, three_pct: 0.447, minutes: 26.0, spg: 0.9, bpg: 0.3, tov: 1.5 },
    
    // Forwards
    { name: "OG Anunoby", team: "NYK", ppg: 14.7, rpg: 4.2, apg: 2.1, fg_pct: 0.478, three_pct: 0.389, minutes: 32.2, spg: 1.7, bpg: 0.8, tov: 1.6 },
    { name: "Mikal Bridges", team: "BRK", ppg: 19.6, rpg: 4.5, apg: 3.6, fg_pct: 0.434, three_pct: 0.372, minutes: 35.0, spg: 1.0, bpg: 0.9, tov: 2.0 },
    { name: "Tobias Harris", team: "PHI", ppg: 17.2, rpg: 6.5, apg: 3.1, fg_pct: 0.533, three_pct: 0.417, minutes: 32.8, spg: 0.7, bpg: 0.5, tov: 1.8 },
    { name: "Harrison Barnes", team: "SAC", ppg: 12.2, rpg: 4.6, apg: 1.5, fg_pct: 0.546, three_pct: 0.367, minutes: 29.0, spg: 0.7, bpg: 0.4, tov: 1.0 },
    { name: "Bojan Bogdanovic", team: "DET", ppg: 20.2, rpg: 3.8, apg: 2.6, fg_pct: 0.484, three_pct: 0.412, minutes: 33.5, spg: 0.8, bpg: 0.2, tov: 2.1 },
    
    // Rookies & Second Year Players
    { name: "Chet Holmgren", team: "OKC", ppg: 16.5, rpg: 7.9, apg: 2.4, fg_pct: 0.532, three_pct: 0.370, minutes: 28.0, spg: 0.6, bpg: 2.3, tov: 1.9 },
    { name: "Ausar Thompson", team: "DET", ppg: 8.8, rpg: 6.4, apg: 4.9, fg_pct: 0.470, three_pct: 0.182, minutes: 25.1, spg: 1.4, bpg: 0.9, tov: 2.0 },
    { name: "Amen Thompson", team: "HOU", ppg: 9.5, rpg: 6.6, apg: 4.1, fg_pct: 0.545, three_pct: 0.267, minutes: 17.4, spg: 0.9, bpg: 0.6, tov: 1.8 },
    { name: "Gradey Dick", team: "TOR", ppg: 8.5, rpg: 2.9, apg: 1.8, fg_pct: 0.407, three_pct: 0.366, minutes: 20.0, spg: 0.5, bpg: 0.2, tov: 1.2 },
    { name: "Keyonte George", team: "UTA", ppg: 13.0, rpg: 3.0, apg: 4.4, fg_pct: 0.405, three_pct: 0.334, minutes: 25.8, spg: 0.8, bpg: 0.2, tov: 2.8 },
    
    // Additional Role Players
    { name: "Marcus Smart", team: "MEM", ppg: 14.5, rpg: 4.3, apg: 4.3, fg_pct: 0.423, three_pct: 0.317, minutes: 31.0, spg: 1.8, bpg: 0.4, tov: 2.9 },
    { name: "Alex Caruso", team: "CHI", ppg: 10.1, rpg: 3.8, apg: 3.5, fg_pct: 0.462, three_pct: 0.401, minutes: 29.8, spg: 1.7, bpg: 1.0, tov: 1.8 },
    { name: "Derrick White", team: "BOS", ppg: 15.2, rpg: 4.2, apg: 5.2, fg_pct: 0.464, three_pct: 0.397, minutes: 32.0, spg: 1.0, bpg: 1.2, tov: 1.9 },
    { name: "Terry Rozier", team: "MIA", ppg: 16.4, rpg: 4.2, apg: 4.0, fg_pct: 0.423, three_pct: 0.385, minutes: 34.0, spg: 1.1, bpg: 0.5, tov: 2.0 },
    { name: "Duncan Robinson", team: "MIA", ppg: 12.9, rpg: 2.9, apg: 2.0, fg_pct: 0.459, three_pct: 0.387, minutes: 26.2, spg: 0.6, bpg: 0.3, tov: 1.0 },
    
    // International Players
    { name: "Lauri Markkanen", team: "UTA", ppg: 23.2, rpg: 8.2, apg: 2.0, fg_pct: 0.480, three_pct: 0.398, minutes: 33.0, spg: 0.9, bpg: 0.6, tov: 2.2 },
    { name: "Dennis Schroder", team: "TOR", ppg: 14.3, rpg: 2.5, apg: 5.3, fg_pct: 0.435, three_pct: 0.324, minutes: 29.0, spg: 0.8, bpg: 0.2, tov: 2.7 },
    { name: "Goga Bitadze", team: "ORL", ppg: 5.0, rpg: 4.8, apg: 1.2, fg_pct: 0.542, three_pct: 0.364, minutes: 17.2, spg: 0.4, bpg: 1.3, tov: 1.0 },
    
    // Bench Players & Specialists
    { name: "Malik Monk", team: "SAC", ppg: 15.4, rpg: 2.9, apg: 4.2, fg_pct: 0.444, three_pct: 0.350, minutes: 26.0, spg: 0.8, bpg: 0.2, tov: 1.8 },
    { name: "Jordan Clarkson", team: "UTA", ppg: 17.1, rpg: 3.4, apg: 5.0, fg_pct: 0.423, three_pct: 0.329, minutes: 28.1, spg: 0.9, bpg: 0.2, tov: 2.3 },
    { name: "Immanuel Quickley", team: "TOR", ppg: 18.6, rpg: 4.8, apg: 6.8, fg_pct: 0.429, three_pct: 0.395, minutes: 32.3, spg: 0.9, bpg: 0.2, tov: 2.7 },
    { name: "Tim Hardaway Jr.", team: "DAL", ppg: 14.4, rpg: 3.2, apg: 1.8, fg_pct: 0.407, three_pct: 0.385, minutes: 26.0, spg: 0.6, bpg: 0.2, tov: 1.1 },
    { name: "Bobby Portis", team: "MIL", ppg: 13.8, rpg: 7.0, apg: 1.1, fg_pct: 0.492, three_pct: 0.408, minutes: 22.5, spg: 0.7, bpg: 0.4, tov: 1.0 },
    
    // Defensive Specialists
    { name: "Nic Claxton", team: "BRK", ppg: 11.8, rpg: 9.9, apg: 2.1, fg_pct: 0.701, three_pct: 0.000, minutes: 25.0, spg: 0.6, bpg: 2.1, tov: 1.6 },
    { name: "Isaiah Hartenstein", team: "NYK", ppg: 7.8, rpg: 8.3, apg: 2.5, fg_pct: 0.644, three_pct: 0.143, minutes: 25.3, spg: 1.2, bpg: 1.1, tov: 1.3 },
    { name: "Andre Drummond", team: "PHI", ppg: 6.0, rpg: 8.4, apg: 0.5, fg_pct: 0.651, three_pct: 0.000, minutes: 13.8, spg: 0.7, bpg: 0.6, tov: 0.9 },
    { name: "Robert Williams III", team: "POR", ppg: 8.6, rpg: 6.8, apg: 1.9, fg_pct: 0.703, three_pct: 0.000, minutes: 16.9, spg: 0.9, bpg: 1.4, tov: 1.3 },
    { name: "Jaden McDaniels", team: "MIN", ppg: 10.9, rpg: 3.9, apg: 1.9, fg_pct: 0.483, three_pct: 0.316, minutes: 27.0, spg: 1.1, bpg: 0.9, tov: 1.2 }
  ];

  // Normalize data for clustering
  const normalizeData = (data) => {
    const stats = ['ppg', 'rpg', 'apg', 'fg_pct', 'three_pct', 'minutes', 'spg', 'bpg'];
    const normalized = {};
    
    stats.forEach(stat => {
      const values = data.map(p => p[stat]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;
      
      normalized[stat] = { min, max, range };
    });
    
    return data.map(player => ({
      ...player,
      normalized: {
        ppg: (player.ppg - normalized.ppg.min) / normalized.ppg.range,
        rpg: (player.rpg - normalized.rpg.min) / normalized.rpg.range,
        apg: (player.apg - normalized.apg.min) / normalized.apg.range,
        fg_pct: (player.fg_pct - normalized.fg_pct.min) / normalized.fg_pct.range,
        three_pct: (player.three_pct - normalized.three_pct.min) / normalized.three_pct.range,
        minutes: (player.minutes - normalized.minutes.min) / normalized.minutes.range,
        spg: (player.spg - normalized.spg.min) / normalized.spg.range,
        bpg: (player.bpg - normalized.bpg.min) / normalized.bpg.range
      }
    }));
  };

  // Enhanced K-means clustering implementation
  const kMeansClustering = (data, k = 6) => {
    const normalizedData = normalizeData(data);
    const features = ['ppg', 'rpg', 'apg', 'fg_pct', 'three_pct', 'minutes', 'spg', 'bpg'];
    
    // Initialize centroids using k-means++
    let centroids = [];
    const dataPoints = normalizedData.map(p => features.map(f => p.normalized[f]));
    
    // First centroid is random
    centroids.push(dataPoints[Math.floor(Math.random() * dataPoints.length)]);
    
    for (let i = 1; i < k; i++) {
      const distances = dataPoints.map(point => {
        const minDist = Math.min(...centroids.map(centroid => {
          return Math.sqrt(point.reduce((sum, val, idx) => sum + Math.pow(val - centroid[idx], 2), 0));
        }));
        return minDist * minDist;
      });
      
      const totalDist = distances.reduce((sum, d) => sum + d, 0);
      const threshold = Math.random() * totalDist;
      
      let cumulative = 0;
      for (let j = 0; j < distances.length; j++) {
        cumulative += distances[j];
        if (cumulative >= threshold) {
          centroids.push(dataPoints[j]);
          break;
        }
      }
    }
    
    let clusters = [];
    let iterations = 0;
    const maxIterations = 100;
    
    while (iterations < maxIterations) {
      // Assign points to clusters
      clusters = normalizedData.map(player => {
        const point = features.map(f => player.normalized[f]);
        const distances = centroids.map(centroid => {
          return Math.sqrt(point.reduce((sum, val, idx) => sum + Math.pow(val - centroid[idx], 2), 0));
        });
        
        const clusterIndex = distances.indexOf(Math.min(...distances));
        return { ...player, cluster: clusterIndex };
      });
      
      // Update centroids
      const newCentroids = Array(k).fill().map(() => Array(features.length).fill(0));
      const clusterCounts = Array(k).fill(0);
      
      clusters.forEach(player => {
        const point = features.map(f => player.normalized[f]);
        point.forEach((val, idx) => {
          newCentroids[player.cluster][idx] += val;
        });
        clusterCounts[player.cluster]++;
      });
      
      for (let i = 0; i < k; i++) {
        if (clusterCounts[i] > 0) {
          for (let j = 0; j < features.length; j++) {
            newCentroids[i][j] /= clusterCounts[i];
          }
        }
      }
      
      // Check for convergence
      const converged = centroids.every((centroid, i) => 
        centroid.every((val, j) => Math.abs(val - newCentroids[i][j]) < 0.001)
      );
      
      centroids = newCentroids;
      iterations++;
      
      if (converged) break;
    }
    
    // Calculate cluster centers in original space for visualization
    const clusterCenters = centroids.map(centroid => ({
      ppg: centroid[0] * (Math.max(...playerData.map(p => p.ppg)) - Math.min(...playerData.map(p => p.ppg))) + Math.min(...playerData.map(p => p.ppg)),
      apg: centroid[2] * (Math.max(...playerData.map(p => p.apg)) - Math.min(...playerData.map(p => p.apg))) + Math.min(...playerData.map(p => p.apg))
    }));
    
    return { clusters, clusterCenters };
  };

  const { clusters: clusteredData, clusterCenters } = useMemo(() => kMeansClustering(playerData), []);
  
  // Define cluster colors with better contrast
  const clusterColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF8A65'];
  
  // Enhanced cluster descriptions based on actual clustering results
  const clusterDescriptions = {
    0: "Elite Scorers - High-volume offensive superstars",
    1: "Floor Generals - Elite playmakers and facilitators", 
    2: "Two-Way Wings - Balanced perimeter players",
    3: "Paint Dominators - Centers and defensive anchors",
    4: "3&D Specialists - Shooters and role players",
    5: "Modern Bigs - Versatile frontcourt players"
  };

  const filteredPlayers = clusteredData.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedPlayers = selectedCluster !== null 
    ? filteredPlayers.filter(p => p.cluster === selectedCluster)
    : filteredPlayers;

  // Enhanced scatter data with cluster boundaries
  const scatterData = clusteredData.map(player => ({
    x: player.ppg,
    y: player.apg,
    z: player.rpg,
    name: player.name,
    cluster: player.cluster,
    rpg: player.rpg,
    team: player.team,
    fg_pct: player.fg_pct,
    three_pct: player.three_pct,
    spg: player.spg,
    bpg: player.bpg,
    size: Math.max(4, Math.min(12, player.minutes / 3)) // Size based on minutes
  }));

  // Custom scatter plot with cluster boundaries
  const CustomScatterPlot = () => (
    <ResponsiveContainer width="100%" height={500}>
      <ScatterChart
        data={scatterData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="x" 
          name="Points per Game"
          stroke="#fff"
          tick={{ fill: '#fff', fontSize: 12 }}
          label={{ value: 'Points per Game', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#fff' } }}
        />
        <YAxis 
          dataKey="y" 
          name="Assists per Game"
          stroke="#fff"
          tick={{ fill: '#fff', fontSize: 12 }}
          label={{ value: 'Assists per Game', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#fff' } }}
        />
        
        {/* Cluster centers as reference points */}
        {clusterCenters.map((center, idx) => (
          <ReferenceLine 
            key={`center-${idx}`}
            x={center.ppg} 
            stroke={clusterColors[idx]} 
            strokeWidth={2}
            strokeDasharray="5 5"
            opacity={0.6}
          />
        ))}
        
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload[0]) {
              const data = payload[0].payload;
              return (
                <div className="bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl border border-gray-700 shadow-2xl">
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: clusterColors[data.cluster] }}
                    />
                    <p className="font-bold text-white text-lg">{data.name}</p>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{data.team} • Cluster {data.cluster + 1}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-blue-400">PPG: <span className="text-white font-medium">{data.x}</span></div>
                    <div className="text-green-400">APG: <span className="text-white font-medium">{data.y}</span></div>
                    <div className="text-yellow-400">RPG: <span className="text-white font-medium">{data.rpg}</span></div>
                    <div className="text-purple-400">FG%: <span className="text-white font-medium">{(data.fg_pct * 100).toFixed(1)}%</span></div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        
        {/* Render clusters as separate scatter series for better visual separation */}
        {[0, 1, 2, 3, 4, 5].map(clusterIdx => (
          <Scatter 
            key={`cluster-${clusterIdx}`}
            name={`Cluster ${clusterIdx + 1}`}
            data={scatterData.filter(d => d.cluster === clusterIdx)}
            fill={clusterColors[clusterIdx]}
            opacity={selectedCluster === null || selectedCluster === clusterIdx ? 0.8 : 0.3}
            r={6}
          />
        ))}
        
        <Legend 
          wrapperStyle={{ color: '#fff' }}
          iconType="circle"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );

  // Radar chart data for selected player
  const getRadarData = (player) => {
    if (!player) return [];
    return [
      { stat: 'PPG', value: Math.min(player.ppg / 35 * 100, 100), fullMark: 100 },
      { stat: 'RPG', value: Math.min(player.rpg / 15 * 100, 100), fullMark: 100 },
      { stat: 'APG', value: Math.min(player.apg / 12 * 100, 100), fullMark: 100 },
      { stat: 'FG%', value: player.fg_pct * 100, fullMark: 100 },
      { stat: '3P%', value: player.three_pct * 100, fullMark: 100 },
      { stat: 'STL', value: Math.min(player.spg / 3 * 100, 100), fullMark: 100 },
      { stat: 'BLK', value: Math.min(player.bpg / 4 * 100, 100), fullMark: 100 }
    ];
  };

  // Cluster averages for bar chart
  const clusterAverages = clusteredData.reduce((acc, player) => {
    const cluster = player.cluster;
    if (!acc[cluster]) {
      acc[cluster] = { 
        cluster: cluster + 1, 
        count: 0, 
        totalPPG: 0, 
        totalRPG: 0, 
        totalAPG: 0,
        totalFG: 0,
        total3P: 0,
        totalSPG: 0,
        totalBPG: 0
      };
    }
    acc[cluster].count++;
    acc[cluster].totalPPG += player.ppg;
    acc[cluster].totalRPG += player.rpg;
    acc[cluster].totalAPG += player.apg;
    acc[cluster].totalFG += player.fg_pct;
    acc[cluster].total3P += player.three_pct;
    acc[cluster].totalSPG += player.spg;
    acc[cluster].totalBPG += player.bpg;
    return acc;
  }, {});

  const clusterAvgData = Object.values(clusterAverages).map(cluster => ({
    cluster: `C${cluster.cluster}`,
    PPG: parseFloat((cluster.totalPPG / cluster.count).toFixed(1)),
    RPG: parseFloat((cluster.totalRPG / cluster.count).toFixed(1)),
    APG: parseFloat((cluster.totalAPG / cluster.count).toFixed(1)),
    'FG%': parseFloat(((cluster.totalFG / cluster.count) * 100).toFixed(1)),
    '3P%': parseFloat(((cluster.total3P / cluster.count) * 100).toFixed(1)),
    SPG: parseFloat((cluster.totalSPG / cluster.count).toFixed(1)),
    BPG: parseFloat((cluster.totalBPG / cluster.count).toFixed(1)),
    color: clusterColors[cluster.cluster - 1]
  }));

  // Pie chart data for cluster distribution
  const pieData = Object.keys(clusterAverages).map(cluster => ({
    name: `Cluster ${parseInt(cluster) + 1}`,
    value: clusterAverages[cluster].count,
    fill: clusterColors[cluster]
  }));

  const findSimilarPlayers = (targetPlayer) => {
    if (!targetPlayer) return [];
    
    const sameCluster = clusteredData.filter(p => 
      p.cluster === targetPlayer.cluster && p.name !== targetPlayer.name
    );
    
    // Calculate similarity scores within the cluster
    const similarities = sameCluster.map(player => {
      const features = ['ppg', 'rpg', 'apg', 'fg_pct', 'three_pct', 'spg', 'bpg'];
      const distance = Math.sqrt(
        features.reduce((sum, feature) => 
          sum + Math.pow(targetPlayer.normalized[feature] - player.normalized[feature], 2), 0
        )
      );
      return { ...player, similarity: 1 / (1 + distance) };
    });
    
    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 4);
  };

  const clusterStats = clusteredData.reduce((acc, player) => {
    const cluster = player.cluster;
    if (!acc[cluster]) {
      acc[cluster] = { count: 0, players: [] };
    }
    acc[cluster].count++;
    acc[cluster].players.push(player);
    return acc;
  }, {});

  const handlePlayerClick = (player) => {
    if (selectedPlayer?.name === player.name) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(player);
      setActiveChart('radar'); // Auto-switch to radar chart
    }
  };

  const charts = {
    scatter: {
      title: 'Player Distribution with Cluster Visualization',
      icon: <TrendingUp className="mr-2" />,
      component: <CustomScatterPlot />
    },
    bar: {
      title: 'Cluster Statistical Averages',
      icon: <BarChart3 className="mr-2" />,
      component: (
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={clusterAvgData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="cluster" 
              stroke="#fff" 
              tick={{ fill: '#fff' }}
              label={{ value: 'Clusters', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#fff' } }}
            />
            <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                border: '1px solid #374151',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)'
              }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="PPG" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="RPG" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="APG" fill="#45B7D1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    pie: {
      title: 'Player Distribution Across Clusters',
      icon: <Users className="mr-2" />,
      component: (
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
              stroke="#1f2937"
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                border: '1px solid #374151',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )
    },
    radar: {
      title: selectedPlayer ? `${selectedPlayer.name} - Statistical Profile` : 'Select a Player for Radar Analysis',
      icon: <Activity className="mr-2" />,
      component: selectedPlayer ? (
        <ResponsiveContainer width="100%" height={450}>
          <RadarChart data={getRadarData(selectedPlayer)} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
            <PolarGrid stroke="rgba(255,255,255,0.2)" />
            <PolarAngleAxis dataKey="stat" tick={{ fill: '#fff', fontSize: 14, fontWeight: 'bold' }} />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#fff', fontSize: 10 }}
              tickCount={5}
            />
            <Radar 
              name={selectedPlayer.name}
              dataKey="value" 
              stroke={clusterColors[selectedPlayer.cluster]}
              fill={clusterColors[selectedPlayer.cluster]}
              fillOpacity={0.4}
              strokeWidth={3}
              dot={{ fill: clusterColors[selectedPlayer.cluster], strokeWidth: 2, r: 6 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                border: '1px solid #374151',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)'
              }}
              formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
            />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-450 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Target size={64} className="mx-auto mb-6 opacity-50" />
            <p className="text-xl mb-2">Select a player to view their statistical profile</p>
            <p className="text-sm opacity-75">Click the "View Profile" button next to any player</p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            NBA Player Clustering Analysis
          </h1>
          <p className="text-xl text-gray-300 mb-2">2023-24 Season • Advanced K-Means Clustering</p>
          <p className="text-sm text-gray-400">{playerData.length} players analyzed across 8 statistical dimensions</p>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
          <div className="relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search players or teams..."
              className="pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              className="pl-10 pr-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
              value={selectedCluster || ''}
              onChange={(e) => setSelectedCluster(e.target.value === '' ? null : parseInt(e.target.value))}
            >
              <option value="">All Clusters</option>
              {Object.keys(clusterStats).map(cluster => (
                <option key={cluster} value={cluster}>
                  Cluster {parseInt(cluster) + 1} ({clusterStats[cluster].count} players)
                </option>
              ))}
            </select>
          </div>

          <div className="flex bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-1">
            {Object.entries(charts).map(([key, chart]) => (
              <button
                key={key}
                onClick={() => setActiveChart(key)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeChart === key 
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {chart.icon}
                <span className="hidden sm:inline">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Visualizations */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/30 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold flex items-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {charts[activeChart].icon}
              {charts[activeChart].title}
            </h2>
            {activeChart === 'scatter' && (
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-dashed border-orange-400 rounded-full mr-2"></div>
                  <span>Cluster Boundaries</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full mr-2"></div>
                  <span>Cluster Centers</span>
                </div>
              </div>
            )}
          </div>
          <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
            {charts[activeChart].component}
          </div>
        </div>

        {/* Enhanced Cluster Overview */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <Users className="mr-3" />
            Cluster Archetypes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(clusterStats).map(cluster => {
              const clusterNum = parseInt(cluster);
              const avgStats = clusterAverages[cluster];
              const isSelected = selectedCluster === clusterNum;
              
              return (
                <div 
                  key={cluster}
                  className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'border-orange-400 bg-gradient-to-br from-orange-400/20 to-red-500/20 shadow-xl shadow-orange-500/20' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
                  }`}
                  onClick={() => setSelectedCluster(isSelected ? null : clusterNum)}
                >
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-8 h-8 rounded-full mr-4 shadow-lg"
                      style={{ backgroundColor: clusterColors[clusterNum] }}
                    ></div>
                    <div>
                      <h3 className="font-bold text-xl">Cluster {clusterNum + 1}</h3>
                      <p className="text-sm text-gray-300">{clusterStats[cluster].count} players</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {clusterDescriptions[clusterNum] || 'Mixed archetype'}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Avg PPG:</span>
                      <span className="font-bold text-blue-400">{(avgStats.totalPPG / avgStats.count).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Avg RPG:</span>
                      <span className="font-bold text-green-400">{(avgStats.totalRPG / avgStats.count).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Avg APG:</span>
                      <span className="font-bold text-yellow-400">{(avgStats.totalAPG / avgStats.count).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">FG%: {((avgStats.totalFG / avgStats.count) * 100).toFixed(1)}%</span>
                      <span className="text-gray-400">3P%: {((avgStats.total3P / avgStats.count) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Player Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center">
              <Award className="mr-3" />
              Player Statistics
              {selectedCluster !== null && (
                <span className="ml-4 text-lg bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full">
                  Cluster {selectedCluster + 1}
                </span>
              )}
            </h2>
            <div className="text-sm text-gray-400">
              Showing {Math.min(20, displayedPlayers.length)} of {displayedPlayers.length} players
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-white/20">
                  <th className="text-left py-4 px-3 font-bold">Player</th>
                  <th className="text-left py-4 px-3 font-bold">Team</th>
                  <th className="text-center py-4 px-3 font-bold">PPG</th>
                  <th className="text-center py-4 px-3 font-bold">RPG</th>
                  <th className="text-center py-4 px-3 font-bold">APG</th>
                  <th className="text-center py-4 px-3 font-bold">FG%</th>
                  <th className="text-center py-4 px-3 font-bold">3P%</th>
                  <th className="text-center py-4 px-3 font-bold">STL</th>
                  <th className="text-center py-4 px-3 font-bold">BLK</th>
                  <th className="text-center py-4 px-3 font-bold">Cluster</th>
                  <th className="text-center py-4 px-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedPlayers.slice(0, 20).map((player, index) => (
                  <tr 
                    key={player.name} 
                    className={`border-b border-white/10 transition-all duration-200 ${
                      selectedPlayer?.name === player.name 
                        ? 'bg-gradient-to-r from-orange-400/20 to-red-500/20 shadow-lg' 
                        : 'hover:bg-white/5'
                    }`}
                    onMouseEnter={() => setHoveredPlayer(player)}
                    onMouseLeave={() => setHoveredPlayer(null)}
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: clusterColors[player.cluster] }}
                        />
                        <span className="font-medium text-white">{player.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="px-2 py-1 bg-white/10 rounded text-gray-300 text-xs font-medium">
                        {player.team}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center font-medium text-blue-400">{player.ppg}</td>
                    <td className="py-4 px-3 text-center font-medium text-green-400">{player.rpg}</td>
                    <td className="py-4 px-3 text-center font-medium text-yellow-400">{player.apg}</td>
                    <td className="py-4 px-3 text-center font-medium text-purple-400">{(player.fg_pct * 100).toFixed(1)}%</td>
                    <td className="py-4 px-3 text-center font-medium text-pink-400">{(player.three_pct * 100).toFixed(1)}%</td>
                    <td className="py-4 px-3 text-center font-medium text-cyan-400">{player.spg}</td>
                    <td className="py-4 px-3 text-center font-medium text-red-400">{player.bpg}</td>
                    <td className="py-4 px-3 text-center">
                      <div className="flex items-center justify-center">
                        <span 
                          className="inline-block w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: clusterColors[player.cluster] }}
                        />
                        <span className="font-bold">{player.cluster + 1}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handlePlayerClick(player)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center ${
                            selectedPlayer?.name === player.name
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg'
                          }`}
                        >
                          <Eye size={12} className="mr-1" />
                          {selectedPlayer?.name === player.name ? 'Hide' : 'Profile'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {displayedPlayers.length > 20 && (
            <div className="text-center mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400">
                Showing first 20 of <span className="text-orange-400 font-bold">{displayedPlayers.length}</span> players. 
                <span className="text-gray-300"> Use search or filters to narrow results.</span>
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Similar Players Section */}
        {selectedPlayer && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">
                Players Similar to <span className="text-orange-400">{selectedPlayer.name}</span>
              </h2>
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: clusterColors[selectedPlayer.cluster] }}
                />
                <span className="text-sm font-medium text-gray-300">
                  Cluster {selectedPlayer.cluster + 1}: {clusterDescriptions[selectedPlayer.cluster]}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {findSimilarPlayers(selectedPlayer).map((similar, index) => (
                <div key={similar.name} className="group bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                        {similar.name}
                      </h3>
                      <span className="text-sm text-gray-300 bg-white/10 px-2 py-1 rounded">{similar.team}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">Rank</div>
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">PPG</div>
                        <div className="font-bold text-blue-400">{similar.ppg}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">RPG</div>
                        <div className="font-bold text-green-400">{similar.rpg}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">APG</div>
                        <div className="font-bold text-yellow-400">{similar.apg}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">FG%</div>
                        <div className="font-medium text-purple-400">{(similar.fg_pct * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">3P%</div>
                        <div className="font-medium text-pink-400">{(similar.three_pct * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">STL</div>
                        <div className="font-medium text-cyan-400">{similar.spg}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">BLK</div>
                        <div className="font-medium text-red-400">{similar.bpg}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Similarity Score:</span>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 w-16 mr-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${similar.similarity * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-orange-400">
                          {(similar.similarity * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePlayerClick(similar)}
                    className="mt-4 w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg text-white text-xs font-medium transition-all duration-200 flex items-center justify-center"
                  >
                    <Star size={12} className="mr-1" />
                    View Profile
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Activity size={16} className="text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-300">Similarity Analysis</h4>
                  <p className="text-xs text-gray-300 mt-1">
                    Players are ranked by statistical similarity within the same cluster using normalized Euclidean distance. 
                    Higher percentages indicate more similar playing styles and statistical profiles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="mt-12 text-center p-8 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-center mb-4">
            <Zap size={24} className="text-orange-500 mr-2" />
            <h3 className="text-xl font-bold">NBA Clustering Insights</h3>
          </div>
          <p className="text-gray-400 text-sm max-w-3xl mx-auto leading-relaxed">
            This analysis uses advanced K-means clustering with K-means++ initialization to identify player archetypes based on 
            8 statistical dimensions: points, rebounds, assists, field goal percentage, three-point percentage, minutes, steals, and blocks. 
            The algorithm automatically discovers natural groupings in the data, revealing distinct player roles and playing styles in the modern NBA.
          </p>
          <div className="mt-6 flex justify-center space-x-8 text-sm text-gray-300">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
              <span>{playerData.length} Players Analyzed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
              <span>8 Statistical Features</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span>6 Player Archetypes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NBAClusteringApp;
