import pandas as pd
import numpy as np

# Create comprehensive data for glamping structures analysis
# Based on research findings

# Structure types and their costs (CAPEX)
structures_data = {
    'Structure Type': ['Yurt', 'Barndominium', 'Quonset Hut', 'Geodesic Dome', 'Tiny House', 'Safari Tent', 'FEMA Tent'],
    'Kit Cost ($)': [12000, 40000, 15000, 18000, 25000, 3200, 800],
    'Platform/Foundation ($)': [8000, 25000, 12000, 8000, 12000, 5000, 2000],
    'Utilities Setup ($)': [15000, 20000, 18000, 15000, 18000, 8000, 3000],
    'Interior Fit-out ($)': [8000, 35000, 15000, 12000, 20000, 6000, 2000],
    'Labor ($)': [5000, 20000, 8000, 6000, 15000, 3000, 1000],
    'Total CAPEX ($)': [48000, 140000, 68000, 59000, 90000, 25200, 8800],
    'Square Feet': [314, 1200, 1000, 450, 400, 240, 150],
    'CAPEX per Sq Ft': [153, 117, 68, 131, 225, 105, 59]
}

# Operational costs (OPEX) per month
opex_data = {
    'Structure Type': ['Yurt', 'Barndominium', 'Quonset Hut', 'Geodesic Dome', 'Tiny House', 'Safari Tent', 'FEMA Tent'],
    'Utilities/month ($)': [120, 200, 150, 130, 140, 80, 50],
    'Cleaning/turn ($)': [35, 85, 60, 45, 50, 30, 20],
    'Supplies/month ($)': [25, 50, 35, 30, 35, 20, 15],
    'Maintenance/month ($)': [100, 250, 180, 120, 150, 80, 40],
    'Insurance/month ($)': [85, 180, 120, 100, 130, 65, 35],
    'Platform Fee (%)': [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0],
    'Total OPEX/month ($)': [365, 765, 545, 425, 505, 275, 160]
}

# Market data from Tennessee Smokies region
market_data = {
    'Market': ['Maryville', 'Townsend', 'Walland'],
    'ADR ($)': [141, 149, 211],
    'Occupancy (%)': [49.5, 61.0, 39.5],
    'RevPAR ($)': [70, 91, 83],
    'Annual Revenue ($)': [25550, 33215, 30295],
    'Seasonality Factor': [1.15, 1.20, 1.25]  # Peak vs low season variation
}

# Quality scoring dimensions (0-10 scale)
quality_scores = {
    'Structure Type': ['Yurt', 'Barndominium', 'Quonset Hut', 'Geodesic Dome', 'Tiny House', 'Safari Tent', 'FEMA Tent'],
    'Comfort': [7, 9, 6, 8, 8, 6, 4],
    'Privacy': [8, 9, 7, 7, 8, 5, 3],
    'Amenities': [6, 9, 7, 7, 8, 5, 3],
    'Aesthetic': [8, 7, 5, 9, 8, 7, 2],
    'Durability': [8, 9, 9, 8, 7, 6, 4],
    'Seasonality Fit': [7, 9, 8, 8, 7, 5, 3],
    'Setup Time': [8, 4, 6, 7, 5, 9, 9],
    'Regulatory Fit': [7, 8, 6, 6, 5, 8, 9]
}

# Convert to DataFrames
df_structures = pd.DataFrame(structures_data)
df_opex = pd.DataFrame(opex_data)
df_market = pd.DataFrame(market_data)
df_quality = pd.DataFrame(quality_scores)

# Calculate weighted quality scores
weights = {'Comfort': 0.18, 'Privacy': 0.10, 'Amenities': 0.15, 'Aesthetic': 0.12, 
          'Durability': 0.15, 'Seasonality Fit': 0.12, 'Setup Time': 0.08, 'Regulatory Fit': 0.10}

df_quality['Quality Score'] = (
    df_quality['Comfort'] * weights['Comfort'] +
    df_quality['Privacy'] * weights['Privacy'] +
    df_quality['Amenities'] * weights['Amenities'] +
    df_quality['Aesthetic'] * weights['Aesthetic'] +
    df_quality['Durability'] * weights['Durability'] +
    df_quality['Seasonality Fit'] * weights['Seasonality Fit'] +
    df_quality['Setup Time'] * weights['Setup Time'] +
    df_quality['Regulatory Fit'] * weights['Regulatory Fit']
)

print("Structure Cost Analysis:")
print(df_structures.round(0))
print("\nOperational Costs (Monthly):")
print(df_opex.round(0))
print("\nMarket Data:")
print(df_market.round(0))
print("\nQuality Scores:")
print(df_quality[['Structure Type', 'Quality Score']].round(2))