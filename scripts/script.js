// set up element
const bg = document.getElementById("bg");

// define relative size of canvas
bg.width = window.innerWidth - 20;
bg.height = window.innerHeight - 20;

// set up variables
let ctxs = []; // array to hold bead objects
let current_ctx_arr = []; // array to keep track of current bead being touched
let is_dragging = false; // keep track of mousedown event when in shape
let start_x = []; // keep track of mouse starting position
let start_y = []; // keep track of mouse starting position
let mouse_x = []; // mouse moved to position
let mouse_y = []; // mouse moved to position
let is_mobile = false; // flag for desktop/mboile
let active_col_index; // track column being touched
let counter_val = 0; // track current numeric value of abacus
const last_bead_index = 4; // immutable b value for last bead in column

// set up touch tracking
current_ctx_arr.push({touch: 0, last_ctx: null}, {touch: 1, last_ctx: null});

// set up relative positions of beads and other parameters
// 4 columns, fold page evenly by 5 and centerpoint x should be on folds
const fold_x = Math.round(bg.width/4);
const rel_w = Math.round(bg.height/14);
const rel_x = fold_x - rel_w;
const incr_x = Math.round(bg.width/5);

// start y on bottom half of the page
const rel_y = Math.round(bg.height/2);
const rel_h = rel_w;
// start beads stacked
// rel_y is centerpoint, where the rectangles will be drawn
// rotated 45 degrees, therefore the perfect fitment will be centerpoint to
// edge of rectangle * 2, using pythagorean thereom
const incr_y = Math.round(2 * Math.sqrt((rel_w/2)**2 + (rel_h/2)**2)) + 1; 
const init_bead_colour = '#D34324';

// boundaries
const mid_bound_y = rel_y + incr_y/6;
const up_bound_y = rel_y - 1.5 * incr_y - 10;
const lr_bound_y = bg.height;

// c, b, x, y, w, h, is_colliding, is_bound, val
function define_shape_dims() {
    // init array
    // column loop
    function def_bound_y(d, b) {
        switch(b) {
            case 0:
                if (d === 'u') {
                    return up_bound_y;
                } else {
                    return mid_bound_y;
                }
            case 1:
                if (d === 'u') {
                    return mid_bound_y;
                } else {
                    return lr_bound_y - incr_y * 3;
                }                        
            case 2:
                if (d === 'u') {
                    return mid_bound_y + incr_y * 1;
                } else {
                    return lr_bound_y - incr_y * 2;
                }                        
            case 3:
                if (d === 'u') {
                    return mid_bound_y + incr_y * 2;
                } else {
                    return lr_bound_y - incr_y;
                }                    
            case 4:
                if (d === 'u') {
                    return mid_bound_y + incr_y * 3;
                } else {
                    return lr_bound_y;
                }                
            default:
                return 0;
        }
    }

    for (let c = 0; c < 4; c++) {
        // bead loop
        for (let b = 0; b < 5; b++) {
            let temp_val;
            if (b === 0) {
                temp_val = 5 * 10**(3 - c);
            } else {
                temp_val = 1 * 10**(3 - c);
            }
            ctxs.push({c: c, b: b, x: rel_x + c * incr_x, y: rel_y + b * incr_y, w: rel_w, h: rel_h, min_y: def_bound_y('u', b), max_y: def_bound_y ('l', b), is_colliding: false, is_bound: false, val: temp_val});
        }
    }
    // move first row starting position up
    for (let [i, ctx] of ctxs.entries()) {
        if (ctx.b === 0) {
            ctxs[i].y = ctx.y - 1.5 * incr_y;
        }
    }
    // console.log(ctxs);
}

// draw and redraw shapes as movement is detected
let draw_shapes = function() {
    let context = bg.getContext("2d");

    // beads
    context.clearRect(0, 0, bg.width, bg.height); // clear entire canvas and redraw all shapes
    for (let [i, ctx] of ctxs.entries()) {
        context.save(); // save context
        // translate origin to current shape's x, y
        context.translate(ctx.x + ctx.w/2, ctx.y + ctx.h/2);
        context.rotate(45 * (Math.PI/180));
        context.fillStyle = init_bead_colour;
        // x and y positions are reset to 0, 0 because of the translate() function
        context.fillRect(-ctx.w/2, -ctx.h/2, ctx.w, ctx.h);    
        context.restore(); // restore context so other objects are not rotated
    }

    // boundaries
    // middle
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, mid_bound_y);
    context.lineTo(bg.width, mid_bound_y);
    context.stroke();
    // top
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, up_bound_y);
    context.lineTo(bg.width, up_bound_y);
    context.stroke();

    // counter
    // context.fillStyle = 'grey';
    // context.fillRect(ctxs[5].x + ctxs[5].w/2, bg.height/12, ctxs[10].x - ctxs[5].x, bg.height/6);
    context.fillStyle = 'black';
    context.font = "30px Verdana";
    context.textAlign = 'center';
    context.fillText(counter_val, bg.width/2, bg.height/4, bg.width/6);
}

// test for if mouse click originated in shape
let is_mouse_in_shape = function(x, y, ctx) {
    // define boundaries of current shape
    let ctx_left = ctx.x + ctx.w/2 - incr_y/2;
    let ctx_right = ctx.x + ctx.w/2 + incr_y/2;
    let ctx_top = ctx.y + ctx.h/2 - incr_y/2;
    let ctx_bottom = ctx.y + ctx.h/2 + incr_y/2;

    // check if mouse event originated inside current shape
    if (x > ctx_left && x < ctx_right && y > ctx_top && y < ctx_bottom) {
        return true;
    }

    return false;
}

let is_boundary_colliding = function(i, dy) {
    // set up limited scope variables
    let extended_y = incr_y/2;
    let current_col_pt;

    // define boundary check function
    function do_bound_check() {
        switch(Math.sign(dy)) {
            // going down
            case 1:
                current_col_pt = ctxs[i].y + ctxs[i].h/2 + extended_y;
                if (current_col_pt >=  ctxs[i].max_y) {
                    ctxs[i].is_bound = true;    
                    return true;
                } else {
                    ctxs[i].is_bound = false;
                    return false;
                }
            // going up
            case -1: 
                current_col_pt = ctxs[i].y + ctxs[i].h/2 - extended_y;
                if (current_col_pt <=  ctxs[i].min_y) {
                    ctxs[i].is_bound = true;    
                    return true;
                } else {
                    ctxs[i].is_bound = false;
                    return false;
                }
            // no change
            case 0:
                return false;
            default:
                return false;

        }
    }
    return do_bound_check();
}


// test for collision between beads
let is_shape_colliding = function(i, dy) {
    // set up limited scope variables
    let above_ctx;
    let below_ctx;
    let extended_y = incr_y/2;
    let current_col_pt;
    let above_col_pt;
    let below_col_pt;

    switch(Math.sign(dy)) {
        // going down
        case 1:
            // is this the last bead?
            // last bead is b = 4
            if (ctxs[i].b === last_bead_index) {
                return false;
            } else {
                // not the last bead
                below_ctx = ctxs[i + 1];
                current_col_pt = ctxs[i].y + ctxs[i].h/2 + extended_y;
                below_col_pt = below_ctx.y + below_ctx.h/2 - extended_y;
                if (current_col_pt >=  below_col_pt) {
                    ctxs[i].is_colliding = true;    
                    return true;
                } else {
                    ctxs[i].is_colliding = false;
                    return false;
                }
            }
        // going up
        case -1:
            // is this the first bead?
            if (ctxs[i].b === 0) {
                return false;
            } else {
                above_ctx = ctxs[i - 1];
                current_col_pt = ctxs[i].y + ctxs[i].h/2 - extended_y;
                above_col_pt = above_ctx.y + above_ctx.h/2 + extended_y;
                if (current_col_pt <=  above_col_pt) {
                    ctxs[i].is_colliding = true;    
                    return true;
                } else {
                    ctxs[i].is_colliding = false;
                    return false;
                }
            }
        // no change
        case 0:
            return false;
        default:
            return false;
    }
}

let update_counter = function() {
    // this is not ideal but I can't find a simpler way in js
    counter_val = 0;
    for (let [i, ctx] of ctxs.entries()) {
        if (ctx.b === 0 && ctx.max_y < (ctx.y + incr_y + 2)) {            
            counter_val = counter_val + ctx.val;
        } else if (ctx.b != 0 && ctx.min_y > (ctx.y - incr_y/2 - 3)) {
            // console.log('min', ctx.min_y, 'cur_y', ctx.y);                
            counter_val = counter_val + ctx.val;
        }
        else {
            //nothing
        }
    }
    return;
}

// function for handling when click or touch starts
let mouse_down = function(e) {
    e.preventDefault();
    // console.log(e);
    // grab starting x, y positions
    function mouse_down_work(t) {
        start_x[t] = parseInt(e.clientX || e.targetTouches[t].clientX);
        start_y[t] = parseInt(e.clientY || e.targetTouches[t].clientY);

        // if starting position was in a shape, then set is_dragging to true
        for (let [i, ctx] of ctxs.entries()) {
            if (is_mouse_in_shape(start_x[t], start_y[t], ctx)) {
                // console.log('touch', t, 'in shape', i, 'col', ctx.c);
                current_ctx_arr[t].last_ctx = i;
                active_col_index = ctx.c;
                is_dragging = true;
            } else {
                // console.log('not in shape');
            }
        }
        // console.log('arr', current_ctx_arr);
    }

    if (is_mobile) {
        for (let t = 0; t < e.targetTouches.length; t++) {
            if (t < 2) {
                mouse_down_work(t);
            }
        }
    } else {
        mouse_down_work(0);
    }
}

// function for handling mouse up, ending is_dragging
let mouse_up = function(e) {
    if (!is_dragging) {
        return;
    }
    e.preventDefault();
    // console.log('mouse up')
    is_dragging = false;
    current_ctx_arr[0].last_ctx = null;
    current_ctx_arr[1].last_ctx = null;
    active_col_index = null;
}

// function to handle mouse out of bounds
let mouse_out = function(e) {
    if (!is_dragging) {
        return;
    }
    e.preventDefault();
    is_dragging = false;
    current_ctx_arr[0].last_ctx = null;
    current_ctx_arr[1].last_ctx = null;
    active_col_index = null;
}

// function to handle moving shapes
let mouse_move = function(e) {

    e.preventDefault();

    function mouse_move_work(t){
        // track current x,y position
        if (e.pointerType === 'touch') {
            // console.log(e);
            mouse_x[t] = parseInt(e.pageX);
            mouse_y[t] = parseInt(e.pageY);
        } else {
            // console.log('working');
            mouse_x[t] = parseInt(e.clientX || e.targetTouches[t].pageX);
            mouse_y[t] = parseInt(e.clientY || e.targetTouches[t].pageY);    
        }
        
        // calculate movement
        // let dx = mouseX - startX; // y movement only
        let dy = mouse_y[t] - start_y[t];
        // console.log('start', start_y[t], 'change', dy, 'mouse_y', mouse_y[t], 'touch', t, e)

        // write change to array, as this will be used to test collision
        // ctxs[current_ctx_index].x += dx; // y movement only
        // console.log('touch', t, 'shape', current_ctx_arr[t].last_ctx, dy);
        ctxs[current_ctx_arr[t].last_ctx].y += dy;

        // boundary collision
        if (is_boundary_colliding(current_ctx_arr[t].last_ctx, dy)) {
            // reverse change if bound
            ctxs[current_ctx_arr[t].last_ctx].y -= dy;
        }

        // bead collision
        // move everything in the column if colliding
        if (is_shape_colliding(current_ctx_arr[t].last_ctx, dy)) {
            switch (Math.sign(dy)) {
                // going down
                case 1:
                    // is this the last bead?
                    // unnecessary code now, take it out in the future
                    if (ctxs[current_ctx_arr[t].last_ctx].b === last_bead_index) {
                        // do nothing
                    } else {
                        // move the one directly below
                        ctxs[current_ctx_arr[t].last_ctx + 1].y += dy;
                        // check if others below also need to be moved
                        for (let [i, ctx] of ctxs.entries()) {
                            if (ctx.c === active_col_index && i > (current_ctx_arr[t].last_ctx + 1) && is_shape_colliding(i - 1, dy)) {
                                ctxs[i].y += dy;
                            }
                        }
                    }
                    break;
                case -1:
                    // is this the first bead?
                    // unnecessary code now, take it out in the future                    
                    if (ctxs[current_ctx_arr[t].last_ctx].b === 0) {
                        // do nothing
                        console.log('test')
                    } else {
                        // move the one directly above
                        ctxs[current_ctx_arr[t].last_ctx - 1].y += dy;
                        // check if others above also need to be moved
                        for (let [i, ctx] of ctxs.entries()) {
                            if (ctx.c === active_col_index && i < (current_ctx_arr[t].last_ctx - 1) && (is_shape_colliding(i + 1, dy))) {                                
                                ctxs[i].y += dy;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }                      
        }

        // redraw shape for valid movement, if any
        update_counter();
        draw_shapes();

        // reset starting position
        // start_x = mouse_x;
        start_y[t] = mouse_y[t];
    }

    if (!is_dragging) {
        return
    // multiple touch treatment    
    } else if (is_dragging && is_mobile) {
        for (let t = 0; t < e.targetTouches.length; t++) {
            if (t < 2) {
                // console.log('touch', t, e)
                try { // this err handling is for if 2nd touch is not in shape
                    mouse_move_work(t);
                } catch {
                    // nothing
                }
            }
        }
    // mouse treatment
    } else if (is_dragging && !is_mobile) {
        mouse_move_work(0);
    }
}

function set_event_handlers() {
    // mouse event listeners
    bg.onmousedown = mouse_down;
    bg.onmouseup = mouse_up;
    bg.onmouseout = mouse_out;
    bg.onmousemove = mouse_move;

    // basic solution for input device type
    // pointer and touch events interfering with each other
    // only have one or the other active
    // would fail if mobile device rotated sideways
    if (window.innerWidth > window.innerHeight) {
        // pointer/track pad event listeners
        bg.onpointerdown = mouse_down;
        bg.onpointerup = mouse_up;
        bg.onpointerout = mouse_out;
        bg.onpointermove = mouse_move;
    } else {
        is_mobile = true;
        // touch device event listeners
        bg.ontouchstart = mouse_down;
        bg.ontouchcancel = mouse_up;
        bg.ontouchend = mouse_up;
        bg.ontouchmove = mouse_move;  
    }
}

function init() {
    // initialize shapes on load
    define_shape_dims();
    draw_shapes();
    set_event_handlers();

}

init();