const ashes = {
    indCount: 0,
    speed: 0.25,
    particles: 20,
    up: 25,
    down: -5,
    viewPoint: 15,
    vertices: [],
    indices: [],
    normals: [],
    makeVerts() {

        for (let layer = this.up; layer >= this.down; --layer) {
            for (let particle = 0; particle < this.particles; ++particle) {
                const x = Math.random() * 2 * this.up - this.up;
                const y = Math.random() * 2 * this.up - this.up;

                this.vertices.push(
                    // Top
                    x, layer + 0.1, y,
                    x, layer + 0.1, y + 0.1,
                    x + 0.1, layer + 0.1, y + 0.1,
                    x + 0.1, layer + 0.1, y,

                    // Left
                    x, layer + 0.1, y + 0.1,
                    x, layer, y + 0.1,
                    x, layer, y,
                    x, layer + 0.1, y,

                    // Right
                    x + 0.1, layer + 0.1, y + 0.1,
                    x + 0.1, layer, y + 0.1,
                    x + 0.1, layer, y,
                    x + 0.1, layer + 0.1, y,

                    // Front
                    x + 0.1, layer + 0.1, y + 0.1,
                    x + 0.1, layer, y + 0.1,
                    x, layer, y + 0.1,
                    x, layer + 0.1, y + 0.1,

                    // Back
                    x + 0.1, layer + 0.1, y,
                    x + 0.1, layer, y,
                    x, layer, y,
                    x, layer + 0.1, y,

                    // Bottom
                    x, layer, y,
                    x, layer, y + 0.1,
                    x + 0.1, layer, y + 0.1,
                    x + 0.1, layer, y);
                this.normals.push(
                    0, 1, 0,
                    0, 1, 0,
                    0, 1, 0,
                    0, 1, 0,

                    // Left
                    -1, 0, 0,
                    -1, 0, 0,
                    -1, 0, 0,
                    -1, 0, 0,

                    // Right
                    1, 0, 0,
                    1, 0, 0,
                    1, 0, 0,
                    1, 0, 0,

                    // Front
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,

                    // Back
                    0, 0, -1,
                    0, 0, -1,
                    0, 0, -1,
                    0, 0, -1,

                    // Bottom
                    0, -1, 0,
                    0, -1, 0,
                    0, -1, 0,
                    0, -1, 0);
                let count = this.indCount;
                this.indices.push(
                    count, count + 1, count + 2,
                    count, count + 2, count + 3,

                    // Left
                    count + 5, count + 4, count + 6,
                    count + 6, count + 4, count + 7,

                    // Right
                    count + 8, count + 9, count + 10,
                    count + 8, count + 10, count + 11,

                    // Front
                    count + 13, count + 12, count + 14,
                    count + 15, count + 14, count + 12,

                    // Back
                    count + 16, count + 17, count + 18,
                    count + 16, count + 18, count + 19,

                    // Bottom
                    count + 21, count + 20, count + 22,
                    count + 22, count + 20, count + 23)
                this.indCount += 24;
            }
        }
    },
    recount: function () {
        for (let i = 1; i < this.vertices.length; i += 3) {
            let vertex = this.vertices[i];
            if (vertex - this.speed < this.down) {
                if (Number.isInteger(vertex)) {
                    vertex = this.viewPoint;
                } else {
                    vertex = this.viewPoint + 0.1;
                }
            } else {
                vertex -= this.speed;
            }
            this.vertices[i] = vertex;
        }
    }
};
