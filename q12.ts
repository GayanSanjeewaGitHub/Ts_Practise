function findtarget(arr:number[] , target:number):number[]{
    let start: number=0;
    let end : number =0;
    let strated:boolean=false; 
    for(let i=0; i< arr.length ; i++){
        if(arr[i]===target && !strated){
            start=i;
            strated=true;
        }
        if(strated && arr[i]==target){
            end=i;
            
        }
    }

    return [start,end];
}

console.log(findtarget([5, 7, 7, 8, 8, 10], 8));