function getUserAsync(id, callback){
    setTimeout(function(){
        callback(id);
    },2000)
}

function passUserId(userId){
    console.log(`{userId: ${userId}}`);
}
getUserAsync(1,passUserId);
getUserAsync(2,passUserId);
let sum1 = 1 + 1
console.log(sum1);