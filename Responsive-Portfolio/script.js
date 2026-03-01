// Mobile menu
const toggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
navLinks.classList.toggle("active");
});

// Typing effect
const words = ["Frontend Developer","UI Designer","JavaScript Enthusiast"];
let i=0,j=0,currentWord="",isDeleting=false;

function type(){
currentWord = words[i];
if(!isDeleting){
document.getElementById("typing").textContent = currentWord.slice(0,++j);
if(j===currentWord.length){
isDeleting=true;
setTimeout(type,1000);
return;
}
}else{
document.getElementById("typing").textContent = currentWord.slice(0,--j);
if(j===0){
isDeleting=false;
i=(i+1)%words.length;
}
}
setTimeout(type,100);
}
type();

// Scroll reveal
window.addEventListener("scroll",()=>{
document.querySelectorAll(".reveal").forEach(el=>{
const windowHeight=window.innerHeight;
const elementTop=el.getBoundingClientRect().top;
if(elementTop<windowHeight-100){
el.classList.add("active");
}
});
});
