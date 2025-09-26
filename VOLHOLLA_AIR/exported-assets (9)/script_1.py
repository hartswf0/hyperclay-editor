# Calculate financial metrics and create scoring matrix
import pandas as pd
import numpy as np

# Load the data
df_structures = pd.read_csv('volholla_structure_costs.csv')
df_opex = pd.read_csv('volholla_opex_data.csv')

# Merge structure and opex data
df_analysis = pd.merge(df_structures, df_opex[['Type', 'Total_OPEX']], on='Type')

# Use Townsend TN as base case (moderate ADR, lower occupancy but "Peaceful Side" brand fit)
base_adr = 310
base_occupancy = 43
annual_nights = 365
revenue_per_night = base_adr * (base_occupancy / 100)
base_annual_revenue = revenue_per_night * annual_nights

print(f"BASE CASE ASSUMPTIONS (Townsend TN - 'Peaceful Side of Smokies'):")
print(f"Average Daily Rate: ${base_adr}")
print(f"Occupancy Rate: {base_occupancy}%")
print(f"Revenue per Available Night: ${revenue_per_night:.2f}")
print(f"Base Annual Revenue: ${base_annual_revenue:,.0f}")

# Calculate financial metrics
df_analysis['Annual_Revenue'] = base_annual_revenue
df_analysis['Annual_Net_Income'] = df_analysis['Annual_Revenue'] - df_analysis['Total_OPEX']
df_analysis['Payback_Years'] = df_analysis['Total_CAPEX'] / df_analysis['Annual_Net_Income']
df_analysis['ROI_Percent'] = (df_analysis['Annual_Net_Income'] / df_analysis['Total_CAPEX'] * 100).round(1)

# Quality scoring (0-10 scale for each dimension)
quality_scores = {
    'Type': df_analysis['Type'].tolist(),
    'Comfort': [7, 9, 6, 8, 9, 6, 4],  # Bed quality, insulation, climate control
    'Privacy': [8, 9, 7, 8, 8, 5, 3],  # Visual/auditory separation
    'Amenities': [6, 10, 8, 7, 9, 5, 3],  # Bathroom, kitchen, firepit
    'Aesthetic_Viking': [8, 7, 6, 9, 7, 9, 6],  # Viking branding potential
    'Durability': [8, 10, 9, 7, 8, 6, 4],  # Lifespan, maintenance
    'Seasonality': [6, 9, 8, 7, 8, 4, 3],  # Weather performance
    'Setup_Time': [8, 3, 4, 7, 2, 9, 10],  # Installation speed (10 = fastest)
    'Regulatory': [7, 5, 6, 6, 4, 8, 9]   # Permitting ease (10 = easiest)
}

df_quality = pd.DataFrame(quality_scores)

# Calculate weighted quality score (weights from POML spec)
weights = {
    'Comfort': 0.18,
    'Privacy': 0.10, 
    'Amenities': 0.15,
    'Aesthetic_Viking': 0.15,
    'Durability': 0.12,
    'Seasonality': 0.10,
    'Setup_Time': 0.10,
    'Regulatory': 0.10
}

df_quality['Quality_Score'] = (
    df_quality['Comfort'] * weights['Comfort'] +
    df_quality['Privacy'] * weights['Privacy'] +
    df_quality['Amenities'] * weights['Amenities'] +
    df_quality['Aesthetic_Viking'] * weights['Aesthetic_Viking'] +
    df_quality['Durability'] * weights['Durability'] +
    df_quality['Seasonality'] * weights['Seasonality'] +
    df_quality['Setup_Time'] * weights['Setup_Time'] +
    df_quality['Regulatory'] * weights['Regulatory']
).round(2)

# Merge quality scores
df_final = pd.merge(df_analysis, df_quality[['Type', 'Quality_Score']], on='Type')

# Calculate Price Index (normalized 0-10, where 10 = lowest cost)
max_capex = df_final['Total_CAPEX'].max()
df_final['Price_Index'] = (10 - (df_final['Total_CAPEX'] / max_capex * 10)).round(2)

# Calculate Bang-for-Buck score
df_final['Bang_for_Buck'] = (df_final['Quality_Score'] / (1 + (df_final['Total_CAPEX'] / max_capex))).round(2)

# Sort by Bang-for-Buck score (descending)
df_final = df_final.sort_values('Bang_for_Buck', ascending=False)

print(f"\n\nFINANCIAL PERFORMANCE ANALYSIS:")
print("=" * 50)
financial_cols = ['Type', 'Total_CAPEX', 'Annual_Revenue', 'Total_OPEX', 'Annual_Net_Income', 
                  'Payback_Years', 'ROI_Percent']
print(df_final[financial_cols].round(2).to_string(index=False))

print(f"\n\nQUALITY & VALUE ANALYSIS:")
print("=" * 35)
value_cols = ['Type', 'Quality_Score', 'Price_Index', 'Bang_for_Buck', 'Payback_Years']
print(df_final[value_cols].round(2).to_string(index=False))

# Create SWOT Analysis Framework
swot_framework = {
    'Yurt (Shield Dome)': {
        'Strengths': 'Moderate cost, good Viking aesthetics, weather-resistant, proven glamping appeal',
        'Weaknesses': 'Limited space, requires platform, moderate amenities',
        'Opportunities': 'Eco-tourism trend, Instagram appeal, expandable with multiple units',
        'Threats': 'Weather damage risk, zoning restrictions, competition from cabins'
    },
    'Barndominium (Mead Hall)': {
        'Strengths': 'Maximum amenities, year-round appeal, highest durability, true "Mead Hall" experience',
        'Weaknesses': 'Highest cost, complex permitting, long setup time, limited ROI',
        'Opportunities': 'Premium pricing, wedding venue potential, luxury market positioning',
        'Threats': 'High financing requirements, regulatory barriers, oversupply of luxury units'
    },
    'Quonset Hut (Iron Longhouse)': {
        'Strengths': 'Large space, moderate cost per sq ft, durable steel construction, unique aesthetic',
        'Weaknesses': 'Industrial look requires significant interior work, condensation issues',
        'Opportunities': 'Event space rental, unique positioning, multiple revenue streams',
        'Threats': 'Permit challenges, guest expectations mismatch, HVAC complexity'
    },
    'Geodesic Dome (Odin\'s Eye Dome)': {
        'Strengths': 'Strong Viking branding, Instagram-worthy, efficient structure, moderate cost',
        'Weaknesses': 'Complex interior layout, glazing costs, limited suppliers',
        'Opportunities': 'Stargazing appeal, eco-conscious travelers, unique market position',
        'Threats': 'Weather sealing challenges, snow load concerns, permit variations'
    },
    'Tiny House (Viking Cabin)': {
        'Strengths': 'Complete amenities, residential feel, mobility option, proven market',
        'Weaknesses': 'Highest cost per sq ft, zoning complications, size limitations',
        'Opportunities': 'Tiny house movement, sustainability appeal, relocatable asset',
        'Threats': 'Regulatory uncertainty, high competition, financing challenges'
    },
    'Safari Tent (Raiders\' Pavilion)': {
        'Strengths': 'Fast setup, Viking tent aesthetics, moderate cost, flexible placement',
        'Weaknesses': 'Limited durability, seasonal use, basic amenities, weather vulnerability',
        'Opportunities': 'Quick market entry, low risk testing, event rentals',
        'Threats': 'Weather damage, limited season, permit restrictions, guest comfort concerns'
    },
    'FEMA/Military Tent (Traveler\'s Shelter)': {
        'Strengths': 'Lowest cost, fastest setup, minimal permits, authentic "traveler" experience',
        'Weaknesses': 'Basic amenities, weather limitations, durability concerns, limited appeal',
        'Opportunities': 'MVP testing, adventure tourism, festival partnerships',
        'Threats': 'Guest satisfaction risk, weather damage, limited revenue potential'
    }
}

# Save comprehensive analysis
df_final.to_csv('volholla_comprehensive_analysis.csv', index=False)

print(f"\n\nTOP 3 RECOMMENDATIONS BY BANG-FOR-BUCK:")
print("=" * 45)
top_3 = df_final.head(3)[['Type', 'Quality_Score', 'Bang_for_Buck', 'Payback_Years', 'ROI_Percent']]
print(top_3.round(2).to_string(index=False))

print(f"\n\nFILES CREATED:")
print("- volholla_comprehensive_analysis.csv")
print("\nReady for SWOT analysis and recommendations section...")
