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
    LAYOUT_MODE: 'layoutMode', 
    OPACITY: 'webcamOpacity',
    LAST_INDEX: 'lastVideoIndex',
    LAST_TIME: 'lastVideoTime'
};

/* =========================================
   Initialization
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadPlaylist();
    setupEventListeners();
    toggleWebcam(); // Auto-start webcam
    
    // Save playback state every 1 second
    setInterval(savePlaybackState, 1000);
});

function loadSettings() {
    // 1. Layout Mode
    const savedMode = localStorage.getItem(STORAGE_KEYS.LAYOUT_MODE);
    const container = document.querySelector('.container');
    const layoutIcon = document.getElementById('layoutIcon');
    
    if (savedMode === 'overlay' || !savedMode) {
        container.classList.add('overlay-mode');
        if(layoutIcon) layoutIcon.textContent = 'layers';
    } else {
        container.classList.remove('overlay-mode');
        if(layoutIcon) layoutIcon.textContent = 'view_agenda';
    }

    // 2. Opacity
    const savedOpacity = localStorage.getItem(STORAGE_KEYS.OPACITY) || '0.5';
    const slider = document.getElementById('opacitySlider');
    if (slider) {
        slider.value = savedOpacity;
        updateWebcamOpacity(savedOpacity);
    }
    
    // 3. Resume : Last Video Index
    const savedIndex = localStorage.getItem(STORAGE_KEYS.LAST_INDEX);
    if (savedIndex !== null) {
        currentIndex = parseInt(savedIndex, 10);
        // We'll validate this index after playlist loads
    }
}

function savePlaybackState() {
    if(player && player.getPlayerState() === YT.PlayerState.PLAYING) {
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
    
    // Validate currentIndex against the loaded playlist
    if (currentIndex >= playlist.length || currentIndex < 0) {
        currentIndex = 0;
    }
    
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

    console.log(`Starting Player: ${firstVideoId}`);

    // YT.Player 생성 (에러 처리 없이 직접 호출하여 브라우저 콘솔에 에러 뜨게 함)
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: firstVideoId,
        playerVars: { 
            autoplay: 1, 
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
    console.log('Player Ready!');
    
    // 이어보기 (5초 이상일 때만)
    const savedTime = localStorage.getItem(STORAGE_KEYS.LAST_TIME);
    if (savedTime) {
        const t = parseFloat(savedTime);
        if (!isNaN(t) && t > 5) {
            console.log(`Seeking to ${t}s`);
            e.target.seekTo(t);
        }
    }

    e.target.playVideo();
    
    // 자동재생 실패 시 1초 뒤 재시도
    setTimeout(() => {
        if(e.target.getPlayerState() !== 1) { // 1 = Playing
            console.log('Force Play Retry');
            e.target.playVideo();
        }
    }, 1000);

    updateNextVideoUI();
    updatePlaylistUI();
    
    // Watcher: Ensure video keeps playing (Watcher)
    if (!window.playerWatcher) {
        window.playerWatcher = setInterval(() => {
            if (player && typeof player.getPlayerState === 'function') {
                const state = player.getPlayerState();
                // -1: Unstarted, 5: Video cued
                if (state === -1 || state === 5) {
                    console.log('Watcher: Forcing Play...');
                    player.playVideo();
                }
            }
        }, 3000);
    }
}

// Global Safety Watcher for Network/API delays
setInterval(() => {
    if ((window.YT && window.YT.Player) && !player) {
         console.log('Safety Watcher: Creating Missing Player...');
         tryCreatePlayer();
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
        if(webcamPanel) webcamPanel.style.opacity = value;
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
        if(btn) btn.classList.remove('active');
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
            if(btn) btn.classList.add('active');
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
        if(btn) btn.classList.add('active');
    } else {
        webcam.style.transform = 'scaleX(1)';
        if(btn) btn.classList.remove('active');
    }
}

/* =========================================
   Playback Logic
   ========================================= */
function onPlayerStateChange(e) {
    const icon = document.getElementById('playIcon');
    if (e.data === YT.PlayerState.PLAYING) {
        if(icon) icon.textContent = 'pause';
        errorCount = 0;
    } else if (e.data === YT.PlayerState.PAUSED) {
        if(icon) icon.textContent = 'play_arrow';
    } else if (e.data === YT.PlayerState.ENDED) {
        playNext();
    }
}

function onPlayerError(e) {
    console.error('Player Error Code:', e.data);
    errorCount++;
    if(errorCount <= MAX_ERRORS) {
        console.log(`Retrying next video (${errorCount}/${MAX_ERRORS})...`);
        setTimeout(playNext, 1500);
    }
}

function playVideo(index) {
    if(!player || !playlist[index]) return;
    
    // Save state before switching (optional, maybe not needed since we want to reset time)
    // But importantly, update currentIndex
    currentIndex = index;
    
    // Reset saved time for the new video
    localStorage.setItem(STORAGE_KEYS.LAST_INDEX, currentIndex);
    localStorage.setItem(STORAGE_KEYS.LAST_TIME, 0); 
    
    const vidId = playlist[index].id || '372ByJedKsY';
    player.loadVideoById(vidId);
    
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
    if(!player) return;
    const state = player.getPlayerState();
    if(state === YT.PlayerState.PLAYING) player.pauseVideo();
    else player.playVideo();
}

function seek(seconds) {
    if(!player) return;
    const current = player.getCurrentTime();
    player.seekTo(current + seconds);
}

function setSpeed(speed) {
    if(!player) return;
    player.setPlaybackRate(speed);
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
    });
}

function loadPlaylist() {
    fetch('playlist.txt?t=' + new Date().getTime())
        .then(res => {
            if(!res.ok) throw new Error('File error');
            return res.text();
        })
        .then(text => {
            const lines = text.trim().split('\n').filter(l => l.trim());
            const filePlaylist = lines.map(line => {
                const [id, title] = line.split('|');
                if(!id || id.length < 5) return null;
                return { id: id.trim(), title: title ? title.trim() : id.trim() };
            }).filter(item => item !== null);

            if (filePlaylist.length > 0) {
                playlist = filePlaylist;
                localStorage.setItem(STORAGE_KEYS.PLAYLIST, JSON.stringify(playlist));
            }
        })
        .catch(e => {
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
        });
}

function updatePlaylistUI() {
    const container = document.getElementById('playlistItems');
    const count = document.getElementById('count');
    if(!container) return;

    container.innerHTML = '';
    count.textContent = playlist.length;
    
    playlist.forEach((v, i) => {
        const div = document.createElement('div');
        div.className = 'playlist-item' + (i === currentIndex ? ' active' : '');
        div.innerHTML = `
            <div class="item-info" onclick="playVideo(${i})">
                ${i + 1}. ${v.title}
            </div>
            <div class="item-actions">
                <button class="playlist-btn" onclick="moveUp(${i})" title="위로" ${i===0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
                <button class="playlist-btn" onclick="moveDown(${i})" title="아래로" ${i===playlist.length-1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
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
        
        const nextIdx = (currentIndex + 1) % playlist.length;
        const nextItem = playlist[nextIdx];
        
        if (nextItem) {
            nextTitle.textContent = nextItem.title;
        } else {
             nextTitle.textContent = '-';
        }
    } else {
        nextTitle.textContent = '재생 목록 없음';
    }
}

function moveUp(index) {
    if (index <= 0) return;
    
    // Swap
    const temp = playlist[index];
    playlist[index] = playlist[index - 1];
    playlist[index - 1] = temp;
    
    // Update currentIndex if affected
    if (currentIndex === index) currentIndex--;
    else if (currentIndex === index - 1) currentIndex++;
    
    savePlaylist();
    updatePlaylistUI();
    updateNextVideoUI();
}

function moveDown(index) {
    if (index >= playlist.length - 1) return;
    
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
        
        if (index < currentIndex) currentIndex--;
        else if (index === currentIndex) {
            // Deleted currently playing video
            if (playlist.length > 0) {
                 currentIndex = index % playlist.length;
                 playVideo(currentIndex);
            } else {
                 player.stopVideo();
                 currentIndex = 0;
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

    if(videoId && videoId.length >= 11) {
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
        }
    });

    document.addEventListener('keydown', (e) => {
        if(e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault(); 
            togglePlay();
        }
    });
}
