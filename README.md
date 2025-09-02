# NBA Player Clustering Analysis

Interactive NBA player clustering analysis using K-means machine learning to identify player archetypes and statistical similarities.

## Live Demo

https://nba-clustering-analysis.streamlit.app/
## Features
- **Interactive Clustering**: Visualize player groupings with customizable parameters
- **3D Visualizations**: Explore clusters in multiple dimensions  
- **Player Similarity**: Find statistically similar players with accuracy percentages
- **Radar Charts**: Detailed individual player statistical profiles
- **Advanced Analytics**: Comprehensive cluster insights with silhouette scoring
- **Data Export**: Download results as CSV files

## Technologies
- **Python**: Core programming language
- **Streamlit**: Interactive web application framework
- **scikit-learn**: Professional machine learning algorithms
- **Plotly**: Interactive 3D visualizations
- **Pandas**: Advanced data manipulation

##  Data
2023-24 NBA season statistics including:
- Offensive stats: Points, Assists per game
- Rebounding: Rebounds per game
- Shooting efficiency: Field Goal %, 3-Point %
- Defensive impact: Steals, Blocks per game
- Usage: Minutes played per game

## Local Development
```bash
pip install -r requirements.txt
streamlit run app.py
