import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.spatial.distance import cdist
import warnings
warnings.filterwarnings('ignore')

# Set page config
st.set_page_config(
    page_title="NBA Player Clustering Analysis", 
    page_icon="🏀", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem;
    }
    .cluster-card {
        border: 2px solid #ddd;
        border-radius: 10px;
        padding: 1rem;
        margin: 0.5rem;
        background: #f8f9fa;
    }
</style>
""", unsafe_allow_html=True)

# NBA Player Data (2023-24 Season)
@st.cache_data
def load_nba_data():
    data = {
        'name': [
            "Nikola Jokic", "Luka Doncic", "Shai Gilgeous-Alexander", "Giannis Antetokounmpo", 
            "Jayson Tatum", "Domantas Sabonis", "Anthony Edwards", "Tyrese Haliburton",
            "Victor Wembanyama", "Paolo Banchero", "Alperen Sengun", "Scottie Barnes",
            "Jalen Brunson", "De'Aaron Fox", "Donovan Mitchell", "LaMelo Ball",
            "Kristaps Porzingis", "Karl-Anthony Towns", "Franz Wagner", "Cade Cunningham",
            "Jalen Green", "Evan Mobley", "Jarrett Allen", "Rudy Gobert", "Bam Adebayo",
            "Jimmy Butler", "Kawhi Leonard", "Paul George", "Damian Lillard", "Jrue Holiday",
            "Ja Morant", "Zion Williamson", "Brandon Ingram", "Tyler Herro", "Devin Booker",
            "Chris Paul", "Stephen Curry", "Klay Thompson", "Draymond Green", "Kevin Durant",
            "Joel Embiid", "Anthony Davis", "Myles Turner", "Brook Lopez", "Clint Capela",
            "Trae Young", "Russell Westbrook", "Kyle Lowry", "Fred VanVleet", "Mike Conley",
            "OG Anunoby", "Mikal Bridges", "Tobias Harris", "Harrison Barnes", "Bojan Bogdanovic",
            "Chet Holmgren", "Ausar Thompson", "Amen Thompson", "Gradey Dick", "Keyonte George",
            "Marcus Smart", "Alex Caruso", "Derrick White", "Terry Rozier", "Duncan Robinson",
            "Lauri Markkanen", "Dennis Schroder", "Goga Bitadze", "Malik Monk", "Jordan Clarkson",
            "Immanuel Quickley", "Tim Hardaway Jr.", "Bobby Portis", "Nic Claxton", "Isaiah Hartenstein",
            "Andre Drummond", "Robert Williams III", "Jaden McDaniels"
        ],
        'team': [
            "DEN", "DAL", "OKC", "MIL", "BOS", "SAC", "MIN", "IND", "SAS", "ORL",
            "HOU", "TOR", "NYK", "SAC", "CLE", "CHA", "BOS", "MIN", "ORL", "DET",
            "HOU", "CLE", "CLE", "MIN", "MIA", "MIA", "LAC", "LAC", "MIL", "BOS",
            "MEM", "NOP", "NOP", "MIA", "PHX", "GSW", "GSW", "GSW", "GSW", "PHX",
            "PHI", "LAL", "IND", "MIL", "ATL", "ATL", "LAC", "MIA", "HOU", "MIN",
            "NYK", "BRK", "PHI", "SAC", "DET", "OKC", "DET", "HOU", "TOR", "UTA",
            "MEM", "CHI", "BOS", "MIA", "MIA", "UTA", "TOR", "ORL", "SAC", "UTA",
            "TOR", "DAL", "MIL", "BRK", "NYK", "PHI", "POR", "MIN"
        ],
        'ppg': [
            26.4, 32.4, 30.1, 30.4, 26.9, 19.4, 25.9, 20.1, 21.4, 22.6,
            21.1, 19.9, 28.7, 26.6, 26.6, 23.9, 20.1, 21.8, 19.7, 22.7,
            19.6, 15.7, 16.5, 14.0, 19.3, 20.8, 23.7, 22.6, 24.3, 12.5,
            25.1, 22.9, 20.8, 20.8, 27.1, 9.2, 26.4, 17.9, 8.5, 27.1,
            34.7, 24.7, 17.1, 12.5, 11.5, 25.7, 11.1, 8.2, 17.4, 11.4,
            14.7, 19.6, 17.2, 12.2, 20.2, 16.5, 8.8, 9.5, 8.5, 13.0,
            14.5, 10.1, 15.2, 16.4, 12.9, 23.2, 14.3, 5.0, 15.4, 17.1,
            18.6, 14.4, 13.8, 11.8, 7.8, 6.0, 8.6, 10.9
        ],
        'rpg': [
            12.4, 9.1, 5.5, 11.5, 8.1, 13.7, 5.4, 3.9, 10.6, 6.9,
            9.3, 8.2, 3.6, 4.6, 5.1, 5.1, 7.2, 8.3, 5.3, 4.3,
            5.2, 9.4, 10.5, 12.9, 10.4, 5.3, 6.1, 5.2, 4.4, 5.4,
            5.6, 5.8, 5.1, 5.3, 4.5, 3.9, 4.5, 4.1, 7.2, 6.6,
            11.0, 12.6, 6.9, 5.2, 10.6, 2.8, 5.0, 3.2, 3.8, 2.5,
            4.2, 4.5, 6.5, 4.6, 3.8, 7.9, 6.4, 6.6, 2.9, 3.0,
            4.3, 3.8, 4.2, 4.2, 2.9, 8.2, 2.5, 4.8, 2.9, 3.4,
            4.8, 3.2, 7.0, 9.9, 8.3, 8.4, 6.8, 3.9
        ],
        'apg': [
            9.0, 9.8, 6.2, 6.5, 4.9, 8.2, 5.1, 10.9, 3.9, 5.4,
            5.0, 6.1, 6.7, 5.6, 6.1, 8.0, 1.9, 3.0, 3.7, 7.5,
            3.5, 3.2, 2.7, 2.1, 3.9, 5.0, 3.6, 3.5, 7.0, 4.8,
            8.1, 5.0, 5.7, 4.5, 6.9, 6.8, 5.1, 2.3, 6.0, 5.0,
            5.6, 3.5, 1.9, 2.4, 0.9, 10.8, 4.5, 4.0, 8.1, 5.9,
            2.1, 3.6, 3.1, 1.5, 2.6, 2.4, 4.9, 4.1, 1.8, 4.4,
            4.3, 3.5, 5.2, 4.0, 2.0, 2.0, 5.3, 1.2, 4.2, 5.0,
            6.8, 1.8, 1.1, 2.1, 2.5, 0.5, 1.9, 1.9
        ],
        'fg_pct': [
            0.583, 0.487, 0.535, 0.612, 0.472, 0.618, 0.460, 0.475, 0.463, 0.456,
            0.535, 0.473, 0.479, 0.464, 0.463, 0.436, 0.518, 0.505, 0.481, 0.449,
            0.424, 0.580, 0.635, 0.664, 0.522, 0.493, 0.523, 0.473, 0.427, 0.432,
            0.473, 0.570, 0.492, 0.432, 0.465, 0.444, 0.450, 0.433, 0.492, 0.523,
            0.529, 0.567, 0.542, 0.485, 0.677, 0.433, 0.453, 0.420, 0.423, 0.447,
            0.478, 0.434, 0.533, 0.546, 0.484, 0.532, 0.470, 0.545, 0.407, 0.405,
            0.423, 0.462, 0.464, 0.423, 0.459, 0.480, 0.435, 0.542, 0.444, 0.423,
            0.429, 0.407, 0.492, 0.701, 0.644, 0.651, 0.703, 0.483
        ],
        'three_pct': [
            0.351, 0.384, 0.353, 0.274, 0.375, 0.370, 0.356, 0.368, 0.327, 0.335,
            0.297, 0.347, 0.401, 0.368, 0.364, 0.356, 0.378, 0.418, 0.280, 0.357,
            0.331, 0.379, 0.222, 0.000, 0.356, 0.414, 0.417, 0.412, 0.357, 0.387,
            0.274, 0.333, 0.353, 0.396, 0.363, 0.370, 0.407, 0.387, 0.393, 0.413,
            0.434, 0.270, 0.403, 0.365, 0.000, 0.371, 0.271, 0.333, 0.343, 0.447,
            0.389, 0.372, 0.417, 0.367, 0.412, 0.370, 0.182, 0.267, 0.366, 0.334,
            0.317, 0.401, 0.397, 0.385, 0.387, 0.398, 0.324, 0.364, 0.350, 0.329,
            0.395, 0.385, 0.408, 0.000, 0.143, 0.000, 0.000, 0.316
        ],
        'minutes': [
            34.6, 37.5, 34.0, 35.2, 35.7, 35.8, 35.1, 32.1, 29.7, 34.2,
            32.8, 35.1, 35.0, 36.3, 35.1, 31.1, 29.5, 33.0, 32.8, 32.1,
            31.2, 33.4, 32.8, 32.1, 33.9, 33.0, 34.0, 33.8, 35.3, 32.4,
            32.8, 29.0, 34.2, 33.9, 35.6, 26.4, 32.7, 29.7, 31.5, 37.2,
            34.6, 35.5, 28.8, 30.1, 30.1, 35.0, 22.5, 28.0, 37.2, 26.0,
            32.2, 35.0, 32.8, 29.0, 33.5, 28.0, 25.1, 17.4, 20.0, 25.8,
            31.0, 29.8, 32.0, 34.0, 26.2, 33.0, 29.0, 17.2, 26.0, 28.1,
            32.3, 26.0, 22.5, 25.0, 25.3, 13.8, 16.9, 27.0
        ],
        'spg': [
            1.3, 1.4, 2.0, 1.2, 1.0, 0.9, 1.3, 1.2, 1.2, 0.9,
            0.9, 1.1, 0.9, 2.0, 1.8, 1.8, 0.8, 0.7, 1.0, 1.5,
            0.8, 0.8, 0.6, 0.8, 1.2, 1.3, 1.6, 1.5, 1.0, 0.8,
            0.8, 1.1, 0.8, 0.8, 0.9, 1.2, 0.9, 0.6, 0.8, 0.9,
            1.2, 1.2, 0.9, 0.7, 0.9, 1.3, 1.1, 1.2, 1.4, 0.9,
            1.7, 1.0, 0.7, 0.7, 0.8, 0.6, 1.4, 0.9, 0.5, 0.8,
            1.8, 1.7, 1.0, 1.1, 0.6, 0.9, 0.8, 0.4, 0.8, 0.9,
            0.9, 0.6, 0.7, 0.6, 1.2, 0.7, 0.9, 1.1
        ],
        'bpg': [
            0.9, 0.5, 0.9, 1.1, 0.6, 0.6, 0.5, 0.7, 3.6, 0.7,
            0.8, 1.5, 0.2, 0.4, 0.4, 0.2, 1.9, 0.7, 0.6, 0.9,
            0.4, 1.4, 1.2, 2.1, 1.1, 0.4, 0.9, 0.4, 0.3, 0.6,
            0.6, 0.6, 0.6, 0.1, 0.5, 0.1, 0.4, 0.4, 0.8, 1.2,
            1.7, 2.3, 1.9, 2.4, 1.5, 0.1, 0.3, 0.2, 0.7, 0.3,
            0.8, 0.9, 0.5, 0.4, 0.2, 2.3, 0.9, 0.6, 0.2, 0.2,
            0.4, 1.0, 1.2, 0.5, 0.3, 0.6, 0.2, 1.3, 0.2, 0.2,
            0.2, 0.2, 0.4, 2.1, 1.1, 0.6, 1.4, 0.9
        ]
    }
    
    df = pd.DataFrame(data)
    return df

# Load data
df = load_nba_data()

# Title
st.markdown('<h1 class="main-header">🏀 NBA Player Clustering Analysis</h1>', unsafe_allow_html=True)
st.markdown('<p style="text-align: center; font-size: 1.2rem; color: #666;">2023-24 Season • Advanced Machine Learning Analysis</p>', unsafe_allow_html=True)

# Sidebar for controls
st.sidebar.header("🎛️ Analysis Controls")

# Feature selection
features_to_use = st.sidebar.multiselect(
    "Select Features for Clustering:",
    ['ppg', 'rpg', 'apg', 'fg_pct', 'three_pct', 'minutes', 'spg', 'bpg'],
    default=['ppg', 'rpg', 'apg', 'fg_pct', 'three_pct', 'minutes', 'spg', 'bpg']
)

# Number of clusters
n_clusters = st.sidebar.slider("Number of Clusters:", 2, 8, 6)

# Team filter
teams = ['All'] + sorted(df['team'].unique().tolist())
selected_teams = st.sidebar.multiselect("Filter by Team:", teams, default=['All'])

if 'All' not in selected_teams and selected_teams:
    df_filtered = df[df['team'].isin(selected_teams)]
else:
    df_filtered = df.copy()

# Search functionality
search_term = st.sidebar.text_input("🔍 Search Player:", "")
if search_term:
    df_filtered = df_filtered[df_filtered['name'].str.contains(search_term, case=False)]

# Perform clustering
if len(features_to_use) >= 2:
    # Prepare data for clustering
    X = df_filtered[features_to_use].copy()
    
    # Handle any missing values
    X = X.fillna(X.mean())
    
    # Standardize the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Perform K-means clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df_filtered['cluster'] = kmeans.fit_predict(X_scaled)
    
    # Calculate silhouette score
    silhouette_avg = silhouette_score(X_scaled, df_filtered['cluster'])
    
    # Cluster descriptions
    cluster_descriptions = {
        0: "Elite Scorers - High-volume offensive superstars",
        1: "Floor Generals - Elite playmakers and facilitators", 
        2: "Two-Way Wings - Balanced perimeter players",
        3: "Paint Dominators - Centers and defensive anchors",
        4: "3&D Specialists - Shooters and role players",
        5: "Modern Bigs - Versatile frontcourt players",
        6: "Defensive Specialists - Defense-first players",
        7: "Bench Contributors - Role players and sixth men"
    }
    
    # Main dashboard
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Players Analyzed", len(df_filtered))
    with col2:
        st.metric("Features Used", len(features_to_use))
    with col3:
        st.metric("Clusters", n_clusters)
    with col4:
        st.metric("Silhouette Score", f"{silhouette_avg:.3f}")
    
    # Tabs for different visualizations
    tab1, tab2, tab3, tab4, tab5 = st.tabs(["🔍 Cluster Visualization", "📊 Player Statistics", "📈 Cluster Analysis", "🎯 Player Similarity", "📋 Data Table"])
    
    with tab1:
        st.header("Interactive Cluster Visualization")
        
        # Create scatter plot with cluster colors
        fig = px.scatter(
            df_filtered, 
            x='ppg', 
            y='apg',
            size='rpg',
            color='cluster',
            hover_name='name',
            hover_data=['team', 'fg_pct', 'three_pct'],
            title="NBA Players: Points vs Assists (Cluster Analysis)",
            labels={'ppg': 'Points per Game', 'apg': 'Assists per Game', 'rpg': 'Rebounds per Game'},
            color_continuous_scale='viridis'
        )
        
        # Add cluster centers
        cluster_centers = []
        for i in range(n_clusters):
            cluster_data = df_filtered[df_filtered['cluster'] == i]
            center_ppg = cluster_data['ppg'].mean()
            center_apg = cluster_data['apg'].mean()
            cluster_centers.append((center_ppg, center_apg))
            
            # Add center point
            fig.add_trace(go.Scatter(
                x=[center_ppg], 
                y=[center_apg],
                mode='markers',
                marker=dict(size=15, color='red', symbol='x', line=dict(width=3, color='white')),
                name=f'Cluster {i} Center',
                showlegend=True
            ))
        
        fig.update_layout(height=600, showlegend=True)
        st.plotly_chart(fig, use_container_width=True)
        
        # 3D visualization
        st.subheader("3D Cluster Visualization")
        fig_3d = px.scatter_3d(
            df_filtered,
            x='ppg',
            y='apg', 
            z='rpg',
            color='cluster',
            hover_name='name',
            hover_data=['team'],
            title="3D Cluster Analysis: PPG vs APG vs RPG",
            labels={'ppg': 'Points per Game', 'apg': 'Assists per Game', 'rpg': 'Rebounds per Game'}
        )
        fig_3d.update_layout(height=600)
        st.plotly_chart(fig_3d, use_container_width=True)
    
    with tab2:
        st.header("Player Statistics Dashboard")
        
        # Radar chart for selected player
        selected_player = st.selectbox("Select Player for Detailed Analysis:", df_filtered['name'].tolist())
        
        if selected_player:
            player_data = df_filtered[df_filtered['name'] == selected_player].iloc[0]
            
            col1, col2 = st.columns([1, 2])
            
            with col1:
                st.subheader(f"{selected_player}")
                st.write(f"**Team:** {player_data['team']}")
                st.write(f"**Cluster:** {player_data['cluster']} - {cluster_descriptions.get(player_data['cluster'], 'Mixed archetype')}")
                
                # Player stats
                stats_data = {
                    'Statistic': ['PPG', 'RPG', 'APG', 'FG%', '3P%', 'SPG', 'BPG', 'MPG'],
                    'Value': [
                        player_data['ppg'], player_data['rpg'], player_data['apg'],
                        f"{player_data['fg_pct']:.1%}", f"{player_data['three_pct']:.1%}",
                        player_data['spg'], player_data['bpg'], player_data['minutes']
                    ]
                }
                st.dataframe(pd.DataFrame(stats_data), hide_index=True)
            
            with col2:
                # Create radar chart
                categories = ['PPG', 'RPG', 'APG', 'FG%', '3P%', 'SPG', 'BPG']
                
                # Normalize values for radar chart (0-100 scale)
                values = [
                    min(player_data['ppg'] / 35 * 100, 100),
                    min(player_data['rpg'] / 15 * 100, 100),
                    min(player_data['apg'] / 12 * 100, 100),
                    player_data['fg_pct'] * 100,
                    player_data['three_pct'] * 100,
                    min(player_data['spg'] / 3 * 100, 100),
                    min(player_data['bpg'] / 4 * 100, 100)
                ]
                
                fig_radar = go.Figure()
                fig_radar.add_trace(go.Scatterpolar(
                    r=values,
                    theta=categories,
                    fill='toself',
                    name=selected_player,
                    line_color='rgb(255, 107, 107)'
                ))
                
                fig_radar.update_layout(
                    polar=dict(
                        radialaxis=dict(visible=True, range=[0, 100])
                    ),
                    showlegend=True,
                    title=f"{selected_player} - Statistical Profile",
                    height=500
                )
                st.plotly_chart(fig_radar, use_container_width=True)
    
    with tab3:
        st.header("Cluster Analysis & Insights")
        
        # Cluster statistics
        cluster_stats = df_filtered.groupby('cluster').agg({
            'ppg': 'mean',
            'rpg': 'mean', 
            'apg': 'mean',
            'fg_pct': 'mean',
            'three_pct': 'mean',
            'spg': 'mean',
            'bpg': 'mean',
            'name': 'count'
        }).round(2)
        cluster_stats.rename(columns={'name': 'player_count'}, inplace=True)
        
        st.subheader("Cluster Statistics")
        st.dataframe(cluster_stats)
        
        # Cluster comparison
        st.subheader("Cluster Comparison")
        fig_comparison = px.bar(
            cluster_stats.reset_index(),
            x='cluster',
            y=['ppg', 'rpg', 'apg'],
            title="Average Statistics by Cluster",
            barmode='group'
        )
        st.plotly_chart(fig_comparison, use_container_width=True)
        
        # Box plots for each statistic
        st.subheader("Statistical Distribution by Cluster")
        
        col1, col2 = st.columns(2)
        
        with col1:
            fig_box1 = px.box(df_filtered, x='cluster', y='ppg', title="Points per Game by Cluster")
            st.plotly_chart(fig_box1, use_container_width=True)
            
            fig_box2 = px.box(df_filtered, x='cluster', y='rpg', title="Rebounds per Game by Cluster")
            st.plotly_chart(fig_box2, use_container_width=True)
        
        with col2:
            fig_box3 = px.box(df_filtered, x='cluster', y='apg', title="Assists per Game by Cluster")
            st.plotly_chart(fig_box3, use_container_width=True)
            
            fig_box4 = px.box(df_filtered, x='cluster', y='fg_pct', title="Field Goal % by Cluster")
            st.plotly_chart(fig_box4, use_container_width=True)
    
    with tab4:
        st.header("Player Similarity Analysis")
        
        # Find similar players
        if selected_player:
            player_idx = df_filtered[df_filtered['name'] == selected_player].index[0]
            player_cluster = df_filtered.loc[player_idx, 'cluster']
            
            # Get players from same cluster
            same_cluster_players = df_filtered[
                (df_filtered['cluster'] == player_cluster) & 
                (df_filtered['name'] != selected_player)
            ]
            
            if len(same_cluster_players) > 0:
                # Calculate similarity using feature vectors
                player_features = X_scaled[df_filtered.index == player_idx][0]
                same_cluster_indices = [df_filtered.index.get_loc(idx) for idx in same_cluster_players.index]
                same_cluster_features = X_scaled[same_cluster_indices]
                
                # Calculate Euclidean distances
                distances = cdist([player_features], same_cluster_features, metric='euclidean')[0]
                similarities = 1 / (1 + distances)  # Convert to similarity scores
                
                # Create similarity dataframe
                similarity_df = same_cluster_players.copy()
                similarity_df['similarity'] = similarities
                similarity_df = similarity_df.sort_values('similarity', ascending=False).head(5)
                
                st.subheader(f"Players Most Similar to {selected_player}")
                
                for idx, (_, player) in enumerate(similarity_df.iterrows()):
                    with st.container():
                        col1, col2, col3 = st.columns([2, 2, 1])
                        
                        with col1:
                            st.write(f"**#{idx+1}: {player['name']}** ({player['team']})")
                            st.write(f"PPG: {player['ppg']} | RPG: {player['rpg']} | APG: {player['apg']}")
                        
                        with col2:
                            st.write(f"FG%: {player['fg_pct']:.1%} | 3P%: {player['three_pct']:.1%}")
                            st.write(f"SPG: {player['spg']} | BPG: {player['bpg']}")
                        
                        with col3:
                            similarity_pct = player['similarity'] * 100
                            st.metric("Similarity", f"{similarity_pct:.0f}%")
                        
                        st.divider()
    
    with tab5:
        st.header("Complete Data Table")
        
        # Display filterable and sortable dataframe
        display_df = df_filtered.copy()
        display_df['cluster_description'] = display_df['cluster'].map(cluster_descriptions)
        
        # Format percentage columns
        display_df['fg_pct'] = display_df['fg_pct'].apply(lambda x: f"{x:.1%}")
        display_df['three_pct'] = display_df['three_pct'].apply(lambda x: f"{x:.1%}")
        
        st.dataframe(
            display_df[['name', 'team', 'cluster', 'cluster_description', 'ppg', 'rpg', 'apg', 
                       'fg_pct', 'three_pct', 'spg', 'bpg', 'minutes']],
            use_container_width=True
        )
        
        # Export functionality
        csv = display_df.to_csv(index=False)
        st.download_button(
            label="📥 Download Data as CSV",
            data=csv,
            file_name='nba_clustering_analysis.csv',
            mime='text/csv'
        )

else:
    st.warning("Please select at least 2 features for clustering analysis.")

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666; padding: 20px;'>
    <h4>🏀 NBA Clustering Insights</h4>
    <p>This analysis uses K-means clustering to identify player archetypes based on statistical performance. 
    The algorithm automatically discovers natural groupings in player data, revealing distinct roles and playing styles in the modern NBA.</p>
    <p><strong>Features:</strong> {}</p>
    <p><strong>Algorithm:</strong> K-means with StandardScaler normalization</p>
</div>
""".format(", ".join(features_to_use)), unsafe_allow_html=True)
