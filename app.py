from flask import Flask, jsonify, request
from pyadomd import Pyadomd
import os
import re
import json
import clr
from config import conn_str, dll_path, key_map  # cấu hình kết nối
import database  # khởi chạy kết nối, tạo key_map, tên cột...
from flask_cors import CORS

from config import generate_mdx  # cấu hình kết nối

clr.AddReference(dll_path)

app = Flask(__name__)
CORS(app)  # Cho phép tất cả domain truy cập (hoặc tùy chỉnh origin)

# /api [POST]


@app.route('/api', methods=['POST'])
def query_post():
    data = request.get_json()
    dimensions = data.get('dimensions', [])
    measure = data.get('measure', [])
    limit = int(data.get('limit', 100))
    offset = int(data.get('offset', 0))
    measure_filters = data.get('measure_filters', {})
    dimension_filters = data.get('dimension_filters', {})

    mdx = generate_mdx(dimensions=dimensions,
                       measure=measure,
                       measure_filters=measure_filters,
                       dimension_filters=dimension_filters,
                       limit=limit,
                       offset=offset)
    print(mdx)
    results = []
    with Pyadomd(conn_str) as conn:
        with conn.cursor().execute(mdx) as cur:
            columns = [col[0] for col in cur.description]
            rows = cur.fetchall()
            for row in rows:
                row_dict = dict(zip(columns, row))
                short_dict = {}
                for k, v in row_dict.items():
                    clean_key = k.replace(".[MEMBER_CAPTION]", "")
                    if clean_key in key_map:
                        short_dict[key_map[clean_key]] = v
                results.append(short_dict)
    return jsonify(results)

# /api [GET]


@app.route('/api')
def query():
    dimensions = request.args.getlist('dimensions')
    measure = request.args.getlist('measure')
    limit = int(request.args.get('limit', None))
    offset = int(request.args.get('offset', 0))
    measure_filters = request.args.get('measure_filters')
    dimension_filters = request.args.get('dimension_filters')

    if measure_filters:
        measure_filters = json.loads(measure_filters)
    else:
        measure_filters = {}

    if dimension_filters:
        dimension_filters = json.loads(dimension_filters)
    else:
        dimension_filters = {}

    mdx = generate_mdx(dimensions=dimensions,
                       measure=measure,
                       measure_filters=measure_filters,
                       dimension_filters=dimension_filters,
                       limit=limit,
                       offset=offset)
    print(mdx)
    results = []
    with Pyadomd(conn_str) as conn:
        with conn.cursor().execute(mdx) as cur:
            columns = [col[0] for col in cur.description]
            rows = cur.fetchall()
            for row in rows:
                row_dict = dict(zip(columns, row))
                short_dict = {}
                for k, v in row_dict.items():
                    clean_key = k.replace(".[MEMBER_CAPTION]", "")
                    if clean_key in key_map:
                        short_dict[key_map[clean_key]] = v
                results.append(short_dict)
    return jsonify(results)


@app.route('/api/get_all')
def query_get_all():
    dimensions = []
    measures = []

    for k, v in key_map.items():
        if "Measure" in k:
            measures.append(v)
        else:
            dimensions.append(v)

    return jsonify({
        "dimensions": list(set(dimensions)),
        "measures": list(set(measures))
    })


@app.route('/api/get_unique_values', methods=['GET'])
def get_unique_values():
    dimension_key_from_frontend = request.args.get('dimension')

    if not dimension_key_from_frontend:
        return jsonify({"error": "Missing 'dimension' query parameter"}), 400

    hierarchy_path = None
    for internal_path, frontend_key in key_map.items():
        if frontend_key == dimension_key_from_frontend:
            hierarchy_path = internal_path
            break

    if not hierarchy_path:
        return jsonify({"error": f"Unknown or unsupported dimension for unique values: {dimension_key_from_frontend}"}), 404

    mdx_query = f"SELECT {{{hierarchy_path}.Members}} ON COLUMNS FROM [Warehouse]"
    print(f"Executing MDX for unique values: {mdx_query}")

    values = []
    try:
        with Pyadomd(conn_str) as conn:
            with conn.cursor().execute(mdx_query) as cur:
                headers = [col[0] for col in cur.description]

                transformed_values = []
                for header in headers:
                    matches = re.findall(r'&\[(.*?)\]', header)

                    if matches:
                        formatted_value = "-".join(matches)
                        transformed_values.append(formatted_value)

                unique_values = list(set(transformed_values))
                unique_values.sort()

                values = unique_values

    except Exception as e:
        print(
            f"Error fetching unique values for dimension '{dimension_key_from_frontend}' (path: {hierarchy_path}): {e}")
        return jsonify({"error": f"Database error fetching unique values for {dimension_key_from_frontend}"}), 500

    return jsonify(values)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
