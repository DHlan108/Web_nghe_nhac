window.initHorizontalScroll = function(wrapperSelector) {
    document.querySelectorAll(wrapperSelector).forEach((wrapper) => {
        const container = wrapper.querySelector(".pro-container");
        const btnLeft = wrapper.querySelector(".scroll-btn.left");
        const btnRight = wrapper.querySelector(".scroll-btn.right");

        if (!container) return;

        const check = () => {
            const max = container.scrollWidth - container.clientWidth;
            const left = container.scrollLeft;

            if (btnLeft) btnLeft.style.visibility = left <= 5 ? "hidden" : "visible";
            if (btnRight) btnRight.style.visibility = left >= max - 5 ? "hidden" : "visible";
        };

        // BUTTON
        if (btnRight) btnRight.onclick = () => {
            container.scrollBy({ left: 400, behavior: "smooth" });
            setTimeout(check, 350);
        };

        if (btnLeft) btnLeft.onclick = () => {
            container.scrollBy({ left: -400, behavior: "smooth" });
            setTimeout(check, 350);
        };

        // SCROLL
        container.onscroll = check;

        // DRAG
        let isDown = false;
        let startX;
        let scrollLeft;

        container.onmousedown = (e) => {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        };

        container.onmouseleave = () => isDown = false;
        container.onmouseup = () => {
            isDown = false;
            setTimeout(check, 50);
        };

        container.onmousemove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        };

        check();
    });
};