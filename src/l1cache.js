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

        this.victimCache = new victimCache(lineSize, 4);
    }

    readCache(address, mainMemory, l2Cache) {
        let offset = address % this.lineSize;
        let lineNo = Math.floor(address / this.lineSize) % this.noOfLinesOfCache;
        let tag = Math.floor(address / (this.lineSize * this.noOfLinesOfCache));
        console.log(offset, lineNo, tag);
        let hit = false
        let data = null

        // if the location is empty
        if (this.cache[lineNo][offset][0] == null) {
            let block = mainMemory.readMemory(address);
            let result = l2Cache.readCache(address, mainMemory);
            console.log(result);
            if (result.hit == true) {
                for (let i = 0; i < this.lineSize; i++) {
                    this.cache[lineNo][i][0] = result.line[i][0];
                    this.cache[lineNo][i][1] = tag;
                }
            } else {
                for (let i = 0; i < this.lineSize; i++) {
                    this.cache[lineNo][i][0] = block[i];
                    this.cache[lineNo][i][1] = tag;
                }
            }
            this.victimCache.addLine(this.cache[lineNo], address);
            data = this.cache[lineNo][offset][0];
            // if the location if not empty
        } else {
            // the location contains the data we need
            if (this.cache[lineNo][offset][1] == tag) {
                data = this.cache[lineNo][offset][0];
                hit = true;
                // if the location does not contain the data we need
            } else {
                let block = mainMemory.readMemory(address);
                let line1 = this.cache[lineNo];
                // code for insert the current cache contents into the victim cache
                let result = l2Cache.readCache(address, mainMemory);
                console.log(result);
                if (result.hit == true) {
                    for (let i = 0; i < this.lineSize; i++) {
                        this.cache[lineNo][i][0] = result.line[i][0];
                        this.cache[lineNo][i][1] = tag;
                    }
                } else {
                    let line = this.victimCache.readLine(address)
                    console.log(line);
                    if (line != undefined) {
                        for (let i = 0; i < this.lineSize; i++) {
                            this.cache[lineNo][i][0] = line[i][0];
                            this.cache[lineNo][i][1] = line[i][1];
                        }
                    } else {
                        let result = l2Cache.readCache(address, mainMemory);
                        if (result.hit == true) {
                            for (let i = 0; i < this.lineSize; i++) {
                                this.cache[lineNo][i][0] = result.line[i][0];
                                this.cache[lineNo][i][1] = tag;
                            }
                        } else {
                            for (let i = 0; i < this.lineSize; i++) {
                                this.cache[lineNo][i][0] = block[i];
                                this.cache[lineNo][i][1] = tag;
                            }
                        }
                    }
                }
                this.victimCache.addLine(line1, address);
                data = this.cache[lineNo][offset][0];
            }
        }
        return { "data": data, "hit": hit }
    }

}

class victimCache {
    constructor(lineSize, noOfLinesOfCache) {
        this.cache = new Array(noOfLinesOfCache);
        this.lineSize = lineSize;
        this.noOfLinesOfCache = noOfLinesOfCache;
        for (let i = 0; i < noOfLinesOfCache; i++) {
            this.cache[i] = new Array(lineSize);
            for (let j = 0; j < lineSize; j++) {
                this.cache[i][j] = new Array(3);
                this.cache[i][j][0] = null; // data
                this.cache[i][j][1] = null; // tag
                this.cache[i][j][2] = null; // address
            }
        }

        this.currentLine = 0;
    }

    readLine(address) {
        for (let i = 0; i < this.noOfLinesOfCache; i++) {
            if (this.cache[i][2] == address) {
                return this.cache[i];
            }
        }
    }

    addLine(line, address) {
        console.log(this.readLine(address))
        if (this.readLine(address) == undefined) {
            let initialAddress = address - (address % this.lineSize)
            for (let i = 0; i < this.lineSize; i++) {
                this.cache[this.currentLine][i][0] = line[i][0];
                this.cache[this.currentLine][i][1] = line[i][1];
                this.cache[this.currentLine][i][2] = initialAddress + i;
            }
            this.currentLine = (this.currentLine + 1) % this.noOfLinesOfCache;
        }
    }

}

export default L1cache;