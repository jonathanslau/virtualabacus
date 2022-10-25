// set up element
const bg = document.getElementById("bg");

// define relative size of canvas
bg.width = window.innerWidth - 30;
bg.height = window.innerHeight - 30;

// set up variables
let ctxs = []; // array to hold beads
let current_ctx_index = null; // integer to keep track of current bead
let is_dragging = false; // keep track of mousedown event when in shape
let start_x = 0; // keep track of mouse starting position
let start_y = 0; // keep track of mouse starting position

// set up relative positions of beads and other parameters
let test_x = (window.innerWidth - 30)/2;
let init_bead_colour = '#D34324';
let active_bead_colour;

// bead 1
ctxs.push({x: test_x, y: 30, width: 50, height: 50, colour: init_bead_colour, is_colliding: false});
// bead 2
ctxs.push({x: test_x, y: 130, width: 50, height: 50, colour: init_bead_colour, is_colliding: false});
// bead 3
ctxs.push({x: test_x, y: 230, width: 50, height: 50, colour: init_bead_colour, is_colliding: false});
// bead 4
ctxs.push({x: test_x, y: 330, width: 50, height: 50, colour: init_bead_colour, is_colliding: false});
// bead 5
ctxs.push({x: test_x, y: 430, width: 50, height: 50, colour: init_bead_colour, is_colliding: false});

// draw and redraw shapes as movement is detected
let draw_shapes = function() {
    let context = bg.getContext("2d");
    context.clearRect(0, 0, bg.width, bg.height); // clear entire canvas and redraw all shapes
    for (let [i, ctx] of ctxs.entries()) {
        context.save(); // save context
        // console.log(ctx.x, ctx.y)
        // translate origin to current shape's x, y
        context.translate(ctx.x + ctx.width/2, ctx.y + ctx.height/2);
        context.rotate(45 * (Math.PI/180));
        context.fillStyle = ctx.colour;
        // x and y positions are reset to 0, 0 because of the translate() function
        context.fillRect(-ctx.width/2, -ctx.height/2, ctx.width, ctx.height);    
        context.restore(); // restore context so other objects are not rotated
    }
}

// test for collision between beads
let is_shape_colliding = function(dy) {
    // set up limited scope variables
    let above_ctx;
    let below_ctx;
    let extended_y;
    let current_col_pt;
    let above_col_pt;
    let below_col_pt;

    console.log(dy);

    switch(Math.sign(dy)) {
        // going down
        case 1:
            // is this the last bead?
            if (current_ctx_index === (ctxs.length - 1)) {
                return false;
            } else {
                // not the last bead
                below_ctx = ctxs[current_ctx_index + 1];
                extended_y = Math.sqrt((below_ctx.width/2)**2 + (below_ctx.height/2)**2);
                current_col_pt = ctxs[current_ctx_index].y + ctxs[current_ctx_index].height/2 + extended_y;
                below_col_pt = below_ctx.y + below_ctx.height/2 - extended_y;
                console.log('current', current_col_pt);
                console.log('below', below_col_pt);
                if (current_col_pt >=  below_col_pt) {
                    ctxs[current_ctx_index].is_colliding = true;    
                    console.log(true);
                    return true;
                } else {
                    ctxs[current_ctx_index].is_colliding = false;
                    return false;
                }
            }
        // going up
        case -1:
            // is this the first bead?
            if (current_ctx_index === 0) {
                return false;
            } else {
                above_ctx = ctxs[current_ctx_index - 1];
                extended_y = Math.sqrt((above_ctx.width/2)**2 + (above_ctx.height/2)**2);
                current_col_pt = ctxs[current_ctx_index].y + ctxs[current_ctx_index].height/2 - extended_y;
                above_col_pt = above_ctx.y + above_ctx.height/2 + extended_y;
                console.log('current', current_col_pt);
                console.log('above', above_col_pt);
                if (current_col_pt <=  above_col_pt) {
                    ctxs[current_ctx_index].is_colliding = true;    
                    console.log(true);
                    return true;
                } else {
                    ctxs[current_ctx_index].is_colliding = false;
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

// test for if mouse click originated in shape
let is_mouse_in_shape = function(x, y, ctx) {
    // define boundaries of current shape
    let ctx_left = ctx.x;
    let ctx_right = ctx.x + ctx.width;
    let ctx_top = ctx.y;
    let ctx_bottom = ctx.y + ctx.height;

    // check if mouse event originated inside current shape
    if (x > ctx_left && x < ctx_right && y > ctx_top && y < ctx_bottom) {
        return true;
    }

    return false;
}

// function for handling when click or touch starts
let mouse_down = function(e) {
    e.preventDefault();
    // console.log(e);
    // grab starting x, y positions
    start_x = parseInt(e.clientX);
    start_y = parseInt(e.clientY);

    // test for touch screen
    // if (e.pointerType === 'touch') {
    //     console.log('was touch');
    // } else {
    //     console.log('was not touch');
    // }
    
    // console.log(e.pointerType);

    // if starting position was in a shape, then set is_dragging to true
    for (let [i, ctx] of ctxs.entries()) {
        if (is_mouse_in_shape(start_x, start_y, ctx)) {
            // console.log('in shape', i);
            current_ctx_index = i;
            is_dragging = true;
        } else {
            // console.log('not in shape');
        }
    }
}

// function for handling mouse up, ending is_dragging
let mouse_up = function(e) {
    if (!is_dragging) {
        return;
    }
    e.preventDefault();
    // console.log('mouse up')
    is_dragging = false
}

// function to handle mouse out of bounds
let mouse_out = function(e) {
    if (!is_dragging) {
        return;
    }
    e.preventDefault();
    is_dragging = false
}

// function to handle moving shapes
let mouse_move = function(e) {
    // console.log('moving');
    if (!is_dragging) {
        return
    } else if (is_dragging) {

        let mouse_x
        let mouse_y

        // console.log('moving and dragging')
        // track current x,y position
        if (e.pointerType === 'touch') {
            // console.log(e);
            mouse_x = parseInt(e.pageX);
            mouse_y = parseInt(e.pageY);
        } else {
            mouse_x = parseInt(e.clientX);
            mouse_y = parseInt(e.clientY);    
        }

        e.preventDefault();
        
        // calculate movement
        // let dx = mouseX - startX; // y movement only
        let dy = mouse_y - start_y;
        
        // write change to array, as this will be used to test collision
        // ctxs[current_ctx_index].x += dx; // y movement only
        ctxs[current_ctx_index].y += dy;

        if (is_shape_colliding(dy)) {
            // if it is colliding, we will reverse the y change
            // we are reversing it because we still need to draw it in the last position
            // prior to collision
            ctxs[current_ctx_index].y -= dy;
        }

        // redraw shape for valid movement, if any
        draw_shapes();

        // reset starting position
        // start_x = mouse_x;
        start_y = mouse_y;
    }
}

// initialize shapes on load
draw_shapes();

// mouse event listeners
bg.onmousedown = mouse_down;
bg.onmouseup = mouse_up;
bg.onmouseout = mouse_out;
bg.onmousemove = mouse_move;

// pointer/track pad event listeners
bg.onpointerdown = mouse_down;
bg.onpointerup = mouse_up;
bg.onpointerout = mouse_out;
bg.onpointermove = mouse_move;

// touch device event listeners
bg.ontouchstart = mouse_down;
bg.ontouchend = mouse_up;
bg.ontouchmove = mouse_move;  