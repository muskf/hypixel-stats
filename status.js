//基础url，后边连uuid
let base_url = "https://api.hypixel.net/status?key=这里填api key=";


//需要查询的用户的uuid，这是一个对象字面量，对象上每个属性代表要查询的一个用户，属性的名称作为用户的显示名称，属性的值作为uuid进行查询
let player_list = {
    "USTC": "a04d619a-2e75-41b7-b510-1da91ef001c4",
}

//定义一个Map来存储查询结果
let user_stat = new Map();

//定义一个函数，这个函数运行的时候，会读取player_list，查询每个项目的状态，并将结果存储到user_stat
function cycle(){

    //遍历player_list上的属性名，每一次循环都将属性名赋值到一个名叫user的变量
    for (let user in player_list){
    
        //根据属性名，在player_list上获取属性的值
        let uuid = player_list[user];
        
        //创建一个XMLHttpRequest，用于进行请求
        let req = new XMLHttpRequest();
        
        //预先设置事件监听，监听请求完成，传入的函数将在load事件触发（一般是请求结束（注意是结束，不是成功）
        req.addEventListener("load", ()=>{
            //这里是一个箭头函数，没什么特别的，只不过写着方便
            
            //读取请求的状态，判断请求是否成功
            if (req.status !== 200)
                return; //不成功就不执行后边的代码，直接返回
                
            //将查询结果存入 user_stat
            user_stat.set(user, req.responseText);
            
            //调用另一个函数，修改html上的内容
            printText2();
            
        });
        
        //设置请求方法以及url
        req.open("GET", base_url + uuid);
        
        //发送请求，请求结束后会触发load事件，然后触发先前添加的函数
        req.send();
    }
}

//这个函数的作用是根据查询修改html
function printText2(){
    
    //先定义一个字符串变量
    let text = "";
    
    //使用迭代器遍历user_stat中存储的所有键值，每次都将其存到user变量
    for (let user of user_stat.keys()){
    
        //获取user_stat中存储的以user为键的值（也就是先前的查询结果），然后将其转化（或者说反序列化）为一个对象
        //根据之前的测试结果，查询到的东西类似这样（只列出了需要的属性
        // { success: boolean, session: { online: boolean }
        let status = JSON.parse(user_stat.get(user));
        
        //定义一个变量，用于显示查询到的状态
        let statText = "unknown";
        let gameType = "";
        let isOnline = false;
        let gamemode = "";
        let gamemap="";
        gameType = status.session.gameType;
        gamemode = status.session.mode;
        gamemap = status.session.map;


        if (status.success){ //查询成功
            if (status.session.online){ //在线
            
                //状态文字设置成online
                statText = '<font color="green">online</font>'
                text += `
                ${user}: ${statText}|GameType:${gameType}|GameMode:${gamemode}|Map:${gamemap}\n`;
            } else { //不在线
                //文字设置成offline
                statText = '<font color="red">offline</font>'
                text += `
                  ${user}: ${statText}\n`;
            }
        }
        //使用模板字符串拼接字符串
    }
    //获取带有特定id的element，修改它的innerHtml
    document.getElementById("output").innerHTML = text.replaceAll(/\n/g, "<br />");
    //html里的换行是<br />，所以要把\n替换成<br />
}
setInterval(cycle, 30000);
cycle();
