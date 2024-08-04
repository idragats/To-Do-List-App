const addButton = document.getElementById('btn-add');


const task = document.getElementById('task');
const category = document.getElementById('category');
const date = document.getElementById('date');
const time = document.getElementById('time');

const list = document.getElementById('list-items');

const sortDateTime =  document.getElementById('btn-sort-by-date-time');
const sortCategory = document.getElementById('btn-sort-category');

const counter = document.getElementById('counter');


addButton.addEventListener('click', () =>{
    if(task.value === '' || category.value === '' || date.value === '' || time.value === ''){
        alert("You have to write a task first !")
    }else{

        const userLocale = navigator.language || navigator.userLanguage;

        let formattedDate = new Date(date.value).toLocaleDateString(userLocale,{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        })

        let formattedTime = new Date('1970-01-01T' + time.value + ':00').toLocaleTimeString(userLocale, {
            hour: '2-digit',
            minute: '2-digit'
        });

        let li = document.createElement("li");
        li.setAttribute('data-date', date.value);
        li.setAttribute('data-time', time.value);
        li.className = 'task-item';
        li.innerHTML = `<span>${task.value}</span><span>${category.value}</span><span>${formattedDate}</span><span>${formattedTime}</span>`;
        list.appendChild(li);

        //for delete an item
        let spanDelete =  document.createElement('span');
        spanDelete.className = 'delete';
        li.appendChild(spanDelete);
        saveData();
        
    }
    task.value = "";
    category.value = "";
    date.value = "";
    time.value = "";
    updateCounter();

}, false)


list.addEventListener('click', (e)=>{
    if(e.target.tagName === "LI"){
       
        e.target.classList.toggle('checked');
        saveData();
        updateCounter();

    }else if(e.target.className === 'delete'){

        e.target.parentElement.remove();   
        saveData();
        updateCounter();
    }
});


function saveData(){
    localStorage.setItem("data", list.innerHTML);
}

function show(){
   list.innerHTML = localStorage.getItem("data") || '';
   updateCounter();
}

show();

//counter

function updateCounter(){
    const incompleteTasks = Array.from(list.children).filter(task => !task.classList.contains('checked'));
    counter.textContent = incompleteTasks.length;
}


// sort  list

function sortList(input){
    const array = Array.from(list.children);
    array.sort(input);
    for (let item of array){
        list.appendChild(item);
    }
    saveData();
}



sortDateTime.addEventListener('click', ()=>{
    sortList((a,b) =>{
        const dateTimeA = new Date(a.getAttribute('data-date') + 'T' + a.getAttribute('data-time'));
        const dateTimeB = new Date(b.getAttribute('data-date') + 'T' + b.getAttribute('data-time'));
        return dateTimeA - dateTimeB;
    })
})

sortCategory.addEventListener('click', () => {
    sortList((a, b) => {
        const categoryA = a.children[1].innerText.toLowerCase();
        const categoryB = b.children[1].innerText.toLowerCase();
        return categoryA.localeCompare(categoryB);
    });
});