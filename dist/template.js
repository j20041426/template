var template = function(temp, params, repeat){
  var ret = "";
  var repeat = repeat || 1;
  
  for(var i = 0; i < repeat; i++){
    ret += temp.replace(/{{[\w]+}}/g,function(a,b){
      var value = params[a.replace(/[{}]/g,"")];
      if(typeof value === "function"){
        return value.call(this, i);
      }else{
        return value;
      }
    })
  }
  
  return ret;
}
