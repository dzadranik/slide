import '../sass/main.sass'

const wait = document.querySelector('.js-wait'),
    sliders = document.querySelector('.js-sliders'),
    move = moveElements()
let slider = {
    countElements: document.querySelectorAll('.js-slide').length - 1,
    intervalWheel: 70,
    intervalSlider: 600,
    marker: true,
    counter1: 0,
    counter2: false,
}

function wheel(e) {
    let direction
    slider.counter1 += 1
    e.deltaY > 0 ? (direction = 'up') : (direction = 'down')
    console.log(e)
    if (slider.marker) {
        wheelAct(direction)
    }
    return false
}

// блокирует слайдер если wheel генерируется безостановочно
function wheelAct(direction) {
    if (slider.marker) move(direction)
    slider.marker = false
    slider.counter2 = slider.counter1
    setTimeout(function () {
        if (slider.counter2 == slider.counter1) {
            wait.classList.remove('is-show')
            slider.marker = true
            slider.counter1 = 0
            slider.counter2 = false
        } else {
            wheelAct()
        }
    }, slider.intervalWheel)
}

// передвигает элементы с минимальной частотой slider.intervalSlider
function moveElements() {
    let timer = true,
        top = 0,
        activeElement = 0

    return function (direction) {
        if (timer) {
            timer = false
            if (direction === 'up' && activeElement < slider.countElements) {
                activeElement += 1
            } else if (direction === 'down' && activeElement > 0) {
                activeElement -= 1
            }
            let coord = document
                .querySelector(`[data-number="${activeElement}"]`)
                .getBoundingClientRect()

            top = coord.top + top
            wait.classList.add('is-show')
            sliders.style.top = `-${top}px`

            setTimeout(() => {
                timer = true
            }, slider.intervalSlider)

            const event = new Event('click', { bubbles: false })
            document.dispatchEvent(event)
        }
    }
}

document.addEventListener('wheel', wheel)
