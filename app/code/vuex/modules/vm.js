import { LOAD_ROM, WRITE_ADDR, WRITE_REG, INCR_PC, JUMP_PC } from '../mutation-types';

export const MAX_MEM_SIZE = 32768;
export const REGISTERS = { A: 'a', D: 'd', M: 'm', PC: 'pc' };

const state = {
    instructions: [],
    memory: [],
    registers: {
        a: 0,
        d: 0,
        pc: 0
    }
};

const mutations = {
    [LOAD_ROM](state, instructions){
        if (instructions.length > MAX_MEM_SIZE) {
            throw 'Attempted to write inexistent memory';
        }

        state.instructions = instructions;
    },

    [WRITE_ADDR](state, addr) {
        if (addr > MAX_MEM_SIZE) {
            throw 'Attempted to write inexistant memory address';
        }

        if (addr > state.memory.length) {
            while (state.memory.length < addr) {
                state.memory.push(0);
            }
        }

        state.memory[addr] = value;
    },

    [WRITE_REG](state, reg, value) {
        switch (reg) {
            case REGISTERS.A:
                state.registers.a = value;
                break;
            case REGISTERS.D:
                state.registers.d = value;
                break;
            case REGISTERS.M:
                throw 'Cannot directly write to `M` register';
            default:
                throw 'Invalid register argument (cannot directly acces the `pc` register)';
        }
    },

    [INCR_PC](state) {
        if (state.registers.pc >= MAX_MEM_SIE) {
            throw 'program counter overflow';
        }

        state.registers.pc += 1;
    },

    [JUMP_PC](state) {
        state.registers.pc = state.registers.a;
    }
};

export default { state, mutations };
