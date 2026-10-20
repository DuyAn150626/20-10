// --- KHỞI TẠO ĐỒ HỌA HOA 3D TRÊN CANVAS ---
const canvas = document.getElementById('flower-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 300;

let bloomProgress = 0;
let isExpanded = false;

// Hàm tạo chuyển động vẽ hình đóa hoa lấp lánh như video
function drawFlower(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Nếu nhấp vào đóa hoa -> Phóng xòe cánh đa tầng rộng mở
    let petalCount = isExpanded ? 8 : 6;
    let baseRadius = isExpanded ? 70 : 45;
    
    // Tạo hiệu ứng chùm hạt ánh sáng phát ra
    for (let i = 0; i < 40; i++) {
        let angle = (i * Math.PI / 20) + (progress * 0.02);
        let dist = baseRadius * 1.4 * (progress / 100) + Math.sin(progress * 0.05) * 5;
        ctx.fillStyle = i % 2 === 0 ? '#ffb3d1' : '#ffffff';
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Vẽ tầng cánh hoa cốt lõi xoay nhẹ
    for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        
        let length = baseRadius * (progress / 100);
        ctx.bezierCurveTo(-25, -length/2, -15, -length, 0, -length);
        ctx.bezierCurveTo(15, -length, 25, -length/2, 0, 0);
        
        ctx.fillStyle = isExpanded ? `hsl(${330 + i * 5}, 100%, 65%)` : '#ff4fa1';
        ctx.fill();
        
        // Viền nhũ lấp lánh
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // Tâm hoa nhụy vàng rực sáng
    ctx.beginPath();
    ctx.arc(0, 0, 15 * (progress / 100), 0, Math.PI * 2);
    ctx.fillStyle = '#ff2a55';
    ctx.fill();
    
    ctx.restore();
}

function runBloomAnimation() {
    if (bloomProgress < 100) {
        bloomProgress += 1.5;
        drawFlower(bloomProgress);
        requestAnimationFrame(runBloomAnimation);
    } else if (isExpanded) {
        // Tạo nhịp thở nhẹ sau khi hoa nở rực
        let breathe = 100 + Math.sin(Date.now() * 0.003) * 3;
        drawFlower(breathe);
        requestAnimationFrame(runBloomAnimation);
    }
}
runBloomAnimation();

// Bắt sự kiện click vào đóa hoa để kích hoạt nở tung ra đầy màn hình như giây thứ 0:02 của video
canvas.addEventListener('click', () => {
    isExpanded = true;
    bloomProgress = 0;
    document.getElementById('bg-audio').play().catch(() => {});
    runBloomAnimation();
});

// --- DỊCH CHUYỂN ALBUM LỜI CHÚC TỰ ĐỘNG ---
const cards = document.querySelectorAll('.card-item-3d');
let currentCardIndex = 0;

setInterval(() => {
    if (!isExpanded) return;
    cards[currentCardIndex].classList.remove('active');
    currentCardIndex = (currentCardIndex + 1) % cards.length;
    cards[currentCardIndex].classList.add('active');
}, 3000);

// --- ĐIỀU HƯỚNG SANG MÀN HÌNH BỨC THƯ ---
const btnNext = document.getElementById('btn-next-scene');
const sceneBloom = document.getElementById('scene-bloom');
const sceneLetter = document.getElementById('scene-letter');
const envelope = document.getElementById('envelope');

btnNext.addEventListener('click', () => {
    sceneBloom.classList.remove('active-layer');
    sceneBloom.style.display = 'none';
    sceneLetter.classList.add('active-layer');
    
    // Kích hoạt lật mở bao thư 3D tự động sau khi đổi cảnh
    setTimeout(() => {
        envelope.classList.add('open');
        startTypewriter();
    }, 600);
});

// --- HIỆU ỨNG MÁY ĐÁNH CHỮ TỰ ĐỘNG GÕ ---
const fullMessage = `Gửi đến bạn - người con gái tuyệt vời nhất!\nChúc bạn luôn luôn xinh đẹp, mạnh khỏe, hạnh phúc và gặp thật nhiều may mắn trong cuộc sống.\nCảm ơn bạn vì đã luôn là chính mình, luôn mang đến những điều tốt đẹp xung quanh. Chúc bạn có một ngày 20/10 thật đặc biệt! ❤️`;
const typewriterContainer = document.getElementById('typewriter-text');
const btnRestart = document.getElementById('btn-restart');
let charIndex = 0;

function startTypewriter() {
    typewriterContainer.innerHTML = '';
    charIndex = 0;
    btnRestart.style.opacity = '0';
    typeText();
}

function typeText() {
    if (charIndex < fullMessage.length) {
        typewriterContainer.innerHTML += fullMessage.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 45); // Tốc độ gõ chữ mượt mà
    } else {
        btnRestart.style.opacity = '1';
    }
}

btnRestart.addEventListener('click', startTypewriter);

// --- HỆ THỐNG MƯA HOA RƠI TỰ ĐỘNG ---
function createBackgroundPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    const size = Math.random() * 12 + 6;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.left = Math.random() * 100 + 'vw';
    const duration = Math.random() * 4 + 4;
    petal.style.animationDuration = duration + 's';
    document.body.appendChild(petal);
    setTimeout(() => { petal.remove(); }, duration * 1000);
}
setInterval(createBackgroundPetal, 200);
