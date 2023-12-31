const sidebar = document.querySelector('.sidebar')
let isSidebarOpen = true;
const closeIcon = document.querySelector('#closeSidebar')
const openIcon = document.querySelector('#openSidebar')
const sidebarContent = document.querySelector('.sidebar-content')
closeIcon.addEventListener('click',
    () => {
        sidebar.style.width = '0px';
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        sidebarContent.style.display = 'none'
        isSidebarOpen = false;
    }
)
openIcon.addEventListener('click',
    () => {
        sidebar.style.width = 'var(--sidebar-width)';
        openIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        sidebarContent.style.display = 'block'
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

// Get the button:
let mybutton = document.querySelector(".scroll-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// فايل الموظف
let audioSrc1 = 'https://65fd-197-57-185-231.ngrok-free.app/media/telecom_recharge_issue.mp3'
// فايل العميل
let audioSrc2 = 'https://65fd-197-57-185-231.ngrok-free.app/media/telecom_recharge_issue.wav'

let audioFull = 'https://65fd-197-57-185-231.ngrok-free.app/media/telecom_recharge_issue.mp3'
// مدة الفايل
const duration = 150;

const overallSentiment = 'neutral' || 'positive' || 'negative';
// call id
const copyText = 'hello'
// the file to be downloaded
const reportName = 'Evaluation Report'
const reportExtension = 'csv'
// نوع المكالمة
const typeOfCall = 'outgoing' || 'inbound'

const agentSlots = [
    { start: 0, analysis: 'positive' },
    { start: 10, analysis: 'negative' },
    { start: 20, analysis: 'neutral' },
    { start: 130, analysis: 'positive' },
    { start: 90, analysis: 'negative' },
]
const customerSlots = [
    { start: 0, analysis: 'positive' },
    { start: 7, analysis: 'negative' },
    { start: 50, analysis: 'neutral' },
    { start: 30, analysis: 'positive' },
    { start: 140, analysis: 'negative' },
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

const audio = new Audio()
audio.controls = true
audio.src = audioSrc1
const ext = audio.src.lastIndexOf(".");
const extension = audio.src.slice(ext, audio.src.length);
console.log(extension);
if (extension == '.mp3') {
    audio.type = 'audio/mp3'
} else {
    audio.type = 'audio/wav'
}

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
    media: audio,
    normalize: true,
    splitChannels: true
})

document.querySelector(".audio-player").appendChild(audio);

function slotsLoop(slots, idx) {
    slots.map((slot) => {
        if (slot.analysis === 'positive' || slot.analysis === 'negative') {
            const timelines = document.getElementsByClassName('timeline')
            const timeline = timelines[idx]
            const timelineWidth = timeline.offsetWidth;
            const leftCalc = (slot.start / duration) * 100;
            console.log('timeline width:' + timelineWidth + 'duration: ' + duration + 'slot.start: ' + slot.start, 'left: ' + leftCalc)
            console.log(leftCalc)
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
                wavesurfer1.setTime(slot.start)
                audio.currentTime = slot.start
            })
            emoji.addEventListener('mouseenter', () => {
                const slotSpan = document.createElement('span')
                slotSpan.textContent = Math.round(slot.start)
                slotSpan.classList.add('slot-span')
                emoji.appendChild(slotSpan)
            })
            emoji.addEventListener('mouseleave', () => {
                emoji.removeChild(emoji.lastChild)
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

const copyButton = document.querySelector('#copy-button');

copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(copyText);
    copyButton.classList.add('copied');
    copyButton.innerHTML = `<i class="fa-solid fa-check" style="fill='var(--primary-color)'"></i>`;
});


const downloadButton = document.querySelector('#download-button')

const questions = document.querySelectorAll('.question');
const answers = document.querySelectorAll('.answer');
const pts = document.querySelectorAll('.answer-pts');

// Create an array to store the data
const evaluationData = [];

// Iterate through each question and answer pair
for (let i = 0; i < questions.length; i++) {
    // Extract the question and answer text
    const firstLetterIdx = 0
    const question = questions[i].textContent;
    const answer = answers[i].textContent;
    const pt = parseInt(pts[i].textContent[firstLetterIdx]);

    // Add the question and answer to the evaluationData array
    evaluationData.push({
        'Question': question,
        'Answer': answer,
        'Points': pt
    });
}

// Convert the evaluationData to a CSV-formatted string
const csv = Papa.unparse(evaluationData);

downloadButton.addEventListener('click', () => {
    const element = document.createElement('a');
    // download the csv file
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', reportName + reportExtension);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
})

const details = document.querySelectorAll('.section-details');
if (window.innerWidth < 768) {
    details.forEach(detail => {
        detail.removeAttribute('open');
    })
} else {
    details.forEach(detail => {
        detail.setAttribute('open', 'open');
    })
}

const searchInput = document.querySelector('#searchInput')
const messages = document.querySelectorAll('.message')

searchInput.addEventListener('input',
    function () {
        messages.forEach((msg) => {
            const parent = msg.parentElement
            const grandparent = parent.parentElement
            if (msg.innerText.toLowerCase().includes(this.value.toLowerCase())) {
                grandparent.style.display = 'block'
            } else {
                grandparent.style.display = 'none'
            }
        })
    }
)
