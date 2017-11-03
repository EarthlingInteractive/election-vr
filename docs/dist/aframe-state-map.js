webpackJsonp([4],{

/***/ 511:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(4);

var d3 = _interopRequireWildcard(_d);

__webpack_require__(1);

var _topojsonClient = __webpack_require__(22);

var topojson = _interopRequireWildcard(_topojsonClient);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var path = d3.geoPath();

var ready = function ready(error, us) {
    if (error) throw error;

    d3.select("a-scene").selectAll(".state").data(topojson.feature(us, us.objects.states).features).enter().append("a-entity").classed("state", true).attr("position", function (d) {
        var centroid = path.centroid(d);
        return centroid[0] / 100 + " -" + centroid[1] / 100 + " 1";
    })
    //            .attr("scale", "0.5 0.5 1")
    .attr("rotation", "0 0 0").attr("svgpath", function (d) {
        return "svgPath: " + path(d) + "; color: red";
    });
};

d3.queue().defer(d3.json, "us-10m.v1.json").await(ready);

/***/ })

},[511]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hZnJhbWUtc3RhdGUtbWFwLmpzIl0sIm5hbWVzIjpbImQzIiwidG9wb2pzb24iLCJwYXRoIiwiZ2VvUGF0aCIsInJlYWR5IiwiZXJyb3IiLCJ1cyIsInNlbGVjdCIsInNlbGVjdEFsbCIsImRhdGEiLCJmZWF0dXJlIiwib2JqZWN0cyIsInN0YXRlcyIsImZlYXR1cmVzIiwiZW50ZXIiLCJhcHBlbmQiLCJjbGFzc2VkIiwiYXR0ciIsImQiLCJjZW50cm9pZCIsInF1ZXVlIiwiZGVmZXIiLCJqc29uIiwiYXdhaXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0lBQVlBLEU7O0FBQ1o7O0FBQ0E7O0lBQVlDLFE7Ozs7QUFFWixJQUFJQyxPQUFPRixHQUFHRyxPQUFILEVBQVg7O0FBRUEsSUFBSUMsUUFBUSxTQUFSQSxLQUFRLENBQUNDLEtBQUQsRUFBUUMsRUFBUixFQUFlO0FBQ3ZCLFFBQUlELEtBQUosRUFBVyxNQUFNQSxLQUFOOztBQUVYTCxPQUFHTyxNQUFILENBQVUsU0FBVixFQUNLQyxTQURMLENBQ2UsUUFEZixFQUVLQyxJQUZMLENBRVVSLFNBQVNTLE9BQVQsQ0FBaUJKLEVBQWpCLEVBQXFCQSxHQUFHSyxPQUFILENBQVdDLE1BQWhDLEVBQXdDQyxRQUZsRCxFQUdLQyxLQUhMLEdBSUtDLE1BSkwsQ0FJWSxVQUpaLEVBS0tDLE9BTEwsQ0FLYSxPQUxiLEVBS3NCLElBTHRCLEVBTUtDLElBTkwsQ0FNVSxVQU5WLEVBTXNCLFVBQVVDLENBQVYsRUFBYTtBQUMzQixZQUFJQyxXQUFXakIsS0FBS2lCLFFBQUwsQ0FBY0QsQ0FBZCxDQUFmO0FBQ0EsZUFBUUMsU0FBVSxDQUFWLElBQWdCLEdBQWpCLEdBQXdCLElBQXhCLEdBQWdDQSxTQUFVLENBQVYsSUFBZ0IsR0FBaEQsR0FBdUQsSUFBOUQ7QUFDSCxLQVRMO0FBVUk7QUFWSixLQVdLRixJQVhMLENBV1UsVUFYVixFQVdzQixPQVh0QixFQVlLQSxJQVpMLENBWVUsU0FaVixFQVlxQixVQUFVQyxDQUFWLEVBQWE7QUFDMUIsZUFBTyxjQUFjaEIsS0FBS2dCLENBQUwsQ0FBZCxHQUF3QixjQUEvQjtBQUNILEtBZEw7QUFlSCxDQWxCRDs7QUFvQkFsQixHQUFHb0IsS0FBSCxHQUNLQyxLQURMLENBQ1dyQixHQUFHc0IsSUFEZCxFQUNvQixnQkFEcEIsRUFFS0MsS0FGTCxDQUVXbkIsS0FGWCxFIiwiZmlsZSI6ImFmcmFtZS1zdGF0ZS1tYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcbmltcG9ydCBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0ICogYXMgdG9wb2pzb24gZnJvbSBcInRvcG9qc29uLWNsaWVudFwiO1xuXG52YXIgcGF0aCA9IGQzLmdlb1BhdGgoKTtcblxudmFyIHJlYWR5ID0gKGVycm9yLCB1cykgPT4ge1xuICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3I7XG5cbiAgICBkMy5zZWxlY3QoXCJhLXNjZW5lXCIpXG4gICAgICAgIC5zZWxlY3RBbGwoXCIuc3RhdGVcIilcbiAgICAgICAgLmRhdGEodG9wb2pzb24uZmVhdHVyZSh1cywgdXMub2JqZWN0cy5zdGF0ZXMpLmZlYXR1cmVzKVxuICAgICAgICAuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKFwiYS1lbnRpdHlcIilcbiAgICAgICAgLmNsYXNzZWQoXCJzdGF0ZVwiLCB0cnVlKVxuICAgICAgICAuYXR0cihcInBvc2l0aW9uXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICB2YXIgY2VudHJvaWQgPSBwYXRoLmNlbnRyb2lkKGQpO1xuICAgICAgICAgICAgcmV0dXJuIChjZW50cm9pZFsgMCBdIC8gMTAwKSArIFwiIC1cIiArIChjZW50cm9pZFsgMSBdIC8gMTAwKSArIFwiIDFcIjtcbiAgICAgICAgfSlcbiAgICAgICAgLy8gICAgICAgICAgICAuYXR0cihcInNjYWxlXCIsIFwiMC41IDAuNSAxXCIpXG4gICAgICAgIC5hdHRyKFwicm90YXRpb25cIiwgXCIwIDAgMFwiKVxuICAgICAgICAuYXR0cihcInN2Z3BhdGhcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBcInN2Z1BhdGg6IFwiICsgcGF0aChkKSArIFwiOyBjb2xvcjogcmVkXCI7XG4gICAgICAgIH0pO1xufTtcblxuZDMucXVldWUoKVxuICAgIC5kZWZlcihkMy5qc29uLCBcInVzLTEwbS52MS5qc29uXCIpXG4gICAgLmF3YWl0KHJlYWR5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FmcmFtZS1zdGF0ZS1tYXAuanMiXSwic291cmNlUm9vdCI6IiJ9