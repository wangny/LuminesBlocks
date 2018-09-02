(function(){

    $.doc = $(document);
    $.body = $('body');
    $.panel = $('#panel');
    var SCORE = 0;
    var cur = [];
    var blocks = {};
    var col = Array(10);

    function remove(){
        while(toRemove.length>0){
            id = toRemove.shift();
            if (id<0) continue;
            var block = blocks[id];
            $('#'+id).remove();
            if (block==undefined) continue;
            var top = block.getTop();
            var left = block.getLeft();
            panel[top][left] = -1;
            delete blocks[id];
            delete block;
        }
    }


    function score(top, left){
        var id = panel[top][left];
        if(id>0) blocks[id].clear();
        id = panel[top][left-1];
        if(id>0) blocks[id].clear();
        id = panel[top-1][left];
        if(id>0) blocks[id].clear();
        id = panel[top-1][left-1];
        if(id>0) blocks[id].clear();
        SCORE++;
        $.body.find('#score').text("score : "+SCORE);
        setTimeout( remove, 3000 );
    }


    function findtype(top , left){
        var id = panel[top][left];
        if(id<0) return -1;
        if(!blocks[id].dropped) return -1;
        if(cur[0] == id || cur[1]==id || cur[2]==id || cur[3]==id ) return -1;
        return blocks[id].type;
    }

    function scan(scanline){
        var left = parseInt((scanline.style.left).split('vw')[0]) / bw;
        var ncol = Array(10);
        ncol.fill(-1);
        if(left >= 23) left = 0;
        else{
            left++;
            //checking
            var pre = findtype(2, left);
            for(i=3; i<10; i++){
                var now = findtype(i, left)
                if( pre!=-1 && pre == now ){
                    ncol[i-1] = pre;
                    ncol[i] = pre;
                    if( col[i-1] == pre && col[i] == pre ){ //score!
                        score(i, left);
                    }
                }
                pre = now;
            }
        }
        scanline.style.left = left*bw + "vw";
        col = ncol;
        delete ncol;
    }


    function drop(blk, speed = 1){
        var top = parseInt((blk.style.top).split('vw')[0]) / bw;
        var left = parseInt((blk.style.left).split('vw')[0]) / bw;
        if( top >= 9 || ( (panel[top+speed][left] != -1) && (blocks[panel[top+speed][left]].dropped)) ){
            blocks[blk.id].dropped = true;
            return;
        }
        blocks[blk.id].dropped = false;
        panel[top][left] = -1;
        panel[top+speed][left] = blk.id;
        blk.style.top = (top+speed)*bw + "vw";
        if( top >= 9 ) blocks[blk.id].dropped = true;
    }


    function create(id){

        if(panel[1][12]>=0 || panel[1][13]>=0){ //gameover
            gameover();
            return;
        } 

        blocks[id] = new block(id);
        blocks[id].setPosition(12,1);
        $.panel.append( blocks[id].blk );
        cur[0] = blocks[id];
        id++;

        blocks[id] = new block(id);
        blocks[id].setPosition(13,1);
        $.panel.append( blocks[id].blk );
        cur[1] = blocks[id];
        id++;

        blocks[id] = new block(id);
        blocks[id].setPosition(12,0);
        $.panel.append( blocks[id].blk );
        cur[2] = blocks[id];
        id++;

        blocks[id] = new block(id);
        blocks[id].setPosition(13,0);
        $.panel.append( blocks[id].blk );
        cur[3] = blocks[id];
        id++;

        cur[0].did = setInterval( drop, 500, cur[0].blk );
        cur[1].did = setInterval( drop, 500, cur[1].blk );
        cur[2].did = setInterval( drop, 500, cur[2].blk );
        cur[3].did = setInterval( drop, 500, cur[3].blk );

        return id;
    }

    function gameover(runid, scanid){
        cur = [];
        clearInterval(runid);
        clearInterval(scanid);
        console.log("gameover");
        var str = "You've got "+SCORE+" score, congrates! Retry?";
        if( confirm(str) ) location.reload();
    }


    //24 * 7
    function initial(){
        var id = 0;    
        var scanid;

        console.log("game start!");

        for (i=0; i<10; i++){
            var a = new Array(24);
            a.fill(-1);
            panel.push(a);
        }  

        setscan = function(){
            scanid = setInterval( scan, 1000, scanline);
        }

        id = create(id);
        
        //var runid = setInterval( create, 5000);
        var scanline = $.panel.find("#line")[0];
        scanline.style.left = "0vw";
        col.fill(-1);

        thread = function(){
            if(cur[0].dropped && cur[1].dropped) id = create(id);
        }

        var runid = setInterval( thread, 500);
        setTimeout( setscan, 10000 );
   }


   $.doc.on('keydown', function(event){
        if(cur[3]==null || cur[3]==undefined) return;
        switch(event.which){
            case 37 : //left
                cur[0].toLeft();
                cur[2].toLeft();
                cur[1].toLeft();
                cur[3].toLeft();
                break;
            case 39 : //right
                cur[1].toRight();
                cur[3].toRight();
                cur[0].toRight();
                cur[2].toRight();
                break;
            case 40 : //down
                cur[0].toButtom();
                cur[1].toButtom();
                cur[2].toButtom();
                cur[3].toButtom();
                break;
            case 16 : //turn
                break;
            default:
                break;
        }
   });

    $.doc.ready(function(){
        initial();
    });

}())