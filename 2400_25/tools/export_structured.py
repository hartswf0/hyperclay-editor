#!/usr/bin/env python3
import json
import csv
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
STRUCTURED = ROOT / 'rel.structured.json'
OUTDIR = ROOT / 'exports'
OUTDIR.mkdir(exist_ok=True)


def load_data():
    with STRUCTURED.open('r', encoding='utf-8') as f:
        return json.load(f)


def write_csv(path, headers, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(headers)
        for r in rows:
            w.writerow([r.get(h, '') if isinstance(r, dict) else r for h in headers])


def export_sources(data):
    by_id = data.get('sources', {}).get('by_id', {})
    rows = []
    for sid, s in by_id.items():
        rows.append({
            'id': sid,
            'title': s.get('title', ''),
            'authors': '; '.join(s.get('authors', [])),
            'type': s.get('type', ''),
            'tags': '; '.join(s.get('tags', [])),
            'status': s.get('status', ''),
        })
    write_csv(OUTDIR / 'sources.csv', ['id','title','authors','type','tags','status'], rows)


def export_clusters(data):
    clusters = data.get('clusters', [])
    rows = []
    for c in clusters:
        rows.append({
            'id': c.get('id',''),
            'title': c.get('title',''),
            'purpose': c.get('purpose',''),
            'learning_outcomes': '; '.join(c.get('learning_outcomes', [])),
            'primary_sources': '; '.join(c.get('primary_sources', [])),
            'companions': '; '.join(c.get('companions', [])),
            'difficulty': c.get('difficulty',''),
        })
    if rows:
        write_csv(OUTDIR / 'clusters.csv', ['id','title','purpose','learning_outcomes','primary_sources','companions','difficulty'], rows)


def export_arcs(data):
    arcs = data.get('arcs', [])
    rows = []
    for a in arcs:
        rows.append({
            'id': a.get('id',''),
            'title': a.get('title',''),
            'weeks': '; '.join(a.get('weeks', [])),
            'clusters': '; '.join(a.get('clusters', [])),
            'capstone_prompt': a.get('capstone_prompt',''),
        })
    if rows:
        write_csv(OUTDIR / 'arcs.csv', ['id','title','weeks','clusters','capstone_prompt'], rows)


def export_weeks(data):
    weeks_obj = data.get('weeks', {}) or {}
    rows = []
    if isinstance(weeks_obj, dict):
        for wid, w in weeks_obj.items():
            rows.append({
                'id': wid,
                'topic': w.get('topic', ''),
                'sources': '; '.join(w.get('sources', [])),
                'in_class': '; '.join(w.get('in_class', [])),
                'due': '; '.join(w.get('due', [])),
            })
        if rows:
            write_csv(OUTDIR / 'weeks.csv', ['id','topic','sources','in_class','due'], rows)
    elif isinstance(weeks_obj, list):
        # Fallback for list-shaped weeks
        for w in weeks_obj:
            rows.append({
                'id': w.get('id',''),
                'topic': w.get('topic',''),
                'sources': '; '.join(w.get('sources', [])),
                'in_class': '; '.join(w.get('in_class', [])),
                'due': '; '.join(w.get('due', [])),
            })
        if rows:
            write_csv(OUTDIR / 'weeks.csv', ['id','topic','sources','in_class','due'], rows)


def export_assessments(data):
    assessments = data.get('assessments', [])
    rows = []
    for a in assessments:
        rows.append({
            'id': a.get('id',''),
            'name': a.get('name',''),
            'kind': a.get('kind',''),
            'clusters': '; '.join(a.get('clusters', [])),
            'required_methods': '; '.join(a.get('required_methods', [])),
            'due_week': a.get('due_week',''),
            'points': a.get('points',''),
            'rubric_ref': a.get('rubric_ref',''),
        })
    if rows:
        write_csv(OUTDIR / 'assessments.csv', ['id','name','kind','clusters','required_methods','due_week','points','rubric_ref'], rows)


def mermaid_header():
    return """flowchart-elk LR
classDef default fill:#f8f8f8,stroke:#999,stroke-width:1px,color:#111;
classDef rootNode fill:#eef6ff,stroke:#4a90e2,color:#0b3d91,stroke-width:1.5px;
classDef categoryNode fill:#f5f0ff,stroke:#8a63d2,color:#402080,stroke-width:1.5px;
classDef leafNode fill:#f0fff4,stroke:#2e8540,color:#0f3d1e,stroke-width:1px;
"""


def export_cluster_graph(data):
    graph = data.get('graph', {})
    nodes = graph.get('nodes', [])
    edges = graph.get('edges', [])
    if not nodes:
        return
    lines = [mermaid_header()]
    # Emit nodes
    for n in nodes:
        nid = n.get('id')
        kind = n.get('kind','')
        label = nid
        lines.append(f"{nid}[\"{label}\"]")
    # Emit edges
    for e in edges:
        src = e.get('from')
        dst = e.get('to')
        lbl = e.get('label','')
        if lbl:
            lines.append(f"{src} -- \"{lbl}\" --> {dst}")
        else:
            lines.append(f"{src} --> {dst}")
    # Assign classes by kind
    for n in nodes:
        nid = n.get('id')
        kind = n.get('kind','')
        cls = 'leafNode'
        if kind == 'cluster':
            cls = 'categoryNode'
        lines.append(f"class {nid} {cls}")
    (OUTDIR / 'cluster_graph.mmd').write_text('\n'.join(lines), encoding='utf-8')


def export_arc_week_coverage(data):
    arcs = data.get('arcs', [])
    if not arcs:
        return
    lines = [mermaid_header()]
    # Create a root node
    lines.append('A["Course Arcs → Weeks"]')
    lines.append('class A rootNode')
    for i, arc in enumerate(arcs, start=1):
        aid = arc.get('id', f'arc_{i}')
        atitle = arc.get('title', aid)
        anode = f"{aid}[\"{atitle}\"]"
        lines.append(anode)
        lines.append(f"A --> {aid}")
        weeks = arc.get('weeks', [])
        for w in weeks:
            w_id = w
            w_node = f"{w_id}[\"{w_id}\"]"
            lines.append(w_node)
            lines.append(f"{aid} --> {w_id}")
            lines.append(f"class {w_id} leafNode")
        lines.append(f"class {aid} categoryNode")
    (OUTDIR / 'arc_week_coverage.mmd').write_text('\n'.join(lines), encoding='utf-8')


def main():
    data = load_data()
    export_sources(data)
    export_clusters(data)
    export_arcs(data)
    export_weeks(data)
    export_assessments(data)
    export_cluster_graph(data)
    export_arc_week_coverage(data)
    (OUTDIR / 'LAST_RUN.txt').write_text(f"Generated at {datetime.now().isoformat()}\n", encoding='utf-8')
    print(f"Exports written to {OUTDIR}")

if __name__ == '__main__':
    main()
