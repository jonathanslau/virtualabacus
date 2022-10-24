// set up element
var bg = document.getElementById("bg");

// define relative size of canvas
bg.width = window.innerWidth - 30;
bg.height = window.innerHeight - 30;

// set up variables
var ctxs = []; // array to hold beads
var current_ctx_index = null; // integer to keep track of current bead
var last_ctx_pos = []; /* keep track of bead position before moving, although this should be unnecessary
following how I have set up draw_shapes() */ 
var current_ctx_pos = []; // placeholder for position translation  
var is_dragging = false; // keep track of mousedown event when in shape
var startX = 0; // keep track of mouse starting position
var startY = 0; // keep track of mouse starting position

var testX = (window.innerWidth - 30)/2;

// bead 1
ctxs.push({x: testX, y: 30, width: 50, height: 50, colour: '#D34324'});
// bead 2
ctxs.push({x: testX, y: 130, width: 50, height: 50, colour: '#D34324'});
// bead 3
ctxs.push({x: testX, y: 230, width: 50, height: 50, colour: '#D34324'});
// bead 4
ctxs.push({x: testX, y: 330, width: 50, height: 50, colour: '#D34324'});
// bead 5
ctxs.push({x: testX, y: 430, width: 50, height: 50, colour: '#D34324'});


var draw_shapes = function() {
    var context = bg.getContext("2d");
    context.clearRect(0, 0, bg.width, bg.height); // clear entire canvas and redraw all shapes
    for (var [i, ctx] of ctxs.entries()) {
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

var is_mouse_in_shape = function(x, y, ctx) {
    // define boundaries of current shape
    var ctx_left = ctx.x;
    var ctx_right = ctx.x + ctx.width;
    var ctx_top = ctx.y;
    var ctx_bottom = ctx.y + ctx.height;

    // check if mouse event originated inside current shape
    if (x > ctx_left && x < ctx_right && y > ctx_top && y < ctx_bottom) {
        return true;
    }

    return false;
}

// function for handling when click or touch starts
var mouse_down = function(e) {
    e.preventDefault();
    // console.log(e);
    // grab starting x, y positions
    startX = parseInt(e.clientX);
    startY = parseInt(e.clientY);

    // test for touch screen
    // if (e.pointerType == 'touch') {
    //     console.log('was touch');
    // } else {
    //     console.log('was not touch');
    // }
    
    // console.log(e.pointerType);

    // if starting position was in a shape, then set is_dragging to true
    for (var [i, ctx] of ctxs.entries()) {
        if (is_mouse_in_shape(startX, startY, ctx)) {
            // console.log('in shape', i);
            current_ctx_index = i;
            is_dragging = true;
        } else {
            // console.log('not in shape');
        }
    }
}

// function for handling mouse up, ending is_dragging
var mouse_up = function(e) {
    if (!is_dragging) {
        return;
    }
    e.preventDefault();
    // console.log('mouse up')
    is_dragging = false
}

// function to handle mouse out of bounds
var mouse_out = function(e) {
    if (!is_dragging) {
        return;
    }
    e.preventDefault();
    is_dragging = false
}

// function to handle moving shapes
var mouse_move = function(e) {
    // console.log('moving');
    if (!is_dragging) {
        return
    } else if (is_dragging) {
        // console.log('moving and dragging')
        // track current x,y position
        if (e.pointerType == 'touch') {
            // console.log(e);
            var mouseX = parseInt(e.pageX);
            var mouseY = parseInt(e.pageY);
        } else {
            var mouseX = parseInt(e.clientX);
            var mouseY = parseInt(e.clientY);    
        }

        e.preventDefault();
        
        // calculate movement
        var dx = mouseX - startX;
        var dy = mouseY - startY;

        // console.log(dx, dy);
        
        // log position of old shape for cleanup
        last_ctx_pos = ctxs[current_ctx_index];

        // get ready to move shape
        current_ctx_pos = ctxs[current_ctx_index];
        current_ctx_pos.x += dx;
        current_ctx_pos.y += dy;

        ctxs[current_ctx_index].x = current_ctx_pos.x;
        ctxs[current_ctx_index].y = current_ctx_pos.y;

        // redraw shape for movement
        draw_shapes();

        // reset starting position
        startX = mouseX;
        startY = mouseY;
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