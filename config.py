import os
import json
import clr

dll_path = os.path.abspath("Microsoft.AnalysisServices.AdomdClient.dll")
conn_str = "Provider=MSOLEDBSQL.1;Data Source=ALITTLEDAISY;Password=khiem123!;User ID=sa;Initial Catalog=SSAS"


def load_key_map_from_json(filepath='./key_map.json'):
    with open(filepath, 'r', encoding='utf-8') as f:
        key_map = json.load(f)
    return key_map


key_map = load_key_map_from_json()

# MDX QUERY TEMPLATE


def generate_mdx(dimensions=["Customer ID", "Customer Name", "City Name", "Order ID"],
                 measure=["Total Amount"],
                 measure_filters={"Total Amount": ""},
                 dimension_filters={"Quarter": "3"},
                 offset=0,
                 limit=100,
                 cube="Warehouse"):

    mdx_template = """
SELECT
NON EMPTY {{ {measures} }} ON COLUMNS, NON EMPTY
SUBSET(
  FILTER(
    {{
      (
        {crossjoin_sets}
      )
    }},
    {measure_filters}
  ),
  {offset}, {limit}
)
DIMENSION PROPERTIES MEMBER_CAPTION, MEMBER_UNIQUE_NAME ON ROWS
FROM (SELECT ( {dimension_filters} ) ON COLUMNS FROM [{cube}])
"""

    keys = [k for k, v in key_map.items() if v in dimensions]
    crossjoin_sets = "*\n".join(f"{key}.ALLMEMBERS" for key in keys)

    measure_keys = []
    for k, v in key_map.items():
        if v in measure:
            measure_keys.append(k)
    measure = ", ".join(measure_keys)

    # có bug đó
    measure_filter = "NOT ISEMPTY({a}) AND {a}".format(a = "[Measures].[Total Amount]") # DEFAULT
    for k, v in key_map.items():
        if v in measure_filters.keys():
            print("========", v, measure_filters[v], k)
            measure_filter = "NOT ISEMPTY({a}) AND {a}".format(a = k) + measure_filters[v]

    # có bug đó
    dimension_filter = "[Fact Order].[Customer ID]" # DEFAULT
    li = []
    filter_keys_to_process = list(dimension_filters.keys())
    for frontend_key in filter_keys_to_process:
        filter_value = dimension_filters[frontend_key]
        internal_path = None
        for k, v in key_map.items():
            if v == frontend_key:
                internal_path = k
                break
        if internal_path:
            if filter_value:
                parts = filter_value.split("-")
                mdx_member_parts = "".join(f"&[{part}]" for part in parts)
                full_member_mdx = f"{internal_path}.{mdx_member_parts}"
                li.append(full_member_mdx)
            del dimension_filters[frontend_key]
    if li:
        dimension_filter = ",".join(li)
                
    return mdx_template.format(
        measures=measure,
        crossjoin_sets=crossjoin_sets,
        offset=offset,
        limit=limit,
        measure_filters=measure_filter,
        dimension_filters=dimension_filter,
        cube=cube
    )
