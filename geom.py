# tag::determinant[]
def determinant(a, b, c, d):
    return a * d - b * c
# end::determinant[]

# tag::Point[]
class Point(object):
    def __init__(self, *args):
        if len(args) == 1 and type(args[0]) is dict:
            self.x, self.y = float(args[0]['x']), float(args[0]['y'])
        elif len(args) == 2:
            self.x, self.y = args[0], args[1]
        else:
            raise TypeError('Unable to construct Point.')
# end::Point[]

# tag::SegmentLine[]
class Segment(object):
    def __init__(self, msg):
        self.src = Point(msg['src'])
        self.tgt = Point(msg['tgt'])

class Line(object):
    def __init__(self, seg):
        self.a = + determinant(seg.src.y,       1.0, seg.tgt.y,       1.0)
        self.b = - determinant(seg.src.x,       1.0, seg.tgt.x,       1.0)
        self.c = + determinant(seg.src.x, seg.src.y, seg.tgt.x, seg.tgt.y)
# end::SegmentLine[]

# tag::Side[]
class Side(object):
    def __init__(self, v):
        self.v = +1 if v > 0 else (0 if v == 0 else -1)

def oriented_side(line, point):
    return Side(line.a * point.x + line.b * point.y + line.c)

def straddle(line, segment):
    src_side = oriented_side(line, segment.src)
    tgt_side = oriented_side(line, segment.tgt)
    s1 = src_side.v >= 0 and tgt_side.v <  0
    s2 = src_side.v <  0 and tgt_side.v >= 0
    return s1 or s2
# end::Side[]
        
# tag::intersect[]
def intersect(seg1, seg2):
    l1 = Line(seg1)
    l2 = Line(seg2)
    if straddle(l1, seg2) and straddle(l2, seg1):
        denom = determinant(l1.a, l1.b, l2.a, l2.b);
        if denom != 0:
            detx = + determinant(l1.b, l1.c, l2.b, l2.c);
            dety = - determinant(l1.a, l1.c, l2.a, l2.c);
            return Point(detx/denom, dety/denom);
    return None
# end::intersect[]
