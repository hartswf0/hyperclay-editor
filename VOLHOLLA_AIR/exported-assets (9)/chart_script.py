import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Create the data
data = {
    'Structure': [
        'Geodesic Dome', 'Yurt', 'Safari Tent', 'FEMA Tent',
        'Tiny House', 'Quonset Hut', 'Barndominium'
    ],
    'Quality_Score': [7.48, 7.22, 6.50, 5.05, 7.18, 6.76, 7.97],
    'Price_Index': [8.66, 8.26, 9.07, 9.59, 3.78, 3.81, 0.00],
    'Bang_for_Buck': [6.60, 6.15, 5.95, 4.85, 4.43, 4.17, 3.98]
}

df = pd.DataFrame(data)

# Identify Pareto frontier points (not dominated by any other point)
pareto_points = []
for i, row in df.iterrows():
    is_dominated = False
    for j, other_row in df.iterrows():
        if i != j:
            # A point is dominated if another point has both higher quality AND higher price index
            if other_row['Quality_Score'] > row['Quality_Score'] and other_row['Price_Index'] > row['Price_Index']:
                is_dominated = True
                break
    if not is_dominated:
        pareto_points.append(i)

# Identify best bang-for-buck (top 3 highest Bang_for_Buck scores)
top_bang_for_buck = df.nlargest(3, 'Bang_for_Buck').index.tolist()

# Create scatter plot
fig = go.Figure()

# Add regular points
regular_points = [i for i in range(len(df)) if i not in pareto_points and i not in top_bang_for_buck]
if regular_points:
    fig.add_trace(go.Scatter(
        x=df.iloc[regular_points]['Quality_Score'],
        y=df.iloc[regular_points]['Price_Index'],
        mode='markers+text',
        text=df.iloc[regular_points]['Structure'],
        textposition='top center',
        marker=dict(
            size=12,
            color='#5D878F',
            line=dict(width=2, color='white')
        ),
        name='Standard',
        hovertemplate='<b>%{text}</b><br>' +
                      'Quality: %{x}<br>' +
                      'Price Index: %{y}<br>' +
                      '<extra></extra>'
    ))

# Add Pareto frontier points
pareto_only = [i for i in pareto_points if i not in top_bang_for_buck]
if pareto_only:
    fig.add_trace(go.Scatter(
        x=df.iloc[pareto_only]['Quality_Score'],
        y=df.iloc[pareto_only]['Price_Index'],
        mode='markers+text',
        text=df.iloc[pareto_only]['Structure'],
        textposition='top center',
        marker=dict(
            size=14,
            color='#2E8B57',
            symbol='diamond',
            line=dict(width=2, color='white')
        ),
        name='Pareto Optimal',
        hovertemplate='<b>%{text}</b><br>' +
                      'Quality: %{x}<br>' +
                      'Price Index: %{y}<br>' +
                      'Pareto Optimal<br>' +
                      '<extra></extra>'
    ))

# Add best bang-for-buck points (highlighted)
fig.add_trace(go.Scatter(
    x=df.iloc[top_bang_for_buck]['Quality_Score'],
    y=df.iloc[top_bang_for_buck]['Price_Index'],
    mode='markers+text',
    text=df.iloc[top_bang_for_buck]['Structure'],
    textposition='top center',
    marker=dict(
        size=16,
        color='#1FB8CD',
        symbol='star',
        line=dict(width=3, color='#DB4545')
    ),
    name='Best Bang-for-Buck',
    hovertemplate='<b>%{text}</b><br>' +
                  'Quality: %{x}<br>' +
                  'Price Index: %{y}<br>' +
                  'Bang-for-Buck: %{customdata:.2f}<br>' +
                  '<extra></extra>',
    customdata=df.iloc[top_bang_for_buck]['Bang_for_Buck']
))

# Add trend line
z = np.polyfit(df['Quality_Score'], df['Price_Index'], 1)
p = np.poly1d(z)
x_trend = np.linspace(df['Quality_Score'].min(), df['Quality_Score'].max(), 100)
y_trend = p(x_trend)

fig.add_trace(go.Scatter(
    x=x_trend,
    y=y_trend,
    mode='lines',
    line=dict(color='#DB4545', width=2, dash='dash'),
    name='Trend',
    hovertemplate='Trend Line<extra></extra>'
))

# Update layout
fig.update_layout(
    title='Quality vs Price (Higher Index = Lower Cost)',
    xaxis_title='Quality Score',
    yaxis_title='Price Index (Higher = Lower Cost)',
    showlegend=True,
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.05,
        xanchor='center',
        x=0.5
    )
)

# Update traces
fig.update_traces(cliponaxis=False)

# Save as both PNG and SVG
fig.write_image('scatter_plot.png')
fig.write_image('scatter_plot.svg', format='svg')

fig.show()