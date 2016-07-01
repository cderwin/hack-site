const MAX_ADDR = Math.pow(2, 15) - 1;
const BITLENGTH = 32;


function leftPad(base, minLength, pad=' '){
    const len = base.length;
    if (len >= minLength)
        return base;

    let padding = '';
    for (let i = 0; i < minLength - len; i++)
    {
        padding += pad;
    }

    return padding + base;
}


const InstructionTypes = Object.freeze({
    A: 'a',
    B: 'b'
});


class Instruction {
    constructor(binary, index=0)
    {
        const buffer = new ArrayBuffer(2);
        this.buffer = new Uint16Array(buffer);
        this.type = null;
        this.index = index;
    }

    get binary()
    {
        if (!this._binary) {
            const binary = this.buffer[0].toString(2);
            this._binary = leftPad(binary, 16, '0');
        }

        return this._binary;
    }

    set binary(val)
    {
        const intVal = parseInt(val, 2);
        if (isNaN(intVal)){
            throw 'Invalid binary value';
        }

        this._binary = val;
        this.buffer[0] = intVal;
    }

    get hex(){
        if (!this._hex)
        {
            const hex = this.buffer[0].toString(16);
            this._hex = leftPad(hexx, 16, '0');
        }

        return this._hex;
    }

    set hex(val){
        const intVal = parseInt(val, 16);
        if (isNaN(intVal))
            throw 'Invalid hex format';

        this._hex = val;
        this.buffer[0] = intVal;
    }
}

class AInstruction extends Instruction {
    constructor(addr, index=0, symbol=false)
    {
        super(addr, index);
        this.type = InstructionTypes.A;
        if (symbol) {
            this.finalized = false;
            this.symbol = symbol;
        } else {
            this.buffer[0] = addr;
            this.finalized = true;
        }
    }

    get value(){
        return this.buffer[0];
    }

    set value(val){
        this.buffer[0] = val;
    }

    resolveSymbols(symbolTable)
    {
        if (this.finalized)
            return;

        const value = symbolTable[this.symbol];
        if (value){
            this.value = value;
            this.finalized = true;
        }
    }
}


class CInstruction extends Instruction {

    constructor(dest, comp, jump){
        super();
        this.initAttrs();

        if (!comp)
            throw "No comp given, required argument"

        let instruction = '111';
        instruction += this.comps[comp];
        instruction += this.dests[dest].toString(2);
        instruction += this.jumps[jump].toString(2);
        instruction = parseInt(instruction, 2);
        this.buffer[0] = instruction;
    }

    get dest()
    {
        const instruction = this.buffer[0];
        const val = parseInt(this.screen(instruction, 10, 13), 2);
        for (let key in this.dests.keys())
        {
            if (val == this.dests[key])
                return key;
        }
    }

    set dest(value){
        if (!this.dests.keys().contains(value))
            throw 'Invalid dest value';

        const bits = leftPad(this.dests[dest] , 3, '0');
        let instruction = this.binary;
        instruction = instruction.substr(0, 10) + bits + instruction.substr(13, 3);
        this.binary = instruction;
    }

    initAttrs()
    {
        // Part declarations
        this.dests = {null: 0, 'M=': 1, 'D=': 2, 'MD=': 3, 'A=': 4, 'AM=': 5, 'AD=': 6, 'AMD=': 7};

        this.jumps = {null: 0, ';JGT': 1, ';JEQ': 2, ';JGE': 3, ';JLT': 4, ';JNE': 5, ';JLE': 6, ';JMP': 7};

        this.comps = {
            '0':   '0101010', '1':   '0111111', '-1':  '0111010', 'D':   '0001100', 'A':   '0110000', '!D':  '0001101', '!A':  '0110001',
            '-D':  '0001111', '-A':  '0110011', 'D+1': '0011111', 'A+1': '0110111', 'D-1': '0001110', 'A-1': '0110010', 'D+A': '0000010',
            'D-A': '0010011', 'A-D': '0000111', 'D&A': '0000000', 'D|A': '0010101', 'M':   '1110000', '!M':  '1110001', '-M':  '1110011', 
            'M+1': '1110111', 'M-1': '1110010', 'D+M': '1000010', 'D-M': '1010011', 'M-D': '1000111', 'D&M': '1000000', 'D|M': '1010101'
        };
    }

    static screen(value, min=0, max=null)
    {
        // Returns bits of index min through max as a binary string
        if (!max)
            max = Math.ceil(Math.log(value) / Math.log(2));

        const minBitMask = (-1 >>> (BITLENGTH - min));
        const maxBitMask = (-1 >>> (BITLENGTH - max));
        return (value & maxBitMask) & (~minBitMask);
    }
}

// Class variables
CInstruction.dests = {null: 0, 'M=': 1, 'D=': 2, 'MD=': 3, 'A=': 4, 'AM=': 5, 'AD=': 6, 'AMD=': 7};
CInstruction.jumps = {null: 0, ';JGT': 1, ';JEQ': 2, ';JGE': 3, ';JLT': 4, ';JNE': 5, ';JLE': 6, ';JMP': 7};
CInstruction.comps = {
    '0':   '0101010', '1':   '0111111', '-1':  '0111010', 'D':   '0001100', 'A':   '0110000', '!D':  '0001101', '!A':  '0110001',
    '-D':  '0001111', '-A':  '0110011', 'D+1': '0011111', 'A+1': '0110111', 'D-1': '0001110', 'A-1': '0110010', 'D+A': '0000010',
    'D-A': '0010011', 'A-D': '0000111', 'D&A': '0000000', 'D|A': '0010101', 'M':   '1110000', '!M':  '1110001', '-M':  '1110011', 
    'M+1': '1110111', 'M-1': '1110010', 'D+M': '1000010', 'D-M': '1010011', 'M-D': '1000111', 'D&M': '1000000', 'D|M': '1010101'
};


export class Assembler {
    constructor()
    {
        this.instructions = [];
        this.symbolTable =  {};
        this.unresolvedStack = [];
        this.counter = 0;
    }

    clearState(){
        this.instructions = [];
        this.symbolTable = {};
        this.unresolvedStack = [];
        this.counter = 0;
    }

    isIdentifier(ident)
    {
        for (let i = 0; i < ident.length; i++)
        {
            const code = ident.charCodeAt(i);

            if (i != 0 && code > 47 && code < 58) // numerals (0-9), identifier cannot start with numeral
                return true;

            if (code > 64 && code < 91) // uppercase alphabet (A-Z)
                return true;

            if (code > 96 && code < 123)  // lowercase alphabet (a-z)
                return true;

            if (code == 36 || code == 46 || code == 58 || code == 95) // dollar sign (36), period (46), colon (58), or underscore (95)
                return true;

            return false;
        }

        return true;
    }

    isAddress(addr)
    {
        addr = parseInt(addr);
        if (isNaN(addr))
            return false;

        if (addr < 0 || addr > MAX_ADDR)
            return false;

        return true;
    }

    parseComment(line)
    {
        if (line.startsWith('//'))
        {
            return {type: 'comment'};
        }
    }

    parseLabel(line)
    {
        if (line.startsWith('(') && line.endsWith(')'))
        {
            const label = line.slice(1, -1);
            if (this.isIdentifier(label))
            {
                this.symbolTable[label] = this.counter;
                return {type: 'label'};
            }
        }
    }

    parseAInstruction(line)
    {
        if (line.startsWith('@'))
        {
            const value = line.slice(1);

            if (this.isAddress(value))
            {
                const addrValue = parseInt(value, 10);
                return new AInstruction(addrValue, this.counter, false);
            }
            else if (this.isIdentifier(value))
            {
                return new AInstruction(value, this.counter, true);
            }
        }
    }

    parseCInstruction(line)
    {
        // To Do
    }

    assemble(text)
    {
        const lines = text.split('\n')
            .map(line => line.trim())
            .filter(line => (line != ''));

        for (let line of lines){
            const instruction = (
                this.parseComment(line) ||
                this.parseLabel(line) ||
                this.parseAInstruction(line) ||
                this.parseCInstruction(line)
            );

            if (!instruction)
            {
                throw 'Line `' + line + '` could not be parsed';
            }

            if (instruction.type == InstructionTypes.A || instruction.type == InstructionTypes.C)
            {
                this.instructions.push(instruction);
                this.counter += 1;
            }
        }

        for (let instruction of this.unresolvedStack){
            instruction.resolveSymbols(this.symbolTable);
        }
    }
};
