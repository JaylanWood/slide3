let $imagesWrapper = $('.imagesWrapper')
let $buttons = $('.slide .buttonsWrapper button')
let timerID
let current = 0

makeFakeImg()
init()
bindButtons()
bindArrows()
autoPlay()
listenToMouseOnWindow()
listenToDocVisible()

function makeFakeImg() {
    let $imgs = $('.imagesWrapper img')
    let fristClone = $imgs.eq(0).clone(true)
    let latClone = $imgs.eq($imgs.length - 1).clone(true)
    $('.imagesWrapper').append(fristClone).prepend(latClone);
}

function normalSlide(index, time) {
    return $imagesWrapper.css({
        transform: `translateX(${-(index+1)*300}px)`,
        transition: `all ` + time
    })
}

function fakeSlide(fakeImgIndex, index, time) {
    // 1.先切去假图
    normalSlide(fakeImgIndex, time).one('transitionend', function () {
        // 2.一旦动画完成，马上隐藏
        $imagesWrapper.hide().offset()
        // offset，重新算位置，打断浏览器的 hide 和 show 合并。
        // 3.瞬间切到真图，并显示出来
        normalSlide(index, '0s').show()
    })
}

function goToSlides(index) {
    // 判断真正要去的 index
    if (index > $buttons.length - 1) {
        index = 0
    } else if (index < 0) {
        index = $buttons.length - 1
    }

    if (current === $buttons.length - 1 && index === 0) {
        let fakeImgIndex = current + 1
        fakeSlide(fakeImgIndex, index, '1s')
    } else if (current === 0 && index === $buttons.length - 1) {
        let fakeImgIndex = current - 1
        fakeSlide(fakeImgIndex, index, '1s')
    } else {
        normalSlide(index, '1s')
    }

    current = index
}

function bindButtons() {
    $('.slide .buttonsWrapper').on('click', 'button', function (xxx) {
        goToSlides($(xxx.currentTarget).index())
    })
}

function bindArrows() {
    $('.previous').on('click', function () {
        goToSlides(current - 1)
    })
    $('.next').on('click', function () {
        goToSlides(current + 1)
    })
}

function autoPlay() {
    timerID = setInterval(() => {
        goToSlides(current + 1)
    }, 2000)
}

function stopPlay() {
    window.clearInterval(timerID)
}

function showButtonsAndArrows() {
    $('.slide .buttonsWrapper').removeClass('hidden').addClass('showFlex')
    $('.slide .arrowsWrapper').removeClass('hidden').addClass('showFlex')
}

function hideButtonsAndArrows() {
    $('.slide .buttonsWrapper').removeClass('showFlex').addClass('hidden')
    $('.slide .arrowsWrapper').removeClass('showFlex').addClass('hidden')
}

function listenToMouseOnWindow() {
    $('.window').on('mouseenter', function () {
        stopPlay()
        showButtonsAndArrows()
    }).on('mouseleave', function () {
        autoPlay()
        hideButtonsAndArrows()
    })
}

function init() {
    normalSlide(0, '0s')
}

function listenToDocVisible() {
    $(document).on('visibilitychange', function () {
        if (document.hidden) {
            stopPlay()
        } else {
            autoPlay()
        }
    })
}