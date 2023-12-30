//  -- backend variables --
// فايل الموظف
let audioSrc1 = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3'
// فايل العميل
let audioSrc2 = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3'
// مدة الفايل
const duration = 26;
const overallSentiment = 'neutral' || 'positive' || 'negative';
const copyText = 'hello'
const evaluationReportPath = "https://drive.google.com/file/d/1EDd_xQpaK2CIY2og45v8UY-SZgwQuFcy/view?usp=drive_link"
const reportName = 'Evaluation Report'
const typeOfCall = 'outgoing' || 'inbound'

const agentSlots = [
    { start: 0, analysis: 'positive' },
    { start: 9, analysis: 'negative' },
    { start: 17, analysis: 'neutral' },
    { start: 23, analysis: 'negative' },
]

const customerSlots = [
    { start: 1, analysis: 'positive' },
    { start: 5, analysis: 'negative' },
    { start: 13, analysis: 'neutral' },
    { start: 20, analysis: 'positive' },
]

// -- end of backend variables --

// colors
const waveColor = '#dec9e9'
const progressColor = '#000'
const cursorColor = '#000'

const typeOfCallSpan = document.querySelector('#type-of-call')

if (typeOfCall === 'inbound') {
    typeOfCallSpan.innerHTML = `<i class="fa-solid fa-up-right-from-square"></i> Inbound Call`
    typeOfCallSpan.classList.add('inbound')
} else {
    typeOfCallSpan.innerHTML = `<i class="fa-solid fa-up-right-from-square"></i> Outgoing Call`
    typeOfCallSpan.classList.add('outgoing')
}

const scoreSpan = document.querySelector('#score')
const positiveSentimentSpan = document.querySelector('.sentiment-emoji-positive')
const negativeSentimentSpan = document.querySelector('.sentiment-emoji-negative')
const neutralSentimentSpan = document.querySelector('.sentiment-emoji-neutral')


if (overallSentiment === 'positive') {
    scoreSpan.classList.add('positive')
    positiveSentimentSpan.style.color = 'var(--emoji-green)'
} else if (overallSentiment === 'negative') {
    scoreSpan.classList.add('negative')
    negativeSentimentSpan.style.color = 'var(--emoji-red)'
} else {
    scoreSpan.classList.add('neutral')
    neutralSentimentSpan.style.color = 'var(--emoji-yellow)'
}

var audioTag = new Audio();
audioTag.src = audioSrc1 || audioSrc2;
audioTag.controls = true

// Create a WaveSurfer instance and pass the media element
const wavesurfer1 = WaveSurfer.create({
    container: '#waveform',
    waveColor: waveColor,
    progressColor: progressColor,
    height: 30,
    barAlign: "bottom",
    dragToSeek: true,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    cursorWidth: 2,
    cursorColor: cursorColor,
    url: audioSrc1,
    normalize: true
})

const wavesurfer2 = WaveSurfer.create({
    container: '#waveform',
    waveColor: waveColor,
    progressColor: progressColor,
    height: 30,
    barAlign: "top",
    dragToSeek: true,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    cursorWidth: 2,
    cursorColor: cursorColor,
    url: audioSrc2,
    normalize: true
})

audioTag.addEventListener('play', function () {
    wavesurfer1.play(); wavesurfer2.play()
})

audioTag.addEventListener('pause', function () {
    wavesurfer1.pause(); wavesurfer2.pause()
})

audioTag.addEventListener('volumechange', function () {
    if (this.muted) {
        wavesurfer1.setMuted(true); wavesurfer2.setMuted(true)
    }
    wavesurfer1.setVolume(audioTag.volume); wavesurfer2.setVolume(audioTag.volume);
})

audioTag.addEventListener('timeupdate', function () {
    wavesurfer1.setTime(audioTag.currentTime); wavesurfer2.setTime(audioTag.currentTime);
})

audioTag.addEventListener('ratechange', function () {
    wavesurfer1.setPlaybackRate(audioTag.playbackRate); wavesurfer2.setPlaybackRate(audioTag.playbackRate);
})

wavesurfer1.on('interaction', (newTime) => {
    audioTag.currentTime = newTime
})

wavesurfer2.on('interaction', (newTime) => {
    audioTag.currentTime = newTime;
})

document.querySelector(".audio-player").appendChild(audioTag);

function slotsLoop(slots, idx) {
    slots.map((slot) => {
        const leftCalc = (slot.start / duration) * 100;
        if (slot.analysis === 'positive' || slot.analysis === 'negative') {
            const timelines = document.getElementsByClassName('timeline')
            const timeline = timelines[idx]
            const emoji = document.createElement('span')
            emoji.classList.add('emoji')
            emoji.style.left = `${leftCalc}%`
            if (slot.analysis === 'positive') {
                emoji.innerHTML = `<i class="fa-solid fa-face-smile"></i>`
                emoji.classList.add('positive')
            }
            else if (slot.analysis === 'negative') {
                emoji.innerHTML = `<i class="fa-solid fa-face-frown"></i>`
                emoji.classList.add('negative')
            }
            emoji.addEventListener('click', () => {
                audioTag.currentTime = slot.start
            })
            timeline.appendChild(emoji)
        }
    })

}

function slotsEmojis(agentSlots, customerSlots) {
    if (agentSlots.length !== 0 && customerSlots !== 0) {
        const analysisEmojis = document.querySelector('.analysis-emojis')
        analysisEmojis.innerHTML = `
             <div class="timeline-container">
                <i class="fa-solid fa-headphones icon"></i>
                <div class="timeline"></div>
                </div>
                <div class="timeline-container">
                <i class="fa-solid fa-user icon"></i>
                <div class="timeline"></div>
            </div>
        `
        slotsLoop(agentSlots, 0)
        slotsLoop(customerSlots, 1)
    }
}

slotsEmojis(agentSlots, customerSlots)

const copyButton = document.getElementById('copy-button');

const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    copyButton.classList.add('copied');
    copyButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
}

copyButton.addEventListener('click', copy(copyText));

const downloadButton = document.querySelector('#download-button')

function downloadFile(path, filename) {
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;

    // Append to the DOM
    document.body.appendChild(anchor);

    // Trigger `click` event
    // anchor.click();

    // Remove element from DOM
    document.body.removeChild(anchor);
}

// downloadButton.addEventListener('click', downloadFile(evaluationReportPath, reportName))

const sidebar = document.querySelector('.sidebar')
let isSidebarOpen = true;
const closeIcon = document.querySelector('#closeSidebar')
const openIcon = document.querySelector('#openSidebar')
const sidebarLinks = document.querySelectorAll('.sidebarLink')
closeIcon.addEventListener('click',
    () => {
        sidebar.style.width = '0px';
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        sidebarLinks.forEach(link => {
            link.style.display = 'none'
        });
        isSidebarOpen = false;
    }
)
openIcon.addEventListener('click',
    () => {
        sidebar.style.width = 'var(--sidebar-width)';
        openIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        sidebarLinks.forEach(link => {
            link.style.display = 'block'
        });
        isSidebarOpen = true;
    }
)

const barsIcon = document.querySelector('.bars-icon')
const navList = document.querySelector('#navList')
let isNavbarOpen = false

barsIcon.addEventListener('click', () => {
    if (isNavbarOpen) {
        navList.style.display = 'none'
        isNavbarOpen = false;
    }
    else {
        navList.style.display = 'flex'
        isNavbarOpen = true;
    }
})