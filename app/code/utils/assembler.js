let assembler = (text) => {
    const codes = ['11001100', '11110000', '11111110'];
    let result = [];
    for (let i = 0; i < 5; i++){
        result = result.concat(codes);
    }
    return result;
};

export default assembler;
