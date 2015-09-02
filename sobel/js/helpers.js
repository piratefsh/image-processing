function trace(){
    console.info.apply(console, arguments)
}

function error(args){
    console.error(args)
}

var t = {
    s: null,
    e: null
}
function timer(action){
    switch(action){
        case 'start':
            t.s = new Date();
            break;
        case 'end':
            t.e = new Date();
            trace('time taken: ', t.e - t.s);
            break;
    }
}