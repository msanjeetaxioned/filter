document.addEventListener('DOMContentLoaded', (event) => {
    let wrapper = document.querySelector(".wrapper");
    let filters = wrapper.querySelectorAll(".filter > ul > li");
    let filterSelectedArray = [true, false, false, false, false, false, false];
    let imagesArray = [];
    let jsonData = [];
    let headerPageLis = wrapper.querySelectorAll("header > nav li");
    let humburger = wrapper.querySelector(".hamburger-tablet");
    let humburgerOpen = false;
    
    humburger.addEventListener("click", function() {
        if(humburgerOpen) {
            for(let i = 0; i < headerPageLis.length; i++) {
                if(headerPageLis[i].classList[0] == "selected") {
                    continue;
                }
                headerPageLis[i].classList.remove("display-list-item-768");
                headerPageLis[i].classList.add("display-none-768");
            }
        }
        else {
            for(let i = 0; i < headerPageLis.length; i++) {
                if(headerPageLis[i].classList[0] == "selected") {
                    continue;
                }
                headerPageLis[i].classList.remove("display-none-768");
                headerPageLis[i].classList.add("display-list-item-768");
            }
        }
        humburgerOpen = !humburgerOpen;
    });

    for(let i = 0; i < 16; i++) {
        imagesArray[i] = true;
    }

    for(let filter of filters) {
        filter.addEventListener("click", function() {
            changeFilter(this, this.getAttribute("data-id"));
        });
    }

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/json/content.json");
    xhttp.send();
    xhttp.onload = function() {
        jsonData = JSON.parse(this.responseText);
        console.log(jsonData);
    }

    function changeFilter(element, id) {
        id = parseInt(id);
        if(filterSelectedArray[id]) {
            element.classList.remove("selected");
        }
        else {
            element.classList.add("selected");
        }
        filterSelectedArray[id] = !filterSelectedArray[id];
        calculateIntersectionOnFilterChange();
    }

    function calculateIntersectionOnFilterChange() {
        if(filterSelectedArray[0]) {
            updateImage(true);
        }
        else {
            let allArrays = [], count = 0;
            for(let i = 0; i < filterSelectedArray.length; i++) {
                if(filterSelectedArray[i]) {
                    allArrays[count++] = jsonData[i-1].images;
                }
            }

            if(!allArrays.length) {
                updateImage(false, "");
                return;
            }
            let result = allArrays.shift().filter(function(v) {
                return allArrays.every(function(a) {
                    return a.indexOf(v) !== -1;
                });
            });

            updateImage(false, result);
        }
    }

    function updateImage(allTrue, result) {
        let liArray = wrapper.querySelectorAll(".content > li"); 
        
        if(result == "") {
            for(let i = 0; i < imagesArray.length; i++) {
                imagesArray[i] = false;
            }
        }
        else {
            if(allTrue) {
                for(let i = 0; i < imagesArray.length; i++) {
                    imagesArray[i] = true;
                }
            }
            else {
                let j = 0;
                for(let i = 0; i < imagesArray.length; i++) {
                    if(i == (result[j] -1)) {
                        imagesArray[i] = true;
                        j++;
                    }
                    else {
                        imagesArray[i] = false;
                    }
                }
            }
        }

        for(let i = 0; i < imagesArray.length; i++) {
            if(imagesArray[i]) {
                if(liArray[i].classList[0]) {
                    liArray[i].classList.remove("display-none");
                }
            }
            else {
                if(!liArray[i].classList[0]) {
                    liArray[i].classList.add("display-none");
                }
            }
        }
    }
});