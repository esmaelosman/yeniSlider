document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".loader .rotating img");
    const container = document.querySelector(".loader");
    const rotatingDivs = document.querySelectorAll(".rotating");
    const slides = document.querySelectorAll(".slide");
    const contentDiv = document.querySelector(".content");
    const checkBox = document.querySelector(".checkbox");
    const conDiv = document.querySelector(".con");
    const carTitles = [
        "Mavi Araba!",
        "Siyah Araba!",
        "Sarı Araba!",
        "Kırmızı Araba!"
    ];
    const carTitleElement = document.getElementById("carTitle");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    let currentDegree = 135;
    ;
    let currentSlideIndex = 0;
    let autoRotateInterval;
    let pauseAutoId;
    const sliderItems = document.querySelectorAll(".slider .slide");
    const paginationBoxes = document.querySelectorAll(".pagination .box");

    //Events
    checkBox.addEventListener("change", () => {
        if (checkBox.checked) {
            stopAutoRotate();
        } else {
            startAutoRotate();
        }
    });

    rotatingDivs.forEach((div, index) => {
        div.addEventListener("click", () => {
            currentDegree = calcCorrectDegree(currentSlideIndex, index, currentDegree);
            goToSlide(index);
            setSlider(index);
            currentSlideIndex = index;
            /*            if (index - currentSlideIndex){
                                currentDegree = currentDegree + 90 * (index - currentSlideIndex) ;
                        }else {
                            currentDegree = currentDegree - 90 * (currentSlideIndex - index ) ;
                        }*/

        });
    });
    paginationBoxes.forEach((box, index) => {
        box.addEventListener("click", function () {
            pauseAuto();

            currentDegree = calcCorrectDegree(currentSlideIndex, index, currentDegree);

            //currentDegree =parseInt(rotatingDivs[index].dataset.degree, 10) ;
            setSlider(index);
            goToSlide(index);
            currentSlideIndex = index;
        });
    });

    nextButton.addEventListener("click", function () {
        pauseAuto();

        const nextImg = (currentSlideIndex + 1) % sliderItems.length;
        currentDegree = currentDegree + 90;
        goToSlide(nextImg);
        //rotate(container, currentDegree + 90);
        setSlider(nextImg);
    });

    prevButton.addEventListener("click", function () {
        pauseAuto();

        const prevImg = (currentSlideIndex - 1) % sliderItems.length;
        currentDegree = currentDegree - 90;
        goToSlide(prevImg);
        //rotate(container, currentDegree - 90);
        setSlider(prevImg);
    });

//Functions
    function setActive(index) {
        sliderItems.forEach(item => {
            item.classList.remove("active");
        });
        paginationBoxes.forEach(box => {
            box.classList.remove("active");
        });
        paginationBoxes[index].classList.add("active");
        sliderItems[index].classList.add("active");
        currentSlideIndex = index;

        // Loader'ı ayarlanan derecede döndür

        //rotate(container, currentDegree);
    }

    function setSlider(index) {
        setActive(index);
        //returnImageBack();
        updateCarTitle(index);
        updateBackgroundColor(index);
        updateContentBackgroundColor(index);
    }

    function updateCarTitle(index) {
        carTitleElement.textContent = carTitles[index];
    }

    function updateBackgroundColor(index) {
        const bgColors = [
            "rgba(228, 208, 10, 0.4)",
            "rgba(136, 8, 8, 0.4)",
            "rgba(52, 52, 52, 0.4)",
            "rgba(93, 63, 211, 0.4)"
        ];
        conDiv.style.backgroundColor = bgColors[index];
    }

    function updateContentBackgroundColor(index) {
        const bgColor = window.getComputedStyle(rotatingDivs[index]).backgroundColor;
        contentDiv.style.backgroundColor = bgColor;
    }

    function startAutoRotate() {
        if (!autoRotateInterval) {
            autoRotateInterval = setInterval(autoRotate, 4000);
            autoRotate(); // İlk döndürmeyi hemen başlat
        }
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    function goToSlide(index) {
        // Tüm slaytları gizlemek
        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        // Paginationdaki ilgili kutuyu aktif hale getirmek
        paginationBoxes.forEach(box => {
            box.classList.remove("active");
        });
        setTimeout(() => {
            slides[index].classList.add("active");
        }, 1000);
        paginationBoxes[index].classList.add("active");

        // Loader'ı ayarlanan derecede döndürmek

        rotate(container, currentDegree);
        /*        setTimeout(() => {
                    currentDegree = fixRotate(container, currentDegree);
                }, 1100);*/

        // Content divi sağdan sola kayarak görünsün
        contentDiv.classList.remove("fade-in");
        setTimeout(() => {
            contentDiv.classList.add("fade-in");
        }, 1100);
    }

    function fixRotate(element, degree, flag = true) {
        if (degree > 360) {
            degree = degree % 360;
            alert(degree)
            container.style.transition = "0ms";
            element.style.transform = `rotate(${degree}deg)`;
            returnImageBack("0ms");
        }
        return degree
    }

    function rotate(element, degree, flag = true) {
        /*
          index 0 =>  90 * 0 + 45 = 45°
          index 1 =>  90 * 1 + 45= 135°
          index 2 =>  90 * 2 + 45= 225°
          index 3 =>  90 * 3 + 45= 315°
          */
        returnImageBack();
        container.style.transition = "1s";
        element.style.transform = `rotate(${degree}deg)`;
        currentDegree = degree;

    }

    function autoRotate() {
        currentSlideIndex = (currentSlideIndex + 1) % rotatingDivs.length;
        currentDegree = currentDegree + 90;
        setSlider(currentSlideIndex);
        goToSlide(currentSlideIndex);
    }

    function returnImageBack(transition = "0.6s") {
        images.forEach(img => {
            img.style.transition = transition;
            if (currentDegree>0)
            img.style.transform = `rotate( -${currentDegree}deg)`;
            else {
                img.style.transform = `rotate( ${currentDegree * (-1)}deg)`;
            }
        });
    }

    function pauseAuto() {
        if (autoRotateInterval) {
            stopAutoRotate();
            clearTimeout(pauseAutoId);
            pauseAutoId = setTimeout(startAutoRotate, 4000);
        }
    }

    // İlk sayfa yüklenirken ilk kutuyu ve loader'ı aktif hale getir
    // İlk sayfa yüklenirken ilk kutuyu ve slaytı aktif hale getir
    //rotatingDivs[0].click();
    startAutoRotate();

});



function calcCorrectDegree(currentSlideIndex, index, currentDegree) {
    switch (currentSlideIndex - index) {
        case 1:
        case 2:
            currentDegree = currentDegree - 90 * (currentSlideIndex - index);
            break;
        case -1:
        case -2:
            currentDegree = currentDegree + 90 * (index - currentSlideIndex);
            break;
        case 3:
            currentDegree = currentDegree + 90;
            break;
        case -3:
            currentDegree = currentDegree - 90;
            break;
        default:
            //currentDegree = currentDegree;
            break;
    }
    return currentDegree;
}
/*

index 0 =>  90 * 0 + 45 = 45°
index 1 =>  90 * 1 +45= 135°
index 2 =>  90 * 2 +45= 225°
index 3 =>  90 * 3 +45= 315°

*/