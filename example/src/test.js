function m1() {
    console.log('1 start');
    // xxxx
    console.log('1 end');
}


function m2() {
    console.log('2 start');
    // xxxx
    console.log('2 end');
}

async function w1(next) {
    console.log('w1 start');
    // wrap fn logic
    await next();
    console.log('w1 end');
}

// wrap
async function w2(next) {
    console.log('w2 start');
    // wrap fn logic
    await next();
    console.log('w2 end');
}

function logic() {
    console.log('logic');
}

async function main() {
    const pipeline = (next) => {
        m1()
        m2();
        logic(); a
    };

    // 洋葱型中间件
    // const wlist = []; // wrap fn list
    // for(const w of wlist){
    //     await w();
    // }

    pipeline();
}

main();
