webpackJsonp([2,6],{

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var _svgMesh3d = __webpack_require__(26);

var _svgMesh3d2 = _interopRequireDefault(_svgMesh3d);

var _threeSimplicialComplex = __webpack_require__(27);

var _threeSimplicialComplex2 = _interopRequireDefault(_threeSimplicialComplex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AFRAME = window.AFRAME;
var THREE = AFRAME.THREE;

var createGeometry = (0, _threeSimplicialComplex2.default)(THREE);

AFRAME.registerComponent("svgpath", {
    schema: {
        color: { type: "color", default: "#c23d3e" },
        svgPath: { type: "string", default: "M 15,1 29,37 H 15 L 1,1 Z" }
    },
    multiple: false,
    init: function init() {
        var data = this.data;
        var el = this.el;
        var meshData = (0, _svgMesh3d2.default)(data.svgPath, {
            delaunay: true,
            clean: true,
            exterior: false,
            randomization: 0,
            simplify: 0,
            scale: 1
        });
        this.geometry = createGeometry(meshData);
        this.material = new THREE.MeshStandardMaterial({ color: data.color }); // Create material.
        this.mesh = new THREE.Mesh(this.geometry, this.material); // Create mesh.
        el.setObject3D("mesh", this.mesh); // Set mesh on entity.
    },
    update: function update() {},
    remove: function remove() {},
    pause: function pause() {},
    play: function play() {}
});

/***/ })

},[143]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hZnJhbWUtc3ZnLmpzIl0sIm5hbWVzIjpbIkFGUkFNRSIsIndpbmRvdyIsIlRIUkVFIiwiY3JlYXRlR2VvbWV0cnkiLCJyZWdpc3RlckNvbXBvbmVudCIsInNjaGVtYSIsImNvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJzdmdQYXRoIiwibXVsdGlwbGUiLCJpbml0IiwiZGF0YSIsImVsIiwibWVzaERhdGEiLCJkZWxhdW5heSIsImNsZWFuIiwiZXh0ZXJpb3IiLCJyYW5kb21pemF0aW9uIiwic2ltcGxpZnkiLCJzY2FsZSIsImdlb21ldHJ5IiwibWF0ZXJpYWwiLCJNZXNoU3RhbmRhcmRNYXRlcmlhbCIsIm1lc2giLCJNZXNoIiwic2V0T2JqZWN0M0QiLCJ1cGRhdGUiLCJyZW1vdmUiLCJwYXVzZSIsInBsYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBU0MsT0FBT0QsTUFBdEI7QUFDQSxJQUFNRSxRQUFRRixPQUFPRSxLQUFyQjs7QUFFQSxJQUFNQyxpQkFBaUIsc0NBQXVCRCxLQUF2QixDQUF2Qjs7QUFFQUYsT0FBT0ksaUJBQVAsQ0FBeUIsU0FBekIsRUFBb0M7QUFDaENDLFlBQVE7QUFDSkMsZUFBTyxFQUFFQyxNQUFNLE9BQVIsRUFBaUJDLFNBQVMsU0FBMUIsRUFESDtBQUVKQyxpQkFBUyxFQUFFRixNQUFNLFFBQVIsRUFBa0JDLFNBQVMsMkJBQTNCO0FBRkwsS0FEd0I7QUFLaENFLGNBQVUsS0FMc0I7QUFNaENDLFVBQU0sZ0JBQVk7QUFDZCxZQUFNQyxPQUFPLEtBQUtBLElBQWxCO0FBQ0EsWUFBTUMsS0FBSyxLQUFLQSxFQUFoQjtBQUNBLFlBQU1DLFdBQVcseUJBQVVGLEtBQUtILE9BQWYsRUFBd0I7QUFDckNNLHNCQUFVLElBRDJCO0FBRXJDQyxtQkFBTyxJQUY4QjtBQUdyQ0Msc0JBQVUsS0FIMkI7QUFJckNDLDJCQUFlLENBSnNCO0FBS3JDQyxzQkFBVSxDQUwyQjtBQU1yQ0MsbUJBQU87QUFOOEIsU0FBeEIsQ0FBakI7QUFRQSxhQUFLQyxRQUFMLEdBQWdCbEIsZUFBZVcsUUFBZixDQUFoQjtBQUNBLGFBQUtRLFFBQUwsR0FBZ0IsSUFBSXBCLE1BQU1xQixvQkFBVixDQUErQixFQUFFakIsT0FBT00sS0FBS04sS0FBZCxFQUEvQixDQUFoQixDQVpjLENBWXdEO0FBQ3RFLGFBQUtrQixJQUFMLEdBQVksSUFBSXRCLE1BQU11QixJQUFWLENBQWUsS0FBS0osUUFBcEIsRUFBOEIsS0FBS0MsUUFBbkMsQ0FBWixDQWJjLENBYTJDO0FBQ3pEVCxXQUFHYSxXQUFILENBQWUsTUFBZixFQUF1QixLQUFLRixJQUE1QixFQWRjLENBY29CO0FBQ3JDLEtBckIrQjtBQXNCaENHLFlBQVEsa0JBQVksQ0FDbkIsQ0F2QitCO0FBd0JoQ0MsWUFBUSxrQkFBWSxDQUNuQixDQXpCK0I7QUEwQmhDQyxXQUFPLGlCQUFZLENBQ2xCLENBM0IrQjtBQTRCaENDLFVBQU0sZ0JBQVksQ0FDakI7QUE3QitCLENBQXBDLEUiLCJmaWxlIjoiYWZyYW1lLXN2Zy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcImFmcmFtZVwiO1xuaW1wb3J0IHN2Z01lc2gzZCBmcm9tIFwic3ZnLW1lc2gtM2RcIjtcbmltcG9ydCB0aHJlZVNpbXBsaWNpYWxDb21wbGV4IGZyb20gXCJ0aHJlZS1zaW1wbGljaWFsLWNvbXBsZXhcIjtcblxuY29uc3QgQUZSQU1FID0gd2luZG93LkFGUkFNRTtcbmNvbnN0IFRIUkVFID0gQUZSQU1FLlRIUkVFO1xuXG5jb25zdCBjcmVhdGVHZW9tZXRyeSA9IHRocmVlU2ltcGxpY2lhbENvbXBsZXgoVEhSRUUpO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJzdmdwYXRoXCIsIHtcbiAgICBzY2hlbWE6IHtcbiAgICAgICAgY29sb3I6IHsgdHlwZTogXCJjb2xvclwiLCBkZWZhdWx0OiBcIiNjMjNkM2VcIiB9LFxuICAgICAgICBzdmdQYXRoOiB7IHR5cGU6IFwic3RyaW5nXCIsIGRlZmF1bHQ6IFwiTSAxNSwxIDI5LDM3IEggMTUgTCAxLDEgWlwiIH0sXG4gICAgfSxcbiAgICBtdWx0aXBsZTogZmFsc2UsXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBlbCA9IHRoaXMuZWw7XG4gICAgICAgIGNvbnN0IG1lc2hEYXRhID0gc3ZnTWVzaDNkKGRhdGEuc3ZnUGF0aCwge1xuICAgICAgICAgICAgZGVsYXVuYXk6IHRydWUsXG4gICAgICAgICAgICBjbGVhbjogdHJ1ZSxcbiAgICAgICAgICAgIGV4dGVyaW9yOiBmYWxzZSxcbiAgICAgICAgICAgIHJhbmRvbWl6YXRpb246IDAsXG4gICAgICAgICAgICBzaW1wbGlmeTogMCxcbiAgICAgICAgICAgIHNjYWxlOiAxLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5nZW9tZXRyeSA9IGNyZWF0ZUdlb21ldHJ5KG1lc2hEYXRhKTtcbiAgICAgICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiBkYXRhLmNvbG9yIH0pOy8vIENyZWF0ZSBtYXRlcmlhbC5cbiAgICAgICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tZXRyeSwgdGhpcy5tYXRlcmlhbCk7Ly8gQ3JlYXRlIG1lc2guXG4gICAgICAgIGVsLnNldE9iamVjdDNEKFwibWVzaFwiLCB0aGlzLm1lc2gpOy8vIFNldCBtZXNoIG9uIGVudGl0eS5cbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgfSxcbiAgICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIH0sXG4gICAgcGxheTogZnVuY3Rpb24gKCkge1xuICAgIH0sXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FmcmFtZS1zdmcuanMiXSwic291cmNlUm9vdCI6IiJ9