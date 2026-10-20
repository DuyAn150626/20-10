// --- ĐỒ HỌA CANVAS: VẼ ĐÓA HOA HẠT 3D CHUYỂN ĐỘNG QUAY (GIÂY 0:00 - 0:11) ---
const canvas = document.getElementById('flower-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 300;

let bloomProgress = 0;
let isExpanded = false;
let rotationAngle = 0;

function drawFlowerMesh(progress, angleOffset) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleOffset); // Làm đóa hoa tự xoay tròn liên tục
    
    let petalCount = isExpanded ? 8 : 6;
    let baseRadius = isExpanded ? 75 : 42;
    
    // Hệ thống hạt ánh sáng tỏa ra từ tâm như video dạng tinh vân
    for (let i = 0; i < 50; i++) {
        let alpha = (i * Math.PI / 25) + (progress * 0.03);
        let dist = baseRadius * 1.3 * (progress / 100) + Math.sin(progress * 0.04 + i) * 6;
        ctx.fillStyle = i % 2 === 0 ? '#ffb3d1' : '#ffffff';
        ctx.beginPath();
        ctx.arc(Math.cos(alpha) * dist, Math.sin(alpha) * dist, 1.8, 0, Math.PI * 2);
        ctx.fill();
    }

    // Dựng cấu trúc các tầng cánh hoa lồng vào nhau bằng đường cong Bezier
    for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        
        let length = baseRadius * (progress / 100);
        ctx.bezierCurveTo(-22, -length/2, -18, -length, 0, -length);
        ctx.bezierCurveTo(18, -length, 22, -length/2, 0, 0);
        
        // Chuyển màu ombre cho cánh hoa hồng rực rỡ
        let gradient = ctx.createLinearGradient(0, 0, 0, -length);
        gradient.addColorStop(0, '#ff2a55');
        gradient.addColorStop(1, isExpanded ? '#ff75a0' : '#ff4fa1');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Viền ánh kim nhẹ
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // Nhụy hoa phát sáng chính giữa
    ctx.beginPath();
    ctx.arc(0, 0, 14 * (progress / 100), 0, Math.PI * 2);
    ctx.fillStyle = '#ff1493';
    ctx.fill();
    
    ctx.restore();
}

function loopAnimation() {
    rotationAngle += 0.008; // Tốc độ xoay tự nhiên của đóa hoa
    
    if (bloomProgress < 100) {
        bloomProgress += 1.2;
        drawFlowerMesh(bloomProgress, rotationAngle);
        requestAnimationFrame(loopAnimation);
    } else {
        // Sau khi nở xong, hoa vẫn duy trì tự xoay quanh trục liên tục như video
        let wave = 100 + Math.sin(Date.now() * 0.0025) * 2.5;
        drawFlowerMesh(wave, rotationAngle);
        requestAnimationFrame(loopAnimation);
    }
}
loopAnimation();

// Chạm vào đóa hoa để kích hoạt bung nở sang tầng cánh mới lớn hơn (giây 0:02 trong video)
canvas.addEventListener('click', () => {
    isExpanded = true;
    bloomProgress = 0;
    document.getElementById('bg-audio').play().catch(() => {});
    loopAnimation();
});

// --- ALBUM CHỮ TỰ ĐỘNG CHẠY CHUYỂN ĐỔI ---
const cards = document.querySelectorAll('.card-item-3d');
let cardIndex = 0;

setInterval(() => {
    if (!isExpanded) return; // Chỉ chạy khi đóa hoa đã được bấm mở
    cards[cardIndex].classList.remove('active');
    cardIndex = (cardIndex + 1) % cards.length;
    cards[cardIndex].classList.add('active');
}, 2800);

// --- LOGIC CHUYỂN CẢNH SANG BỨC THƯ (GIÂY 0:21 TRONG VIDEO) ---
const btnNext = document.getElementById('btn-next-scene');
const sceneBloom = document.getElementById('scene-bloom');
const sceneLetter = document.getElementById('scene-letter');
const envelope = document.getElementById('envelope');

btnNext.addEventListener('click', () => {
    sceneBloom.classList.remove('active-layer');
    sceneBloom.style.display = 'none';
    sceneLetter.classList.add('active-layer');
    sceneLetter.style.display = 'flex';
    
    // Tự động lật mở nắp thư và đẩy tờ giấy trồi lên sau khi vào màn hình mới
    setTimeout(() => {
        envelope.classList.add('open');
        startTypewriterEffect();
    }, 500);
});

// --- HIỆU ỨNG MÁY ĐÁNH CHỮ TỰ ĐỘNG GÕ (GIÂY 0:24 TRONG VIDEO) ---
const msgLines = `Gửi đến bạn - người con gái tuyệt vời nhất!\nChúc bạn luôn luôn xinh đẹp, mạnh khỏe, hạnh phúc và gặp thật nhiều may mắn trong cuộc sống.\nCảm ơn bạn vì đã luôn là chính mình, luôn mang đến những điều tốt đẹp xung quanh. Chúc bạn có một ngày 20/10 thật đặc biệt! ❤️`;
const typewriter = document.getElementById('typewriter-text');
const btnRestart = document.getElementById('btn-restart');
let txtIndex = 0;

function startTypewriterEffect() {
    typewriter.innerHTML = '';
    txtIndex = 0;
    btnRestart.style.opacity = '0';
    btnRestart.style.pointerEvents = 'none';
    type();
}

function type() {
    if (txtIndex < msgLines.length) {
        typewriter.innerHTML += msgLines.charAt(txtIndex);
        txtIndex++;
        setTimeout(type, 50); // Khớp chuẩn tốc độ xuất hiện chữ mượt mà như video
    } else {
        btnRestart.style.opacity = '1';
        btnRestart.style.pointerEvents = 'auto';
    }
}

btnRestart.addEventListener('click', startTypewriterEffect);

// --- HỆ THỐNG MƯA CÁNH HOA BAY NỀN ---
function spawnPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    const size = Math.random() * 10 + 6;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.left = Math.random() * 100 + 'vw';
    const duration = Math.random() * 4 + 4;
    petal.style.animationDuration = duration + 's';
    document.body.appendChild(petal);
    setTimeout(() => { petal.remove(); }, duration * 1000);
}
setInterval(spawnPetal, 220);
