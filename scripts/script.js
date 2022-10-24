var bg = document.getElementById("bg");

bg.width = window.innerWidth - 30;
bg.height = window.innerHeight - 10;

var ctxs = [];
var is_dragging = false;
var startX = 0;
var startY = 0;

ctxs.push({x: 30, y: 30, width: 50, height: 50, colour: '#D34324'});

var draw_shapes = function() {
    var context = bg.getContext("2d");
    context.clearRect(0, 0, bg.width, bg.height);
    for (var ctx of ctxs) {
        context.fillStyle = ctx.colour;
        context.fillRect(ctx.x, ctx.y, ctx.width, ctx.height);
    }
}

var is_mouse_in_shape = function(x, y, ctx) {
    var ctx_left = ctx.x;
    var ctx_right = ctx.x + ctx.width;
    var ctx_top = ctx.y;
    var ctx_bottom = ctx.y + ctx.height;

    if (x > ctx_left && x < ctx_right && y > ctx_top && y < ctx_bottom) {
        return true;
    }

    return false;
}

var mouse_down = function(e) {
    e.preventDefault();
    console.log(e);
    startX = parseInt(e.clientX);
    startY = parseInt(e.clientY);

    // test for touch screen
    if (e.pointerType == 'touch') {
        console.log('was touch');
    } else {
        console.log('was not touch');
    }
    
    // console.log(e.pointerType);

    for (var ctx of ctxs) {
        if (is_mouse_in_shape(startX, startY, ctx)) {
            console.log('in shape');
            is_dragging = true;
        } else {
            console.log('not in shape');
        }
    }
}

var mouse_up = function(e) {
    if (!is_dragging) {
        return;
    }
    e.preventDefault();
    console.log('mouse up')
    is_dragging = false
}

var mouse_out = function(e) {
    if (!is_dragging) {
        return;
    }
    e.preventDefault();
    is_dragging = false
}

var mouse_move = function(e) {
    // console.log('moving');
    if (!is_dragging) {
        return
    } else if (is_dragging) {
        // console.log('moving and dragging')

        if (e.pointerType == 'touch') {
            console.log(e);
            var mouseX = parseInt(e.pageX);
            var mouseY = parseInt(e.pageY);
        } else {
            var mouseX = parseInt(e.clientX);
            var mouseY = parseInt(e.clientY);    
        }

        e.preventDefault();
 
        var dx = mouseX - startX;
        var dy = mouseY - startY;

        console.log(dx, dy);
        
        var current_ctx_pos = ctxs[0];
        current_ctx_pos.x += dx;
        current_ctx_pos.y += dy;

        draw_shapes();

        startX = mouseX;
        startY = mouseY;
    }
}

draw_shapes();
bg.onmousedown = mouse_down;
bg.onmouseup = mouse_up;
bg.onmouseout = mouse_out;
bg.onmousemove = mouse_move;

bg.onpointerdown = mouse_down;
bg.onpointerup = mouse_up;
bg.onpointerout = mouse_out;
bg.onpointermove = mouse_move;

bg.ontouchstart = mouse_down;
bg.ontouchend = mouse_up;
bg.ontouchmove = mouse_move;  