import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Create the data from the provided JSON
data = {
    'name': ['Safari Tent', 'Geodesic Dome', 'Yurt', 'Quonset Hut', 'Tiny House Kit', 'Barndominium', 'FEMA Tent Upg'],
    'quality_score': [6.39, 7.41, 6.85, 6.21, 7.25, 7.58, 4.12],
    'price_index': [8.64, 7.57, 8.39, 6.89, 7.77, 0.0, 10.0],
    'bang_for_buck': [5.62, 5.96, 5.90, 4.74, 5.93, 3.79, 4.12]
}

df = pd.DataFrame(data)

# Find Pareto frontier points (minimize price, maximize quality)
pareto_indices = []
for i, row in df.iterrows():
    is_pareto = True
    for j, other_row in df.iterrows():
        if i != j:
            # Other point dominates if it has higher/equal quality AND lower/equal price (with at least one strict)
            if (other_row['quality_score'] >= row['quality_score'] and 
                other_row['price_index'] <= row['price_index'] and
                (other_row['quality_score'] > row['quality_score'] or 
                 other_row['price_index'] < row['price_index'])):
                is_pareto = False
                break
    if is_pareto:
        pareto_indices.append(i)

# Create the scatter plot
fig = go.Figure()

# Define text positions to avoid overlap
text_positions = ['top center', 'bottom center', 'middle right', 'middle left', 
                 'top right', 'bottom left', 'top left']

# Add scatter plot with points sized by bang_for_buck
for i, (idx, row) in enumerate(df.iterrows()):
    # Special handling for Barndominium (price index = 0)
    marker_color = '#DB4545' if row['name'] == 'Barndominium' else '#1FB8CD'
    
    fig.add_trace(go.Scatter(
        x=[row['quality_score']],
        y=[row['price_index']],
        mode='markers+text',
        text=[row['name']],
        textposition=text_positions[i % len(text_positions)],
        marker=dict(
            size=row['bang_for_buck'] * 10,  # Scale up for visibility
            color=marker_color,
            line=dict(width=2, color='white')
        ),
        name=row['name'],
        hovertemplate='<b>%{text}</b><br>' +
                      'Quality Score: %{x:.2f}<br>' +
                      'Price Index: %{y:.2f}<br>' +
                      f'Bang-for-Buck: {row["bang_for_buck"]:.2f}<br>' +
                      '<extra></extra>',
        showlegend=False
    ))

# Add Pareto frontier
if len(pareto_indices) > 1:
    pareto_df = df.iloc[pareto_indices].sort_values('quality_score')
    
    # Create step-wise Pareto frontier
    frontier_x = []
    frontier_y = []
    
    for i, (_, row) in enumerate(pareto_df.iterrows()):
        if i == 0:
            # Start from left edge
            frontier_x.extend([3.5, row['quality_score']])
            frontier_y.extend([row['price_index'], row['price_index']])
        else:
            # Add horizontal then vertical segments
            prev_y = frontier_y[-1]
            frontier_x.extend([row['quality_score'], row['quality_score']])
            frontier_y.extend([prev_y, row['price_index']])
    
    # Extend to right edge
    frontier_x.append(8.0)
    frontier_y.append(frontier_y[-1])
    
    fig.add_trace(go.Scatter(
        x=frontier_x,
        y=frontier_y,
        mode='lines',
        line=dict(color='#2E8B57', width=3, dash='dash'),
        name='Pareto Frontier',
        hoverinfo='skip',
        showlegend=True
    ))

# Add iso-lines for constant bang-for-buck ratios
for bfb_value in [4.0, 5.0, 6.0]:
    x_iso = np.linspace(4, 8, 100)
    # Assuming bang-for-buck is roughly quality/price relationship
    y_iso = x_iso / bfb_value * 10  # Scale factor to match data range
    
    # Only show relevant parts of iso-lines
    valid_mask = (y_iso >= 0) & (y_iso <= 10.5)
    if np.any(valid_mask):
        fig.add_trace(go.Scatter(
            x=x_iso[valid_mask],
            y=y_iso[valid_mask],
            mode='lines',
            line=dict(color='#5D878F', width=1, dash='dot'),
            opacity=0.4,
            name=f'BfB={bfb_value}',
            hoverinfo='skip',
            showlegend=False
        ))

# Add annotation for Barndominium's special case
fig.add_annotation(
    x=7.58,
    y=0.5,
    text="Price Index = 0",
    showarrow=True,
    arrowhead=2,
    arrowsize=1,
    arrowwidth=2,
    arrowcolor="#DB4545",
    font=dict(size=10, color="#DB4545")
)

# Update layout
fig.update_layout(
    title='Quality vs Price: Glamping Structures',
    xaxis_title='Quality Score',
    yaxis_title='Price Index',
    xaxis=dict(range=[3.5, 8]),
    yaxis=dict(range=[-0.5, 10.5]),
    showlegend=True,
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update traces for better visibility
fig.update_traces(cliponaxis=False)

# Save as both PNG and SVG
fig.write_image("glamping_scatter.png")
fig.write_image("glamping_scatter.svg", format="svg")

fig.show()