
class Toggle {
    constructor(state, toggleOn=()=>{}, toggleOff=toggleOn) {
        this.state = state;
        this.toggleOn = toggleOn;
        this.toggleOff = toggleOff;
    }
    update(state=!this.state) {
        if (state != this.state) {
            if (state) {
                this.toggleOn();
                this.state = !this.state;
            } else {
                this.toggleOff();
                this.state = !this.state;
            }
        }
    }
}

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

    // Top of element below bottom of screen
    if (elemTop - margin > window.innerHeight) { return false };

    // Bottom of element above top of screen
    if (elemBot + margin < 0) { return false };

    return true;
}

// fisher yates shuffle
function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
}

// Shuffle css colors
function shuffle_colors() {
    let colors = [
        "#EFB5E8", "#EF9CEE",
        "#B28BFF", "#D5AAFF",
        "#FFBB44", "#FFE56A",
        "#FFABAB", "#D35FA0",
        "#6EB5FF", "#3E90FF",
        "#85D3AF", "#90EE90"
    ]
    shuffle(colors);

    let head = document.head || document.getElementsByTagName("head")[0];
    let style;
    let head_children = head.children;
    let length = head.childElementCount;
    
    for (let i = 0; i < length; i++) {
        if (head_children[i].id == "colors") {
            style = head_children[i];
            let l = style.sheet.cssRules.length;
            for (let r = 0; r < l && r < colors.length; r++) {
                style.sheet.cssRules[r].style.backgroundColor = colors[r];
            }
        }
    }

    if (!style) {
        let colorStyle = "";
        for (let i = 0; i < colors.length; i++) {
            colorStyle += ` .colors:nth-child(${i+1}) { background-color: ${colors[i]}; } `;
        }

        style = document.createElement("style");
        style.id = "colors";
        style.appendChild(document.createTextNode(colorStyle));
        head.appendChild(style);
    }
}

function toggle_visible(ids) {
    let elements = ids.map((id) => document.getElementById(id));
    for (let element of elements) {
        let cl = element.classList
        if (cl.contains("nodisp")) {
            cl.remove("nodisp");
            cl.remove("fade-out");
            cl.add("fade-in");
        } else {
            setTimeout(()=>cl.add("nodisp"), 500);
            cl.add("fade-out");
            cl.remove("fade-in");
        }
    }
}

// Slider animation
let wasInView = {}
wasInView.cov_head = true;
document.addEventListener('DOMContentLoaded', () => {
    let cov_head = document.getElementById("cover-headings");
    let cov_head_watcher = new Toggle(
        // checkInView(cov_head, -0.25 * window.innerHeight),
        true,
        () => {
            let children = cov_head.children;
            for (let i = 0; i < children.length; i++) {
                children[i].className = "";
                children[i].offsetWidth;
                children[i].className = "slider";
            }
        },
        () => {}
    );

    let nav = document.getElementsByClassName("nav-list")[0];
    let nav_watcher = new Toggle(
        checkInView(nav),
        () => {
            let children = nav.children;
            for (let i = 0; i < children.length; i++) {
                children[i].className = "";
                children[i].offsetWidth;
                children[i].className = "slider";
            }
        },
        () => {}
    );

    let cooldown = [-1];
    let scrollContainer = document.querySelector('.scroll-container')
    scrollContainer.addEventListener('scroll', (event) => {
        if (cooldown[0] == -1) {
            shuffle_colors();
            cooldown[0] = setInterval(() => {
                clearInterval(cooldown[0]);
                cooldown[0] = -1
            }, 1000)
        }
        // console.log(event);
        let cov_head = document.getElementById("cover-headings")
        cov_head_watcher.update(checkInView(cov_head, -0.25 * window.innerHeight));
        nav_watcher.update(checkInView(nav));
    });

    // Apply smooth scrolling to navlist
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

    shuffle_colors();

    // Read more div -> floating card
    let floating_card_buttons = document.getElementsByClassName("show-button")
    for (let fc_btn of floating_card_buttons) {
        let targets = ["floating-divs"];
        for (let className of fc_btn.classList) {
            if (className.startsWith("target-")) {
                targets.push(className.substring(7));
            }
        }
        fc_btn.addEventListener('click', ()=>{
            toggle_visible(targets);
            let floatdiv_container = document.getElementById("floating-divs");
            function reHide(e) {
                if (e.type == 'click' || (e.type == 'keydown' && e.key == 'Escape')) {
                    floatdiv_container.removeEventListener('click', reHide);
                    document.removeEventListener('keydown', reHide);
                    toggle_visible(targets)
                }
            }
            floatdiv_container.addEventListener('click', reHide)
            document.addEventListener('keydown', reHide);
        })
    }

})

