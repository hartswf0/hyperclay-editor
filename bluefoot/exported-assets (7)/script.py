# Let's create structured data tables to organize the information we've gathered
import pandas as pd
import numpy as np

# Create Airbnb/STR comparable listings data
airbnb_comps = {
    'Listing_Type': ['Airbnb Market Data - Boone', 'Watauga Lake Vacations', 'Yurt - Asheville NC', 'Glamping Dome - Blue Ridge GA', 'Tiny Home - Butler TN', 'Treehouse - Boone NC'],
    'Location': ['Boone, NC', 'Butler, TN', 'Asheville, NC', 'Cherry Log, GA', 'Butler, TN', 'Boone, NC'],
    'Distance_Miles': [0, 15, 75, 45, 15, 0],
    'Type': ['Market Average', 'Cabin/Lake Access', 'Yurt', 'Geodesic Dome', 'Tiny Home', 'Treehouse'],
    'ADR': [156, 250, 180, 325, 225, 59],
    'Occupancy_Est': [55, 65, 60, 70, 60, 75],
    'Annual_Revenue': [31525, 59125, 39420, 83075, 49275, 16158],
    'Amenities': ['Standard STR', 'Lake access, hot tub', 'Private bathhouse, heating', 'Hot tub, full kitchen', 'Lake views, deck', 'Unique design, basic'],
    'Source': ['Airbtics', 'WataugaLakeVacations.com', 'MtnSprings.com', 'GlampBlueRidge', 'TripAdvisor', 'Airbnb']
}

comps_df = pd.DataFrame(airbnb_comps)
print("STR Comparable Listings Data:")
print(comps_df.to_string(index=False))
print("\n" + "="*80 + "\n")

# Create structure kit costs and specifications
structure_costs = {
    'Structure_Type': ['Safari Tent', 'Geodesic Dome', 'Yurt', 'Quonset Hut', 'Tiny House Kit', 'Barndominium', 'FEMA Tent Upgraded'],
    'Kit_Cost_Low': [1500, 2500, 8000, 12000, 15000, 80000, 500],
    'Kit_Cost_High': [15000, 50000, 25000, 30000, 35000, 160000, 2000],
    'Platform_Foundation': [5000, 8000, 6000, 15000, 8000, 25000, 2000],
    'Utilities_Setup': [3000, 4000, 4000, 8000, 6000, 15000, 1500],
    'Interior_Fitout': [8000, 15000, 12000, 20000, 10000, 40000, 3000],
    'Labor_Cost': [3000, 8000, 5000, 12000, 8000, 25000, 1000],
    'Total_CAPEX_Low': [20500, 37500, 35000, 67000, 47000, 185000, 8000],
    'Total_CAPEX_High': [56000, 85000, 52000, 85000, 67000, 265000, 9500],
    'Snow_Load_Rating': ['Moderate', 'Excellent', 'Good', 'Excellent', 'Good', 'Excellent', 'Poor'],
    'Wind_Rating': ['Good', 'Excellent', 'Good', 'Excellent', 'Good', 'Excellent', 'Poor'],
    'Setup_Time_Days': [3, 14, 7, 21, 14, 90, 1]
}

costs_df = pd.DataFrame(structure_costs)
print("Structure Costs and Specifications:")
print(costs_df.to_string(index=False))
print("\n" + "="*80 + "\n")

# Create operating expense estimates
opex_data = {
    'Structure_Type': ['Safari Tent', 'Geodesic Dome', 'Yurt', 'Quonset Hut', 'Tiny House Kit', 'Barndominium', 'FEMA Tent Upgraded'],
    'Utilities_Monthly': [150, 200, 180, 250, 220, 300, 100],
    'Cleaning_Per_Turn': [75, 100, 85, 120, 95, 150, 50],
    'Maintenance_Monthly': [200, 150, 180, 100, 120, 80, 300],
    'Insurance_Monthly': [200, 250, 225, 275, 240, 400, 150],
    'Platform_Fee_Percent': [15, 15, 15, 15, 15, 15, 15],
    'Annual_OPEX_Est': [7500, 8400, 7800, 8940, 8100, 11160, 7200]
}

opex_df = pd.DataFrame(opex_data)
print("Operating Expense Estimates (Annual):")
print(opex_df.to_string(index=False))
print("\n" + "="*80 + "\n")

# Calculate financial metrics
def calculate_metrics(capex_mid, annual_revenue_est, annual_opex):
    net_revenue = annual_revenue_est - annual_opex
    payback_years = capex_mid / net_revenue if net_revenue > 0 else float('inf')
    return net_revenue, payback_years

# Assume moderate ADR and occupancy for calculations
base_adr = 200  # Conservative estimate between Boone average and premium glamping
base_occupancy = 0.6  # 60% occupancy
annual_nights = 365 * base_occupancy
base_annual_revenue = base_adr * annual_nights

financial_metrics = []
for i, row in costs_df.iterrows():
    capex_mid = (row['Total_CAPEX_Low'] + row['Total_CAPEX_High']) / 2
    annual_opex = opex_df.iloc[i]['Annual_OPEX_Est']
    
    # Adjust revenue based on structure appeal/pricing power
    revenue_multipliers = {'Safari Tent': 0.8, 'Geodesic Dome': 1.3, 'Yurt': 1.0, 
                          'Quonset Hut': 0.7, 'Tiny House Kit': 1.1, 'Barndominium': 1.4, 'FEMA Tent Upgraded': 0.5}
    
    adjusted_revenue = base_annual_revenue * revenue_multipliers[row['Structure_Type']]
    net_revenue, payback = calculate_metrics(capex_mid, adjusted_revenue, annual_opex)
    
    financial_metrics.append({
        'Structure_Type': row['Structure_Type'],
        'CAPEX_Mid': capex_mid,
        'Est_Annual_Revenue': adjusted_revenue,
        'Annual_OPEX': annual_opex,
        'Net_Annual_Revenue': net_revenue,
        'Payback_Years': round(payback, 1) if payback != float('inf') else 'N/A'
    })

financial_df = pd.DataFrame(financial_metrics)
print("Financial Analysis Summary:")
print(financial_df.to_string(index=False))
print("\n" + "="*80 + "\n")

# Quality scoring (0-10 scale for each dimension)
quality_scores = {
    'Structure_Type': ['Safari Tent', 'Geodesic Dome', 'Yurt', 'Quonset Hut', 'Tiny House Kit', 'Barndominium', 'FEMA Tent Upgraded'],
    'Comfort': [6, 8, 7, 5, 8, 9, 3],
    'Privacy': [7, 6, 7, 8, 8, 9, 5],
    'Amenities': [5, 7, 6, 6, 8, 9, 3],
    'Aesthetic': [7, 9, 8, 4, 7, 6, 2],
    'Durability': [6, 8, 7, 9, 7, 9, 3],
    'Seasonality_Fit': [5, 8, 6, 8, 7, 9, 2],
    'Setup_Time': [9, 6, 7, 4, 6, 2, 10],
    'Regulatory_Fit': [8, 6, 7, 5, 6, 4, 9]
}

# Weights from the specification
weights = {
    'Comfort': 0.18,
    'Privacy': 0.10,
    'Amenities': 0.15,
    'Aesthetic': 0.12,
    'Durability': 0.15,
    'Seasonality_Fit': 0.12,
    'Setup_Time': 0.08,
    'Regulatory_Fit': 0.10
}

quality_df = pd.DataFrame(quality_scores)

# Calculate weighted quality scores
quality_df['Quality_Score'] = (
    quality_df['Comfort'] * weights['Comfort'] +
    quality_df['Privacy'] * weights['Privacy'] +
    quality_df['Amenities'] * weights['Amenities'] +
    quality_df['Aesthetic'] * weights['Aesthetic'] +
    quality_df['Durability'] * weights['Durability'] +
    quality_df['Seasonality_Fit'] * weights['Seasonality_Fit'] +
    quality_df['Setup_Time'] * weights['Setup_Time'] +
    quality_df['Regulatory_Fit'] * weights['Regulatory_Fit']
).round(2)

print("Quality Scoring Matrix:")
print(quality_df.to_string(index=False))
print("\n" + "="*80 + "\n")

# Bang for Buck calculation
# Normalize costs (inverse - lower cost = higher score)
max_capex = financial_df['CAPEX_Mid'].max()
min_capex = financial_df['CAPEX_Mid'].min()

financial_df['Price_Index'] = 10 * (max_capex - financial_df['CAPEX_Mid']) / (max_capex - min_capex)
financial_df['Quality_Score'] = quality_df['Quality_Score']
financial_df['Bang_for_Buck'] = financial_df['Quality_Score'] / (1 + (10 - financial_df['Price_Index'])/10)
financial_df['BFB_Rank'] = financial_df['Bang_for_Buck'].rank(ascending=False).astype(int)

print("Bang for Buck Analysis:")
print(financial_df[['Structure_Type', 'Quality_Score', 'Price_Index', 'Bang_for_Buck', 'BFB_Rank', 'Payback_Years']].to_string(index=False))

# Save data to CSV files
comps_df.to_csv('glamping_comps.csv', index=False)
costs_df.to_csv('structure_costs.csv', index=False)
opex_df.to_csv('operating_expenses.csv', index=False)
financial_df.to_csv('financial_analysis.csv', index=False)
quality_df.to_csv('quality_scores.csv', index=False)

print(f"\n✓ Data exported to CSV files")
print(f"✓ Analysis complete - Top 3 Bang-for-Buck options:")
top_3 = financial_df.nsmallest(3, 'BFB_Rank')[['Structure_Type', 'Bang_for_Buck', 'Payback_Years']].values
for i, (structure, bfb, payback) in enumerate(top_3, 1):
    print(f"  {i}. {structure}: BFB={bfb:.2f}, Payback={payback} years")