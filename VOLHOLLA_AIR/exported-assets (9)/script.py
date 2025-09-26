import pandas as pd
import numpy as np
import csv

# First, let's create a comprehensive comparison table of structure types with collected data
structure_types = {
    'Type': ['Yurt (Shield Dome)', 'Barndominium (Mead Hall)', 'Quonset Hut (Iron Longhouse)', 
             'Geodesic Dome (Odin\'s Eye Dome)', 'Tiny House (Viking Cabin)', 
             'Safari Tent (Raiders\' Pavilion)', 'FEMA/Military Tent (Traveler\'s Shelter)'],
    
    'Base_Kit_Cost': [8000, 55200, 32640, 5840, 30000, 3800, 1500],  # USD
    'Size_SqFt': [314, 2300, 5000, 415, 400, 450, 200],
    'Platform_Foundation_Cost': [1600, 8000, 12000, 1600, 8000, 800, 400],
    'Utilities_HVAC_Cost': [3000, 15000, 8000, 2500, 8000, 2000, 1000],
    'Interior_Finish_Cost': [8000, 40000, 20000, 6000, 25000, 4000, 2000],
    'Labor_Install_Cost': [2000, 12000, 8000, 1500, 10000, 1500, 500],
    'Total_CAPEX': [22600, 130200, 80640, 17440, 81000, 12100, 5400]
}

# Create DataFrame
df_structures = pd.DataFrame(structure_types)

print("VOLHOLLA VIKING GLAMPING STRUCTURE COMPARISON")
print("=" * 60)
print(df_structures.to_string(index=False))

# Calculate cost per square foot
df_structures['Cost_Per_SqFt'] = df_structures['Total_CAPEX'] / df_structures['Size_SqFt']
print("\n\nCOST PER SQUARE FOOT ANALYSIS:")
print("=" * 40)
cost_analysis = df_structures[['Type', 'Size_SqFt', 'Total_CAPEX', 'Cost_Per_SqFt']].round(2)
print(cost_analysis.to_string(index=False))

# Market data from research
market_data = {
    'Location': ['Maryville TN', 'Townsend TN', 'Walland TN (Blackberry Farm area)', 
                'Sevierville TN', 'Gatlinburg TN', 'Pigeon Forge TN'],
    'Avg_ADR': [220, 310, 400, 375, 335, 326],
    'Occupancy_Rate': [55, 43, 60, 58, 55, 53],
    'Annual_Revenue': [44000, 48700, 87600, 79500, 67200, 63100],
    'Market_Type': ['Gateway to GSMNP', 'Peaceful Side Smokies', 'Luxury Halo', 
                   'Tourist Hub', 'Mountain Town', 'Attraction Center']
}

df_market = pd.DataFrame(market_data)
print("\n\nMARKET DATA - SMOKY MOUNTAINS REGION:")
print("=" * 50)
print(df_market.to_string(index=False))

# Calculate RevPAR (Revenue Per Available Room per night)
df_market['RevPAR'] = (df_market['Avg_ADR'] * df_market['Occupancy_Rate'] / 100).round(2)
print("\n\nREVPAR ANALYSIS:")
print("=" * 20)
revpar_analysis = df_market[['Location', 'Avg_ADR', 'Occupancy_Rate', 'RevPAR']].round(2)
print(revpar_analysis.to_string(index=False))

# Operational costs estimates
opex_data = {
    'Type': ['Yurt (Shield Dome)', 'Barndominium (Mead Hall)', 'Quonset Hut (Iron Longhouse)', 
             'Geodesic Dome (Odin\'s Eye Dome)', 'Tiny House (Viking Cabin)', 
             'Safari Tent (Raiders\' Pavilion)', 'FEMA/Military Tent (Traveler\'s Shelter)'],
    'Annual_Utilities': [1800, 4000, 3500, 2000, 3000, 1500, 1000],
    'Cleaning_Laundry': [3600, 6000, 5500, 4000, 4500, 3000, 2500],
    'Maintenance_Repairs': [1500, 4000, 3000, 1200, 2500, 2000, 1500],
    'Insurance': [2000, 4500, 3500, 2200, 3000, 1800, 1200],
    'Platform_Fees_15pct': [6600, 11925, 7310, 13140, 11925, 7310, 13140],
    'Property_Tax': [800, 2000, 1500, 600, 1500, 400, 200],
    'Total_OPEX': [16300, 32425, 24310, 23140, 26425, 16010, 19540]
}

df_opex = pd.DataFrame(opex_data)
print("\n\nANNUAL OPERATING EXPENSES (OPEX):")
print("=" * 40)
print(df_opex.to_string(index=False))

# Save all data to CSV files
df_structures.to_csv('volholla_structure_costs.csv', index=False)
df_market.to_csv('volholla_market_data.csv', index=False)
df_opex.to_csv('volholla_opex_data.csv', index=False)

print("\n\nCSV FILES CREATED:")
print("- volholla_structure_costs.csv")  
print("- volholla_market_data.csv")
print("- volholla_opex_data.csv")