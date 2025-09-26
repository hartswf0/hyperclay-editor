import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Create dataframe from the provided data
data = [
    {"Structure Type": "Yurt", "Quality Score": 7.30, "Price Index": 7.28, "Bang for Buck": 5.74},
    {"Structure Type": "Barndominium", "Quality Score": 8.26, "Price Index": 1.00, "Bang for Buck": 4.35},
    {"Structure Type": "Quonset Hut", "Quality Score": 6.82, "Price Index": 5.77, "Bang for Buck": 4.79},
    {"Structure Type": "Geodesic Dome", "Quality Score": 7.59, "Price Index": 6.51, "Bang for Buck": 5.63},
    {"Structure Type": "Tiny House", "Quality Score": 7.19, "Price Index": 4.47, "Bang for Buck": 4.63},
    {"Structure Type": "Safari Tent", "Quality Score": 6.19, "Price Index": 8.82, "Bang for Buck": 5.54},
    {"Structure Type": "FEMA Tent", "Quality Score": 4.29, "Price Index": 10.00, "Bang for Buck": 4.29}
]

df = pd.DataFrame(data)

# Create scatter plot
fig = go.Figure()

# Define colors for each structure type (using the brand colors in order)
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C', '#B4413C', '#964325']

# Add scatter points for each structure type
for i, structure in enumerate(df['Structure Type'].unique()):
    structure_data = df[df['Structure Type'] == structure]
    # Abbreviate structure names if needed for text labels
    abbreviated_name = structure[:15] if len(structure) > 15 else structure
    
    fig.add_trace(go.Scatter(
        x=structure_data['Quality Score'],
        y=structure_data['Price Index'],
        mode='markers+text',
        text=[abbreviated_name],
        textposition="top center",
        marker=dict(
            size=12,
            color=colors[i % len(colors)]
        ),
        name=structure[:15],  # Abbreviate legend names too
        showlegend=True,
        hovertemplate='<b>%{text}</b><br>Quality: %{x}<br>Price: %{y}<extra></extra>'
    ))

# Add iso-lines for bang-for-buck performance (Quality/Price ratio lines)
x_range = np.linspace(4, 9, 100)
performance_ratios = [0.5, 1.0, 1.5, 2.0]

for ratio in performance_ratios:
    y_line = x_range / ratio
    # Only show parts of the line that are within reasonable bounds
    valid_mask = (y_line >= 0) & (y_line <= 11)
    if np.any(valid_mask):
        fig.add_trace(go.Scatter(
            x=x_range[valid_mask],
            y=y_line[valid_mask],
            mode='lines',
            line=dict(dash='dot', width=1, color='lightgray'),
            showlegend=False,
            hoverinfo='skip'
        ))

fig.update_layout(
    title="Quality vs Price: Glamping Structures",
    xaxis_title="Quality Score",
    yaxis_title="Price Index"
)

fig.update_traces(cliponaxis=False)

# Save as both PNG and SVG
fig.write_image("chart.png")
fig.write_image("chart.svg", format="svg")