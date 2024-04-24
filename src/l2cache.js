

class l2Cache {
    constructor(mainMemorySize, cacheSize, noOfLinesOfCache, lineSize, setSize) {
        this.cache = new Array(noOfLinesOfCache);
        this.cacheSize = cacheSize;
        this.noOfLinesOfCache = noOfLinesOfCache;
        this.lineSize = lineSize;
        this.mainMemorySize = mainMemorySize;
        this.setSize = setSize;
        this.numberOfSets = this.noOfLinesOfCache / this.setSize

        this.cache = new Array(this.noOfLinesOfCache);
        for (let i = 0; i < this.noOfLinesOfCache; i++) {
            this.cache[i] = new Array(this.lineSize)
            for (let j = 0; i < this.lineSize; j++) {
                this.cache[i][j] = new Array(3);
                this.cache[i][j][0] = null; // data
                this.cache[i][j][1] = null; // setno
                this.cache[i][j][3] = null; // tag
            }
        }
    }

    readCache(address, mainMemory) {
        let offset = address % this.lineSize;
        let setNo = Math.floor(address / this.lineSize) % this.numberOfSets;
        let tag = Math.floor(Math.floor(address / this.lineSize) / this.numberOfSets);
        let lineNo = Math.floor(address / this.lineSize);
        let data = 0;
        let line;
        let hit = false;

        if (this.cache[lineNo][offset][0] == null) {
            let block = mainMemory.readMemory(address);
            for (let i = 0; i < this.lineSize; i++) {
                this.cache[lineNo][i][0] = block[i];
                this.cache[lineNo][i][1] = setNo;
                this.cache[lineNo][i][2] = tag;
            }
            data = this.cache[lineNo][offset][0];
            line = this.cache[lineNo];
        } else {
            if (this.cache[lineNo][offset][1] == tag) {
                data = this.cache[lineNo][offset][0];
                line = this.cache[lineNo];
                hit = true;
            } else {
                let block = mainMemory.readMemory(address);
                for (let i = 0; i < this.lineSize; i++) {
                    this.cache[lineNo][i][0] = block[i];
                    this.cache[lineNo][i][1] = setNo;
                    this.cache[lineNo][i][2] = tag;
                }
                line = this.cache[lineNo];
                data = this.cache[lineNo][offset][0];
            }
        }
        return { "data": data, "hit": hit, "line": line }
    }
}

export default l2Cache