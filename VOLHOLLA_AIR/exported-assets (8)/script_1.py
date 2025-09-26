# Calculate financial metrics for each structure in each market
import pandas as pd

# Combine data and calculate financial metrics
results = []

for _, market in df_market.iterrows():
    market_name = market['Market']
    adr = market['ADR ($)']
    occupancy = market['Occupancy (%)'] / 100
    annual_revenue = market['Annual Revenue ($)']
    
    for _, structure in df_structures.iterrows():
        struct_type = structure['Structure Type']
        capex = structure['Total CAPEX ($)']
        
        # Get OPEX
        opex_row = df_opex[df_opex['Structure Type'] == struct_type].iloc[0]
        monthly_opex = opex_row['Total OPEX/month ($)']
        annual_opex = monthly_opex * 12
        
        # Get quality score
        quality_row = df_quality[df_quality['Structure Type'] == struct_type].iloc[0]
        quality_score = quality_row['Quality Score']
        
        # Calculate metrics
        platform_fees = annual_revenue * 0.03  # 3% platform fee
        gross_annual_revenue = annual_revenue
        net_annual_revenue = gross_annual_revenue - annual_opex - platform_fees
        
        # Price index (normalized, 10 = lowest total cost)
        total_2yr_cost = capex + (annual_opex * 2)  # CAPEX + 2 years OPEX
        
        # Calculate payback period
        payback_years = capex / max(net_annual_revenue, 1) if net_annual_revenue > 0 else 999
        
        # Simple IRR approximation (10-year, no resale)
        if net_annual_revenue > 0:
            irr_approx = (net_annual_revenue / capex) * 100
        else:
            irr_approx = -100
            
        results.append({
            'Market': market_name,
            'Structure Type': struct_type,
            'CAPEX ($)': capex,
            'Annual OPEX ($)': annual_opex,
            'Gross Revenue ($)': gross_annual_revenue,
            'Net Revenue ($)': net_annual_revenue,
            'Payback (years)': payback_years,
            'IRR Approx (%)': irr_approx,
            'Quality Score': quality_score,
            'Total 2yr Cost ($)': total_2yr_cost
        })

df_results = pd.DataFrame(results)

# Calculate price index (normalized so 10 = lowest cost)
min_cost = df_results['Total 2yr Cost ($)'].min()
max_cost = df_results['Total 2yr Cost ($)'].max()
df_results['Price Index'] = 10 - ((df_results['Total 2yr Cost ($)'] - min_cost) / (max_cost - min_cost)) * 9

# Calculate Bang-for-Buck
df_results['Bang for Buck'] = df_results['Quality Score'] / (1 + (10 - df_results['Price Index'])/10)

# Rank by Bang for Buck within each market
df_results['BFB Rank'] = df_results.groupby('Market')['Bang for Buck'].rank(ascending=False, method='dense').astype(int)

print("Financial Analysis Results:")
print("="*100)
key_cols = ['Market', 'Structure Type', 'CAPEX ($)', 'Net Revenue ($)', 'Payback (years)', 
           'Quality Score', 'Price Index', 'Bang for Buck', 'BFB Rank']
print(df_results[key_cols].round(2))

# Create summary by structure type (average across markets)
print("\n\nSummary by Structure Type (Average Across Markets):")
print("="*80)
summary = df_results.groupby('Structure Type').agg({
    'CAPEX ($)': 'mean',
    'Net Revenue ($)': 'mean', 
    'Payback (years)': 'mean',
    'Quality Score': 'mean',
    'Bang for Buck': 'mean',
    'BFB Rank': 'mean'
}).round(2)

summary = summary.sort_values('Bang for Buck', ascending=False)
print(summary)

# Save detailed results to CSV
df_results.to_csv('glamping_structure_analysis.csv', index=False)
print("\n\nDetailed results saved to 'glamping_structure_analysis.csv'")

# Top 3 recommendations
print("\n\nTOP 3 RECOMMENDATIONS BY MARKET:")
print("="*50)
for market in ['Maryville', 'Townsend', 'Walland']:
    market_data = df_results[df_results['Market'] == market].nsmallest(3, 'BFB Rank')
    print(f"\n{market}:")
    for _, row in market_data.iterrows():
        print(f"  {row['BFB Rank']}. {row['Structure Type']}: "
              f"Quality={row['Quality Score']:.1f}, "
              f"Payback={row['Payback (years)']:.1f}yr, "
              f"BFB={row['Bang for Buck']:.2f}")