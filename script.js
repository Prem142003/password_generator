const inputslider = document.querySelector("[data-length-slider]")
// if i am using custom attribte then  i have to follow this syntax [attribute name ]
const lengthdisplay = document.querySelector("[data-lengthnumber]")

const passworddisplay = document.querySelector("[data-password-display]")
const copyBtn = document.querySelector("[data-copy]")

const copymsg = document.querySelector("[data-copymsg]")
const uppercasecheck = document.querySelector("#uppercase")
const lowercasecheck = document.querySelector("#lowercase")
const numbercheck = document.querySelector("#number")
const symbolscheck = document.querySelector("#symbol")
const indicator = document.querySelector("[data-indicator]")
const generatebtn = document.querySelector(".generatebutton")

const allcheck  = document.querySelectorAll("input[type=checkbox]");
// allcheck me sare ke sare checkbox jsike input me type checkbox wo aa jayenge 
const symbol = '!"#$%&()*+,-./:;<=>?@[\]^_{|}~'
// string of symbol 


let password = "";
let passwordlength = 10;
let checkcount = 0;
handleslider();
// set strength circle color to grey
setindictor("#ccc");       
// set password length 
function handleslider(){
inputslider.value = passwordlength;
lengthdisplay.innerText = passwordlength;

}

function setindictor(color){
    indicator.style.backgroundColor = color;
}

function getrandomintiger(min , max){
   return  Math.floor(Math.random()*(max-min)) + min;
} 

function generaterandomnumber (){
    return getrandomintiger(0 , 9);
}

function generatelowercase(){
  return String.fromCharCode(getrandomintiger(97,123)) 
}

function generateuppercase(){
   return  String.fromCharCode(getrandomintiger(65,91))
}

function generatesymbol(){
    const randnum = getrandomintiger(0 ,  symbol.length);
    return symbol.charAt(randnum);
      // charAt ->  give character at that index (randnum will give random index) , us index pr jo bhi character present hai wo charAt batayega 
}

function calculate_strength (){
    let hasupper = false;
    let haslower = false;
    let hasnum = false;
    let hassymbol = false;

    if (uppercasecheck.checked) hasupper = true;
    if(lowercasecheck.checked) haslower = true;
    if(numbercheck.checked) hasnum = true;
    if(symbolscheck.checked) hassymbol = true;

    if(hasupper && haslower && (hasnum || hassymbol) && passwordlength >=8){
        setindictor("#0f0");
    }
    else if((haslower || hasupper) && (hasnum || hassymbol)&& passwordlength>=6){
        setindictor("#ff0");
    }
    else{
        setindictor("#f00")
    }
}

// copy to clip board 
async function copycontent(){
    try{
       await navigator.clipboard.writeText(passworddisplay.value)
        copymsg.innerText = "copied";
    }
    catch(e){
        copymsg.innerText = "failed";
    }
  // to make copy wala span visibile
  copymsg.classList.add("active");

  // aftre 2 second -> copy wala span invisible 
  setTimeout(() => {
    copymsg.classList.remove("active")
  }, 2000);
}
// suffle password 
function shufflepassword(array){
    // fisher yates method 
  for(let i = array.length - 1 ; i> 0 ; i--){
    // finding random j , in array
    const j = Math.floor(Math.random() * (i + 1));
    // swaping i with j 
    const temp = array[i];
    array[i] == array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
// event listner on input slider 
inputslider.addEventListener('input' , (e)=>{
    passwordlength = e.target.value;
    handleslider();
})


copyBtn.addEventListener('click' , ()=>{
    // if passworddisplay is non empty , then copycontent ka function call kardenge 
    if(passworddisplay.value){
        copycontent();
    }
})



allcheck.forEach((checkbox)=> {
    checkbox.addEventListener('change' , handlecheckboxchange);
})
function handlecheckboxchange(){
    checkcount = 0;
    allcheck.forEach((checkbox)=>{
        if (checkbox.checked)
             checkcount++;
    })

    // special case  ->  if checkcount is 4 and password length is 2 or 1 or 3 
    // in this special case , password length will become 4 automatically  

    if(passwordlength < checkcount){
         passwordlength = checkcount;
         handleslider();
    }

}


// now applying eventlistner on generate password 
generatebtn.addEventListener('click'  , ()=>{
// none of the checkbox is checked
if(checkcount == 0) return;

if(passwordlength < checkcount){
    passwordlength = checkcount;
    handleslider();
}
// lets start the journey to find new password 
console.log("starting the journey")
// remove old password 
password = "";

//     if(numbercheck.checked){
//        password += generaterandomnumber ()
//     }
//    if(lowercasecheck.checked){
//     password += generatelowercase()
//    }
    
//    if(uppercasecheck.checked){
//     password +=  generateuppercase()
//    }
    
//    if(symbolscheck.checked){
//     password += generatesymbol()
//    }
    // abhi 4 random password to generate ho gaya , 
    // but if we want to generate password of length 10  , then what ?

let funcarr = [];

if(uppercasecheck.checked){
    funcarr.push(generateuppercase)
}

if(lowercasecheck.checked){
    funcarr.push(generatelowercase)
}

if(numbercheck.checked){
    funcarr.push(generaterandomnumber)
}
if(symbolscheck.checked){
    funcarr.push(generatesymbol)
}

// compulsory addition 
for(let i = 0 ; i<funcarr.length ; i++){
    password +=funcarr[i]();
}
console.log("compulsory addition done ")
// remaining addition 
for(let i = 0 ; i<passwordlength - funcarr.length ; i++){
    let randindex = getrandomintiger(0 , funcarr.length);

    password += funcarr[randindex]();
}
console.log("remaining addition done ")

// shuffle the password 
password = shufflepassword(Array.from(password));
console.log("shuffling done")
// show in UI
passworddisplay.value = password;
console.log("ui addition done ")
// calculate strength 
calculate_strength();

});