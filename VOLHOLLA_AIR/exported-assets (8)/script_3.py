# Create SWOT Analysis for top 3 structures and glamping thresholds analysis

print("SWOT ANALYSIS - TOP 3 STRUCTURES")
print("="*60)

swot_data = {
    'Yurt': {
        'Strengths': [
            'Excellent quality-to-cost ratio (Bang-for-Buck: 5.74)',
            'Fast setup (8/10 setup score)',
            'Good regulatory compliance (7/10 regulatory fit)',
            'Strong durability (8/10) with proper maintenance',
            'Distinctive aesthetic appeal (8/10)',
            'Reasonable CAPEX at $48K for 314 sq ft'
        ],
        'Weaknesses': [
            'Limited amenities compared to hard structures',
            'Fabric components require seasonal maintenance',
            'Lower comfort in extreme weather vs barndominiums',
            'Platform dependency for proper installation',
            'Higher per-sq-ft cost ($153/sq ft) vs Quonset huts'
        ],
        'Opportunities': [
            'Strong market demand for unique glamping experiences',
            'Townsend market shows 1.7yr payback potential',
            'Can upgrade with luxury amenities over time',
            'Expandable with additional yurts on same property',
            'Appeals to eco-conscious glamping market segment'
        ],
        'Threats': [
            'Weather-related wear on fabric components',
            'Zoning changes could impact setup requirements',
            'Competition from hard structures in luxury market',
            'Seasonal occupancy variations in Smoky Mountains',
            'Insurance costs may increase with claims history'
        ]
    },
    
    'Geodesic Dome': {
        'Strengths': [
            'Highest aesthetic appeal (9/10) - very Instagrammable',
            'Strong structural integrity for weather resistance',
            'Good insulation and year-round suitability',
            'Premium pricing potential (especially Walland market)',
            'Excellent durability (8/10) with proper materials',
            '450 sq ft provides good space efficiency'
        ],
        'Weaknesses': [
            'Higher CAPEX at $59K vs other options',
            'Complex glazing requirements increase costs',
            'Specialized construction knowledge needed',
            'Potential permitting challenges due to unique shape',
            'Limited expansion options vs modular structures'
        ],
        'Opportunities': [
            'Premium glamping market commands higher ADRs',
            'Architectural uniqueness creates marketing advantage',
            'Year-round operation potential in Smokies climate',
            'Strong social media appeal drives bookings',
            'Potential for eco-tourism partnerships'
        ],
        'Threats': [
            'Glazing repairs can be expensive and specialized',
            'Building code interpretations may vary by jurisdiction',
            'Higher insurance due to unique structure',
            'Weather damage to transparent elements',
            'Market saturation if domes become too common'
        ]
    },
    
    'Safari Tent': {
        'Strengths': [
            'Lowest CAPEX at $25.2K enables quick market entry',
            'Fastest setup time (9/10) for rapid deployment',
            'Excellent regulatory compliance (8/10)',
            'Quick payback: ~1 year across all markets',
            'Established glamping aesthetic familiar to guests',
            'Lowest operational costs ($275/month)'
        ],
        'Weaknesses': [
            'Lowest quality score (6.2/10) among top options',
            'Limited privacy (5/10) vs enclosed structures',
            'Seasonal weather limitations (5/10 seasonality)',
            'Smallest space (240 sq ft) limits amenity options',
            'Ongoing maintenance of canvas/fabric elements'
        ],
        'Opportunities': [
            'Entry-level glamping market segment',
            'Multiple units feasible with lower investment',
            'Can upgrade to luxury tents over time',
            'Strong cash flow for reinvestment',
            'Market testing platform before larger investments'
        ],
        'Threats': [
            'Canvas deterioration in humid Smoky Mountain climate',
            'Guest expectations may exceed actual experience',
            'Competition from cabin/tiny house alternatives',
            'Limited differentiation in crowded safari tent market',
            'Weather cancellations impact revenue reliability'
        ]
    }
}

for structure, swot in swot_data.items():
    print(f"\n{structure.upper()} SWOT:")
    print(f"  STRENGTHS:")
    for s in swot['Strengths']:
        print(f"    • {s}")
    print(f"  WEAKNESSES:")
    for w in swot['Weaknesses']:
        print(f"    • {w}")
    print(f"  OPPORTUNITIES:")
    for o in swot['Opportunities']:
        print(f"    • {o}")
    print(f"  THREATS:")
    for t in swot['Threats']:
        print(f"    • {t}")

print("\n\n" + "="*80)
print("GLAMPING THRESHOLDS ANALYSIS")
print("="*80)

print("\nMINIMUM GLAMPING REQUIREMENTS:")
print("  ✓ Real bed with high-quality linens")
print("  ✓ Weather protection + climate control")
print("  ✓ Private or dedicated bath access")
print("  ✓ Distinctive design/aesthetic appeal")
print("  ✓ Defined outdoor living space (deck/patio)")

print("\nSTRUCTURE COMPLIANCE WITH MINIMUM GLAMPING:")
glamping_compliance = {
    'Yurt': '✓ MEETS - Good bed setup, weather protection, bathhouse access, circular aesthetic, deck space',
    'Geodesic Dome': '✓ MEETS - Premium bed, full weather protection, ensuite possible, iconic design, deck',
    'Safari Tent': '✓ MEETS - Comfortable bed, weather protection, shared/private bath, classic safari aesthetic',
    'Quonset Hut': '△ MARGINAL - Requires significant interior work for glamping feel',
    'Tiny House': '✓ MEETS - Full amenities, weather protection, home-like comfort',
    'Barndominium': '✓ EXCEEDS - Full luxury amenities, complete weather protection',
    'FEMA Tent': '✗ FAILS - Requires major upgrades for glamping standard'
}

for structure, compliance in glamping_compliance.items():
    print(f"  {compliance}")

print("\nBEYOND-GLAMPING FEATURES (Premium Tier):")
print("  • Architectural distinctiveness (domes, unique designs)")
print("  • Premium spa elements (outdoor shower, soaking tub)")
print("  • High-end finishes + smart climate control")
print("  • Curated landscape views and privacy")
print("  • Luxury amenities (wine fridge, premium linens)")

print("\nSTRUCTURES CAPABLE OF BEYOND-GLAMPING:")
beyond_glamping = {
    'Geodesic Dome': 'EXCELLENT - Architectural icon, premium finishes possible',
    'Barndominium': 'EXCELLENT - Full luxury amenities, custom architecture',
    'Yurt': 'GOOD - Can upgrade with luxury amenities and spa features',
    'Tiny House': 'GOOD - Premium finishes and smart home integration',
    'Safari Tent': 'LIMITED - Can add outdoor shower, fire features',
    'Quonset Hut': 'LIMITED - Requires extensive interior renovation',
    'FEMA Tent': 'NOT SUITABLE - Cannot achieve beyond-glamping standard'
}

for structure, capability in beyond_glamping.items():
    print(f"  • {structure}: {capability}")

print("\n\nMVP RECOMMENDATION - 'Platform-Plus-Canvas' Micro-Suite:")
print("  Structure: Engineered deck + insulated safari tent")
print("  Features: Vestibule, off-grid power option")
print("  Sanitation: Composting toilet + shared bathhouse")
print("  Climate: Heater/cooler, code-compliant egress")
print("  Investment: ~$15-20K total")
print("  Timeline: 2-4 weeks from permit to occupancy")
print("  Market Position: Entry-level glamping, testing demand")