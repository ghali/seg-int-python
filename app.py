#!/usr/bin/env python
# tag::FlaskRoutes[]
from geom import Point, Segment, Line, intersect
from flask import Flask, render_template, request, jsonify, abort

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
# end::FlaskRoutes[]

# tag::api[]
# Both request and response are JSON.
@app.route('/calculate_intersection', methods=['POST'])
def calculate_intersection():
    if not request.json:
        abort(400)
    seg1 = Segment(request.json['seg1'])
    seg2 = Segment(request.json['seg2'])
    result = intersect(seg1, seg2)
    if result is None:
        return jsonify({'intersection': False})
    else:
        return jsonify({'intersection': True, 'x': result.x, 'y': result.y})
# end::api[]

# tag::launch[]
if __name__=="__main__":
    app.run(host='0.0.0.0')
# end::launch[]
