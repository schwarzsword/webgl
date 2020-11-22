const ashes = {
    layers: 360,
    particles: 100,
    rad: 20,
    vertices: [],
    indices: [],
    normals: [],
    makeVerts() {
        for (let layer = 0; layer <= this.layers; ++layer) {
            for (let loop = 0; loop <= this.loops; ++loop) {
                //   x=(R+r·cos(v))cos(w)
                //   y=(R+r·cos(v))sin(w)
                //             z=r.sin(v)
                const u = loop / this.loops;
                const loop_angle = u * 2 * Math.PI;
                const cos_loops = Math.cos(loop_angle);
                const sin_loops = Math.sin(loop_angle);

                const z = 4 + slice_rad * cos_loops;
                const x = 4 + slice_rad * sin_loops;
                const y = this.inner_rad * sin_slices;

                this.vertices.push(x, y, z);
                this.normals.push(
                    cos_loops * sin_slices,
                    sin_loops * sin_slices,
                    cos_slices);

            }
        }

        const vertsPerSlice = this.loops + 1;
        for (let i = 0; i < this.slices; ++i) {
            let v1 = i * vertsPerSlice;
            let v2 = v1 + vertsPerSlice;

            for (let j = 0; j < this.loops; ++j) {

                this.indices.push(v1);
                this.indices.push(v1 + 1);
                this.indices.push(v2);

                this.indices.push(v2);
                this.indices.push(v1 + 1);
                this.indices.push(v2 + 1);

                v1 += 1;
                v2 += 1;
            }
        }
        //this.indices = undefined;
    },
};
ashes.makeVerts();