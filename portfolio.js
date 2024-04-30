// Easing Function
function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// Smooth Scrolling using javascript
class SmoothScroller {
    constructor(start, dist, duration, easingFunction, scrollContainer) {
        this.start = start;
        this.dist = dist;
        this.duration = duration;
        this.easingFunction = easingFunction;
        this.scrollContainer = scrollContainer;
        this.animateScrollTo = this.animateScrollTo.bind(this);
    }
    animateScrollTo(timeStamp) {
        if (this.progress === undefined) {
            this.scrollContainer.style.scrollSnapType = "none";
            this.startTime = timeStamp
        }
        if (this.progress >= 1) {
            window.cancelAnimationFrame(this.animateScrollTo)
            this.scrollContainer.style.scrollSnapType = "";
            if (window.target !== undefined) {
                window.location.hash = window.target;
            }
            return;
        };
        const elapsed = timeStamp - this.startTime;
        this.progress = elapsed / this.duration;
        const moveProgress = this.easingFunction(this.progress);
        const moveDist = this.dist * moveProgress;
        this.scrollContainer.scrollTo(0, this.start + moveDist);
        window.requestAnimationFrame(this.animateScrollTo)
    };
}

function smoothTo(cssQuery, time = 800) {
    let location = document.querySelector(cssQuery).getBoundingClientRect().y;
    let scrollContainer = document.querySelector('.scroll-container')
    const start = scrollContainer.scrollTop;
    const scroller = new SmoothScroller(
        start,
        location,
        time,
        easeInOutQuad,
        scrollContainer
    )
    window.requestAnimationFrame(scroller.animateScrollTo)
}

function checkInView(elem, margin = 0) {
    // let scrollContainer = document.querySelector('.scroll-container')
    let elemDim = elem.getBoundingClientRect()
    let elemTop = elemDim.top;
    let elemBot = elemDim.bottom;
    // let viewTop = scrollContainer.scrollTop;
    // let viewBot = scrollContainer.scrollTop + window.innerHeight;

    if (elemTop - margin < 0) { return false };
    if (elemBot + margin < 0) { return false };

    return true;
}

// Slider animation
let wasInView = {}
wasInView.cov_head = true;
document.addEventListener('DOMContentLoaded', () => {
    let scrollContainer = document.querySelector('.scroll-container')
    scrollContainer.addEventListener('scroll', (event) => {
        console.log(event);
        let cov_head = document.getElementById("cover-headings")
        if (checkInView(cov_head, -64)) {
            if (!wasInView.cov_head) {
                let children = cov_head.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].className = "";
                    children[i].offsetWidth;
                    children[i].className = "slider";
                }
            wasInView.cov_head = true;
            }
        } else {
            if (wasInView.cov_head) {
                wasInView.cov_head = false;
            }
        }
    });

    let nav_lis = document.getElementsByClassName('nav-li')
    for (let i = 0; i < nav_lis.length; i++) {
        let children = nav_lis[i].children;
        for (let j = 0; j < children.length; j++) {
            let child = children[j];
            if (child.tagName != 'A') { continue };
            if (child.className != 'a-nav') { continue };
            let target = child.href.split('#')[1];
            let buttonElm = document.createElement('button');
            buttonElm.className = 'a-nav';
            buttonElm.setAttribute('onClick', `smoothTo('#${target}');window.target = '${target}'`);
            buttonElm.innerHTML = child.innerHTML;
            nav_lis[i].appendChild(buttonElm);
            child.remove();
        }
    }
})
