import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np

# Load the data
data = {
    "structures": [
        {"name": "Safari Tent", "quality_category": "Medium", "cost_category": "Medium-Low", "payback": 1.4, "quality_score": 6.39, "capex": 38250},
        {"name": "Geodesic Dome", "quality_category": "High", "cost_category": "Medium-High", "payback": 1.3, "quality_score": 7.41, "capex": 61250},
        {"name": "Yurt", "quality_category": "Medium-High", "cost_category": "Medium", "payback": 1.2, "quality_score": 6.85, "capex": 43500},
        {"name": "Quonset Hut", "quality_category": "Medium", "cost_category": "High", "payback": 3.5, "quality_score": 6.21, "capex": 76000},
        {"name": "Tiny House Kit", "quality_category": "High", "cost_category": "Medium-High", "payback": 1.4, "quality_score": 7.25, "capex": 57000},
        {"name": "Barndominium", "quality_category": "Highest", "cost_category": "Highest", "payback": 4.5, "quality_score": 7.58, "capex": 225000},
        {"name": "FEMA Tent Upgraded", "quality_category": "Low", "cost_category": "Lowest", "payback": 0.6, "quality_score": 4.12, "capex": 8750}
    ]
}

# Convert to DataFrame
df = pd.DataFrame(data["structures"])

# Define category orders
quality_order = ["Low", "Medium", "Medium-High", "High", "Highest"]
cost_order = ["Lowest", "Medium-Low", "Medium", "Medium-High", "High", "Highest"]

# Create mapping for matrix positions
quality_map = {cat: i for i, cat in enumerate(quality_order)}
cost_map = {cat: i for i, cat in enumerate(cost_order)}

# Create matrix for payback periods
matrix_size_x = len(quality_order)
matrix_size_y = len(cost_order)
payback_matrix = np.full((matrix_size_y, matrix_size_x), np.nan)
text_matrix = [["" for _ in range(matrix_size_x)] for _ in range(matrix_size_y)]

# Fill matrix with data
for _, row in df.iterrows():
    x_pos = quality_map[row['quality_category']]
    y_pos = cost_map[row['cost_category']]
    payback_matrix[y_pos, x_pos] = row['payback']
    
    # Create text with structure name and payback
    name_short = row['name'][:12]  # Truncate long names
    text_matrix[y_pos][x_pos] = f"{name_short}<br>{row['payback']} yrs"

# Identify Pareto frontier structures
pareto_points = []
for i, row in df.iterrows():
    is_pareto = True
    for j, other_row in df.iterrows():
        if i != j:
            if other_row['quality_score'] >= row['quality_score'] and other_row['capex'] <= row['capex']:
                if other_row['quality_score'] > row['quality_score'] or other_row['capex'] < row['capex']:
                    is_pareto = False
                    break
    pareto_points.append(is_pareto)

df['is_pareto'] = pareto_points

# Create custom colorscale for payback periods
# Lower payback (better) = green, higher payback (worse) = red
colorscale = [
    [0.0, "#2E8B57"],    # Best payback - green
    [0.25, "#1FB8CD"],   # Good payback - cyan  
    [0.5, "#D2BA4C"],    # Medium payback - yellow
    [0.75, "#DB4545"],   # Poor payback - red
    [1.0, "#B4413C"]     # Worst payback - dark red
]

# Create the heatmap
fig = go.Figure(data=go.Heatmap(
    z=payback_matrix,
    x=quality_order,
    y=cost_order[::-1],  # Reverse to have lowest cost at bottom
    text=text_matrix[::-1],  # Reverse to match y-axis
    texttemplate="%{text}",
    textfont={"size": 11},
    colorscale=colorscale,
    colorbar=dict(
        title="Payback (yrs)"
    ),
    hoverongaps=False,
    hovertemplate='Quality: %{x}<br>Cost: %{y}<br>%{text}<extra></extra>'
))

# Add quadrant backgrounds to highlight optimal zones
# Add rectangle for optimal quadrant (High Quality, Low-Medium Cost)
fig.add_shape(
    type="rect",
    x0=2.5, y0=-0.5, x1=4.5, y1=2.5,  # High/Highest quality, Lowest/Medium-Low/Medium cost
    line=dict(color="black", width=3, dash="dash"),
    fillcolor="rgba(46, 139, 87, 0.1)"  # Light green overlay
)

# Add annotations for quadrants
fig.add_annotation(
    x=3.5, y=1, 
    text="OPTIMAL ZONE",
    showarrow=False,
    font=dict(size=12, color="black"),
    bgcolor="rgba(255,255,255,0.9)",
    bordercolor="black",
    borderwidth=2
)

# Highlight Pareto frontier structures with borders
for _, row in df[df['is_pareto']].iterrows():
    x_pos = quality_map[row['quality_category']]
    y_pos = len(cost_order) - 1 - cost_map[row['cost_category']]  # Adjust for reversed y-axis
    
    fig.add_shape(
        type="rect",
        x0=x_pos-0.45, y0=y_pos-0.45, 
        x1=x_pos+0.45, y1=y_pos+0.45,
        line=dict(color="black", width=4)
    )

# Add legend annotation to explain Pareto frontier
fig.add_annotation(
    x=4.5, y=5.8,
    text="Black borders:<br>Pareto frontier",
    showarrow=False,
    font=dict(size=10, color="black"),
    bgcolor="rgba(255,255,255,0.9)",
    bordercolor="black",
    borderwidth=1,
    xanchor="left"
)

# Update layout
fig.update_layout(
    title='Glamping Payoff Matrix',
    xaxis_title='Quality Level',
    yaxis_title='Cost Level',
    xaxis=dict(side="bottom"),
    yaxis=dict(side="left")
)

# Save as PNG and SVG
fig.write_image('glamping_payoff_matrix.png')
fig.write_image('glamping_payoff_matrix.svg', format='svg')

fig.show()