
   
var type = {"orange" : "orange", "white" : "white", "clear" : "clear"};
var doc = document;
var toRemove = [];
var panel = [];
var bw = 4;

function block(id, ratio = 0.5){
    //init
    this.id = parseInt(id);
    this.type = Math.random() >= ratio ? type.orange : type.white;
    this.blk = doc.createElement("i");
    this.blk.id = this.id;
    this.blk.className = this.type;
    this.did = null;
    this.dropped = false;

    this.setPosition = function(left = 0, top = 0){
        if( left < 24 ) this.blk.style.left = left*bw + "vw";
        if( top < 10 ) this.blk.style.top = top*bw + "vw";
        panel[top][left] = this.id;
    };

    this.toType = function(type){
        this.type = type;
        this.blk.className = this.type;
    };

    //functions
    this.clear = function(){
        this.type = type.clear;
        this.blk.className = type.clear;
        clearInterval(this.did);
        toRemove.push(this.id);
    };

    this.toLeft = function(){
        var top = parseInt((this.blk.style.top).split('vw')[0]) / bw;
        var left = parseInt((this.blk.style.left).split('vw')[0]) / bw;
        if(left>1 && panel[top][left-1] == -1){
            panel[top][left] = -1;
            this.blk.style.left = (left-1)*bw + "vw";
            panel[top][left-1] = this.id;
        }
    };

    this.toRight = function(){
        var top = parseInt((this.blk.style.top).split('vw')[0]) / bw;
        var left = parseInt((this.blk.style.left).split('vw')[0]) / bw;
        if(left<23 && panel[top][left+1] == -1){
            panel[top][left] = -1;
            this.blk.style.left = (left+1)*bw + "vw";
            panel[top][left+1] = this.id;
        }
    };

    this.toButtom = function(){
        var left = parseInt((this.blk.style.left).split('vw')[0]) / bw;
        var top = parseInt((this.blk.style.top).split('vw')[0]) / bw;
        if(top<9 && panel[top+1][left] == -1){
            panel[top][left] = -1;
            this.blk.style.top = (top+1)*bw + "vw";
            panel[top+1][left] = this.id;
        }
    }

    this.getTop = function(){
        return parseInt((this.blk.style.top).split('vw')[0]) / bw;
    }

    this.getLeft = function(){
        return parseInt((this.blk.style.left).split('vw')[0]) / bw;
    }
}

