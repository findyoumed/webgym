# 운동 따라하기 앱

YouTube 운동 영상과 웹캠을 분할 화면으로 보면서 운동을 따라할 수 있는 웹 애플리케이션입니다.

## 사용 방법

### 서버 시작
```bash
python -m http.server 8080
```

### 브라우저 접속
```
http://localhost:8080
```

## 주요 기능

### 🎬 YouTube 플레이어
- ⏪ 10초 뒤로 / ⏩ 10초 앞으로
- 🎚️ 배속 조절 (0.5x ~ 2x)
- ▶️ 재생/일시정지
- ⏮️ 이전 곡 / ⏩ 다음 곡
- 📋 다음 운동 미리보기

### 📹 웹캠
- 실시간 화면 표시
- 좌우 반전 (거울 모드)

### 📝 플레이리스트 관리
- **무제한** 비디오 추가
- 추가/삭제 자유롭게
- localStorage에 자동 저장

## 플레이리스트 설정

### 초기 설정 (선택사항)
`playlist.txt` 파일을 만들어 기본 영상 설정:
```
372ByJedKsY|전신 다이어트 운동
LU9FojZAybM|전신 유산소 운동
Ms-90Os7OFs|상체 운동
```

**형식**: `비디오ID|제목`

처음 실행 시 playlist.txt를 읽어 localStorage에 저장합니다.
이후부터는 localStorage를 사용합니다.

### UI에서 추가
1. 플레이리스트 버튼 클릭
2. YouTube URL 또는 비디오 ID 입력
3. 제목 입력
4. 추가 버튼 클릭

## 컨트롤

### 키보드 단축키
- `Space`: 재생/일시정지
- `←`: 이전 비디오
- `→`: 다음 비디오

### 버튼
- **10초 뒤로**: 현재 위치에서 10초 뒤로
- **10초 앞으로**: 현재 위치에서 10초 앞으로
- **배속 조절**: 비디오 우측 상단 (0.5x ~ 2x)
- **다음 곡**: 비디오 하단 바에서 확인 및 스킵

## 파일 구조

```
game_videocam/
├── index.html              # 메인 앱
├── playlist.txt            # 기본 플레이리스트 (선택)
└── README.md               # 이 파일
```

## FAQ

**Q: 플레이리스트가 사라졌어요**  
A: localStorage를 초기화하려면 브라우저 개발자 도구 > Application > Local Storage 삭제 후 새로고침

**Q: 기본 플레이리스트로 돌아가고 싶어요**  
A: localStorage 삭제 후 playlist.txt 파일 있으면 자동 로드

**Q: 비디오 ID는 어디서 찾나요?**  
A: YouTube URL `https://www.youtube.com/watch?v=372ByJedKsY`에서 `372ByJedKsY`가 ID입니다
