// Easing Function
function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// Smooth Scrolling using javascript
let scrollContainer = document.querySelector('.scroll-container')
class SmoothScroller {
    constructor(start, dist, duration, easingFunction) {
        this.start = start;
        this.dist = dist;
        this.duration = duration;
        this.easingFunction = easingFunction;
        this.animateScrollTo = this.animateScrollTo.bind(this);
    }
    animateScrollTo(timeStamp) {
        if (this.progress === undefined) {
            if (!scrollContainer) {
                scrollContainer = document.querySelector('.scroll-container')
            }
            scrollContainer.style.scrollSnapType = "none";
            this.startTime = timeStamp
        }
        if (this.progress >= 1) {
            window.cancelAnimationFrame(this.animateScrollTo)
            scrollContainer.style.scrollSnapType = "";
            return;
        };
        const elapsed = timeStamp - this.startTime;
        this.progress = elapsed / this.duration;
        const moveProgress = this.easingFunction(this.progress);
        const moveDist = this.dist * moveProgress;
        scrollContainer.scrollTo(0, this.start + moveDist);
        window.requestAnimationFrame(this.animateScrollTo)
    };
}

function smoothTo(location, time = 800) {
    scrollContainer = document.querySelector('.scroll-container')
    const start = scrollContainer.scrollTop;
    const scroller = new SmoothScroller(start, location, time, easeInOutQuad)
    window.requestAnimationFrame(scroller.animateScrollTo)
}

function checkInView(elem, margin = 0) {
    let scrollContainer = document.querySelector('.scroll-container')
    let elemDim = elem.getBoundingClientRect()
    let elemTop = elemDim.top;
    let elemBot = elemDim.bottom;
    let viewTop = scrollContainer.scrollTop;
    let viewBot = scrollContainer.scrollTop + window.innerHeight;

    if (elemTop - margin < 0) { return false };
    if (elemBot + margin < 0) { return false };

    return true;
}

// Slider animation
let wasInView = {}
wasInView.cov_head = true;
document.addEventListener('DOMContentLoaded', () => {
    scrollContainer = document.querySelector('.scroll-container')
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
})
