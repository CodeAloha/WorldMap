

			function loadColor() {
			    var e = new Image;
			    e.onload = function() {
			        var e = document.createElement("canvas");
			        e.width = this.width;
			        e.height = this.height;
			        var t = e.getContext("2d");
			        t.drawImage(this, 0, 0);
			        imageW = e.width;
			        imageH = e.height;
			        colorData = t.getImageData(0, 0, imageW, imageH).data;
			        loadBoundaries();
			        loadHeight()
			    };
			    e.src = "day_medium.jpg"
			}

			function loadBoundaries() {
			    var e = new Image;
			    e.onload = function() {
			        var e = document.createElement("canvas");
			        e.width = this.width;
			        e.height = this.height;
			        var t = e.getContext("2d");
			        t.drawImage(this, 0, 0);
			        imageW = e.width;
			        imageH = e.height;
			        boundaryData = t.getImageData(0, 0, imageW, imageH).data
			    };
			    e.src = "boundaries.jpg"
			}

			function loadHeight() {
			    var e = new Image;
			    e.onload = function() {
			        var e = document.createElement("canvas");
			        e.width = this.width;
			        e.height = this.height;
			        var t = e.getContext("2d");
			        t.drawImage(this, 0, 0);
			        imageW = e.width;
			        imageH = e.height;
			        var n = t.getImageData(0, 0, imageW, imageH).data;
			        var r = 0;
			        var i = 0;
			        for (var s = 0; s < imageW; ++s) {
			            for (var o = 0; o < imageH; ++o) {
			                var u = n[r];
			                var a = n[r + 1];
			                var f = n[r + 2];
			                var l = n[r + 3];
			                var c = new THREE.Color;
			                try {
			                    if (boundaryData[r] == 0) {
			                        c.setRGB(colorData[r] / 255, colorData[r + 1] / 255, colorData[r + 2] / 255)
			                    } else {
			                        c.setRGB((colorData[r] - 20) / 255, (colorData[r + 1] - 20) / 255, (colorData[r + 2] - 20) / 255)
			                    }
			                } catch (h) {
			                    c.setRGB(colorData[r] / 255, colorData[r + 1] / 255, colorData[r + 2] / 255)
			                }
			                r = s * 4 + o * 4 * imageW;
			                var p = u + a + f;
			                if (p > 70) {
			                    var d = {
			                        x: s - imageW / 2,
			                        y: o - imageH / 2,
			                        scale: p / 3 + 50,
			                        color: c,
			                        mod: i
			                    };
			                    array.push(d)
			                } else {
			                    var d = {
			                        x: s - imageW / 2,
			                        y: o - imageH / 2,
			                        scale: 30,
			                        color: c,
			                        mod: i
			                    };
			                    array.push(d)
			                }
			            }++i
			        }
			        init();
			        animate()
			    };
			    e.src = "bump_medium2.jpg"
			}

			function init() {
			    container = document.createElement("div");
			    document.body.appendChild(container);
			    scene = new THREE.Scene;
			    if (!(navigator.appVersion.indexOf("Win") != -1 || navigator.appVersion.indexOf("Mac") != -1 || navigator.appVersion.indexOf("X11") != -1 || navigator.appVersion.indexOf("Linux") != -1)) {
			        scene.fog = new THREE.Fog(197379, 100, 200)
			    }
			    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1e4);
			    camera.position.z = -200;
			    camera.lookAt(scene.position);
			    scene.add(camera);
			    world = new THREE.Object3D;
			    world.rotation.y = Math.PI - .4;
			    scene.add(world);
			    var e = new THREE.Object3D;
			    e.rotation.x = -Math.PI / 2;
			    world.add(e);
			    var t = 100;
			    var n = new THREE.Geometry;
			    var r = [];
			    var s = Math.PI * 2 / 1024;
			    var o = Math.PI / 512;
			    for (i = 0; i < array.length; i++) {
			        var u = 0;
			        if (array[i].mod % 2 == 0) {
			            u = .5
			        }
			        var a = array[i].x * s;
			        var f = (array[i].y - u) * o;
			        var l = array[i].scale / (255 * 3);
			        var c = array[i].color;
			        var h = new THREE.Vector3;
			        h.x = t * Math.cos(f) * Math.cos(a);
			        h.y = t * Math.cos(f) * Math.sin(a);
			        h.z = t * -Math.sin(f);
			        vertex2 = h.clone();
			        vertex2.multiplyScalar(1 + l / 6);
			        n.vertices.push(h);
			        n.vertices.push(vertex2);
			        r.push(c);
			        r.push(c)
			    }
			    n.colors = r;
			    var p = new THREE.LineBasicMaterial({
			        color: 16777215,
			        linewidth: 1,
			        vertexColors: THREE.VertexColors
			    });
			    var d = new THREE.Line(n, p, THREE.LinePieces);
			    e.add(d);
			    try {
			        renderer = new THREE.WebGLRenderer({
			            antialias: true
			        });
			        renderer.setSize(window.innerWidth, window.innerHeight);
			        THREEx.WindowResize(renderer, camera);
			        container.appendChild(renderer.domElement);
			        has_gl = true
			    } catch (v) {
			        console.log("No WebGL Context.");
			        return;
			    }
			}

			function onDocumentMouseMove(e) {
			    var t = window.innerWidth >> 1;
			    var n = window.innerHeight >> 1;
			    mouseX = e.clientX - t;
			    mouseY = e.clientY - n
			}

			function onTouchMove(e) {
			    e.preventDefault();
			    var t = window.innerWidth >> 1;
			    var n = window.innerHeight >> 1;
			    mouseX = (e.touches[0].clientX - t) * -1;
			    mouseY = (e.touches[0].clientY - n) * -1
			}

			function animate() {
			    requestAnimationFrame(animate);
			    render()
			}

			function render() {
			    time = (new Date).getTime();
			    delta = time - oldTime;
			    oldTime = time;
			    if (isNaN(delta) || delta > 1e3 || delta == 0) {
			        delta = 1e3 / 60
			    }
			    camera.position.y += (-150 * Math.sin(mouseY / 500) - camera.position.y) / 10;
			    camera.lookAt(scene.position);
			    world.rotation.y -= mouseX / 2e4;
			    if (has_gl) {
			        renderer.render(scene, camera);
			    }
			}
			var expanded = true;
			var container;
			var camera, scene, renderer;
			var composer;
			var has_gl = false;
			var delta;
			var time;
			var oldTime;
			var world;
			var array = [];
			var coverMesh;
			var colorData;
			var boundaryData;
			var mouseX = 0;
			var mouseY = 0;
			document.addEventListener("mousemove", onDocumentMouseMove, false);
			document.addEventListener("touchmove", onTouchMove, false);
			loadColor();