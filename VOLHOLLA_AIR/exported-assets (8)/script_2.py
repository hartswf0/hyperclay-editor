# Create comprehensive cost breakdown tables and regulatory analysis

# Create cost breakdown table for top 3 structures
top_structures = ['Yurt', 'Geodesic Dome', 'Safari Tent']

print("DETAILED COST BREAKDOWN - TOP 3 STRUCTURES")
print("="*80)

for struct in top_structures:
    struct_data = df_structures[df_structures['Structure Type'] == struct].iloc[0]
    opex_data_struct = df_opex[df_opex['Structure Type'] == struct].iloc[0]
    
    print(f"\n{struct.upper()}:")
    print(f"  Kit Cost: ${struct_data['Kit Cost ($)']:,}")
    print(f"  Platform/Foundation: ${struct_data['Platform/Foundation ($)']:,}")
    print(f"  Utilities Setup: ${struct_data['Utilities Setup ($)']:,}")
    print(f"  Interior Fit-out: ${struct_data['Interior Fit-out ($)']:,}")
    print(f"  Labor: ${struct_data['Labor ($)']:,}")
    print(f"  TOTAL CAPEX: ${struct_data['Total CAPEX ($)']:,}")
    print(f"  Per Sq Ft: ${struct_data['CAPEX per Sq Ft']:,}")
    print(f"  ")
    print(f"  Monthly OPEX: ${opex_data_struct['Total OPEX/month ($)']:,}")
    print(f"  Annual OPEX: ${opex_data_struct['Total OPEX/month ($)'] * 12:,}")

# Regulatory matrix for Blount County
regulatory_data = {
    'Jurisdiction': ['Blount County', 'Maryville', 'Townsend', 'Walland'],
    'Building Permit Required': ['Yes', 'Yes', 'Yes', 'Yes'],
    'Zoning Approval': ['Required', 'Required', 'Required', 'Required'],
    'Septic/Sewer': ['Site dependent', 'Municipal available', 'Limited municipal', 'Septic required'],
    'STR License': ['$20 home occupation', 'Business license req', 'Business license req', 'Business license req'],
    'Occupancy Tax': ['County rate', 'City + County', 'City + County', 'County rate'],
    'Min Insurance': ['$500K liability', '$500K liability', '$500K liability', '$500K liability']
}

df_regulatory = pd.DataFrame(regulatory_data)
print("\n\nREGULATORY REQUIREMENTS - BLOUNT COUNTY")
print("="*60)
print(df_regulatory.to_string(index=False))

# Dependencies and risk analysis
dependencies = {
    'Structure Type': ['Yurt', 'Geodesic Dome', 'Safari Tent', 'Quonset Hut', 'Tiny House', 'Barndominium', 'FEMA Tent'],
    'Critical Dependencies': [
        'Platform, snow load cert, insulation, septic',
        'Platform, glazing cert, snow load, HVAC',
        'Heavy frame, platform, weather protection',
        'Slab foundation, insulation, moisture control',
        'Foundation/wheels decision, zoning variance',
        'Full foundation, code compliance, HVAC',
        'Weatherproofing upgrades, aesthetic improvements'
    ],
    'Risk Level': ['Medium', 'Medium-High', 'Medium', 'Medium', 'High', 'High', 'High'],
    'Key Mitigations': [
        'Engineered platform, proper insulation liner',
        'Professional glazing, certified snow load design',
        'Quality frame system, seasonal maintenance plan',
        'Proper vapor barrier, interior framing',
        'Pre-approved tiny house community',
        'Full architectural plans, professional construction',
        'Major upgrades for durability and aesthetics'
    ]
}

df_dependencies = pd.DataFrame(dependencies)
print("\n\nDEPENCIES & RISK REGISTER")
print("="*50)
print(df_dependencies.to_string(index=False))

# Save all tables
df_regulatory.to_csv('regulatory_matrix.csv', index=False)
df_dependencies.to_csv('dependencies_risk.csv', index=False)

print("\n\nTables saved to CSV files:")
print("- regulatory_matrix.csv")
print("- dependencies_risk.csv")