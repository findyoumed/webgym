/* Global State */
let playlist = [{ id: '372ByJedKsY', title: '기본 비디오(로딩 중...)' }];
let player;
let webcamStream;
let currentIndex = 0;
let isFlipped = true; // Default: Mirrored
let errorCount = 0;
const MAX_ERRORS = 5;

// Initialization Flags
let isYoutubeApiReady = false;
let isPlaylistLoaded = false;

// LocalStorage Keys
const STORAGE_KEYS = {
    PLAYLIST: 'playlist',
<<<<<<< HEAD
    LAYOUT_MODE: 'layoutMode',
    OPACITY: 'webcamOpacity',
    LAST_INDEX: 'lastVideoIndex',
    LAST_TIME: 'lastVideoTime',
    EXERCISE_TIME: 'totalExerciseTime',
    SENSITIVITY: 'motionSensitivity'
};

let totalExerciseTime = 0;

let timerInterval;

// Motion Detection Globals
let poseDetector;

let skeletonRenderer;
let motionAnalyzer;
let isPoseTracking = false;

=======
    LAYOUT_MODE: 'layoutMode', 
    OPACITY: 'webcamOpacity',
    LAST_INDEX: 'lastVideoIndex',
    LAST_TIME: 'lastVideoTime'
};

>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
/* =========================================
   Initialization
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadPlaylist();
    setupEventListeners();
    toggleWebcam(); // Auto-start webcam
<<<<<<< HEAD

    // Save playback state every 1 second
    setInterval(savePlaybackState, 1000);

    // Start Timer Logic
    // Start Timer Logic
    initExerciseTimer();

    // Init Motion Detection (Async)
    initMotionDetection();
=======
    
    // Save playback state every 1 second
    setInterval(savePlaybackState, 1000);
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
});

function loadSettings() {
    // 1. Layout Mode
    const savedMode = localStorage.getItem(STORAGE_KEYS.LAYOUT_MODE);
    const container = document.querySelector('.container');
    const layoutIcon = document.getElementById('layoutIcon');
<<<<<<< HEAD

    if (savedMode === 'overlay' || !savedMode) {
        container.classList.add('overlay-mode');
        if (layoutIcon) layoutIcon.textContent = 'layers';
    } else {
        container.classList.remove('overlay-mode');
        if (layoutIcon) layoutIcon.textContent = 'view_agenda';
=======
    
    if (savedMode === 'overlay' || !savedMode) {
        container.classList.add('overlay-mode');
        if(layoutIcon) layoutIcon.textContent = 'layers';
    } else {
        container.classList.remove('overlay-mode');
        if(layoutIcon) layoutIcon.textContent = 'view_agenda';
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    }

    // 2. Opacity
    const savedOpacity = localStorage.getItem(STORAGE_KEYS.OPACITY) || '0.5';
<<<<<<< HEAD
    const opacitySlider = document.getElementById('opacitySlider');
    if (opacitySlider) {
        opacitySlider.value = savedOpacity;
        updateWebcamOpacity(savedOpacity);
    }

    // 3. Sensitivity
    const savedSensitivity = localStorage.getItem(STORAGE_KEYS.SENSITIVITY) || '50';
    const sensitivitySlider = document.getElementById('sensitivitySlider');
    if (sensitivitySlider) {
        sensitivitySlider.value = savedSensitivity;
        // Update motionAnalyzer if already initialized
        if (window.motionAnalyzer) {
            window.motionAnalyzer.sensitivity = parseInt(savedSensitivity, 10) * 10;
        }
    }

    // 4. Resume : Last Video Index
=======
    const slider = document.getElementById('opacitySlider');
    if (slider) {
        slider.value = savedOpacity;
        updateWebcamOpacity(savedOpacity);
    }
    
    // 3. Resume : Last Video Index
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    const savedIndex = localStorage.getItem(STORAGE_KEYS.LAST_INDEX);
    if (savedIndex !== null) {
        currentIndex = parseInt(savedIndex, 10);
        // We'll validate this index after playlist loads
    }
}

function savePlaybackState() {
<<<<<<< HEAD
    if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
=======
    if(player && player.getPlayerState() === YT.PlayerState.PLAYING) {
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
        localStorage.setItem(STORAGE_KEYS.LAST_INDEX, currentIndex);
        localStorage.setItem(STORAGE_KEYS.LAST_TIME, player.getCurrentTime());
    }
}

function saveSetting(key, value) {
    localStorage.setItem(key, value);
}

/* =========================================
   Player Initialization (Resume Logic)
   ========================================= */
function onYouTubeIframeAPIReady() {
    isYoutubeApiReady = true;
    tryCreatePlayer();
}

function onPlaylistLoaded() {
    isPlaylistLoaded = true;
<<<<<<< HEAD

=======
    
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    // Validate currentIndex against the loaded playlist
    if (currentIndex >= playlist.length || currentIndex < 0) {
        currentIndex = 0;
    }
<<<<<<< HEAD

=======
    
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    tryCreatePlayer();
}

function tryCreatePlayer() {
    if (!isYoutubeApiReady || player) return;

    let firstVideoId = '372ByJedKsY'; // 기본값

    // 플레이리스트 확인 및 ID 추출
    if (playlist && playlist.length > 0) {
        if (currentIndex < 0 || currentIndex >= playlist.length) currentIndex = 0;
        if (playlist[currentIndex] && playlist[currentIndex].id) {
            firstVideoId = playlist[currentIndex].id;
        }
    }

<<<<<<< HEAD
    // console.log(`Starting Player: ${firstVideoId}`);
=======
    console.log(`Starting Player: ${firstVideoId}`);
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d

    // YT.Player 생성 (에러 처리 없이 직접 호출하여 브라우저 콘솔에 에러 뜨게 함)
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: firstVideoId,
<<<<<<< HEAD
        playerVars: {
            autoplay: 1,
=======
        playerVars: { 
            autoplay: 1, 
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
            controls: 1,
            playsinline: 1, // 모바일 전체화면 방지 및 자동재생
            rel: 0
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
        }
    });
}

function onPlayerReady(e) {
<<<<<<< HEAD
    // console.log('Player Ready!');

=======
    console.log('Player Ready!');
    
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    // 이어보기 (5초 이상일 때만)
    const savedTime = localStorage.getItem(STORAGE_KEYS.LAST_TIME);
    if (savedTime) {
        const t = parseFloat(savedTime);
        if (!isNaN(t) && t > 5) {
<<<<<<< HEAD
            // console.log(`Seeking to ${t}s`);
=======
            console.log(`Seeking to ${t}s`);
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
            e.target.seekTo(t);
        }
    }

    e.target.playVideo();
<<<<<<< HEAD

    // 자동재생 실패 시 1초 뒤 재시도
    setTimeout(() => {
        if (e.target.getPlayerState() !== 1) { // 1 = Playing
            // console.log('Force Play Retry');
=======
    
    // 자동재생 실패 시 1초 뒤 재시도
    setTimeout(() => {
        if(e.target.getPlayerState() !== 1) { // 1 = Playing
            console.log('Force Play Retry');
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
            e.target.playVideo();
        }
    }, 1000);

    updateNextVideoUI();
    updatePlaylistUI();
<<<<<<< HEAD

=======
    
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    // Watcher: Ensure video keeps playing (Watcher)
    if (!window.playerWatcher) {
        window.playerWatcher = setInterval(() => {
            if (player && typeof player.getPlayerState === 'function') {
                const state = player.getPlayerState();
                // -1: Unstarted, 5: Video cued
                if (state === -1 || state === 5) {
<<<<<<< HEAD
                    // console.log('Watcher: Forcing Play...');
=======
                    console.log('Watcher: Forcing Play...');
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
                    player.playVideo();
                }
            }
        }, 3000);
    }
}

// Global Safety Watcher for Network/API delays
setInterval(() => {
    if ((window.YT && window.YT.Player) && !player) {
<<<<<<< HEAD
        // console.log('Safety Watcher: Creating Missing Player...');
        tryCreatePlayer();
=======
         console.log('Safety Watcher: Creating Missing Player...');
         tryCreatePlayer();
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    }
}, 2000);

/* =========================================
   Controls & Layout
   ========================================= */
function togglePlaylist() {
    const modal = document.getElementById('playlistModal');
    if (!modal) return;
    modal.classList.toggle('active');

    // Close speed menu when playlist is toggled
    const speedMenu = document.getElementById('speedMenu');
    if (speedMenu) speedMenu.classList.remove('active');
}

function toggleSpeedMenu() {
    const menu = document.getElementById('speedMenu');
    if (!menu) return;

    const isActive = menu.classList.toggle('active');

    // Close playlist when speed menu is opened
    if (isActive) {
        const modal = document.getElementById('playlistModal');
        if (modal) modal.classList.remove('active');
    }
}

function toggleLayout() {
    const container = document.querySelector('.container');
    const icon = document.getElementById('layoutIcon');
<<<<<<< HEAD

    container.classList.toggle('overlay-mode');

    const isOverlay = container.classList.contains('overlay-mode');
    if (icon) icon.textContent = isOverlay ? 'layers' : 'view_agenda';

    saveSetting(STORAGE_KEYS.LAYOUT_MODE, isOverlay ? 'overlay' : 'split');

    if (isOverlay) {
        const slider = document.getElementById('opacitySlider');
        if (slider) updateWebcamOpacity(slider.value);
    } else {
        const webcamPanel = document.querySelector('.webcam-panel');
        if (webcamPanel) webcamPanel.style.opacity = '1';
=======
    
    container.classList.toggle('overlay-mode');
    
    const isOverlay = container.classList.contains('overlay-mode');
    if(icon) icon.textContent = isOverlay ? 'layers' : 'view_agenda';
    
    saveSetting(STORAGE_KEYS.LAYOUT_MODE, isOverlay ? 'overlay' : 'split');
    
    if (isOverlay) {
        const slider = document.getElementById('opacitySlider');
        if(slider) updateWebcamOpacity(slider.value);
    } else {
        const webcamPanel = document.querySelector('.webcam-panel');
        if(webcamPanel) webcamPanel.style.opacity = '1';
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    }
}

function updateOpacityFromSlider(value) {
    updateWebcamOpacity(value);
    saveSetting(STORAGE_KEYS.OPACITY, value);
}

function updateWebcamOpacity(value) {
    const container = document.querySelector('.container');
    if (container.classList.contains('overlay-mode')) {
        const webcamPanel = document.querySelector('.webcam-panel');
<<<<<<< HEAD
        if (webcamPanel) webcamPanel.style.opacity = value;
=======
        if(webcamPanel) webcamPanel.style.opacity = value;
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    }
}

async function toggleWebcam() {
    const webcam = document.getElementById('webcam');
    const btn = document.getElementById('webcamBtn');
    const placeholder = document.getElementById('placeholder');

    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        webcamStream = null;
        webcam.srcObject = null;
        webcam.style.display = 'none';
        placeholder.style.display = 'flex';
        placeholder.textContent = '웹캠이 꺼졌습니다';
<<<<<<< HEAD
        if (btn) btn.classList.remove('active');

        // Stop Pose Detection
        stopPoseDetection();
=======
        if(btn) btn.classList.remove('active');
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: false
            });
            webcam.srcObject = stream;
            webcam.style.display = 'block';
            placeholder.style.display = 'none';
            webcamStream = stream;
<<<<<<< HEAD
            if (btn) btn.classList.add('active');

            // Start Pose Detection
            startPoseDetection();
=======
            if(btn) btn.classList.add('active');
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
        } catch (error) {
            console.error('Webcam Error:', error);
            placeholder.textContent = '웹캠 권한 필요';
        }
    }
}

function toggleFlip() {
    const webcam = document.getElementById('webcam');
    const btn = document.getElementById('flipBtn');
    isFlipped = !isFlipped;
    if (isFlipped) {
        webcam.style.transform = 'scaleX(-1)';
<<<<<<< HEAD
        if (btn) btn.classList.add('active');
    } else {
        webcam.style.transform = 'scaleX(1)';
        if (btn) btn.classList.remove('active');
    }

    // Flip Canvas too
    const canvas = document.getElementById('output_canvas');
    if (canvas) {
        canvas.style.transform = isFlipped ? 'scaleX(-1)' : 'scaleX(1)';
=======
        if(btn) btn.classList.add('active');
    } else {
        webcam.style.transform = 'scaleX(1)';
        if(btn) btn.classList.remove('active');
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    }
}

/* =========================================
   Playback Logic
   ========================================= */
function onPlayerStateChange(e) {
    const icon = document.getElementById('playIcon');
    if (e.data === YT.PlayerState.PLAYING) {
<<<<<<< HEAD
        if (icon) icon.textContent = 'pause';
        errorCount = 0;
    } else if (e.data === YT.PlayerState.PAUSED) {
        if (icon) icon.textContent = 'play_arrow';
=======
        if(icon) icon.textContent = 'pause';
        errorCount = 0;
    } else if (e.data === YT.PlayerState.PAUSED) {
        if(icon) icon.textContent = 'play_arrow';
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    } else if (e.data === YT.PlayerState.ENDED) {
        playNext();
    }
}

function onPlayerError(e) {
    console.error('Player Error Code:', e.data);
    errorCount++;
<<<<<<< HEAD
    if (errorCount <= MAX_ERRORS) {
        // console.log(`Retrying next video (${errorCount}/${MAX_ERRORS})...`);
=======
    if(errorCount <= MAX_ERRORS) {
        console.log(`Retrying next video (${errorCount}/${MAX_ERRORS})...`);
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
        setTimeout(playNext, 1500);
    }
}

function playVideo(index) {
<<<<<<< HEAD
    if (!player || !playlist[index]) return;

    // Save state before switching (optional, maybe not needed since we want to reset time)
    // But importantly, update currentIndex
    currentIndex = index;

    // Reset saved time for the new video
    localStorage.setItem(STORAGE_KEYS.LAST_INDEX, currentIndex);
    localStorage.setItem(STORAGE_KEYS.LAST_TIME, 0);

    const vidId = playlist[index].id || '372ByJedKsY';
    player.loadVideoById(vidId);

=======
    if(!player || !playlist[index]) return;
    
    // Save state before switching (optional, maybe not needed since we want to reset time)
    // But importantly, update currentIndex
    currentIndex = index;
    
    // Reset saved time for the new video
    localStorage.setItem(STORAGE_KEYS.LAST_INDEX, currentIndex);
    localStorage.setItem(STORAGE_KEYS.LAST_TIME, 0); 
    
    const vidId = playlist[index].id || '372ByJedKsY';
    player.loadVideoById(vidId);
    
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    updatePlaylistUI();
    updateNextVideoUI();
}

function playNext() {
    // Loop Logic: (current + 1) % length ensures it goes back to 0 after the last one
    currentIndex = (currentIndex + 1) % playlist.length;
    playVideo(currentIndex);
}

function playPrevious() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playVideo(currentIndex);
}

function togglePlay() {
<<<<<<< HEAD
    if (!player) return;
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) player.pauseVideo();
=======
    if(!player) return;
    const state = player.getPlayerState();
    if(state === YT.PlayerState.PLAYING) player.pauseVideo();
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    else player.playVideo();
}

function seek(seconds) {
<<<<<<< HEAD
    if (!player) return;
=======
    if(!player) return;
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    const current = player.getCurrentTime();
    player.seekTo(current + seconds);
}

function setSpeed(speed) {
<<<<<<< HEAD
    if (!player) return;
=======
    if(!player) return;
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    player.setPlaybackRate(speed);
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
    });
}

function loadPlaylist() {
<<<<<<< HEAD
    // 1. Try to load from LocalStorage first (User's custom playlist)
    const stored = localStorage.getItem(STORAGE_KEYS.PLAYLIST);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                playlist = parsed;
                // console.log('Loaded playlist from localStorage');
                updatePlaylistUI();
                updateNextVideoUI();
                onPlaylistLoaded();

                // Still fetch playlist.txt to see if we need to initialize (if storage was somehow empty/invalid logic fell through)
                // But we won't overwrite if we already loaded successfully.
                return;
            }
        } catch (err) {
            console.warn('Corrupt localStorage playlist', err);
        }
    }

    // 2. Fallback: Fetch default playlist.txt
    fetch('playlist.txt?t=' + new Date().getTime())
        .then(res => {
            if (!res.ok) throw new Error('File error');
=======
    fetch('playlist.txt?t=' + new Date().getTime())
        .then(res => {
            if(!res.ok) throw new Error('File error');
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
            return res.text();
        })
        .then(text => {
            const lines = text.trim().split('\n').filter(l => l.trim());
            const filePlaylist = lines.map(line => {
                const [id, title] = line.split('|');
<<<<<<< HEAD
                if (!id || id.length < 5) return null;
=======
                if(!id || id.length < 5) return null;
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
                return { id: id.trim(), title: title ? title.trim() : id.trim() };
            }).filter(item => item !== null);

            if (filePlaylist.length > 0) {
                playlist = filePlaylist;
<<<<<<< HEAD
                // Only save to storage if we are initializing for the first time
=======
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
                localStorage.setItem(STORAGE_KEYS.PLAYLIST, JSON.stringify(playlist));
            }
        })
        .catch(e => {
<<<<<<< HEAD
            console.warn('Using default playlist failed', e);
        })
        .finally(() => {
            updatePlaylistUI();
            updateNextVideoUI();
            onPlaylistLoaded();
=======
            console.warn('Using cached/default playlist', e);
            const stored = localStorage.getItem(STORAGE_KEYS.PLAYLIST);
            if (stored) {
                try { playlist = JSON.parse(stored); } catch(err){}
            }
        })
        .finally(() => {
            updatePlaylistUI();
            updateNextVideoUI(); // Ensure next title is shown immediately
            onPlaylistLoaded(); // Signal ready
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
        });
}

function updatePlaylistUI() {
    const container = document.getElementById('playlistItems');
    const count = document.getElementById('count');
<<<<<<< HEAD
    if (!container) return;

    container.innerHTML = '';
    count.textContent = playlist.length;

=======
    if(!container) return;

    container.innerHTML = '';
    count.textContent = playlist.length;
    
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    playlist.forEach((v, i) => {
        const div = document.createElement('div');
        div.className = 'playlist-item' + (i === currentIndex ? ' active' : '');
        div.innerHTML = `
            <div class="item-info" onclick="playVideo(${i})">
                ${i + 1}. ${v.title}
            </div>
            <div class="item-actions">
<<<<<<< HEAD
                <button class="playlist-btn" onclick="moveUp(${i})" title="위로" ${i === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
                <button class="playlist-btn" onclick="moveDown(${i})" title="아래로" ${i === playlist.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
=======
                <button class="playlist-btn" onclick="moveUp(${i})" title="위로" ${i===0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
                <button class="playlist-btn" onclick="moveDown(${i})" title="아래로" ${i===playlist.length-1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
                <button class="playlist-btn delete-btn" onclick="deleteVideo(${i})" title="삭제">✕</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateNextVideoUI() {
    const nextTitle = document.getElementById('nextTitle');
    if (!nextTitle) return;

    if (playlist && playlist.length > 0) {
        if (currentIndex < 0 || currentIndex >= playlist.length) currentIndex = 0;
<<<<<<< HEAD

        const nextIdx = (currentIndex + 1) % playlist.length;
        const nextItem = playlist[nextIdx];

        if (nextItem) {
            nextTitle.textContent = nextItem.title;
        } else {
            nextTitle.textContent = '-';
=======
        
        const nextIdx = (currentIndex + 1) % playlist.length;
        const nextItem = playlist[nextIdx];
        
        if (nextItem) {
            nextTitle.textContent = nextItem.title;
        } else {
             nextTitle.textContent = '-';
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
        }
    } else {
        nextTitle.textContent = '재생 목록 없음';
    }
}

function moveUp(index) {
    if (index <= 0) return;
<<<<<<< HEAD

=======
    
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    // Swap
    const temp = playlist[index];
    playlist[index] = playlist[index - 1];
    playlist[index - 1] = temp;
<<<<<<< HEAD

    // Update currentIndex if affected
    if (currentIndex === index) currentIndex--;
    else if (currentIndex === index - 1) currentIndex++;

=======
    
    // Update currentIndex if affected
    if (currentIndex === index) currentIndex--;
    else if (currentIndex === index - 1) currentIndex++;
    
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    savePlaylist();
    updatePlaylistUI();
    updateNextVideoUI();
}

function moveDown(index) {
    if (index >= playlist.length - 1) return;
<<<<<<< HEAD

=======
    
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
    // Swap
    const temp = playlist[index];
    playlist[index] = playlist[index + 1];
    playlist[index + 1] = temp;

    // Update currentIndex if affected
    if (currentIndex === index) currentIndex++;
    else if (currentIndex === index + 1) currentIndex--;

    savePlaylist();
    updatePlaylistUI();
    updateNextVideoUI();
}

function deleteVideo(index) {
    if (confirm('삭제하시겠습니까?')) {
        playlist.splice(index, 1);
        savePlaylist();
<<<<<<< HEAD

=======
        
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
        if (index < currentIndex) currentIndex--;
        else if (index === currentIndex) {
            // Deleted currently playing video
            if (playlist.length > 0) {
<<<<<<< HEAD
                currentIndex = index % playlist.length;
                playVideo(currentIndex);
            } else {
                player.stopVideo();
                currentIndex = 0;
=======
                 currentIndex = index % playlist.length;
                 playVideo(currentIndex);
            } else {
                 player.stopVideo();
                 currentIndex = 0;
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
            }
        }
        updatePlaylistUI();
        updateNextVideoUI();
    }
}

function savePlaylist() {
    localStorage.setItem(STORAGE_KEYS.PLAYLIST, JSON.stringify(playlist));
}

function addVideo() {
    const url = document.getElementById('urlInput').value;
    const title = document.getElementById('titleInput').value || '새 비디오';
    let videoId = url;
    if (url.includes('v=')) videoId = url.split('v=')[1];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1];
    if (videoId && videoId.indexOf('&') !== -1) videoId = videoId.split('&')[0];
    if (videoId && videoId.indexOf('?') !== -1) videoId = videoId.split('?')[0];

<<<<<<< HEAD
    if (videoId && videoId.length >= 11) {
=======
    if(videoId && videoId.length >= 11) {
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
        playlist.push({ id: videoId, title: title });
        savePlaylist();
        updatePlaylistUI();
        updateNextVideoUI();
        document.getElementById('urlInput').value = '';
        alert('추가되었습니다.');
    } else {
        alert('올바른 ID/URL을 입력하세요.');
    }
}

function setupEventListeners() {
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.onclick = () => setSpeed(parseFloat(btn.dataset.speed));
    });
<<<<<<< HEAD

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.settings-container') && !e.target.closest('#speedMenu')) {
            const menu = document.getElementById('speedMenu');
            if (menu) menu.classList.remove('active');
        }

        /* Mobile Slider Logic (Opacity) */
        const opacityContainer = document.querySelector('.opacity-container');
        const sensitivityContainer = document.querySelector('.sensitivity-container');
        const playerDiv = document.getElementById('player');

        // Opacity Slider Toggle
        if (opacityContainer && e.target.closest('.opacity-container')) {
            const container = document.querySelector('.container');
            if (!container.classList.contains('overlay-mode')) return;

            if (!e.target.closest('input[type=range]')) {
                const isActive = opacityContainer.classList.toggle('active');
                // Close others
                if (sensitivityContainer) sensitivityContainer.classList.remove('active');
                if (playerDiv) playerDiv.style.pointerEvents = isActive ? 'none' : 'auto';
            }
        }
        // Sensitivity Slider Toggle
        else if (sensitivityContainer && e.target.closest('.sensitivity-container')) {
            if (!e.target.closest('input[type=range]')) {
                const isActive = sensitivityContainer.classList.toggle('active');
                // Close others
                if (opacityContainer) opacityContainer.classList.remove('active');
                if (playerDiv) playerDiv.style.pointerEvents = isActive ? 'none' : 'auto';
            }
        }
        // Click outside to close
        else {
            if (opacityContainer && opacityContainer.classList.contains('active')) {
                opacityContainer.classList.remove('active');
            }
            if (sensitivityContainer && sensitivityContainer.classList.contains('active')) {
                sensitivityContainer.classList.remove('active');
            }
            if (playerDiv) playerDiv.style.pointerEvents = 'auto';
=======
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.settings-container') && !e.target.closest('#speedMenu')) {
            const menu = document.getElementById('speedMenu');
            if(menu) menu.classList.remove('active');
        }

        /* Mobile Slider Logic */
        const opacityContainer = document.querySelector('.opacity-container');
        const playerDiv = document.getElementById('player'); 

        if (opacityContainer && e.target.closest('.opacity-container')) {
            // Strict Check: Only work in Overlay Mode
            const container = document.querySelector('.container');
            if(!container.classList.contains('overlay-mode')) {
                return; // Stop here if not in overlay mode
            }

            // Clicked icon? Toggle slider
            if (!e.target.closest('input[type=range]')) {
                const isActive = opacityContainer.classList.toggle('active');
                if(playerDiv) playerDiv.style.pointerEvents = isActive ? 'none' : 'auto';
            }
        } 
        else if (opacityContainer && !e.target.closest('.opacity-container')) {
             if (opacityContainer.classList.contains('active')) {
                opacityContainer.classList.remove('active');
                if(playerDiv) playerDiv.style.pointerEvents = 'auto'; 
            }
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
        }
    });

    document.addEventListener('keydown', (e) => {
<<<<<<< HEAD
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
=======
        if(e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault(); 
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
            togglePlay();
        }
    });
}
<<<<<<< HEAD


/* =========================================
   Exercise Timer Logic
   ========================================= */
function initExerciseTimer() {
    // Load saved time
    const savedTime = localStorage.getItem(STORAGE_KEYS.EXERCISE_TIME);
    if (savedTime) {
        totalExerciseTime = parseInt(savedTime, 10);
    }
    updateTimerDisplay();

    // Start counting
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
            totalExerciseTime++;
            updateTimerDisplay();

            // Save every 5 seconds to reduce writes
            if (totalExerciseTime % 5 === 0) {
                localStorage.setItem(STORAGE_KEYS.EXERCISE_TIME, totalExerciseTime);
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('exerciseTimer');
    if (!timerEl) return;

    const h = Math.floor(totalExerciseTime / 3600);
    const m = Math.floor((totalExerciseTime % 3600) / 60);
    const s = totalExerciseTime % 60;

    const fmt = (n) => n.toString().padStart(2, '0');
    timerEl.textContent = `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
}


/* =========================================
   Motion Detection Logic
   ========================================= */
async function initMotionDetection() {
    try {
        const { PoseDetector } = await import('./js/pose-detector.js');
        const { Renderer } = await import('./js/renderer.js');
        const { MotionAnalyzer } = await import('./js/motion-analyzer.js');

        poseDetector = new PoseDetector();
        await poseDetector.initialize();

        const canvas = document.getElementById('output_canvas');
        if (canvas) {
            skeletonRenderer = new Renderer(canvas);
        }

        motionAnalyzer = new MotionAnalyzer();

        // console.log('Motion detection initialized');
    } catch (e) {
        console.error('Failed to init motion detection', e);
    }
}

function startPoseDetection() {
    if (!poseDetector || !skeletonRenderer || isPoseTracking) return;

    const video = document.getElementById('webcam');
    const canvas = document.getElementById('output_canvas');
    if (!video || !canvas) return;

    canvas.style.display = 'block';
    // Sync flip state
    canvas.style.transform = isFlipped ? 'scaleX(-1)' : 'scaleX(1)';

    const scoreEl = document.getElementById('scoreDisplay');
    if (scoreEl) scoreEl.style.display = 'block';

    isPoseTracking = true;

    function loop() {
        if (!isPoseTracking) return;

        if (video.videoWidth > 0 && video.videoHeight > 0) {
            skeletonRenderer.resize(video.videoWidth, video.videoHeight);
            poseDetector.detect(video, performance.now(), (result) => {
                skeletonRenderer.clear();
                if (result.landmarks && result.landmarks.length > 0) {
                    const landmarks = result.landmarks[0];
                    skeletonRenderer.draw(landmarks);

                    if (motionAnalyzer) {
                        const score = motionAnalyzer.update(landmarks);
                        const scoreEl = document.getElementById('scoreDisplay');
                        if (scoreEl) scoreEl.textContent = `SCORE: ${score}`;
                    }
                }
            });
        }

        requestAnimationFrame(loop);
    }
    loop();
}

function stopPoseDetection() {
    isPoseTracking = false;
    const canvas = document.getElementById('output_canvas');
    if (canvas) {
        canvas.style.display = 'none';
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    const scoreEl = document.getElementById('scoreDisplay');
    if (scoreEl) scoreEl.style.display = 'none';
}

function updateSensitivityFromSlider(value) {
    if (motionAnalyzer) {
        // Map 0-100 slider to 0-1000 internal sensitivity
        const val = parseInt(value, 10);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.SENSITIVITY, val);

        motionAnalyzer.sensitivity = val * 10;
        // console.log('Sensitivity updated:', motionAnalyzer.sensitivity);
    }
}
=======
>>>>>>> ae9a655d37b10c21141ee97ca29cb12d00d1f83d
