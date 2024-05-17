
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

function float_in() {
    // Elements with float-in class
    let old_float_in  = document.getElementsByClassName('float-in');
    // Elements with float-out class
    let old_float_out = document.getElementsByClassName('float-out');
    for (let elm of old_float_in) {
        if (!checkInView(elm)) {
            elm.classList.remove("float-in");
            elm.classList.add("float-out");
        }
    }
    for (let elm of old_float_out) {
        if (checkInView(elm)) {
            elm.classList.remove("float-out");
            elm.classList.add("float-in");
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

        float_in();
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
    let floating_card_buttons = document.getElementsByClassName("show-button");
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
            floatdiv_container.addEventListener('click', reHide);
            document.addEventListener('keydown', reHide);
        })
    }

    // Folding cards
    function gen_card_style(index, card) {
        let style = card.style;
        style.margin = "0px";
        style.position = index ? "absolute" : "relative";
        style.left = `${index * 9}vw`;
        style.top = `${index * 3}vh`;
        style.zIndex = `${69 - index}`;
        style.width = "70%";

        // Add & remove nodisp to cardcovers that detect keypresses
        if (index) {
            card.children[1].classList.remove("nodisp");
        } else {
            card.children[1].classList.add("nodisp");
        }
    }
    function reorder_cards(order, cards, skip_children=1) {
        let length = cards.length - skip_children;

        for (let i=0; i<length; i++) {
            gen_card_style(order[i], cards[i+skip_children]);
        }
    }
    // Do styling on containers
    let folding_containers = document.getElementsByClassName("folding-container");
    for (let fold_cont of folding_containers) {
        let order = [];
        let length = fold_cont.childElementCount - 1;
        for (let i=0; i<length; i++) {
            order.push(i);
        }
        fold_cont.order = order;
        reorder_cards(order, fold_cont.children);
        // Event listeners on cards
        length++;
        for (let i=1; i<length; i++) {
            let card = fold_cont.children[i].children[1];
            let container = fold_cont
            card.addEventListener('click', () => {
                let ord = container.order;
                ord.unshift(ord.pop());
                reorder_cards(ord, container.children);
                // let ord = fold_cont.order;
                // console.log(ord);
                // let cardIndex = i-1;
                // let rotDist = ord.indexOf(cardIndex);
                // let length = ord.length;
                // rotDist = length - rotDist;
                // for (let i of ord.splice(0, rotDist)) {
                //     ord.push(i);
                // }
                // console.log(ord);
                // reorder_cards(ord, fold_cont.children);
            })
        }
    }
    // Do event listeners on menu
    for (let fold_menu of document.getElementsByClassName("folding-menu")) {
        fold_menu.classList.remove("nodisp");
        let open_btn = fold_menu.children[0];
        let next_btn = fold_menu.children[1];
        let prev_btn = fold_menu.children[2];

        next_btn.addEventListener('click', () => {
            let container = fold_menu.parentElement;
            let ord = container.order;
            ord.unshift(ord.pop());
            reorder_cards(ord, container.children);

            let extern_doc = container.children[ord.indexOf(0)+1].children[0];
            if (extern_doc.attributes["data-target"]) {
                open_btn.href = extern_doc.attributes["data-target"].value;
            } else {
                open_btn.href = extern_doc.src;
            }
        })
        prev_btn.addEventListener('click', () => {
            let container = fold_menu.parentElement;
            let ord = container.order;
            ord.push(ord.shift());
            reorder_cards(ord, container.children);

            let extern_doc = container.children[ord.indexOf(0)+1].children[0];
            if (extern_doc.attributes["data-target"]) {
                open_btn.href = extern_doc.attributes["data-target"].value;
            } else {
                open_btn.href = extern_doc.src;
            }
        })
    }

})

window.location.hash = ""
