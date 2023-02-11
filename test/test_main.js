//
// Standalone runner
//

const path = require('path');
const fs = require('fs');

//-----------------------------------------------------------------------------------------------//
// Init module and lookup path
//-----------------------------------------------------------------------------------------------//

global._sourcebase = path.resolve(__dirname, "../src");
global.BIND = function (_module) {
    _module.paths.push(global._sourcebase);
};

// eslint-disable-next-line
BIND(module);

//-----------------------------------------------------------------------------------------------//
// Required Modules
//-----------------------------------------------------------------------------------------------//
const { Logger, LogLevel } = require('utilities/logger');
const { Elf } = require('elf/elf');
const { ElfSymbol } = require('elf/symbol_table');

const logger = new Logger("TestMain");

function testElf(filename) {

    const elf = new Elf();
    elf.load(filename);

    for (const section of elf.sections) {
        console.log("Section: " + section.name + "  index: " + section.index);
    }

    {
        const section = elf.getSection(".debug_line");
        if (section) {
            const entries = section.entries;
            if (entries) {
                for (const entry of entries) {
                    console.log("0x" + entry.address.toString(16) + ", " + entry.source + ":" + entry.line);
                }
            }
        }
    }

    {
        const section = elf.getSection(".symtab");
        if (section) {
            const numSymbols = section.getSymbolCount();
            for (let i=0; i<numSymbols; i++) {
                const symbol = section.getSymbol(i);
                if (symbol.type == ElfSymbol.TypeObject) {
                    console.log("Symbol: " + symbol.name + "  Value: " + symbol.value + "  Size: " + symbol.size);
                }
            }
        }
    }

    {
        const section = elf.getSection(".debug_info");
        const data = section.buffer;
    }

}

function main() {
    Logger.setGlobalLevel(LogLevel.Trace);
    //testElf("data/test8bit.elf");
    testElf("data/test64bit.elf");

    console.log("DONE");
}

main();
