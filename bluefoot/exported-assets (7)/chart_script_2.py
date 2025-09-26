import plotly.express as px
import pandas as pd
import datetime

# Load the data
data = {"project_timeline": [{"structure": "FEMA Tent Upgraded", "phases": [{"phase": "Permitting", "start": 0, "duration": 14}, {"phase": "Platform Prep", "start": 14, "duration": 3}, {"phase": "Kit Assembly", "start": 17, "duration": 1}, {"phase": "Utilities", "start": 18, "duration": 2}, {"phase": "Interior", "start": 20, "duration": 3}, {"phase": "Inspection", "start": 23, "duration": 2}]}, {"structure": "Safari Tent", "phases": [{"phase": "Permitting", "start": 0, "duration": 21}, {"phase": "Platform Prep", "start": 21, "duration": 7}, {"phase": "Kit Assembly", "start": 28, "duration": 3}, {"phase": "Utilities", "start": 31, "duration": 5}, {"phase": "Interior", "start": 36, "duration": 10}, {"phase": "Inspection", "start": 46, "duration": 3}]}, {"structure": "Yurt", "phases": [{"phase": "Permitting", "start": 0, "duration": 30}, {"phase": "Platform Prep", "start": 30, "duration": 10}, {"phase": "Kit Assembly", "start": 40, "duration": 7}, {"phase": "Utilities", "start": 47, "duration": 7}, {"phase": "Interior", "start": 54, "duration": 14}, {"phase": "Inspection", "start": 68, "duration": 5}]}, {"structure": "Tiny House Kit", "phases": [{"phase": "Permitting", "start": 0, "duration": 45}, {"phase": "Foundation", "start": 45, "duration": 14}, {"phase": "Kit Assembly", "start": 59, "duration": 14}, {"phase": "Utilities", "start": 73, "duration": 10}, {"phase": "Interior", "start": 83, "duration": 21}, {"phase": "Inspection", "start": 104, "duration": 7}]}, {"structure": "Geodesic Dome", "phases": [{"phase": "Permitting", "start": 0, "duration": 30}, {"phase": "Platform Prep", "start": 30, "duration": 14}, {"phase": "Kit Assembly", "start": 44, "duration": 14}, {"phase": "Utilities", "start": 58, "duration": 10}, {"phase": "Interior", "start": 68, "duration": 21}, {"phase": "Inspection", "start": 89, "duration": 7}]}, {"structure": "Quonset Hut", "phases": [{"phase": "Permitting", "start": 0, "duration": 60}, {"phase": "Foundation", "start": 60, "duration": 21}, {"phase": "Kit Assembly", "start": 81, "duration": 21}, {"phase": "Utilities", "start": 102, "duration": 14}, {"phase": "Interior", "start": 116, "duration": 30}, {"phase": "Inspection", "start": 146, "duration": 10}]}, {"structure": "Barndominium", "phases": [{"phase": "Permitting", "start": 0, "duration": 90}, {"phase": "Foundation", "start": 90, "duration": 30}, {"phase": "Kit Assembly", "start": 120, "duration": 60}, {"phase": "Utilities", "start": 180, "duration": 21}, {"phase": "Interior", "start": 201, "duration": 45}, {"phase": "Inspection", "start": 246, "duration": 14}]}]}

# Convert data to format suitable for Gantt chart
gantt_data = []
base_date = datetime.datetime(2024, 1, 1)

for structure_info in data["project_timeline"]:
    structure = structure_info["structure"]
    for phase_info in structure_info["phases"]:
        phase = phase_info["phase"]
        start = phase_info["start"]
        duration = phase_info["duration"]
        
        start_date = base_date + datetime.timedelta(days=start)
        finish_date = base_date + datetime.timedelta(days=start + duration)
        
        gantt_data.append({
            "Structure": structure,
            "Phase": phase,
            "Start": start_date,
            "Finish": finish_date,
            "Duration": duration
        })

df = pd.DataFrame(gantt_data)

# Map phase names to shorter versions to meet 15 char limit
phase_mapping = {
    "Permitting": "Permits",
    "Platform Prep": "Platform", 
    "Kit Assembly": "Assembly",
    "Utilities": "Utilities",
    "Interior": "Interior",
    "Inspection": "Inspect",
    "Foundation": "Foundation"
}

df["Phase_Short"] = df["Phase"].map(phase_mapping)

# Create the Gantt chart
fig = px.timeline(df, 
                  x_start="Start", 
                  x_end="Finish", 
                  y="Structure", 
                  color="Phase_Short",
                  title="Glamping Setup Timeline by Structure",
                  hover_data=["Duration"])

# Update layout
fig.update_yaxes(categoryorder="total ascending")
fig.update_layout(
    xaxis_title="Timeline (Days)",
    yaxis_title="Structure Type",
    legend_title="Phase"
)

# Update traces for better visibility
fig.update_traces(cliponaxis=False)

# Save both PNG and SVG
fig.write_image("gantt_chart.png")
fig.write_image("gantt_chart.svg", format="svg")

fig.show()