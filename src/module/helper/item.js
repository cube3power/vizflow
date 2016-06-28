let itemHelper = {

  setup: function item_helper_setup(itemConfig, viz) {

    if(viz === undefined) {
      viz = this ;
    }

    if ( itemConfig === undefined ) {
      itemConfig = {} ;
    }

    if(itemConfig.opacity === undefined) {
      itemConfig.opacity = 1 ;
    }

    if(itemConfig.inert === undefined) {
      itemConfig.inert = true ;
    }

    var xOrigin, yOrigin ;
    if ( itemConfig.centerSwitch === true ) {
      xOrigin = itemConfig.image.width * 0.5 ;
      yOrigin = itemConfig.image.height * 0.5 ;
    } else {
      xOrigin = 0 ;
      yOrigin = 0 ;
    }

    var xScale, yScale ;

    if ( itemConfig.xScale === undefined ) {
      xScale = 1 ;
    } else {
      xScale = itemConfig.xScale ;
    }

    if ( itemConfig.yScale === undefined ) {
      yScale = 1 ;
    } else {
      yScale = itemConfig.yScale ;
    }

    var item = { // configurable properties: x, y, type, element, opacity, image, inert, render, fixed, transition

      /* default properties: */

      delayCount: 0,      
      responseSet: {}, // add response objects separately

      /* configurable properties: */

      config:    itemConfig,
      viz:       itemConfig.viz || viz, 
      x:         itemConfig.x || 0,
      y:         itemConfig.y || 0,
      angle:     itemConfig.angle   || 0,
      xOrigin:   itemConfig.xOrigin || xOrigin,
      yOrigin:   itemConfig.yOrigin || yOrigin,
      xAngle:    itemConfig.xAngle  || 0,
      yAngle:    itemConfig.yAngle  || 0,
      xScale:    xScale,
      yScale:    yScale,
      type:      itemConfig.type,
      element:   itemConfig.element,
      enter:     itemConfig.enter,
      exit:      itemConfig.exit,
      opacity:   itemConfig.opacity,
      color:     itemConfig.color,
      width:     itemConfig.width,
      height:    itemConfig.height,
      image:     itemConfig.image,
      child:     itemConfig.child,
      childFade: itemConfig.childFade,
      inert:     itemConfig.inert,
      fixed:     itemConfig.fixed,
      uiSwitch:  itemConfig.uiSwitch || false,
      callback:  itemConfig.callback,
      addSwitch: itemConfig.addSwitch || true,
      render:    itemConfig.render || $Z.helper.draw.item, // $Z.helper.draw.image expects "this" to  be "item"

    } ;

    Object.assign(item, itemHelper.method) ;
    Object.assign(item, $Z.helper.transition.method) ;

    if ( item.addSwitch === true ) { 
      item.add() ;
    }

    // console.log('item helper', 'item', item) ;

    return item ;

  },

  method: {

    collision_image: function action_helper_collision_image(actionType, item) { // actionType is either 'source' or 'target'
      
      // console.log('element collision_image start') ;

      if(item === undefined) {
        item = this ;
      }

      var property = actionType + 'CollisionImage' ;

      // console.log('collision_image item', item)
      if(item.image[property] === undefined || item.image[property] === null) {
        // console.log('element collision image element sprite collisionSet', item.element.sprite.collisionSet) ;
        return undefined ;
      } else {      
        var collisionImage = item.image[property] ;
        // console.log('element collision_image', 'property', property, 'item.image[property]', item.image[property]) ;
        return collisionImage ;
      }

    },

    default_child: function item_helper_default_child (item) {

      if ( item === undefined ) {
        item = this ;
      }

      if ( item.child === undefined ) {
        item.child = [] ; // initialize
      }

      var white = $Z.helper.effect.image.color_filter(item.image, [255, 255, 255]) ;

      item.white = $Z.helper.item.setup({
        viz: item.viz,
        addSwitch: false,
        image: white,
        opacity: 0,
        xOrigin: item.xOrigin,
        yOrigin: item.yOrigin,
      }) ;
      // item.white.childFade = true ;
      item.child.push(item.white) ;

      var black = $Z.helper.effect.image.color_filter(item.image, [0, 0, 0]) ;

      item.black = $Z.helper.item.setup({
        viz: item.viz,
        addSwitch: false,
        image: black,
        opacity: 0,
        xOrigin: item.xOrigin,
        yOrigin: item.yOrigin,
      }) ;

      // item.black.childFade = true ;

      item.black.image   = black ;

      item.child.push(item.black) ;

    },

    zoom: function item_zoom(scale, duration, item) {

      if(item === undefined) {
        item = this ;
      }

      if(scale === undefined) {
        scale = 0.5 ;
      }

      if(duration === undefined) {
        duration = item.viz.fadeDuration ;
      }
      // console.log('item helper', 'zoom', 'this', this) ;

      item.viz.zoom({
        duration: duration, 
        x: item.x, 
        y: item.y, 
        width: item.viz.width * scale, 
        height: item.viz.height * scale,
      }) ;

    },

    add: function(viz, item) {

      if(item === undefined) {
        item = this ;
      }

      if(viz === undefined) {
        viz = this.viz ;
      }

      if(viz.item === undefined) {
        viz.item = [] ;
      }

      if(item.constructor !== Array) {

        // console.log('item helper:', 'viz', viz, 'this', this)

        viz.stagingArray.push(item) ;        
      
      } else {

        for(var kitem = 0 ; kitem < item.length ; kitem++) {
          viz.stagingArray.push(item[kitem]) ;
        }
      
      }

    },

    remove: function item_helper_remove(item) {

      if(item === undefined) {
        item = this ;
      }

      item.removeSwitch = true ;

    },

    scale: function item_helper_scale ( scale0, scale1, item ) {

      if ( item === undefined ) {
        item = this ;
      }

      if ( scale1 === undefined ) {
        scale1 = scale0 ;
      }

      item.xScale = scale0 ;
      item.yScale = scale1 ;

    },

    loop: function item_helper_loop( trans_func, item ) {

      if ( item === undefined ) {
        item = this ;
      }

      if ( trans_func.constructor === String ) {
        trans_func = item[trans_func] ;
      } else {
        trans_func = trans_func ;
      }

      item.add_transition( item.loop_trans(trans_func) ) ;              

    },

    call: function item_helper_call (callback, delay, item) {

      if ( item === undefined ) {
        item = this ;
      }

      if ( callback.constructor === Array ) {

        var delaySum = 0 ;

        for ( var kcall = 0 ; kcall < callback.length ; kcall++ ) {

          if ( delay.constructor === Number ) {
            var delayK = delay * (kcall + 1) ;
          } else if( delay.constructor === Array ) {
            delaySum += delay[kcall] ;
            delayK = delaySum ;
          } else {
            console.log('item_helper_call: delay is not a Number of Array') ;
          }

          // console.log('item helper call: ', 'kcall', kcall, 'callback[kcall]', callback[kcall], 'delayK', delayK) ;

          if ( callback[kcall].constructor === String ) {
            var callbackK = item[callback[kcall]] ;
          } else {
            var callbackK = callback[kcall] ;
          }

          item.run_callback( callbackK, delayK ) ;

        }

      } else {

        // console.log('item helper call: ', 'callback', callback, 'item', item)

        if ( callback.constructor === String ) {
          callback = item[callback] ;
        }

        // console.log('item helper call: ', 'callback 2', callback, 'delay', delay)

        item.run_callback(callback, delay) ;        

      }

    },

    run_callback: function item_helper_run_callback( callback, delay, item ) {

      if ( item === undefined ) {
        item = this ;
      }

      item.delayCount++ ;

      var prop = 'delay' + item.delayCount ;

      item[prop] = null ;

      var trans = $Z.helper.transition.new_step(prop, undefined, delay) ;

      trans.end = function run_callback_end() {
        // console.log('run_callback_end:', 'callback', callback, 'item', item)
        callback.call(item) ;
      } ;

      // console.log('run_callback', 'item', item, 'trans', trans) ;

      item.add_transition(trans) ;

    },

    flash: function item_helper_method_flash (Nflash, flashDuration, item) {

      if ( item === undefined ) { // assume that "this" corresponds to the element item object
        item = this ;
      }

      if ( Nflash === undefined ) {
        Nflash = 1 ;
      }

      if ( flashDuration === undefined ) {
        flashDuration = 100 ;
      }

      // console.log('effect flash', 'frameDuration', frameDuration, 'Nstep', Nstep) ;
      // console.log('effect flash 5') ;
      var blank = function () {} ;
      var valueList = [blank, $Z.helper.draw.item] ;

      var flash     = new Array(2 * Nflash) ;
      
      for(var kflash = 0 ; kflash < 2 * Nflash ; kflash++) {
        flash[kflash] = $Z.helper.transition.new_step('render', valueList[kflash % valueList.length], flashDuration) ;
      }

      flash = $Z.helper.transition.sequence(flash) ;

      // var loopConfig = {
      //  Nstep: Nstep,
      //  position: 0,
      //  frameDur: frameDuration,
      // } ;
      // // console.log('effect flash 12') ;

      // var loop = animate_loop (loopConfig, valueList, create_transition) ;

      if ( item.add_transition !== undefined ) {
        item.add_transition(flash) ;
      }

      // console.log('effect flash', 'flash', flash) ;

      return flash ;

    },

    shake: function effect_shake(xKey, yKey, item) {

      if(item === undefined) {
        item = this ;
      }

      if(xKey === undefined) {
        xKey = 'x' ;
      }

      if(yKey === undefined) {
        yKey = 'y' ;
      }

      var xShakeMove = [1, -1, -1,  1] ; 
      var yShakeMove = [1, -1,  1, -1] ; 

      var damping = 1.5 * document.ratio ;
      var dampingFactor = 1 ;
      var Nstep = 9 ;

      xTransition = new Array(Nstep) ;
      yTransition = new Array(Nstep) ;

      for (let kstep = 0 ; kstep < Nstep - 1 ; kstep++) {
        xTransition[kstep] = item.transitionSet[xKey](Math.round(Math.random() * xShakeMove[(kstep + $Z.iter) % xShakeMove.length] * damping)) ;
        yTransition[kstep] = item.transitionSet[yKey](Math.round(Math.random() * yShakeMove[(kstep + $Z.iter * 3) % xShakeMove.length] * damping)) ;
        damping *= dampingFactor ;
      }

      xTransition[kstep] = item.transitionSet[xKey](0) ;
      yTransition[kstep] = item.transitionSet[yKey](0) ;

      xTransition = $Z.helper.transition.sequence(xTransition)[0] ;
      yTransition = $Z.helper.transition.sequence(yTransition)[0] ;

      // console.log('xTransition', xTransition, 'yTransition', yTransition) ;

      var replacementSwitch = true ;
      item.add_transition([xTransition, yTransition]) ;

    },    

    fade: function item_helper_method_fade(fadeConfig, item) {      

      if(item === undefined) {
        item = this ;
      }

      if(fadeConfig === undefined) {
        fadeConfig = {} ;
      }

      if(fadeConfig.opacity === undefined) {
      // console.log('fadeConfig', fadeConfig, 'item.opacity', item.opacity)

        var thresh = 0.5 ;
        if(item.opacity < thresh) {
          fadeConfig.opacity = 1 ;
        } else {
          fadeConfig.opacity = 0 ;
        }
      }

      var newTransition = $Z.helper.effect.image.fade_transition(fadeConfig) ;

      // console.log('fade', 'newTransition', newTransition, 'item', item, 'fadeConfig', fadeConfig) ;

      var replacementSwitch = fadeConfig.replacementSwitch || true ;

      item.add_transition(newTransition, replacementSwitch) ;

    }, // end fade

    whiteflash: function item_helper_method_whiteflash ( duration, item ) {
      
      if(item === undefined) {
        item = this ;
      }

      if ( duration === undefined ) {
        duration = item.duration || item.viz.fadeDuration ;
      }

      if ( item.white === undefined ) {
        return ;
      }

      var fade_func = $Z.helper.transition.fixed_duration_creator('opacity', duration, $Z.helper.transition.linear_interp) ;

      item.white.add_sequence([1, 0], fade_func) ;

    },

    loop_fade: function item_helper_method_loop_fade( fader, fadeVal, item ) {

      if ( item === undefined ) { 
        item = this ;
      }

      if ( fader === undefined ) {
        fader = item.viz.fader ;
      }

      if ( fadeVal === undefined ) {
        fadeVal = [1, 0] ;
      }

      item.loop( function() { return fader(fadeVal) ; } ) ;
    
    }, 

    focus: function item_helper_method_focus( item ) {

      if ( item === undefined ) {
        item = this ;
      }

      var index = $Z._item.indexOf(item) ;
      var last  = $Z._item[$Z._item.length - 1] ;

      if ( last !== item ) {

        $Z._item[$Z._item.length - 1] = item ; // item to be focused becomes last

        if ( $Z._item.length > 2 ) {

          for ( var kitem = index ; kitem < $Z._item.length - 2 ; kitem++ ) { // left-shift by one:
            $Z._item[kitem] = $Z._item[kitem + 1] ;
          }

          $Z._item[$Z._item.length - 2] = last ; // previously last item becomes second-to-last

        } else { // only 2 items
          $Z._item[0] = last ;
        }
      }

    },

  }, // end: item helper method property

  text: function item_helper_method_text (textConfig) {
    var image = $Z.helper.image.text({
      text: textConfig.text,
      sprite: textConfig.sprite,
      color: textConfig.color || '#FFF',
    }) ;

    var config = Object.assign({ image: image, }, textConfig) ;

    return textConfig.viz.setup_item(config) ;        

  }, 

} ;

export { itemHelper as default }