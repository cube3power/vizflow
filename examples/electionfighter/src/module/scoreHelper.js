var scoreHelper = {

  setup: function score_helper_load(scoreConfig, viz) {

    if( viz === undefined ) {
      viz = this ;
    }

    if (scoreConfig === undefined) {
      scoreConfig = {
        x: 2,
        y: 2,
        inert: true,
        fixed: true,
      } ;
    }
      
    viz.player.score          = itemHelper.setup(scoreConfig, viz) ;
    viz.player.score.value    = 0 ;
    viz.player.score.enemyHit = 200 ;
    viz.player.score.counter  = 500 ;

    var rowName = [
      '0', 
      '1', 
      '2', 
      '3', 
      '4', 
      '5', 
      '6', 
      '7', 
      '8', 
      '9'
    ] ;

    var canvas    = imageHelper.to_canvas('./image/0-9.png') ;
    
    var tileWidth = [
      15, 
      15, 
      15, 
      15, 
      15, 
      15, 
      15, 
      15, 
      15, 
      15,
    ] ;

    var rowHeight = [
      16, 
      16, 
      16, 
      16, 
      16, 
      16, 
      16, 
      16, 
      16, 
      16,
    ] ;

    var scoreSprite = spriteHelper.foreach(spriteHelper.get(canvas, rowName, tileWidth, rowHeight), imageHelper.get_original) ;

    viz.player.score.config = {

      color: 'rgba(200, 200, 0, 0.8)',
      text: viz.player.score.value,
      image: imageHelper.text,
      sprite: scoreSprite,

    } ;

    viz.player.score.set = function() {

      this.config.text = this.value ;
      this.image = this.config.image() ; // imageHelper.word(this.config) ;

    } ;

    viz.player.score.increase = function(type) {

      this.value += this[type] ;
      this.set() ;
      var level1 = 2000 ;
      var powerup = [level1, level1 * 3] ;
      if(viz.player.powerup.count < viz.player.powerup.Nmax &&  this.value >= powerup[viz.player.powerup.count] ) {
        viz.player.fire_powerup() ;
      }

    } ;

    viz.player.score.set() ;

    // imageHelper.view(viz.player.score.image) ;
  
  },
	
} ;