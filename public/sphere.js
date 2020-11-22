const sphere = {
    slices: 20,
    loops: 20,
    inner_rad: 2,
    outerRad: 0.1,
    vertices: [],
    indices: [],
    normals: [],
    texCoords: [],
    makeVerts() {
        for (let slice = 0; slice <= this.slices; ++slice) {
            const v = slice / this.slices;
            const slice_angle = v * 2 * Math.PI;
            const cos_slices = Math.cos(slice_angle);
            const sin_slices = Math.sin(slice_angle);
            const slice_rad = this.outerRad + this.inner_rad * cos_slices;

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

                this.texCoords.push(u);
                this.texCoords.push(v);
            }
        }


        // 0  1  2  3  4  5
        // 6  7  8  9  10 11
        // 12 13 14 15 16 17

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