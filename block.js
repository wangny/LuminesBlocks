
   
var type = {"orange" : "orange", "white" : "white", "clear" : "clear"};
var doc = document;
var panel = [];
var toRemove = [];
var bw = 4;
var blocks = {};

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
        toRemove.push(this.id);
    };

    this.toLeft = function(){
        if(this.dropped)return;
        var top = parseInt((this.blk.style.top).split('vw')[0]) / bw;
        var left = parseInt((this.blk.style.left).split('vw')[0]) / bw;
        var rtop = Math.floor(top);
        var ctop = Math.ceil(top);
        if(left>1 && 
            !(panel[ctop][left-1] != -1 &&  blocks[ panel[ctop][left-1] ].dropped)
            && panel[rtop][left-1] == -1 ){
            panel[rtop][left] = -1;
            this.blk.style.left = (left-1)*bw + "vw";
            panel[rtop][left-1] = this.id;
        }
    };

    this.toRight = function(){
        if(this.dropped)return;
        var top = parseInt((this.blk.style.top).split('vw')[0]) / bw;
        var left = parseInt((this.blk.style.left).split('vw')[0]) / bw;
        var rtop = Math.floor(top);
        var ctop = Math.ceil(top);
        if(left<23 &&
            !(panel[ctop][left+1] != -1 &&  blocks[ panel[ctop][left+1] ].dropped)
            && panel[rtop][left+1] == -1){
            panel[rtop][left] = -1;
            this.blk.style.left = (left+1)*bw + "vw";
            panel[rtop][left+1] = this.id;
        }
    };

    this.toButtom = function(){
        if(this.dropped)return;
        var left = parseInt((this.blk.style.left).split('vw')[0]) / bw;
        var top = parseInt((this.blk.style.top).split('vw')[0]) / bw;
        var top = Math.floor(top);
        if(top<9 && panel[top+1][left] == -1){
            panel[top][left] = -1;
            this.blk.style.top = (top+1)*bw + "vw";
            panel[top+1][left] = this.id;
        }
    }

    this.getTop = function(){
        return Math.floor(parseFloat((this.blk.style.top).split('vw')[0]) / bw);
    }

    this.getLeft = function(){
        return Math.floor(parseFloat((this.blk.style.left).split('vw')[0]) / bw);
    }

    this.isClear = function(){
        return (this.type == type.clear)
    }
}

