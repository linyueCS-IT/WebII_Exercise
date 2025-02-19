
function getUserSync(id){
    const timeToStop = Date.now() + 2000;
    while (Date.now() < timeToStop){

    }
    return {userId:id}
}

console.log(getUserSync(1));
console.log(getUserSync(2));
let sum = 1 + 1;
console.log(sum);
