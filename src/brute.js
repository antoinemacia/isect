/**
 * This is a brute force solution with O(n^2) performance.
 * (`n` is number of segments).
 * 
 * Use this when number of lines is low, and number of intersections
 * is high.
 */

export default function brute(lines, options) {
  var results = [];
  var reportIntersection = (options && options.onFound) || 
                            defaultIntersectionReporter;
  var asyncState;

  return {
    /**
     * Execute brute force of the segment intersection search
     */
    run,
    /**
     * Access to results array. Works only when you use default onFound() handler
     */
    results,

    /**
     * Performs a single step in the brute force algorithm ()
     */
    step
  }

  function step() {
    if (!asyncState) {
      asyncState = {
        i: 0
      }
    }
    var test = lines[asyncState.i];
    for (var j = asyncState.i + 1; j < lines.length; ++j) {
      var other = lines[j];
      var pt = intersectSegments(test, other);
      if (pt) {
        if (reportIntersection(pt, [test, other])) {
          return;
        }
      }
    }
    asyncState.i += 1;
    return asyncState.i < lines.length;
  }

  function run() {
    for(var i = 0; i < lines.length; ++i) {
      var test = lines[i];
      for (var j = i + 1; j < lines.length; ++j) {
        var other = lines[j];
        var pt = intersectSegments(test, other);
        if (pt) {
          if (reportIntersection(pt, [test, other])) {
            return;
          }
        }
      }
    }
    return results;
  }

  function defaultIntersectionReporter(p, interior) {
    results.push({
      point: p, 
      segments: interior
    });
  }
}

function intersectSegments(a, b) {
  // Note: this is almost the same as geom.intersectSegments()
  // The main difference is that we don't have a pre-computed
  // value for dx/dy on the segments.
  //  https://stackoverflow.com/a/1968345/125351
  var aStart = a.from, bStart = b.from;
  var p0_x = aStart.x, p0_y = aStart.y,
      p2_x = bStart.x, p2_y = bStart.y;

  var s1_x = a.from.x - a.to.x, s1_y = a.from.y - a.to.y, s2_x = b.from.x - b.to.x, s2_y = b.from.y - b.to.y;
  var div = s1_x * s2_y - s2_x * s1_y;

  var s = (s1_y * (p0_x - p2_x) - s1_x * (p0_y - p2_y)) / div;
  if (s < 0 || s > 1) return;

  var t = (s2_x * (p2_y - p0_y) + s2_y * (p0_x - p2_x)) / div;

  if (t >= 0 && t <= 1) {
    return {
      x: p0_x - (t * s1_x),
      y: p0_y - (t * s1_y)
    }
  }
}
