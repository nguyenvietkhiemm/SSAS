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
                 cube="Cube"):

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
FROM (SELECT ({{ {dimension_filters} }}) ON COLUMNS FROM [{cube}])
"""

    keys = [k for k, v in key_map.items() if v in dimensions]
    crossjoin_sets = "*\n".join(f"{key}.ALLMEMBERS" for key in keys)

    for k, v in key_map.items():
        if v in measure:
            measure = k
            break

    # có bug đó
    measure_filter = "NOT ISEMPTY({a}) AND {a}".format(a = "[Measures].[Total Amount]") # DEFAULT
    for k, v in key_map.items():
        if v in measure_filters.keys():
            measure_filter = "NOT ISEMPTY({a}) AND {a}".format(a = k) + measure_filters[v]
        else:
            measure_filter = "NOT ISEMPTY({a}) AND {a}".format(a = k)

    # có bug đó
    dimension_filter = "[Fact Order].[Customer ID]" # DEFAULT
    for k, v in key_map.items():
        if v in dimension_filters.keys():
            if dimension_filters[v]:
                dimension_filter = ".".join(k.split(".")) + "." + "&[{}]&[2024]".format(dimension_filters[v])
                # dimension_filter = k.split(".")[0] + "." + k.split(".")[2] + "." + "&[{}]&[2024]".format(dimension_filters[v])
            else:
                dimension_filter = ".".join(k.split("."))
                # dimension_filter = k.split(".")[0] + "." + k.split(".")[2]
                
    return mdx_template.format(
        measures=measure,
        crossjoin_sets=crossjoin_sets,
        offset=offset,
        limit=limit,
        measure_filters=measure_filter,
        dimension_filters=dimension_filter,
        cube=cube
    )
