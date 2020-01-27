import{Polyline,Renderer,Transform,Geometry,Program,Mesh,Vec3,Vec2,Color}from"https://boid-trail.glitch.me/ogl.mjs";const vertex="\n            attribute vec3 position;\n            attribute vec3 next;\n            attribute vec3 prev;\n            attribute vec2 uv;\n            attribute float side;\n\n            uniform vec2 uResolution;\n            uniform float uDPR;\n            uniform float uThickness;\n\n            vec4 getPosition() {\n                vec2 aspect = vec2(uResolution.x / uResolution.y, 1);\n                vec2 nextScreen = next.xy * aspect;\n                vec2 prevScreen = prev.xy * aspect;\n\n                vec2 tangent = normalize(nextScreen - prevScreen);\n                vec2 normal = vec2(-tangent.y, tangent.x);\n                normal /= aspect;\n                normal *= 1.0 - pow(abs(uv.y - 0.5) * 1.9, 2.0);\n\n                float pixelWidth = 1.0 / (uResolution.y / uDPR);\n                normal *= pixelWidth * uThickness;\n\n                // When the points are on top of each other, shrink the line to avoid artifacts.\n                float dist = length(nextScreen - prevScreen);\n                normal *= smoothstep(0.0, 0.02, dist);\n\n                vec4 current = vec4(position, 1);\n                current.xy -= normal * side;\n                return current;\n            }\n\n            void main() {\n                gl_Position = getPosition();\n            }\n        ";{const e=new Renderer({dpr:2}),n=e.gl;n.canvas;document.body.appendChild(n.canvas),n.clearColor(.9,.9,.9,1);const t=new Transform,o=[];function resize(){e.setSize(window.innerWidth,window.innerHeight),o.forEach(e=>e.polyline.resize())}function random(e,n){const t=Math.random();return e*(1-t)+n*t}window.addEventListener("resize",resize,!1);var touchIndex=null,touchVelocity=new Vec3,friction=.9+.01*Math.random();function getParameters(){const e=1.5*(.2+.01*Math.random()),n=.5*e,t=1.5*n,o=1.72*t,r=Math.random()*Math.PI,a=.5*r,i=r,s=a,d=Math.random()*Math.PI,c=d*(1+Math.random()),u=c,p=d,h=.01*Math.random(),l=.2*h;return[{A1:e,f1:r,p1:d,d1:h},{A2:n,f2:a,p2:c,d2:l},{A3:t,f3:i,p3:u,d3:h},{A4:o,f4:s,p4:p,d4:l}]}function deviation(e,n,t,o,r){return e*Math.sin(n*t+o)*Math.pow(Math.E,-r*n)}function getHarmonographPoint(e,[{A1:n,f1:t,p1:o,d1:r},{A2:a,f2:i,p2:s,d2:d},{A3:c,f3:u,p3:p,d3:h},{A4:l,f4:m,p4:v,d4:f}]){return[deviation(n,e,t,o,r)-deviation(a,e,i,s,d),deviation(c,e,u,p,h)+deviation(l,e,m,v,f),0]}function reset(){o[touchIndex].mouseDown=!1,touchIndex=null,touchVelocity=new Vec3}["#e09f7d","#ef5d60","#ec4067","#a01a7d","#311847"].forEach((e,r)=>{const a={spring:random(.01,.05),parameters:getParameters(),vel:.01*Math.PI*Math.random(),mouseDown:!1},i=a.points=[],s=getHarmonographPoint(0,a.parameters);for(let e=0;e<20;e++)i.push(new Vec3(...s));a.polyline=new Polyline(n,{points:i,vertex:vertex,uniforms:{uColor:{value:new Color(e)},uThickness:{value:random(10,20)}}}),a.polyline.mesh.setParent(t),o.push(a)}),resize();const r=new Vec3;function updateMouse(e){null===touchIndex&&(touchIndex=Math.floor(o.length*Math.random()),o[touchIndex].mouseDown=!0),e.changedTouches&&e.changedTouches.length&&(e.x=e.changedTouches[0].pageX,e.y=e.changedTouches[0].pageY),void 0===e.x&&(e.x=e.pageX,e.y=e.pageY),r.set(e.x/n.renderer.width*2-1,e.y/n.renderer.height*-2+1,0)}"ontouchstart"in window?(window.addEventListener("touchstart",updateMouse,!1),window.addEventListener("touchmove",updateMouse,!1),window.addEventListener("touchend",reset,!1)):(window.addEventListener("mousedown",updateMouse,!1),window.addEventListener("mousemove",updateMouse,!1),window.addEventListener("mouseup",reset,!1));const a=new Vec3;function update(n){requestAnimationFrame(update),o.forEach(e=>{for(let t=e.points.length-1;t>=0;t--)t?e.points[t].lerp(e.points[t-1],.9):e.mouseDown?(a.copy(r).sub(e.points[t]).multiply(e.spring),touchVelocity.add(a).multiply(friction),e.points[t].add(touchVelocity)):(e.points[t]=new Vec3(...getHarmonographPoint(.001*n,e.parameters)),e.theta+=e.vel*e.spring);e.polyline.updateGeometry()}),e.render({scene:t})}requestAnimationFrame(update)}