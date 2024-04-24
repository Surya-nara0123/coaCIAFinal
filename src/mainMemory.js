import random from "random";

class memory{
    constructor(size, lineSize){
        this.size = size;
        this.lineSize = lineSize;
        this.noOfLines = Math.floor(size / lineSize);
        this.memory = new Array(this.noOfLines);
        for(let i = 0; i < this.noOfLines; i++){
            this.memory[i] = new Array(lineSize);
            for(let j = 0; j < lineSize; j++){
                this.memory[i][j] = random.int(0, 99);
            }
        }
    }

    readMemory(address){
        let lineNo = Math.floor(address / this.lineSize);
        return this.memory[lineNo];
    }
}

export default memory;