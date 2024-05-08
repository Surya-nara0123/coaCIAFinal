// direct mapping of L1 cache

class L1cache {
    constructor(mainMemorySize, cacheSize, noOfLinesOfCache, lineSize) { // everything in bytes
        this.cache = new Array(noOfLinesOfCache);
        this.cacheSize = cacheSize;
        this.noOfLinesOfCache = noOfLinesOfCache;
        this.lineSize = lineSize;
        this.mainMemorySize = mainMemorySize;

        for (let i = 0; i < noOfLinesOfCache; i++) {
            this.cache[i] = new Array(lineSize);
            for (let j = 0; j < lineSize; j++) {
                this.cache[i][j] = new Array(2);
                this.cache[i][j][0] = null; // data
                this.cache[i][j][1] = null; // tag
            }
        }
    }

    readCache(address, mainMemory) {
        let offset = address % this.lineSize;
        let lineNo = Math.floor(address / this.lineSize) % this.noOfLinesOfCache;
        let tag = Math.floor(address / (this.lineSize * this.noOfLinesOfCache));
        console.log(offset, lineNo, tag);
        let hit = false
        let data = null
        if (this.cache[lineNo][offset][0] == null) {
            let block = mainMemory.readMemory(address);
            for (let i = 0; i < this.lineSize; i++) {
                this.cache[lineNo][i][0] = block[i];
                this.cache[lineNo][i][1] = tag;
            }
            data = this.cache[lineNo][offset][0];
        } else {
            if (this.cache[lineNo][offset][1] == tag) {
                data = this.cache[lineNo][offset][0];
                hit = true;
            } else {
                let block = mainMemory.readMemory(address);
                for (let i = 0; i < this.lineSize; i++) {
                    this.cache[lineNo][i][0] = block[i];
                    this.cache[lineNo][i][1] = tag;
                }
                data = this.cache[lineNo][offset][0];
            }
        }
        return { "data": data, "hit": hit }
    }

}

export default L1cache;