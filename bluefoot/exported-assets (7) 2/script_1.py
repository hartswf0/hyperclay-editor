# Create comprehensive SWOT analysis for each structure type
import pandas as pd

swot_analysis = {
    'Safari Tent': {
        'Strengths': [
            'Lowest upfront investment ($20K-$56K)',
            'Quick setup (3 days)',
            'High regulatory compliance',
            'Flexible/moveable',
            'Authentic glamping aesthetic'
        ],
        'Weaknesses': [
            'Limited cold weather performance',
            'Moderate durability (5-10 years)',
            'Basic amenity integration',
            'Higher maintenance needs',
            'Limited sound insulation'
        ],
        'Opportunities': [
            'Growing glamping market demand',
            'Seasonal operation viable',
            'Low barrier to entry',
            'Easy to scale up',
            'Multiple configuration options'
        ],
        'Threats': [
            'Weather damage risk',
            'Fire code restrictions',
            'Seasonal revenue limitations',
            'Increasing competition',
            'Labor shortage for maintenance'
        ]
    },
    'Geodesic Dome': {
        'Strengths': [
            'Excellent structural integrity',
            'Outstanding weather resistance',
            'High Instagram appeal',
            'Energy efficient design',
            'Strong revenue potential ($57K/yr)'
        ],
        'Weaknesses': [
            'Higher complexity setup (14 days)',
            'Specialized contractor needs',
            'Interior space challenges',
            'Higher insurance costs',
            'Limited door/window options'
        ],
        'Opportunities': [
            'Premium pricing power',
            'Year-round operation',
            'Unique market positioning',
            'Eco-tourism appeal',
            'Corporate retreat bookings'
        ],
        'Threats': [
            'Building code variations',
            'High replacement costs',
            'Limited supplier network',
            'Complex repair requirements',
            'Zoning restrictions'
        ]
    },
    'Yurt': {
        'Strengths': [
            'Balanced cost/quality ratio',
            'Cultural authenticity',
            'Good weather performance',
            'Moderate setup complexity',
            'Proven glamping track record'
        ],
        'Weaknesses': [
            'Platform dependency',
            'Moisture management issues',
            'Limited bathroom integration',
            'Seasonal heating challenges',
            'Fabric maintenance needs'
        ],
        'Opportunities': [
            'Strong market recognition',
            'Meditation/retreat market',
            'International tourism appeal',
            'Educational/cultural programs',
            'Multiple size options'
        ],
        'Threats': [
            'Fire safety regulations',
            'Wind damage exposure',
            'Fabric degradation',
            'Rodent/pest issues',
            'Insurance limitations'
        ]
    },
    'Quonset Hut': {
        'Strengths': [
            'Exceptional durability (50+ years)',
            'Superior weather resistance',
            'High structural capacity',
            'Minimal maintenance',
            'Expandable design'
        ],
        'Weaknesses': [
            'Industrial aesthetic',
            'Condensation issues',
            'Complex foundation needs',
            'Higher upfront costs',
            'Limited glamping appeal'
        ],
        'Opportunities': [
            'Multi-purpose use potential',
            'Group/event bookings',
            'Storage/workspace combo',
            'Military/industrial tourism',
            'Disaster-resistant selling point'
        ],
        'Threats': [
            'Aesthetic market resistance',
            'Higher permitting requirements',
            'Limited design flexibility',
            'Expensive modifications',
            'Poor payback timeline (3.5 years)'
        ]
    },
    'Tiny House Kit': {
        'Strengths': [
            'High guest appeal',
            'Full amenity integration',
            'Good market positioning',
            'Residential comfort level',
            'Strong social media potential'
        ],
        'Weaknesses': [
            'Complex regulations',
            'Higher permitting costs',
            'Foundation requirements',
            'Utilities complexity',
            'Higher insurance needs'
        ],
        'Opportunities': [
            'ADU market crossover',
            'Long-term rental option',
            'Corporate housing demand',
            'Eco-conscious travelers',
            'Design customization'
        ],
        'Threats': [
            'Zoning restrictions',
            'Changing ADU regulations',
            'Building code evolution',
            'Higher property taxes',
            'Seasonal demand swings'
        ]
    },
    'Barndominium': {
        'Strengths': [
            'Highest revenue potential ($61K/yr)',
            'Premium positioning',
            'Year-round viability',
            'Multiple unit potential',
            'Excellent durability'
        ],
        'Weaknesses': [
            'Highest capital requirement ($185K-$265K)',
            'Long development timeline (90+ days)',
            'Complex permitting',
            'Poor payback (4.5 years)',
            'High regulatory burden'
        ],
        'Opportunities': [
            'Luxury market segment',
            'Wedding/event venue',
            'Corporate retreats',
            'Multi-generational bookings',
            'Property appreciation'
        ],
        'Threats': [
            'Economic downturn impact',
            'Construction cost inflation',
            'Regulatory changes',
            'High competition entry',
            'Interest rate sensitivity'
        ]
    },
    'FEMA Tent Upgraded': {
        'Strengths': [
            'Lowest investment ($8K-$9.5K)',
            'Fastest setup (1 day)',
            'High regulatory compliance',
            'Emergency preparedness',
            'Shortest payback (0.6 years)'
        ],
        'Weaknesses': [
            'Poor weather performance',
            'Limited aesthetic appeal',
            'Basic comfort level',
            'High maintenance needs',
            'Low revenue potential'
        ],
        'Opportunities': [
            'Budget-conscious market',
            'Festival/event temp housing',
            'Disaster relief training',
            'Camping education',
            'Youth group programs'
        ],
        'Threats': [
            'Market perception issues',
            'Safety concerns',
            'Limited seasons',
            'Regulatory restrictions',
            'Insurance challenges'
        ]
    }
}

# Create regulatory compliance matrix
regulatory_data = {
    'Jurisdiction': ['Johnson County, TN', 'Watauga County, NC', 'North Carolina State', 'Tennessee State'],
    'Building_Permits': ['Not required for most structures', 'Required >800 sq ft tent', 'Required permanent structures', 'Varies by county'],
    'Septic_Requirements': ['Required if plumbing', 'Required if plumbing', 'NSF-41 composting toilets OK', 'NSF-41 composting toilets OK'],
    'STR_Licensing': ['Business license required', 'Permit required', 'Local ordinance dependent', 'Favorable state law'],
    'Fire_Safety': ['Basic requirements', 'Permit >800 sq ft tent', 'NFPA 701 flame retardant', 'Local fire marshal'],
    'Setbacks': ['Standard property line', '20 ft structures/vehicles', 'Varies by structure type', 'Local zoning dependent'],
    'Occupancy_Limits': ['2 per bedroom, 12 max typical', '44" egress width', 'Varies by classification', 'Health dept oversight']
}

reg_df = pd.DataFrame(regulatory_data)
print("Regulatory Compliance Matrix:")
print(reg_df.to_string(index=False))
print("\n" + "="*80 + "\n")

# Create dependency risk register
risk_register = {
    'Risk_Category': ['Permitting Delays', 'Weather/Seasonal', 'Utilities Access', 'Site Constraints', 'Market Demand', 'Regulatory Changes', 'Construction Costs'],
    'Probability': ['Medium', 'High', 'Low', 'Medium', 'Low', 'Medium', 'High'],
    'Impact': ['High', 'Medium', 'High', 'Medium', 'High', 'Medium', 'Medium'],
    'Risk_Level': ['High', 'Medium', 'Medium', 'Medium', 'Medium', 'Medium', 'Medium'],
    'Mitigation_Strategy': [
        'Pre-application meetings, local contacts',
        'Seasonal pricing, weather-resistant designs',
        'Site survey, utility easements',
        'Geotechnical assessment, flexible layouts',
        'Market research, phased development',
        'Industry monitoring, compliance buffer',
        'Fixed-price contracts, material pre-buy'
    ]
}

risk_df = pd.DataFrame(risk_register)
print("Risk Register and Mitigation Strategies:")
print(risk_df.to_string(index=False))
print("\n" + "="*80 + "\n")

# Create site-specific analysis for 10120 US-321, Butler, TN 37640
site_analysis = {
    'Factor': ['Location', 'Zoning', 'Utilities', 'Access', 'Topography', 'Water Features', 'Soil', 'Climate', 'Neighbors', 'Regulations'],
    'Status': [
        'Rural Johnson County, TN near Watauga Lake',
        'Likely agricultural/residential - confirm',
        'Electric available, septic needed',
        'US-321 frontage, good road access',
        'Rolling terrain, some slope challenges',
        'Near Watauga Lake, potential flood zones',
        'Requires perc test for septic',
        'Mountain climate, winter heating needs',
        'Rural setting, adequate separation',
        'Johnson County - minimal building permits'
    ],
    'Considerations': [
        '15 miles from Butler, 30 miles to Boone',
        'Check setbacks from US-321',
        'Septic permit mandatory if plumbing',
        'Good for guests, utilities, deliveries',
        'May limit structure placement options',
        'Check flood zones, drainage needs',
        'Test before committing to septic systems',
        'Snow loads, heating costs consideration',
        'Privacy good, noise from US-321',
        'Favorable for quick development'
    ]
}

site_df = pd.DataFrame(site_analysis)
print("Site-Specific Analysis: 10120 US-321, Butler, TN 37640:")
print(site_df.to_string(index=False))

# Export additional analysis to CSV
reg_df.to_csv('regulatory_matrix.csv', index=False)
risk_df.to_csv('risk_register.csv', index=False)
site_df.to_csv('site_analysis.csv', index=False)

print(f"\n✓ Additional analysis exported to CSV files")
print(f"✓ SWOT analysis complete for all 7 structure types")
print(f"✓ Regulatory compliance matrix created")
print(f"✓ Risk register and mitigation strategies documented")
print(f"✓ Site-specific analysis for Butler, TN location completed")