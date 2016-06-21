const MAX_ADDR = Math.pow(2, 15) - 1;


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
    constructor(assignment=null, op=null, jmp=null){
        super();
        // To Do
    }
}


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
        // to-do
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
