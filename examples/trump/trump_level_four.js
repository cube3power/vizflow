function trump_level_four () {

  var viz = basic_setup () ;

  var backgroundImageUrl = 'trump_bg4.png' ;
  var background         = image2canvas(backgroundImageUrl) ;

  var image_transition           = step_transition_func('image', viz.dur) ;
  var collision_image_transition = step_transition_func('collisionImage', viz.dur) ;
  
  function viz_prep () {

    // viz.context.clearRect(0, 0, viz.canvas.width, viz.canvas.height) ;

    viz.context.drawImage (background, 0, 0) ;

    return true ;

  }

  function draw_image (frame) {

    if (frame === undefined) {
      frame = this ;
    } 
    viz.context.drawImage(frame.image, frame.x, frame.y) ;
    $Z.item ([]) ;

  }  
  
  function draw_rect (context, rect) {

    if (rect === undefined) {
      rect = this ;
    }
    context.beginPath() ;
    context.rect(rect.x, rect.y, rect.width, rect.height) ;
    context.fillStyle = rect.color ;
    context.fill() ;
    context.closePath() ;

  }

  function draw_circle (ctx, circ) {

    if (circ === undefined) {
      circ = this ;  
    }

    ctx.beginPath() ;
    var x = circ.x ;
    var y = circ.y ;
    var r = circ.radius ;
    ctx.arc(x, y, r, 0, Math.PI * 2, true) ;
    ctx.fillStyle = circ.color ;
    ctx.fill() ;
    ctx.closePath() ;

  }

  var samusSpriteR  = samus_sprite () ;
  // console.log ('samusSpriteR', samusSpriteR) ;
  var samusSpriteL  = horizontal_flip(samusSpriteR) ;
  var samusSprite   = samusSpriteR ;

  var restFrame    = samusSprite.walk[0] ;
  var clearedFrame = create_canvas(restFrame.width, restFrame.height) ; 
  // var positionObject = {x: 0, y: 241 - samusSprite.height} ;

  var samusLoop = {totalDur : 2 * viz.dur, frameDur : viz.dur, position : 0} ; // position is from 0 to 1
  var samus     = {image: restFrame, collisionImage: clearedFrame, render: draw_image, x: 20, y: 225 - samusSprite.height } ;

  var trumpSprite = trump_sprite() ; 
  var trump       = {image: trumpSprite.blink[0], collisionImage: trumpSprite.blink[0], render: draw_image, x: 80, y: 140} ;

  var walkLeftButton  = {image: viz.button[0], render: draw_image, x: viz.buttonX[0], y: viz.buttonY + viz.uiY} ;
  var walkRightButton = {image: viz.button[0], render: draw_image, x: viz.buttonX[1], y: viz.buttonY + viz.uiY} ;
  var punchButton     = {image: viz.button[0], render: draw_image, x: viz.buttonX[2], y: viz.buttonY + viz.uiY} ;
  var jumpButton      = {image: viz.button[0], render: draw_image, x: viz.buttonX[3], y: viz.buttonY + viz.uiY} ;

  var health          = 40 ;
  var healthBarHeight = 5 ;
  var healthBarRect   = {x: 190, y: 10, width: health, height: healthBarHeight, color: '#600'} ; 

  var draw_bar        = function () {
    healthBarRect.width = this.width ;
   // console.log ('draw_bar:this', this) ;
    draw_rect (viz.context, healthBarRect) ;
  }

  var trumpHealthBar   = {render: draw_bar, width: health} ;

  var item = [samus] ; // walkLeftButton, walkRightButton, punchButton, jumpButton] ;



  function detect_punch() {
    var collision = collision_detect([samus, trump], viz.width, viz.height) ;
    if (collision.list.length > 0) { // a collision between samus and trump occurred
      console.log ('detect_punch: collision', collision) ;
      set_punch_action() ;
    }
  }

  function set_punch_detect() {
    $Z.detect([detect_punch]) ;    
  }

  function set_punch_action() {
    $Z.action([punch_action]) ;    
  }

  var health_transition = $Z.transition.linear_transition_func ( 'width', viz.dur * 4 ) ; 
  var healthDrop = 4 ;

  function punch_action() {

    punch_reset () ;

    var transition   = animate (trumpSprite.blink, image_transition, undefined, trumpSprite.blink[0]) ;
    trump.transition = transition ;

    health -= healthDrop ;
    
    if (health < 0) {
      alert ('game over') ;
      health = 0 ;
    }

    //trumpHealthBar.width = health ;
    trumpHealthBar.transition = health_transition (health) ;
    // console.log ('trumpHealthBar', trumpHealthBar) ;

  }

  function punch_reset () {
   $Z.detect([]) ; // turn off collision detection until after the trump character finishes animating
   $Z.action([]) ; // turn off other actions
  }

  $Z.item(item)   ;     // load the user data into the visualization engine to initialize the time equals zero (t = 0) state
	$Z.prep([viz_prep]) ; // sets the preprocessing to perform on each frame of the animation (prior to updating and rendering the elements)
	$Z.run()        ;     // run the interactive visualization (infinite loop by default)

  var x_transition = $Z.transition.rounded_linear_transition_func ( 'x', viz.dur * (samusSprite.walk.length + 1) ) ; // function accepting an x end-value and returning a transition object
  var xMove        = 15 ; 

  function keydown (e) {

    document.onkeydown = null ;
    var transition     = [] ;
    var state ;

    switch (e.keyCode) {

      case 37: // left
        state = 'l' ;
        break;
      case 38: // up
        state = 'j' ;
        break;
      case 39: // right
        state = 'r' ;
        break;
      case 40: // down
        state = 'p' ;
        break;

    }

    update_samus(state) ;

  }

  function update_samus(state) { 
    console.log ('update_samus: state', state) ;
    var minNstep = 2 ; // minimum number of frames to animate per user input for walking animations
    var transition = [] ;
     switch(state) {
      case 'l' :
        samusSprite   = samusSpriteL ;
        restFrame  = samusSprite.walk[0] ;
        samusLoop  = animate_loop (samusLoop, samusSprite.walk, image_transition, undefined, restFrame) ;
        add_transition_end(samusLoop.animation[0], minNstep - 1, set_keydown) ;
        //console.log('samusLoop.animation', samusLoop.animation)
        transition = samusLoop.animation ;

        var xNew   = Math.max(0, samus.x - xMove) ;
        var xTransition = x_transition(xNew) ;

        transition.push(xTransition) ;

        break ;
      case 'r' :
        samusSprite   = samusSpriteR ;
        restFrame  = samusSprite.walk[0] ;
        samusLoop = animate_loop (samusLoop, samusSprite.walk, image_transition, undefined, restFrame) ;
        add_transition_end(samusLoop.animation[0], minNstep - 1, set_keydown) ;
        transition = samusLoop.animation ;

        var xNew   = Math.min(viz.width - restFrame.width, samus.x + xMove) ;
        var xTransition = x_transition(xNew) ;

        transition.push(xTransition) ;

        break ;
      case 'j' :
        transition = animate(samusSprite.jump, image_transition, set_keydown, restFrame) ;
        break ;
      case 'p' :
        transition = animate(samusSprite.punch, image_transition, set_keydown, restFrame) ;
        var collisionTransition = animate (samusSprite.punchCollision, collision_image_transition, punch_reset, clearedFrame) ; 
        transition = transition.concat(collisionTransition) ;
       // console.log ('update_samus: transition', transition) ;
        set_punch_detect() ;
        break ;
    }
    if (transition.length > 0) {
      // console.log('update_samus: transition', transition)
      samus.transition = transition ;
    } else {
      set_keydown() ;
    }
  }

  function click (e) {

    viz.canvas.removeEventListener ('click', click, false) ;

    var position = set_canvas_position( viz.canvas ) ;

    var clickedX = Math.round( (e.clientX - position.left) / position.scale ) ;
    var clickedY = Math.round( (e.clientY - position.top)  / position.scale ) ;

    var color       = viz.hiddenContext.getImageData(clickedX, clickedY, 1, 1).data ;
    var buttonIndex = color[0] - 1 ; // color indexing used by image2index is 1-based

    if(buttonIndex >= 0) { // user clicked on a viz.button

      var state;

      switch (buttonIndex) {

        case 0: // walk left
          walkLeftButton.transition = animate([viz.button[1]], image_transition, undefined, viz.button[0]) ;
          state = 'l' ;
          break;
        case 1: // walk right
          walkRightButton.transition = animate([viz.button[1]], image_transition, undefined, viz.button[0]) ;
          state = 'r' ;
          break;
        case 2: // punch
          punchButton.transition = animate([viz.button[1]], image_transition, undefined, viz.button[0]) ;
          state = 'p' ;
          break;
        case 3: // jump
          jumpButton.transition = animate([viz.button[1]], image_transition, undefined, viz.button[0]) ;
          state = 'j' ;
          break;

      }

      update_samus(state) ;

    } else {

      set_keydown() ;

    }

  } 

  function set_keydown () {
    document.onkeydown = keydown ;
    viz.canvas.addEventListener('click', click, false) ;
    // console.log('set_keydown')
  }

  set_keydown() ;

}