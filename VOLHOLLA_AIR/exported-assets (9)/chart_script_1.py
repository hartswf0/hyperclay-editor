import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

# Data from the JSON
data = {
    'Type': [
        'FEMA/Military Tent (Traveler\'s Shelter)',
        'Safari Tent (Raiders\' Pavilion)',
        'Geodesic Dome (Odin\'s Eye Dome)',
        'Yurt (Shield Dome)',
        'Quonset Hut (Iron Longhouse)',
        'Tiny House (Viking Cabin)',
        'Barndominium (Mead Hall)'
    ],
    'Payback_Years': [0.19, 0.37, 0.68, 0.70, 3.31, 3.64, 8.02],
    'ROI_Percent': [539.2, 269.8, 146.3, 143.2, 30.2, 27.4, 12.5]
}

df = pd.DataFrame(data)

# Create abbreviated structure names to fit 15 character limit
df['Short_Type'] = [
    'FEMA Tent',
    'Safari Tent', 
    'Geodesic Dome',
    'Yurt',
    'Quonset Hut',
    'Tiny House',
    'Barndominium'
]

# Define tiers based on payback periods
# MVP: <1 year, Mid-Tier: 3-4 years, Flagship: >8 years
df['Tier'] = ['MVP' if x < 1 else 'Mid-Tier' if x < 8 else 'Flagship' for x in df['Payback_Years']]

# Sort by payback period (shortest to longest)
df = df.sort_values('Payback_Years')

# Define colors for each tier
color_map = {
    'MVP': '#1FB8CD',        # Strong cyan
    'Mid-Tier': '#2E8B57',   # Sea green  
    'Flagship': '#DB4545'    # Bright red
}

# Assign colors based on tier
df['Color'] = df['Tier'].map(color_map)

# Create horizontal bar chart with single trace to maintain sort order
fig = go.Figure()

fig.add_trace(go.Bar(
    y=df['Short_Type'],
    x=df['Payback_Years'],
    orientation='h',
    marker_color=df['Color'],
    text=[f"{roi:.1f}%" for roi in df['ROI_Percent']],
    textposition='inside',
    textfont=dict(size=12, color='white'),
    showlegend=False
))

# Add custom legend traces (invisible bars for legend)
for tier in ['MVP', 'Mid-Tier', 'Flagship']:
    fig.add_trace(go.Bar(
        y=[None], x=[None],
        name=tier,
        marker_color=color_map[tier],
        showlegend=True
    ))

fig.update_layout(
    title='Volholla Payback Period by Structure',
    xaxis_title='Payback (Years)',
    yaxis_title='Structure Type',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    showlegend=True
)

fig.update_traces(cliponaxis=False)

# Set y-axis order from shortest to longest payback (reverse the sorted list)
fig.update_yaxes(categoryorder='array', categoryarray=df['Short_Type'].tolist()[::-1])

# Save as both PNG and SVG
fig.write_image('payback_chart.png')
fig.write_image('payback_chart.svg', format='svg')

fig.show()