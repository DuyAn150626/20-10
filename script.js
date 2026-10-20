const envelopeBox = document.getElementById('envelope-box');
const wishesBox = document.getElementById('wishes-box');
const guide = document.getElementById('guide');
const bgAudio = document.getElementById('bg-audio');
let isOpen = false;

envelopeBox.addEventListener('click', function() {
    if (!isOpen) {
        isOpen = true;
        
        // Phát nhạc nền
        bgAudio.play().catch(() => {});

        // Kích hoạt chuỗi hiệu ứng mở thư và bung nở hoa
        envelopeBox.classList.add('open');
        wishesBox.classList.add('show');
        guide.style.display = 'none';
    }
});

function spawnPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    const size = Math.random() * 12 + 8; 
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.left = Math.random() * 100 + 'vw';
    
    const duration = Math.random() * 4 + 5;
    petal.style.animationDuration = duration + 's';
    
    document.body.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, duration * 1000);
}

setInterval(spawnPetal, 180);
