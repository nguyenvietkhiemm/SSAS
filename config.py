import os, json
import clr

dll_path = os.path.abspath("Microsoft.AnalysisServices.AdomdClient.dll")
conn_str = "Provider=MSOLEDBSQL.1;Data Source=ALITTLEDAISY;Password=khiem123!;User ID=sa;Initial Catalog=SSAS"

def load_key_map_from_json(filepath='./key_map.json'):
    with open(filepath, 'r', encoding='utf-8') as f:
        key_map = json.load(f)
    return key_map

key_map = load_key_map_from_json()

### MDX QUERY TEMPLATE

def generate_mdx(dimensions=["Customer ID", "Customer Name", "City Name", "Day", "Order ID"],
                 measure="[Measures].[Total Amount]", 
                 offset=0, 
                 limit=100,
                 cube="Cube"):

  mdx_template = """
    SELECT 
      NON EMPTY {{ {measures} }} ON COLUMNS,
      SUBSET(
        {{
          NONEMPTY(
            {crossjoin_sets},
            {nonempty_measure}
          )
        }},
        {offset}, {limit}
      )
      DIMENSION PROPERTIES MEMBER_CAPTION, MEMBER_UNIQUE_NAME ON ROWS
    FROM [{cube}]
    CELL PROPERTIES VALUE, BACK_COLOR, FORE_COLOR, FORMATTED_VALUE, FORMAT_STRING, FONT_NAME, FONT_SIZE, FONT_FLAGS
    """
  
  keys = [k for dim in dimensions for k, v in key_map.items() if v == dim]
  crossjoin_sets = " * ".join(f"{key}.ALLMEMBERS" for key in keys)
  
  print(crossjoin_sets)
  
  return mdx_template.format(
      measures=measure,
      crossjoin_sets=crossjoin_sets,
      nonempty_measure=measure,
      offset=offset,
      limit=limit,
      cube=cube
  )