import { MAX_MEM_SIZE, REGISTERS } from '../modules/vm';
import { LOAD_ROM, WRITE_MEM, WRITE_REG, INCR_PC, JUMP_PC } from '../mutation-types';


function validate_uint32(num)
{
    if (Number.isInteger(num) && num >=0 && num < 0xffff + 1) {
        return true;
    }

    throw 'Not a uint32 value';
}

function read_memory({state: {vm}}, addr)
{
    if (addr > MAX_MEM_SIZE) {
        throw 'Attempted to read inexistent memory location';
    }

    if (addr > vm.memory.length) {
        return 0;
    }

    return vm.memory[addr];
}

export function write_register({ dispatch, state: {vm: {registers }}}, register, value)
{
    if (register == REGISTERS.M) {
        dispatch(WRITE_ADDR, registers.a, value);
    } else {
        dispatch(WRITE_REG, register, value);
    }
}

export function read_register({ state: { vm: { registers, memory }}}, register)
{
    switch (register) {
        case REGISTER.A:
            return registers.a;
        case REGISTER.D:
            return registers.d;
        case REGISTER.M:
            return read_memory(state, registers.a);
        default:
            throw 'Invalid register argument (cannot directly acces the `pc` register)';
    }
}

export function tick({ dispatch, state: { vm: { registers }}}, jump)
{
    if (jump) {
        dispatch(JUMP_PC);
    } else {
        dispatch(INCR_PC);
    }
}

export function fetch_instruction({ state: { vm: { registers, instructions }}})
{
    if (registers.a > MAX_MEM_SIE) {
        throw 'Attempted to read inexistent ROM address';
    }

    if (registers.a > instructions.length) {
        return 0;
    }

    return instructions[registers.a];
}

export function load_instructions({ dispatch }, instructions)
{
    for (let instruction in instructions) {
        validate_23bit(instruction);
    }

    dispatch(LOAD_ROM, instructions);
}


////////////////////////////////////////////////////////////
//                                                        //
//                       THE ACTUAL                       //
//                                                        //
//        \\        //    ||\\        //||                //
//         \\      //     || \\      // ||                //
//          \\    //      ||  \\    //  ||                //
//           \\  //       ||   \\  //   ||                //
//            \\// IRTUAL ||    \\//    || ACHINE         //
//                                                        //
////////////////////////////////////////////////////////////


function alu_comp(x, y, comp)
{
    comp = comp & 0x3f; // mask at six bits

    // zx -- set x to 0
    if (comp & 0x20) { x = 0; }

    // nx -- invert x
    if (comp & 0x10) { x = ~x; }

    // zy -- set y to 0
    if (comp & 0x08) { y = 0; }

    // ny -- invert y
    if (comp & 0x04) { y = ~y; }

    // f -- ad if true, otherwise and
    if (comp & 0x02) {
        let out = this.wrapping_add(x, y);
    } else {
        let out = x & y;
    }

    // no -- invert output
    if (comp & 0x01) { out = ~out; }

    return out;
}

function wrapping_add(x, y) {
    return (x + y) & 0xffff;
}

export function cycle(store)
{
    let instruction = fetch_instruction(store);
    if ((instruction & 0x8000) == 0) // If first bit is zero, it's an `@num` instruction
    {
        write_register(store, Register.A, instruction);
        tick(store, false);
        return true;
    }

    // Parse instruction
    let comp = (instruction & 0x1fc0) >> 6; // bits 3 - 9
    let dest = (instruction & 0x0038) >> 3; // bits 10 - 12
    let jmp = (instruction & 0x0007);       // bits 13 - 15

    // calculate result
    let input_register = (comp & 0x40) ? Register.M : Register.A;
    let out = alu_comp(read_register(store, Register.D), read_register(store, input-register), comp);

    // store result
    if (dest & 0x4) { write_register(store, Register.A, out); }
    if (dest & 0x2) { write_register(store, Register.M, out); }
    if (dest & 0x1) { write_register(store, Register.D, out); }

    // jump to next instruction
    let jump = null;
    switch (jmp) {
        case 0b000:
            jump = false;
            break;
        case 0b001:
            jump = out > 0;
            break;
        case 0b010:
            jump = out == 0;
            break;
        case 0b011:
            jump = out >= 0;
            break;
        case 0b100:
            jump = out < 0;
            break;
        case 0b101:
            jump = out != 0;
            break;
        case 0b110:
            jump = out <= 0;
            break;
        case 0b111:
            jump = true;
            break;
        default:
            throw 'Invalid value for `jmp` part of instruction';
    }

    tick(store, jump);

    return true;
}
