import '../sass/main.sass'

let wait = document.querySelector('.wait'),
    marker = true,
    direction,
    interval = 150,
    counter1 = 0,
    counter2

function wheel(e) {
    counter1 += 1
    e.deltaY > 0 ? (direction = 'up') : (direction = 'down')
    if (marker) {
        wheelAct()
    }
    return false
}
function wheelAct() {
    if (marker) moveElements(direction)

    marker = false
    counter2 = counter1
    setTimeout(function () {
        if (counter2 == counter1) {
            wait.classList.remove('is-show')
            marker = true
            counter1 = 0
            counter2 = false
        } else {
            wheelAct()
        }
    }, interval)
}

function moveElements(direction) {
    const element = document.querySelector('.sliders__slide.is-active')
    if (direction === 'up' && element.nextSibling) {
        element.classList.remove('is-active')
        element.nextSibling.classList.add('is-active')
        wait.classList.add('is-show')
    } else if (direction === 'down' && element.previousSibling) {
        element.classList.remove('is-active')
        element.previousSibling.classList.add('is-active')
        wait.classList.add('is-show')
    }
}

document.addEventListener('wheel', wheel)
