(function() {
    // --- 0. 설정 및 상수 (CONFIG) ---
    const CONFIG = {
        // 한국인 기준 (대한비만학회 2020)
        BMI: { 
            UNDER: 18.5, 
            NORMAL_END: 23, 
            PRE_OBESE_END: 25, 
            OBESE_1_END: 30, 
            OBESE_2_END: 35 
        }, 
        LIMITS: { MIN_WEIGHT: 30, MAX_WEIGHT: 300, MIN_FAT: 1, MAX_FAT: 70 },
        // CSS 변수명과 매핑되는 차트 색상값 (DomUtil에서 실제 값을 읽어옴)
        COLORS: {
            GAIN: 'var(--heatmap-gain)', // #ffcdd2
            LOSS: 'var(--secondary)',    // #bbdefb (실제값은 theme에 따라 다름)
            WEEKEND: '#F44336', 
            WEEKDAY: '#4CAF50'
        },
        // 복싱 체급 기준
        WEIGHT_CLASSES: [
            { name: "헤비급", min: 90.7 },
            { name: "크루저급", min: 79.4 },
            { name: "라이트헤비급", min: 76.2 },
            { name: "슈퍼미들급", min: 72.6 },
            { name: "미들급", min: 69.9 },
            { name: "슈퍼웰터급", min: 66.7 },
            { name: "웰터급", min: 63.5 },
            { name: "슈퍼라이트급", min: 61.2 },
            { name: "라이트급", min: 59.0 },
            { name: "슈퍼페더급", min: 57.2 },
            { name: "페더급", min: 55.3 },
            { name: "슈퍼밴텀급", min: 53.5 },
            { name: "밴텀급", min: 52.2 },
            { name: "슈퍼플라이급", min: 50.8 },
            { name: "플라이급", min: 49.0 },
            { name: "라이트플라이급", min: 47.6 },
            { name: "미니멈급", min: 0 }
        ],
        // 뱃지 정의 (상수 관리)
        BADGES: [
            { id: 'start', name: '시작이 반', icon: '🐣', desc: '첫 기록을 남겼습니다.' },
            { id: 'holiday', name: '홀리데이 서바이버', icon: '🎅', desc: '명절/연말 전후 증량을 0.5kg 미만으로 막아냈습니다.' },
            { id: 'zombie', name: '돌아온 탕아', icon: '🧟', desc: '15일 이상의 공백을 깨고 다시 기록을 시작했습니다.' },
            { id: 'sniper', name: '스나이퍼', icon: '🎯', desc: '목표 체중을 소수점까지 정확하게 명중시켰습니다.' },
            { id: 'coaster', name: '롤러코스터', icon: '🎢', desc: '하루 만에 1.5kg 이상의 급격한 변화를 경험했습니다.' },
            { id: 'zen', name: '평정심', icon: '🧘', desc: '7일 연속으로 체중 변동 폭이 0.1kg 이내로 유지되었습니다.' },
            { id: 'loss3', name: '3kg 감량', icon: '🥉', desc: '총 3kg 이상 감량했습니다.' },
            { id: 'loss5', name: '5kg 감량', icon: '🥈', desc: '총 5kg 이상 감량했습니다.' },
            { id: 'loss10', name: '10kg 감량', icon: '🥇', desc: '총 10kg 이상 감량했습니다.' },
            { id: 'streak3', name: '작심삼일 탈출', icon: '🔥', desc: '3일 연속으로 감량 또는 유지했습니다.' },
            { id: 'streak7', name: '일주일 연속', icon: '⚡', desc: '7일 연속으로 감량 또는 유지했습니다.' },
            { id: 'digit', name: '앞자리 체인지', icon: '✨', desc: '체중의 십의 자리 숫자가 바뀌었습니다.' },
            { id: 'goal', name: '목표 달성', icon: '👑', desc: '최종 목표 체중에 도달했습니다.' },
            { id: 'weekend', name: '주말 방어전', icon: '🛡️', desc: '주말(토~월) 동안 체중이 늘지 않았습니다.' },
            { id: 'plateau', name: '정체기 탈출', icon: '🧗‍♀️', desc: '7일 이상의 정체기를 뚫고 감량했습니다.' },
            { id: 'bmi', name: 'BMI 돌파', icon: '🩸', desc: 'BMI 단계(비만->과체중->정상)가 개선되었습니다.' },
            { id: 'yoyo', name: '요요 방지턱', icon: '🧘', desc: '목표 달성 후 10일간 체중을 유지했습니다.' },
            { id: 'ottogi', name: '오뚜기', icon: '💪', desc: '급격한 증량 후 3일 내에 다시 복구했습니다.' },
            { id: 'recordGod', name: '기록의 신', icon: '📝', desc: '총 누적 기록 365개를 달성했습니다.' },
            { id: 'goldenCross', name: '골든 크로스', icon: '📉', desc: '급격한 하락 추세(30일 평균 대비 7일 평균 급감)에 진입했습니다.' },
            { id: 'fatDestroyer', name: '체지방 파괴자', icon: '🥓', desc: '체지방률 25% 미만에 진입했습니다.' },
            { id: 'plateauMaster', name: '정체기 끝판왕', icon: '🧱', desc: '7일 이상 변동 없다가 0.5kg 이상 감량했습니다.' },
            { id: 'recordMaster', name: '기록의 달인', icon: '📅', desc: '90일 연속으로 기록했습니다.' },
            { id: 'reborn', name: '다시 태어난', icon: '🦋', desc: '최고 체중에서 10kg 이상 감량했습니다.' },
            { id: 'slowSteady', name: '슬로우 앤 스테디', icon: '🐢', desc: '3개월간 월평균 2kg 이하로 꾸준히 감량했습니다.' },
            { id: 'weightExpert', name: '체중 변화 전문가', icon: '🎓', desc: '1개월간 4kg 이상 감량했습니다.' },
            { id: 'plateauDestroyer', name: '정체기 파괴자', icon: '🔨', desc: '2주 이상의 정체기를 극복했습니다.' },
            { id: 'iconOfConstancy', name: '꾸준함의 아이콘', icon: '🗿', desc: '6개월 이상 연속 기록을 유지했습니다.' },
            // --- [NEW] 새로운 업적 ---
            { id: 'bigStep', name: '빅 스텝', icon: '👣', desc: '하루 만에 1.0kg 이상 감량했습니다.' },
            { id: 'phoenix', name: '불사조', icon: '🐦‍🔥', desc: '요요(증량) 후 다시 심기일전하여 최저 체중을 경신했습니다.' },
            { id: 'weekendRuler', name: '주말의 지배자', icon: '🧛', desc: '금요일 아침보다 월요일 아침 체중이 같거나 낮았습니다.' },
            { id: 'curiosity', name: '궁금증 해결사', icon: '🕵️', desc: '체지방률을 안 재다가 10일 연속으로 꼼꼼히 기록했습니다.' },
            { id: 'timeTraveler', name: '시공간 초월', icon: '🚀', desc: '예상 완료일을 10일 이상 앞당겼습니다.' }
        ]
    };

    // --- 0.1 유틸리티 (DateUtil, MathUtil, DomUtil) ---
    const DateUtil = {
        parse: (str) => {
            if (!str) return null;
            const parts = str.split('-');
            return new Date(parts[0], parts[1] - 1, parts[2]);
        },
        format: (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        },
        daysBetween: (d1, d2) => (d2 - d1) / (1000 * 3600 * 24),
        addDays: (dateStr, days) => {
            const d = DateUtil.parse(dateStr);
            d.setDate(d.getDate() + days);
            return DateUtil.format(d);
        },
        isFuture: (dateStr) => {
            const inputDate = DateUtil.parse(dateStr);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return inputDate > today;
        },
        getDaysInMonth: (year, month) => {
            return new Date(year, month + 1, 0).getDate();
        }
    };

    const MathUtil = {
        // 부동소수점 오차 보정을 위한 연산 메서드
        round: (num, decimals = 1) => {
            if (num === null || num === undefined) return 0;
            const factor = Math.pow(10, decimals);
            return Math.round((num + Number.EPSILON) * factor) / factor;
        },
        diff: (a, b) => MathUtil.round(a - b),
        add: (a, b) => MathUtil.round(a + b),
        clamp: (num, min, max) => Math.min(Math.max(num, min), max),
        stdDev: (arr) => {
            if (arr.length === 0) return 0;
            const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
            const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
            return Math.sqrt(variance);
        }
    };

    const DomUtil = {
        escapeHtml: (text) => {
            if (text === null || text === undefined) return '';
            return String(text)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },
        getChartColors: () => {
            const styles = getComputedStyle(document.body);
            return {
                grid: styles.getPropertyValue('--chart-grid').trim(),
                text: styles.getPropertyValue('--chart-text').trim(),
                primary: styles.getPropertyValue('--primary').trim(),
                secondary: styles.getPropertyValue('--secondary').trim(),
                danger: styles.getPropertyValue('--danger').trim(),
                accent: styles.getPropertyValue('--accent').trim()
            };
        },
        // CSS 클래스 기반 텍스트 색상 변경 헬퍼
        setTextColor: (el, colorType) => {
            el.className = el.className.replace(/\btext-\S+/g, ''); // 기존 text- 클래스 제거
            if (colorType === 'danger') el.classList.add('text-danger');
            else if (colorType === 'primary') el.classList.add('text-primary');
            else if (colorType === 'secondary') el.classList.add('text-secondary');
            else if (colorType === 'accent') el.classList.add('text-accent');
            else if (colorType === 'default') el.classList.add('text-default');
        }
    };

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // --- 1. 상태 및 DOM 관리 ---
    const AppState = {
        STORAGE_KEY: 'diet_pro_records',
        SETTINGS_KEY: 'diet_pro_settings',
        FILTER_KEY: 'diet_pro_filter_mode',
        records: [],
		settings: { height: 179, startWeight: 78.5, goal1: 70, intake: 1459 }, 
        chartFilterMode: 'ALL',
        customStart: null,
        customEnd: null,
        charts: { 
            main: null, dow: null, hist: null, cumul: null, monthly: null, fat: null, scatter: null, 
            weekend: null, bodyComp: null, boxPlot: null, roc: null, ghostRunner: null, 
            gaugeBmi: null, gaugeFat: null, weeklyBodyComp: null,
            // [NEW] (dietStyleRadar 제거됨)
            weightSpeedScatter: null
        },
        el: {},
        state: {
            editingDate: null, 
            statsCache: null, 
            isDirty: true,     
            calendarViewDate: new Date() 
        }
    };

    // --- 2. 초기화 ---
    function init() {
        const ids = [
            'dateInput', 'weightInput', 'fatInput', 'userHeight', 'startWeight', 'goal1Weight', 'dailyIntake',
            'settingsPanel', 'badgeGrid', 'csvFileInput', 'resetConfirmInput', 'recordInputGroup',
            'chartStartDate', 'chartEndDate', 'showTrend',
            'currentWeightDisplay', 'totalLostDisplay', 'percentLostDisplay', 'progressPercent',
            'remainingWeightDisplay', 'remainingPercentDisplay', 'bmiDisplay', 'predictedDate',
            'predictionRange', 'dashboardRate7Days', 'dashboardRate30Days', 'streakDisplay', 'successRateDisplay', 'minMaxWeightDisplay',
            'dailyVolatilityDisplay', 'weeklyAvgDisplay', 'monthCompareDisplay', 'analysisText',
            'lbmDisplay', 'lbmiDisplay', 'dDayDisplay', 'estTdeeDisplay', 'estTdeeSubDisplay', 'weeklyEffDisplay', 'shortTrendDisplay', 
            'waterIndexDisplay', 'netChangeDisplay', 'netChangeSubDisplay', 'consistencyDisplay', 'deficitDisplay', 'ffmiDisplay',
            'maDisparityDisplay', 'weightClassDisplay', 'recoveryScoreDisplay', 
            'plateauHelperText', 'yoyoRiskDisplay', 'recent3DayAvgDisplay', 'weeklySpeedDisplay', 'idealWeeklyRateDisplay',
            'bodyCompBalanceDisplay', 'lossConsistencyDisplay', 'calEfficiencyDisplay', 'volatilityIndexDisplay', 'bodyCompTrendDisplay',
            // [NEW] 지표 IDs
            'metabolicAgeDisplay', 'dietCostDisplay', 'weekendImpactDisplay', 
            // [NEW] 테이블 IDs
            'dailyWinRateTable', 'zoneDurationTable', 'streakDetailTable', 'bestWorstMonthTable',

            'advancedAnalysisList', 'calendarContainer', 'periodCompareTable', 'detailedStatsTable',
            'progressBarFill', 'progressEmoji', 'progressText', 'labelStart', 'labelGoal',
            'bmiProgressBarFill', 'bmiProgressEmoji', 'bmiProgressText', 'bmiLabelLeft', 'bmiLabelRight',
            'rate7Days', 'rate30Days', 'weeklyCompareDisplay', 'heatmapGrid', 'chartBackdrop',
            'monthlyTableBody', 'weeklyTableBody', 'milestoneTableBody', 'historyList',
            'tab-monthly', 'tab-weekly', 'tab-milestone', 'tab-history', 
            'btn-1m', 'btn-3m', 'btn-6m', 'btn-1y', 'btn-all', 'tab-btn-monthly', 'tab-btn-weekly', 'tab-btn-milestone', 'tab-btn-history', 'recordBtn'
        ];
        ids.forEach(id => AppState.el[id] = document.getElementById(id));
        
        AppState.el.dateInput.valueAsDate = new Date();
        
        try {
            AppState.records = JSON.parse(localStorage.getItem(AppState.STORAGE_KEY)) || [];
            const savedSettings = JSON.parse(localStorage.getItem(AppState.SETTINGS_KEY));
            if (savedSettings) AppState.settings = savedSettings;
        } catch (e) {
            console.error('Data Load Error', e);
            AppState.records = [];
        }

        AppState.chartFilterMode = localStorage.getItem(AppState.FILTER_KEY) || 'ALL';
        if(localStorage.getItem('diet_pro_dark_mode') === 'true') {
            document.body.classList.add('dark-mode');
        }

        AppState.el.userHeight.value = AppState.settings.height;
        AppState.el.startWeight.value = AppState.settings.startWeight;
        AppState.el.goal1Weight.value = AppState.settings.goal1;
        AppState.el.dailyIntake.value = AppState.settings.intake || 1862;

        if(AppState.records.length > 0) {
            AppState.state.calendarViewDate = DateUtil.parse(AppState.records[AppState.records.length-1].date);
        }

        // 이벤트 리스너 등록
        AppState.el.heatmapGrid.addEventListener('click', (e) => {
             if(e.target.classList.contains('heatmap-cell') && e.target.title) {
                 showToast(e.target.title);
             }
        });
        
        // 입력 편의성: Enter 키 처리
        const handleEnter = (e) => { if(e.key === 'Enter') addRecord(); };
        AppState.el.weightInput.addEventListener('keyup', handleEnter);
        AppState.el.fatInput.addEventListener('keyup', handleEnter);

        // 이벤트 위임 (히스토리 테이블)
        AppState.el.historyList.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const action = btn.dataset.action;
            const date = btn.dataset.date;
            if (action === 'edit') editRecord(date);
            else if (action === 'delete') deleteRecord(date);
        });

        updateFilterButtons();
        updateUI();
    }

    // --- 3. 기본 기능 (디바운스 적용 및 로컬 스토리지 최적화) ---
    const debouncedSaveRecords = debounce(() => {
        if (AppState.state.isDirty) {
            localStorage.setItem(AppState.STORAGE_KEY, JSON.stringify(AppState.records));
        }
    }, 500);

    const debouncedSaveSettings = debounce(() => {
        if (AppState.state.isDirty) {
            localStorage.setItem(AppState.SETTINGS_KEY, JSON.stringify(AppState.settings));
        }
    }, 500);

    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function toggleSettings() {
        const panel = AppState.el.settingsPanel;
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    }

    function toggleBadges() {
        const grid = AppState.el.badgeGrid;
        grid.style.display = grid.style.display === 'grid' ? 'none' : 'grid';
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('diet_pro_dark_mode', document.body.classList.contains('dark-mode'));
        // 차트 색상 완전 갱신을 위해 파괴 후 재생성
        Object.keys(AppState.charts).forEach(key => { 
            if(AppState.charts[key]) {
                AppState.charts[key].destroy(); 
                AppState.charts[key] = null;
            }
        });
        updateUI(); 
    }

    function saveSettings() {
        const height = parseFloat(AppState.el.userHeight.value);
        const startWeight = parseFloat(AppState.el.startWeight.value);
        const goal1 = parseFloat(AppState.el.goal1Weight.value);
        const intake = parseFloat(AppState.el.dailyIntake.value);

        // 설정값 유효성 검사 강화
        if (isNaN(height) || height <= 0 || height > 300) return showToast('유효한 키(cm)를 입력해주세요.');
        if (isNaN(startWeight) || startWeight <= 0 || startWeight > 500) return showToast('유효한 시작 체중을 입력해주세요.');
        if (isNaN(goal1) || goal1 <= 0 || goal1 > 500) return showToast('유효한 목표 체중을 입력해주세요.');

        AppState.settings.height = height;
        AppState.settings.startWeight = startWeight;
        AppState.settings.goal1 = goal1;
        AppState.settings.intake = intake || 2000;
        
        AppState.state.isDirty = true;
        debouncedSaveSettings();
        toggleSettings();
        updateUI();
        showToast('설정이 저장되었습니다.');
    }

    function addRecord() {
        const date = AppState.el.dateInput.value;
        const weight = parseFloat(AppState.el.weightInput.value);
        const fat = parseFloat(AppState.el.fatInput.value);

        if (!date) return showToast('날짜를 입력해주세요.');
        if (DateUtil.isFuture(date)) return showToast('미래 날짜는 입력할 수 없습니다.');
        
        if (isNaN(weight) || weight < CONFIG.LIMITS.MIN_WEIGHT || weight > CONFIG.LIMITS.MAX_WEIGHT) {
            return showToast(`유효한 체중을 입력해주세요 (${CONFIG.LIMITS.MIN_WEIGHT}~${CONFIG.LIMITS.MAX_WEIGHT}kg).`);
        }
        if (!isNaN(fat) && (fat < CONFIG.LIMITS.MIN_FAT || fat > CONFIG.LIMITS.MAX_FAT)) {
            return showToast(`유효한 체지방률을 입력해주세요 (${CONFIG.LIMITS.MIN_FAT}~${CONFIG.LIMITS.MAX_FAT}%).`);
        }

        const record = { date, weight: MathUtil.round(weight) };
        if (!isNaN(fat)) record.fat = MathUtil.round(fat);

        const existingIndex = AppState.records.findIndex(r => r.date === date);

        // 수정 모드 또는 신규 입력 시 중복 처리 로직 강화
        if (AppState.state.editingDate) {
            if (AppState.state.editingDate !== date) {
                // 날짜 변경 시
                if (existingIndex >= 0) {
                    if (!confirm(`${date}에 이미 기록이 있습니다. 덮어쓰시겠습니까?`)) return;
                    AppState.records = AppState.records.filter(r => r.date !== AppState.state.editingDate && r.date !== date);
                    AppState.records.push(record);
                } else {
                    AppState.records = AppState.records.filter(r => r.date !== AppState.state.editingDate);
                    AppState.records.push(record);
                }
            } else {
                // 날짜 동일, 데이터 업데이트
                AppState.records[existingIndex] = record;
            }
        } else {
            // 신규 입력
            if (existingIndex >= 0) {
                if(!confirm(`${date}에 이미 기록이 있습니다. 덮어쓰시겠습니까?`)) return;
                AppState.records[existingIndex] = record;
            } else {
                AppState.records.push(record);
            }
        }

        AppState.records.sort((a, b) => new Date(a.date) - new Date(b.date));
        AppState.state.isDirty = true;
        debouncedSaveRecords();
        
        resetForm(date); // 입력한 날짜를 전달하여 다음 날 자동 설정
        updateUI();
        showToast('기록이 저장되었습니다.');
    }

    function resetForm(lastDateStr = null) {
        if (lastDateStr) {
            // 편의성: 입력 후 다음 날짜로 자동 세팅
            AppState.el.dateInput.value = DateUtil.addDays(lastDateStr, 1);
        } else {
            AppState.el.dateInput.valueAsDate = new Date();
        }
        AppState.el.weightInput.value = '';
        AppState.el.fatInput.value = '';
        AppState.state.editingDate = null;
        AppState.el.recordBtn.innerText = '기록하기 📝';
        AppState.el.recordBtn.classList.remove('editing-mode');
        AppState.el.weightInput.focus();
    }

    function deleteRecord(date) {
        if(confirm('이 날짜의 기록을 삭제하시겠습니까?')) {
            AppState.records = AppState.records.filter(r => r.date !== date);
            AppState.state.isDirty = true;
            debouncedSaveRecords();
            updateUI();
            showToast('삭제되었습니다.');
        }
    }

    function editRecord(date) {
        const record = AppState.records.find(r => r.date === date);
        if (record) {
            AppState.el.dateInput.value = record.date;
            AppState.el.weightInput.value = record.weight;
            if (record.fat) AppState.el.fatInput.value = record.fat;
            else AppState.el.fatInput.value = '';
            
            AppState.state.editingDate = date; 
            AppState.el.recordBtn.innerText = '수정 완료 ✔️';
            AppState.el.recordBtn.classList.add('editing-mode');

            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast(`${date} 기록을 수정합니다.`);
            
            const inputGroup = AppState.el.recordInputGroup;
            inputGroup.classList.add('highlight');
            setTimeout(() => inputGroup.classList.remove('highlight'), 1000);
        }
    }

    function safeResetData() {
        if (AppState.el.resetConfirmInput.value === "초기화") {
            localStorage.removeItem(AppState.STORAGE_KEY);
            AppState.records = [];
            AppState.state.isDirty = true;
            AppState.el.resetConfirmInput.value = '';
            updateUI();
            showToast('초기화되었습니다.');
        } else {
            showToast('"초기화"라고 정확히 입력해주세요.');
        }
    }

    function importData() {
        const file = AppState.el.csvFileInput.files[0];
        if (!file) return showToast('파일을 선택해주세요.');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // BOM 제거 및 trim
            const content = e.target.result.trim().replace(/^\uFEFF/, '');
            
            if(file.name.endsWith('.json')) {
                try {
                    const data = JSON.parse(content);
                    if(data.records && Array.isArray(data.records)) {
                        AppState.records = data.records.filter(r => r.date && !isNaN(r.weight));
                        if(data.settings) AppState.settings = data.settings;
                        AppState.state.isDirty = true;
                        debouncedSaveRecords();
                        debouncedSaveSettings();
                        updateUI();
                        showToast('데이터 복원 완료');
                    } else {
                        throw new Error('올바르지 않은 JSON 형식');
                    }
                } catch(err) {
                    showToast('JSON 파일 오류: ' + err.message);
                }
                return;
            }

            // CSV 파싱 로직 개선 (쉼표 및 따옴표 처리)
            const lines = content.split(/\r?\n/);
            let count = 0;
            const csvRegex = /(?:^|,)(?:"([^"]*)"|([^",]*))/g;
            
            for(let i=0; i<lines.length; i++) {
                const line = lines[i].trim();
                if(!line || line.toLowerCase().startsWith('date')) continue; 
                
                const matches = [];
                let match;
                while ((match = csvRegex.exec(line)) !== null) {
                     matches.push(match[1] ? match[1] : match[2]);
                }
                
                if(matches.length >= 2) {
                    const d = matches[0].trim().replace(/['"]/g, ''); 
                    const w = parseFloat(matches[1]);
                    
                    if(d.match(/^\d{4}-\d{2}-\d{2}$/) && !isNaN(w)) {
                        const rec = { date: d, weight: w };
                        if(matches[2] && !isNaN(parseFloat(matches[2]))) {
                            rec.fat = parseFloat(matches[2]);
                        }
                        const idx = AppState.records.findIndex(r => r.date === d);
                        if(idx >= 0) AppState.records[idx] = rec;
                        else AppState.records.push(rec);
                        count++;
                    }
                }
                csvRegex.lastIndex = 0;
            }
            AppState.records.sort((a, b) => new Date(a.date) - new Date(b.date));
            AppState.state.isDirty = true;
            debouncedSaveRecords();
            updateUI();
            showToast(`${count}건의 데이터(CSV)를 불러왔습니다.`);
        };
        reader.readAsText(file);
    }

    function exportCSV() {
        if (AppState.records.length === 0) return showToast('내보낼 데이터가 없습니다.');
        let csvContent = "\uFEFFDate,Weight,BodyFat\n";
        AppState.records.forEach(row => {
            csvContent += `${row.date},${row.weight},${row.fat || ''}\n`;
        });
        downloadFile(csvContent, "diet_records.csv", "text/csv;charset=utf-8");
    }

    function exportJSON() {
        const data = {
            settings: AppState.settings,
            records: AppState.records,
            exportDate: new Date().toISOString()
        };
        downloadFile(JSON.stringify(data, null, 2), "diet_backup.json", "application/json");
    }

    function downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- 4. 메인 렌더링 함수 (updateUI - 최적화 적용) ---
    function updateUI() {
        if(AppState.state.isDirty) {
            AppState.state.statsCache = analyzeRecords(AppState.records);
            // 저장 로직은 debouncedSaveRecords에서 처리하므로 여기서는 flag 유지
            // 단, UI 렌더링을 위해 캐시는 갱신함.
        }
        const s = AppState.state.statsCache;
        
        renderStats(s);
        renderNewStats(s); 
        renderAnalysisText();
        renderAdvancedText(s); 
        renderPlateauHelper(s); // 신규 기능
        renderPeriodComparison(); // 신규 기능
        renderDetailedStats(s); // 신규 기능
        renderExtendedStats(); // [NEW] 확장 통계
        
        // 차트 업데이트 (재사용 및 업데이트 방식 개선)
        const colors = DomUtil.getChartColors();
        updateMainChart(colors);
        updateDayOfWeekChart(colors);
        updateHistogram(colors);
        updateCumulativeChart(colors);
        updateMonthlyChangeChart(colors);
        updateBodyFatChart(colors);
        updateScatterChart(colors); 
        updateWeekendChart(colors); 
        updateBodyCompStackedChart(colors); 
        updateMonthlyBoxPlotChart(colors); 
        updateRocChart(colors); 

        // 신규 차트 업데이트
        updateGhostRunnerChart(colors);
        updateGaugeCharts(colors);
        updateWeeklyBodyCompChart(colors); // 신규 차트
        updateWeightSpeedScatterChart(colors); // [NEW]
        // updateDietStyleRadarChart(colors); // [REMOVED]

        renderHeatmap();
        renderCalendarView(); 
        renderAllTables();
        renderBadges(s);

        // UI 갱신 후 dirty 상태 해제는 실제 저장 시점과 별개일 수 있으나
        // 로직 단순화를 위해 여기서 해제하지 않고 debouncedSaveRecords에 위임하거나
        // 저장 후 false로 변경해야 하나, 여기서는 저장이 비동기(debounce)이므로
        // 다음 입력 전까지는 변경사항이 반영된 상태로 유지.
        // *참고: isDirty 플래그는 저장 트리거용으로 사용됨.
    }

    // --- 5. 분석 계산 로직 (중복 연산 제거를 위한 통합) ---
    function analyzeRecords(records) {
        if (!records || records.length === 0) return {};
        
        const weights = records.map(r => r.weight);
        const current = weights[weights.length - 1];
        const min = Math.min(...weights);
        const max = Math.max(...weights);
        const lastRec = records[records.length - 1];
        
        let maxStreak = 0, curStreak = 0;
        let successCount = 0;
        let maxDrop = 0, maxGain = 0;
        let diffs = [];

        if (records.length > 1) {
            for (let i = 1; i < records.length; i++) {
                const diff = MathUtil.diff(records[i].weight, records[i-1].weight);
                diffs.push(diff);

                if (diff <= 0) curStreak++;
                else curStreak = 0;
                if (curStreak > maxStreak) maxStreak = curStreak;

                if (diff < 0) successCount++;

                const dayDiff = DateUtil.daysBetween(new Date(records[i-1].date), new Date(records[i].date));
                if (dayDiff === 1) {
                    if (diff < 0 && Math.abs(diff) > maxDrop) maxDrop = Math.abs(diff);
                    if (diff > 0 && diff > maxGain) maxGain = diff;
                }
            }
        }

        // --- 새로운 통계 계산 (추가된 부분) ---
        // 1. 최고/최저 체중일
        const maxRec = records.find(r => r.weight === max) || {};
        const minRec = records.find(r => r.weight === min) || {};
        
        // 2. 표준편차
        const stdDev = MathUtil.stdDev(weights);

        // 3. 체지방/제지방량 변화
        let fatChange = 0, lbmChange = 0;
        const firstFatRec = records.find(r => r.fat);
        const lastFatRec = [...records].reverse().find(r => r.fat);
        if(firstFatRec && lastFatRec) {
            const startFatKg = firstFatRec.weight * (firstFatRec.fat / 100);
            const endFatKg = lastFatRec.weight * (lastFatRec.fat / 100);
            fatChange = MathUtil.diff(endFatKg, startFatKg);
            
            const startLbmKg = firstFatRec.weight * (1 - firstFatRec.fat / 100);
            const endLbmKg = lastFatRec.weight * (1 - lastFatRec.fat / 100);
            lbmChange = MathUtil.diff(endLbmKg, startLbmKg);
        }

        // 4. 최장 정체기
        let maxPlateau = 0, curPlateau = 0;
        for(let i=1; i<records.length; i++) {
            if(Math.abs(MathUtil.diff(records[i].weight, records[i-1].weight)) < 0.2) curPlateau++;
            else curPlateau = 0;
            if(curPlateau > maxPlateau) maxPlateau = curPlateau;
        }

        return {
            current, min, max, maxStreak, lastRec, diffs,
            successRate: records.length > 1 ? Math.round((successCount / (records.length - 1)) * 100) : 0,
            maxDrop: MathUtil.round(maxDrop), 
            maxGain: MathUtil.round(maxGain),
            maxDate: maxRec.date, minDate: minRec.date,
            stdDev: stdDev,
            fatChange, lbmChange,
            maxPlateau
        };
    }

    // --- 6. 통계 렌더링 ---
    function renderStats(s) {
        const currentW = s.current !== undefined ? s.current : AppState.settings.startWeight;
        const totalLost = MathUtil.diff(AppState.settings.startWeight, currentW);
        
        AppState.el.currentWeightDisplay.innerText = currentW.toFixed(1) + 'kg';
        AppState.el.totalLostDisplay.innerText = `${totalLost}kg`;
        DomUtil.setTextColor(AppState.el.totalLostDisplay, totalLost > 0 ? 'primary' : (totalLost < 0 ? 'danger' : 'default'));

        let pct = 0;
        const totalGap = MathUtil.diff(AppState.settings.startWeight, AppState.settings.goal1);
        const currentGap = MathUtil.diff(AppState.settings.startWeight, currentW);
        if(Math.abs(totalGap) > 0.01) {
             pct = (currentGap / totalGap) * 100;
        }
        
        // 달성률 클램핑 (0~100)
        const displayPct = MathUtil.clamp(pct, 0, 100);
        AppState.el.progressPercent.innerText = displayPct.toFixed(1) + '%';
        
        const remaining = MathUtil.diff(currentW, AppState.settings.goal1);
        const remainingDisplay = AppState.el.remainingWeightDisplay;
        remainingDisplay.innerText = `${remaining > 0 ? remaining : 0}kg`;
        DomUtil.setTextColor(remainingDisplay, remaining <= 0 ? 'secondary' : 'default');

        let remainingPct = 0;
        if(totalGap !== 0) {
            remainingPct = (remaining / totalGap * 100);
            if(remainingPct < 0) remainingPct = 0;
        }
        AppState.el.remainingPercentDisplay.innerText = `${remainingPct.toFixed(1)}%`;

        const hMeter = AppState.settings.height / 100;
        const bmi = (currentW / (hMeter * hMeter)).toFixed(1);
        
        // BMI 기준 적용 (CONFIG.BMI 활용)
        let bmiLabel = '정상';
        if(bmi < CONFIG.BMI.UNDER) bmiLabel = '저체중';
        else if(bmi < CONFIG.BMI.NORMAL_END) bmiLabel = '정상';
        else if(bmi < CONFIG.BMI.PRE_OBESE_END) bmiLabel = '비만 전 단계 (과체중, 위험 체중)';
        else if(bmi < CONFIG.BMI.OBESE_1_END) bmiLabel = '1단계 비만';
        else if(bmi < CONFIG.BMI.OBESE_2_END) bmiLabel = '2단계 비만';
        else bmiLabel = '3단계 비만 (고도 비만)';
        
        AppState.el.bmiDisplay.innerText = `BMI: ${bmi} (${bmiLabel})`;
        updateBmiProgressBar(parseFloat(bmi), bmiLabel); // BMI 프로그레스바 업데이트

        const percentLost = ((AppState.settings.startWeight - currentW) / AppState.settings.startWeight * 100).toFixed(1);
        AppState.el.percentLostDisplay.innerText = `(시작 체중 대비 ${percentLost > 0 ? '-' : '+'}${Math.abs(percentLost)}%)`;

        updateProgressBar(currentW, totalLost, pct, remaining);

        AppState.el.streakDisplay.innerText = (s.maxStreak || 0) + '일';
        AppState.el.successRateDisplay.innerText = (s.successRate || 0) + '%';
        
        const pred = calculateScenarios(currentW);
        AppState.el.predictedDate.innerText = pred.avg;
        AppState.el.predictionRange.innerText = pred.range;
        
        AppState.el.rate7Days.innerText = getRate(7);
        AppState.el.rate30Days.innerText = getRate(30);
        AppState.el.dashboardRate7Days.innerText = getRate(7);
        AppState.el.dashboardRate30Days.innerText = getRate(30);
        AppState.el.weeklyCompareDisplay.innerText = getWeeklyComparison();

        AppState.el.minMaxWeightDisplay.innerHTML = `
            <span class="text-danger">${(s.max||0).toFixed(1)}kg</span> / 
            <span class="text-primary">${(s.min||0).toFixed(1)}kg</span>
        `;
        
        AppState.el.dailyVolatilityDisplay.innerHTML = `
            <span class="text-primary">▼${(s.maxDrop||0).toFixed(1)}</span> / 
            <span class="text-danger">▲${(s.maxGain||0).toFixed(1)}</span>
        `;

        AppState.el.weeklyAvgDisplay.innerText = calculateWeeklyAvg() + 'kg';
        
        const monComp = calculateMonthlyComparison();
        AppState.el.monthCompareDisplay.innerText = monComp;
        DomUtil.setTextColor(AppState.el.monthCompareDisplay, monComp.includes('▼') ? 'primary' : (monComp.includes('▲') ? 'danger' : 'default'));
    }

    function renderNewStats(s) {
        if(AppState.records.length === 0) return;

        const lastRec = s.lastRec;
        const currentW = lastRec.weight;

        // 신규 지표 1: 이동평균 괴리율
        if(AppState.records.length >= 7) {
            const last7 = AppState.records.slice(-7);
            const avg7 = last7.reduce((a,b)=>a+b.weight, 0) / 7;
            const disparity = MathUtil.diff(currentW, avg7);
            AppState.el.maDisparityDisplay.innerText = (disparity > 0 ? '+' : '') + disparity.toFixed(2) + 'kg';
            DomUtil.setTextColor(AppState.el.maDisparityDisplay, disparity > 0 ? 'danger' : 'primary');
        } else {
            AppState.el.maDisparityDisplay.innerText = '수집중';
        }

        // 신규 지표 2: 체급 표시
        const wClass = CONFIG.WEIGHT_CLASSES.find(c => currentW >= c.min);
        AppState.el.weightClassDisplay.innerText = wClass ? wClass.name : '미분류';

        // 신규 지표 3: 회복 탄력성 (Recovery Score)
        let recoveries = [];
        for(let i=1; i<AppState.records.length-1; i++) {
            const diff = MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight);
            if(diff >= 0.5) { // 0.5kg 이상 증량을 '치팅/스파이크'로 간주
                const baseWeight = AppState.records[i-1].weight;
                let daysToRecover = 0;
                for(let j=i+1; j<AppState.records.length; j++) {
                    daysToRecover++;
                    if(AppState.records[j].weight <= baseWeight) {
                        recoveries.push(daysToRecover);
                        break;
                    }
                }
            }
        }
        if(recoveries.length > 0) {
            const avgRec = recoveries.reduce((a,b)=>a+b, 0) / recoveries.length;
            AppState.el.recoveryScoreDisplay.innerText = avgRec.toFixed(1) + '일';
        } else {
            AppState.el.recoveryScoreDisplay.innerText = '-';
        }

        if(lastRec && lastRec.fat) {
            const lbm = lastRec.weight * (1 - lastRec.fat/100);
            const hMeter = AppState.settings.height / 100;
            const lbmi = lbm / (hMeter * hMeter);
            AppState.el.lbmDisplay.innerText = lbm.toFixed(1) + 'kg';
            AppState.el.lbmiDisplay.innerText = `LBMI: ${lbmi.toFixed(1)}`;
            
            // [NEW] 신체 나이 (Metabolic Age)
            // 가상 공식: 25 + (BMI-22)*2 + (체지방-20)*0.5 (매우 단순화된 예시)
            const bmiVal = currentW / (hMeter * hMeter);
            let metaAge = 25 + (bmiVal - 22) * 2 + (lastRec.fat - 20) * 0.5;
            if(metaAge < 18) metaAge = 18; 
            AppState.el.metabolicAgeDisplay.innerText = `약 ${Math.round(metaAge)}세`;
        } else {
            AppState.el.lbmDisplay.innerText = '-';
            AppState.el.lbmiDisplay.innerText = '체지방 입력 필요';
            AppState.el.metabolicAgeDisplay.innerText = '체지방 필요';
        }

        const startD = DateUtil.parse(AppState.records[0].date);
        const lastD = DateUtil.parse(lastRec.date);
        const dayDiff = Math.floor(DateUtil.daysBetween(startD, lastD));
        AppState.el.dDayDisplay.innerText = `Day ${dayDiff + 1}`;

        const recentRecs = AppState.records.slice(-14); 
        if(recentRecs.length > 2) {
            const first = recentRecs[0];
            const last = recentRecs[recentRecs.length-1];
            const days = DateUtil.daysBetween(DateUtil.parse(first.date), DateUtil.parse(last.date));
            if(days > 0) {
                const lossKg = MathUtil.diff(first.weight, last.weight);
                const dailyLoss = lossKg / days;
                const userIntake = AppState.settings.intake || 2000;
                const estimatedTdee = userIntake + (dailyLoss * 7700);
                AppState.el.estTdeeDisplay.innerText = `${Math.round(estimatedTdee)} kcal`;
                AppState.el.estTdeeSubDisplay.innerText = `(섭취 ${userIntake}kcal 가정)`;
                
                // 신규 지표: 칼로리 컷 효율
                if(AppState.el.calEfficiencyDisplay) {
                    const actualDeficit = dailyLoss * 7700;
                    const eff = (actualDeficit / estimatedTdee) * 100;
                    AppState.el.calEfficiencyDisplay.innerText = `${eff.toFixed(1)}%`;
                }
            } else {
                AppState.el.estTdeeDisplay.innerText = '-';
                if(AppState.el.calEfficiencyDisplay) AppState.el.calEfficiencyDisplay.innerText = '-';
            }
        } else {
            AppState.el.estTdeeDisplay.innerText = '데이터 수집중';
            if(AppState.el.calEfficiencyDisplay) AppState.el.calEfficiencyDisplay.innerText = '-';
        }

        const totalLost = MathUtil.diff(AppState.settings.startWeight, s.current);
        const totalDays = DateUtil.daysBetween(startD, lastD) || 1;
        const weeklyEff = (totalLost / totalDays) * 7;
        AppState.el.weeklyEffDisplay.innerText = `${weeklyEff.toFixed(2)} kg/주`;

        // [NEW] 다이어트 가성비 (Cost of Diet)
        if(totalLost > 0) {
            const cost = totalDays / totalLost;
            AppState.el.dietCostDisplay.innerText = `${cost.toFixed(1)}일/kg`;
        } else {
            AppState.el.dietCostDisplay.innerText = '-';
        }

        // [NEW] 주말 여파 지수 (Weekend Impact)
        const weekendImpacts = [];
        for(let i=1; i<AppState.records.length; i++) {
            const d = DateUtil.parse(AppState.records[i].date);
            if(d.getDay() === 1) { // 월요일
                // 이전 금요일 찾기 (3일전)
                const prevFriDate = new Date(d);
                prevFriDate.setDate(d.getDate() - 3);
                const prevFriStr = DateUtil.format(prevFriDate);
                const prevFriRec = AppState.records.find(r => r.date === prevFriStr);
                if(prevFriRec) {
                    weekendImpacts.push(AppState.records[i].weight - prevFriRec.weight);
                }
            }
        }
        if(weekendImpacts.length > 0) {
            const avgImpact = weekendImpacts.reduce((a,b)=>a+b,0) / weekendImpacts.length;
            const sign = avgImpact > 0 ? '+' : '';
            AppState.el.weekendImpactDisplay.innerText = `${sign}${avgImpact.toFixed(2)}kg`;
            DomUtil.setTextColor(AppState.el.weekendImpactDisplay, avgImpact > 0 ? 'danger' : 'primary');
        } else {
            AppState.el.weekendImpactDisplay.innerText = '-';
        }

        if(AppState.records.length >= 3) {
            const r3 = AppState.records[AppState.records.length-3];
            const r1 = AppState.records[AppState.records.length-1];
            const diff3 = MathUtil.diff(r1.weight, r3.weight);
            let msg = "안정";
            if(diff3 < -0.4) msg = "📉 급하락";
            else if(diff3 < 0) msg = "↘ 하락세";
            else if(diff3 > 0.4) msg = "📈 급상승";
            else if(diff3 > 0) msg = "↗ 상승세";
            
            AppState.el.shortTrendDisplay.innerText = msg;
            DomUtil.setTextColor(AppState.el.shortTrendDisplay, diff3 > 0 ? 'danger' : (diff3 < 0 ? 'primary' : 'default'));
            
            // 신규 지표: 최근 3일간 평균 변동량
            const avgDiff3 = diff3 / 2; // (오늘-그제) / 2일간
            if(AppState.el.recent3DayAvgDisplay) AppState.el.recent3DayAvgDisplay.innerText = `${(avgDiff3).toFixed(2)} kg/일`;
        } else {
            AppState.el.shortTrendDisplay.innerText = '-';
            if(AppState.el.recent3DayAvgDisplay) AppState.el.recent3DayAvgDisplay.innerText = '-';
        }

        if(AppState.records.length >= 7) {
             const last7 = AppState.records.slice(-7);
             const avg7 = last7.reduce((a,b)=>a+b.weight,0)/last7.length;
             const dev = MathUtil.diff(s.current, avg7);
             AppState.el.waterIndexDisplay.innerText = (dev > 0 ? '+' : '') + dev.toFixed(1) + 'kg';
             DomUtil.setTextColor(AppState.el.waterIndexDisplay, dev > 0.5 ? 'danger' : (dev < -0.5 ? 'primary' : 'default'));
             
             // 신규 지표: 체중 변화 속도 (주단위)
             const startW7 = last7[0].weight;
             const endW7 = last7[last7.length-1].weight;
             const wSpeed = MathUtil.diff(endW7, startW7);
             if(AppState.el.weeklySpeedDisplay) AppState.el.weeklySpeedDisplay.innerText = `${wSpeed.toFixed(2)} kg/주`;
             
             // 신규 지표: 체중 변동성 지수
             const stdDev7 = MathUtil.stdDev(last7.map(r=>r.weight));
             const volIdx = stdDev7 * 10; // 스케일링
             if(AppState.el.volatilityIndexDisplay) AppState.el.volatilityIndexDisplay.innerText = volIdx.toFixed(1);

             // 신규 지표: 요요 발생 가능성 (Yoyo Risk)
             let riskScore = 0;
             if(wSpeed < -1.5) riskScore += 40; // 주당 1.5kg 이상 급감
             else if(wSpeed < -1.0) riskScore += 20;
             if(stdDev7 > 0.5) riskScore += 30; // 변동성 큼
             if(dev > 1.0) riskScore += 30; // 최근 급증
             
             let riskLabel = '낮음';
             let riskColor = 'primary';
             if(riskScore >= 70) { riskLabel = '높음'; riskColor = 'danger'; }
             else if(riskScore >= 40) { riskLabel = '중간'; riskColor = 'accent'; }
             
             if(AppState.el.yoyoRiskDisplay) {
                 AppState.el.yoyoRiskDisplay.innerText = `${riskScore}점 (${riskLabel})`;
                 DomUtil.setTextColor(AppState.el.yoyoRiskDisplay, riskColor);
             }

        } else {
            AppState.el.waterIndexDisplay.innerText = '-';
            if(AppState.el.weeklySpeedDisplay) AppState.el.weeklySpeedDisplay.innerText = '-';
            if(AppState.el.volatilityIndexDisplay) AppState.el.volatilityIndexDisplay.innerText = '-';
            if(AppState.el.yoyoRiskDisplay) AppState.el.yoyoRiskDisplay.innerText = '-';
        }

        const startRecWithFat = AppState.records.find(r => r.fat);
        if(startRecWithFat && lastRec.fat) {
             const startFatKg = startRecWithFat.weight * (startRecWithFat.fat/100);
             const currFatKg = lastRec.weight * (lastRec.fat/100);
             const fatLoss = MathUtil.diff(startFatKg, currFatKg);
             
             const startLeanKg = startRecWithFat.weight * (1 - startRecWithFat.fat/100);
             const currLeanKg = lastRec.weight * (1 - lastRec.fat/100);
             const leanLoss = MathUtil.diff(startLeanKg, currLeanKg);
             
             const totalLoss = fatLoss + leanLoss;
             const fatRatio = totalLoss > 0 ? (fatLoss/totalLoss)*100 : 0;
             
             AppState.el.netChangeDisplay.innerText = `지방 ${fatLoss.toFixed(1)}kg 감량`;
             AppState.el.netChangeSubDisplay.innerText = `(감량분의 ${Math.round(fatRatio)}%가 지방)`;
             
             // 신규 지표: 체성분 균형 지수
             const balance = (currLeanKg / currFatKg).toFixed(2);
             if(AppState.el.bodyCompBalanceDisplay) AppState.el.bodyCompBalanceDisplay.innerText = `${balance} : 1`;
             
             // 신규 지표: 체성분 변화 추이
             if(AppState.el.bodyCompTrendDisplay) AppState.el.bodyCompTrendDisplay.innerText = `근육 ${leanLoss > 0 ? '-' : '+'}${Math.abs(leanLoss).toFixed(1)}kg`;
        } else {
             AppState.el.netChangeDisplay.innerText = '-';
             AppState.el.netChangeSubDisplay.innerText = '체지방 데이터 필요';
             if(AppState.el.bodyCompBalanceDisplay) AppState.el.bodyCompBalanceDisplay.innerText = '-';
             if(AppState.el.bodyCompTrendDisplay) AppState.el.bodyCompTrendDisplay.innerText = '-';
        }

        const now = new Date();
        const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(now.getDate()-30);
        const recentRecs30 = AppState.records.filter(r => DateUtil.parse(r.date) >= thirtyDaysAgo);
        const uniqueDays = new Set(recentRecs30.map(r => r.date)).size;
        const score = Math.min(100, Math.round((uniqueDays / 30) * 100));
        AppState.el.consistencyDisplay.innerText = `${score}%`;
        
        // 신규 지표: 감량 일관성 지수
        let lossDays = 0;
        if(recentRecs30.length > 1) {
            for(let i=1; i<recentRecs30.length; i++) {
                if(recentRecs30[i].weight < recentRecs30[i-1].weight) lossDays++;
            }
            const lossConsistency = (lossDays / (recentRecs30.length - 1)) * 100;
            if(AppState.el.lossConsistencyDisplay) AppState.el.lossConsistencyDisplay.innerText = `${lossConsistency.toFixed(0)}%`;
        } else {
            if(AppState.el.lossConsistencyDisplay) AppState.el.lossConsistencyDisplay.innerText = '-';
        }

        const remW = MathUtil.diff(s.current, AppState.settings.goal1);
        if(remW > 0) {
            const calToLose = remW * 7700;
            const daysToGoal = 90;
            const reqDeficit = Math.round(calToLose / daysToGoal);
            AppState.el.deficitDisplay.innerText = `-${reqDeficit} kcal/일`;
            
            // 신규 지표: 이상적인 주간 감량률
            const idealWeekly = (remW / (daysToGoal / 7)).toFixed(2);
            if(AppState.el.idealWeeklyRateDisplay) AppState.el.idealWeeklyRateDisplay.innerText = `-${idealWeekly} kg/주`;
        } else {
             AppState.el.deficitDisplay.innerText = '목표 달성!';
             if(AppState.el.idealWeeklyRateDisplay) AppState.el.idealWeeklyRateDisplay.innerText = '완료';
        }

        if(lastRec.fat) {
            const hMeter = AppState.settings.height/100;
            const lbm = lastRec.weight * (1 - lastRec.fat/100);
            const ffmi = lbm / (hMeter * hMeter);
            AppState.el.ffmiDisplay.innerText = ffmi.toFixed(1);
        } else {
             AppState.el.ffmiDisplay.innerText = '-';
        }
    }

	function renderAdvancedText(s) {
        if(AppState.records.length < 5) {
            AppState.el.advancedAnalysisList.innerHTML = '<li class="insight-item">데이터가 5개 이상 쌓이면 분석을 제공합니다.</li>';
            return;
        }

        let html = '';

        const dayDeltas = [0,0,0,0,0,0,0]; 
        const dayCounts = [0,0,0,0,0,0,0];
        for(let i=1; i<AppState.records.length; i++) {
            const d = DateUtil.parse(AppState.records[i].date).getDay();
            const diff = MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight);
            dayDeltas[d] += diff;
            dayCounts[d]++;
        }
        const dayAvgs = dayDeltas.map((sum, i) => dayCounts[i] ? sum/dayCounts[i] : 0);
        const bestDayIdx = dayAvgs.indexOf(Math.min(...dayAvgs));
        const worstDayIdx = dayAvgs.indexOf(Math.max(...dayAvgs));
        const dayNames = ['일','월','화','수','목','금','토'];
        
        html += `<li class="insight-item"><span class="insight-label">🧐 요일 승률:</span> 
            <strong>${dayNames[bestDayIdx]}요일</strong>에 가장 잘 빠지고, 
            <strong>${dayNames[worstDayIdx]}요일</strong>에 주의가 필요합니다.</li>`;

        // [NEW] 패턴 감지 (28일 주기)
        let cyclePattern = false;
        if(AppState.records.length > 60) {
            // 대략적인 로직: 28일 간격으로 증량 스파이크가 있는지 확인
            let spikeCount = 0;
            const reversed = [...AppState.records].reverse();
            for(let i=0; i<reversed.length-30; i+=28) {
                // 해당 구간 근처에서 증량이 있었는지 체크
                let hasGain = false;
                for(let j=0; j<5; j++) {
                    if(i+j+1 < reversed.length && reversed[i+j].weight > reversed[i+j+1].weight + 0.5) hasGain = true;
                }
                if(hasGain) spikeCount++;
            }
            if(spikeCount >= 2) cyclePattern = true;
        }
        if(cyclePattern) {
            html += `<li class="insight-item"><span class="insight-label">🔄 패턴 감지:</span> 
                "약 28일 주기로 체중이 일시적으로 증가하는 패턴이 감지됩니다. 자연스러운 현상이니 당황하지 마세요."</li>`;
        }

        // [NEW] 리바운드 경고
        if(AppState.records.length >= 3) {
            const last3 = AppState.records.slice(-3);
            const drop3 = last3[0].weight - last3[2].weight;
            if(drop3 >= 2.0) {
                html += `<li class="insight-item text-danger"><span class="insight-label">⚠️ 리바운드 경고:</span> 
                    "최근 급격한 감량(-${drop3.toFixed(1)}kg/3일)이 있었습니다. 통계적으로 이런 급감 후에는 48시간 내에 반등할 확률이 높습니다. 식단에 유의하세요."</li>`;
            }
        }

        // [NEW] 시즈널리티 분석
        const monthlyGains = {};
        for(let i=1; i<AppState.records.length; i++) {
            const m = DateUtil.parse(AppState.records[i].date).getMonth() + 1;
            const diff = AppState.records[i].weight - AppState.records[i-1].weight;
            if(!monthlyGains[m]) monthlyGains[m] = 0;
            monthlyGains[m] += diff;
        }
        let worstMonth = -1, maxVal = -999;
        Object.keys(monthlyGains).forEach(m => {
            if(monthlyGains[m] > maxVal) { maxVal = monthlyGains[m]; worstMonth = m; }
        });
        if(maxVal > 1.0) {
            html += `<li class="insight-item"><span class="insight-label">🍂 시즈널리티:</span> 
                "<strong>${worstMonth}월</strong>에 체중이 증가하는 경향이 있습니다. 해당 시기에 활동량 저하를 주의하세요."</li>`;
        }

        // 심층 분석 1: 치팅 데이 여파 분석
        const recoveries = [];
        for(let i=1; i<AppState.records.length; i++) {
            const diff = MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight);
            if(diff >= 0.4) {
                const spikeDay = DateUtil.parse(AppState.records[i].date).getDay();
                let found = false;
                for(let j=i+1; j<Math.min(i+7, AppState.records.length); j++) {
                    if(AppState.records[j].weight <= AppState.records[i-1].weight) {
                        const recoveryDay = DateUtil.parse(AppState.records[j].date).getDay();
                        recoveries.push({ spike: spikeDay, recovery: recoveryDay });
                        found = true; break;
                    }
                }
            }
        }
        if(recoveries.length > 0) {
            const counts = {};
            recoveries.forEach(r => {
                const key = `${dayNames[r.spike]}요일에 찐 살은 보통 ${dayNames[r.recovery]}요일`;
                counts[key] = (counts[key] || 0) + 1;
            });
            const bestPattern = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            html += `<li class="insight-item"><span class="insight-label">🍔 치팅 여파:</span> "${bestPattern}에 다 빠집니다."</li>`;
        }

        // 심층 분석 2: 최적 감량 구간 발견
        const zones = {};
        for(let i=10; i<AppState.records.length; i++) {
            const zone = Math.floor(AppState.records[i].weight);
            if(!zones[zone]) zones[zone] = [];
            const diff = MathUtil.diff(AppState.records[i-1].weight, AppState.records[i].weight);
            zones[zone].push(diff);
        }
        const zoneStats = Object.keys(zones).map(z => {
            return { zone: z, avg: zones[z].reduce((a,b)=>a+b,0)/zones[z].length };
        }).sort((a,b) => b.avg - a.avg);

        if(zoneStats.length >= 2) {
            const best = zoneStats[0];
            const worst = zoneStats[zoneStats.length-1];
            html += `<li class="insight-item"><span class="insight-label">📉 구간 분석:</span> 
                "${best.zone}kg대에서 가장 빠르게 감량되었습니다. ${worst.zone}kg대에서는 상대적으로 속도가 느려집니다."</li>`;
        }

        let maxPlateau = 0, currPlateau = 0;
        for(let i=1; i<AppState.records.length; i++) {
            const diff = Math.abs(MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight));
            if(diff < 0.2) currPlateau++;
            else currPlateau = 0;
            if(currPlateau > maxPlateau) maxPlateau = currPlateau;
        }
        if(maxPlateau >= 3) {
            html += `<li class="insight-item"><span class="insight-label">⏳ 최장 정체기:</span> 
                체중 변화가 거의 없던 최장 기간은 <strong>${maxPlateau}일</strong> 입니다.</li>`;
        }

        if(s.diffs && s.diffs.length > 0) {
            const mean = s.diffs.reduce((a,b)=>a+b,0)/s.diffs.length;
            const variance = s.diffs.reduce((a,b)=>a+Math.pow(b-mean,2),0)/s.diffs.length;
            const stdDev = Math.sqrt(variance);
            let volScore = Math.max(0, 100 - (stdDev * 50)); 
            let volMsg = volScore > 80 ? "매우 안정적" : (volScore > 50 ? "보통" : "롤러코스터 🎢");
            
            html += `<li class="insight-item"><span class="insight-label">🎢 요요 인덱스:</span> 
                변동성 점수 <strong>${Math.round(volScore)}점</strong> (${volMsg}) 입니다.</li>`;
        }

        const remaining = MathUtil.diff(s.current, AppState.settings.goal1);
        if(remaining > 0) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 30);
            
            let recentStartRecord = AppState.records.find(r => DateUtil.parse(r.date) >= cutoffDate);
            const useFullHistory = !recentStartRecord || 
                                  (AppState.records.indexOf(AppState.records[AppState.records.length-1]) - AppState.records.indexOf(recentStartRecord) < 3);

            if(useFullHistory) {
                recentStartRecord = AppState.records[0];
            }

            const rStartD = DateUtil.parse(recentStartRecord.date);
            const rLastD = DateUtil.parse(s.lastRec.date);
            const rDays = DateUtil.daysBetween(rStartD, rLastD) || 1;
            
            const currentSpeed = (recentStartRecord.weight - s.current) / rDays;

            if(currentSpeed > 0.01) {
                const daysCur = remaining / currentSpeed;
                
                // [NEW] 목표 달성일 신뢰도 구간 (단순화된 텍스트)
                const dTarget = new Date(); dTarget.setDate(dTarget.getDate() + daysCur);
                const dEarly = new Date(); dEarly.setDate(dEarly.getDate() + daysCur * 0.9);
                const dLate = new Date(); dLate.setDate(dLate.getDate() + daysCur * 1.1);
                
                html += `<li class="insight-item"><span class="insight-label">🎯 신뢰도 구간:</span> 
                    "현재 속도라면 90% 확률로 <strong>${DateUtil.format(dEarly)}</strong>에서 <strong>${DateUtil.format(dLate)}</strong> 사이에 목표를 달성합니다."</li>`;
            } 
        }

        const now = new Date();
        const thisMonthKey = now.toISOString().slice(0, 7);
        const thisMonthRecs = AppState.records.filter(r => r.date.startsWith(thisMonthKey));
        if(thisMonthRecs.length > 3) {
            const startW = thisMonthRecs[0].weight;
            const endW = thisMonthRecs[thisMonthRecs.length-1].weight;
            const loss = MathUtil.diff(startW, endW);
            const uniqueDays = new Set(thisMonthRecs.map(r => r.date)).size;
            const daysInMonth = now.getDate();
            const consistency = (uniqueDays / daysInMonth) * 100;
            
            let grade = 'C';
            if(loss > 2 && consistency > 80) grade = 'A+';
            else if(loss > 1 && consistency > 60) grade = 'B';
            else if(loss < 0) grade = 'D';

            html += `<li class="insight-item"><span class="insight-label">🗓️ 월간 성적표:</span>
                이번 달 성적은 <strong>${grade}</strong>입니다! (감량 ${loss.toFixed(1)}kg)</li>`;
        }

        if(AppState.records.length > 7) {
            const last7 = AppState.records.slice(-7);
            const totalDrop = MathUtil.diff(last7[0].weight, last7[last7.length-1].weight);
            if(totalDrop > 2.0) { 
                html += `<li class="insight-item text-danger"><span class="insight-label">🔄 요요 위험도 경고:</span>
                    최근 감량 속도가 너무 빠릅니다. 급격한 감량은 요요를 부를 수 있습니다.</li>`;
            }
        }

        if(AppState.records.length > 30) {
            let maxLoss30 = -999;
            let bestPeriod = '';
            for(let i=30; i<AppState.records.length; i++) {
                const prev = AppState.records[i-30];
                const curr = AppState.records[i];
                const diff = MathUtil.diff(prev.weight, curr.weight);
                if(diff > maxLoss30) {
                    maxLoss30 = diff;
                    bestPeriod = `${prev.date} ~ ${curr.date}`;
                }
            }
            if(maxLoss30 > 0) {
                 html += `<li class="insight-item"><span class="insight-label">🏆 베스트 퍼포먼스:</span>
                    <strong>${bestPeriod}</strong> 기간에 <strong>${maxLoss30.toFixed(1)}kg</strong> 감량한 기록이 있습니다.</li>`;
            }
        }

        AppState.el.advancedAnalysisList.innerHTML = html;
    }

    // --- 정체기 돌파 도우미 렌더링 (신규) ---
    function renderPlateauHelper(s) {
        if (!AppState.el.plateauHelperText) return;
        const recent = AppState.records.slice(-14); // 최근 2주
        if (recent.length < 7) {
            AppState.el.plateauHelperText.innerText = "데이터가 충분하지 않습니다. 7일 이상 기록해주세요.";
            return;
        }
        
        const weights = recent.map(r => r.weight);
        const max = Math.max(...weights);
        const min = Math.min(...weights);
        const diff = MathUtil.diff(max, min);
        
        let msg = "";
        if (diff < 0.5) {
            const tips = [
                "단백질 섭취량을 체중 1kg당 1.5g 이상으로 늘려보세요.",
                "하루 물 섭취량을 500ml 더 늘려보세요.",
                "운동 강도를 높이거나 루틴을 완전히 바꿔보세요.",
                "치팅밀이나 간식을 완전히 끊어보세요.",
                "수면 시간을 1시간 늘려보세요.",
                "간헐적 단식 시간을 2시간 더 늘려보세요."
            ];
            const tip = tips[Math.floor(Math.random() * tips.length)];
            msg = `🛑 <strong>정체기 감지!</strong> 최근 2주간 변화가 ${diff.toFixed(1)}kg 입니다.<br>💡 팁: ${tip}`;
        } else {
            const lastW = weights[weights.length-1];
            const firstW = weights[0];
            if (lastW < firstW) msg = "📉 현재 감량 흐름이 좋습니다! 이대로 유지하세요!";
            else msg = "📈 약간의 증량이 있지만, 일시적인 현상일 수 있습니다.";
        }
        AppState.el.plateauHelperText.innerHTML = msg;
    }

    // --- 기간별 기록 요약 및 비교 렌더링 (신규) ---
    function renderPeriodComparison() {
        if (!AppState.el.periodCompareTable) return;
        const now = new Date();
        const threeMonthsAgo = new Date(now); threeMonthsAgo.setMonth(now.getMonth() - 3);
        const oneYearAgo = new Date(now); oneYearAgo.setFullYear(now.getFullYear() - 1);
        
        const getStats = (startDate, endDate) => {
            const recs = AppState.records.filter(r => {
                const d = DateUtil.parse(r.date);
                return d >= startDate && d <= endDate;
            });
            if (recs.length < 2) return null;
            const avgW = recs.reduce((a,b) => a+b.weight, 0) / recs.length;
            const loss = MathUtil.diff(recs[0].weight, recs[recs.length-1].weight);
            const days = DateUtil.daysBetween(DateUtil.parse(recs[0].date), DateUtil.parse(recs[recs.length-1].date)) || 1;
            const speed = loss / days * 7; // 주간 속도
            return { avgW, loss, speed };
        };

        const currentStats = getStats(threeMonthsAgo, now);
        const pastStats = getStats(new Date(oneYearAgo.setMonth(oneYearAgo.getMonth()-3)), new Date(now.getFullYear()-1, now.getMonth(), now.getDate()));

        let html = "";
        if (currentStats) {
            html += `<tr><td>최근 3개월</td><td>${currentStats.avgW.toFixed(1)}</td><td>${currentStats.loss.toFixed(1)}</td><td>${currentStats.speed.toFixed(2)} kg/주</td></tr>`;
        } else {
            html += `<tr><td>최근 3개월</td><td colspan="3">데이터 부족</td></tr>`;
        }
        
        if (pastStats) {
            html += `<tr><td>작년 동기</td><td>${pastStats.avgW.toFixed(1)}</td><td>${pastStats.loss.toFixed(1)}</td><td>${pastStats.speed.toFixed(2)} kg/주</td></tr>`;
        } else {
             html += `<tr><td>작년 동기</td><td colspan="3">데이터 없음</td></tr>`;
        }
        AppState.el.periodCompareTable.innerHTML = html;
    }

    // --- 상세 통계 렌더링 (신규) ---
    function renderDetailedStats(s) {
        if (!AppState.el.detailedStatsTable) return;
        if (AppState.records.length < 2) {
            AppState.el.detailedStatsTable.innerHTML = "<tr><td colspan='2'>데이터 부족</td></tr>";
            return;
        }
        
        let html = "";
        html += `<tr><td>최고 체중 기록일</td><td>${s.maxDate} (${s.max}kg)</td></tr>`;
        html += `<tr><td>최저 체중 기록일</td><td>${s.minDate} (${s.min}kg)</td></tr>`;
        html += `<tr><td>체중 표준 편차</td><td>${s.stdDev.toFixed(2)}</td></tr>`;
        html += `<tr><td>체지방량 변화</td><td>${s.fatChange ? s.fatChange.toFixed(1) + 'kg' : '-'}</td></tr>`;
        html += `<tr><td>제지방량 변화</td><td>${s.lbmChange ? s.lbmChange.toFixed(1) + 'kg' : '-'}</td></tr>`;
        html += `<tr><td>최대 일일 감량</td><td>${s.maxDrop}kg</td></tr>`;
        html += `<tr><td>최대 일일 증량</td><td>${s.maxGain}kg</td></tr>`;
        html += `<tr><td>최장 정체기</td><td>${s.maxPlateau}일</td></tr>`;
        
        AppState.el.detailedStatsTable.innerHTML = html;
    }
    
    // --- [NEW] 확장 통계 렌더링 ---
    function renderExtendedStats() {
        if(AppState.records.length < 2) return;

        // 1. 요일별 승률 (Daily Win Rate)
        const winStats = [0,0,0,0,0,0,0]; // counts
        const totalStats = [0,0,0,0,0,0,0]; 
        const dayNames = ['일','월','화','수','목','금','토'];
        for(let i=1; i<AppState.records.length; i++) {
            const d = DateUtil.parse(AppState.records[i].date).getDay();
            if(AppState.records[i].weight < AppState.records[i-1].weight) winStats[d]++;
            totalStats[d]++;
        }
        let winHtml = "";
        dayNames.forEach((name, i) => {
            const rate = totalStats[i] > 0 ? (winStats[i] / totalStats[i] * 100).toFixed(0) : 0;
            winHtml += `<tr><td>${name}</td><td>${rate}% (${winStats[i]}/${totalStats[i]})</td></tr>`;
        });
        AppState.el.dailyWinRateTable.innerHTML = winHtml;

        // 2. 구간별 체류 시간 (Zone Duration)
        const zones = {};
        AppState.records.forEach(r => {
            const z = Math.floor(r.weight / 10) * 10;
            const key = `${z}kg대`;
            if(!zones[key]) zones[key] = 0;
            zones[key]++;
        });
        let zoneHtml = "";
        Object.keys(zones).sort().reverse().forEach(z => {
            zoneHtml += `<tr><td>${z}</td><td>${zones[z]}일</td></tr>`;
        });
        AppState.el.zoneDurationTable.innerHTML = zoneHtml;

        // 3. 연속 기록 상세
        let maxLossStreak = 0, currLossStreak = 0;
        let maxGainStreak = 0, currGainStreak = 0;
        let maxRecStreak = 0, currRecStreak = 0;
        let maxGap = 0;

        for(let i=1; i<AppState.records.length; i++) {
            const diff = AppState.records[i].weight - AppState.records[i-1].weight;
            const dayDiff = DateUtil.daysBetween(DateUtil.parse(AppState.records[i-1].date), DateUtil.parse(AppState.records[i].date));
            
            // 연속 기록
            if(dayDiff === 1) {
                currRecStreak++;
                if(currRecStreak > maxRecStreak) maxRecStreak = currRecStreak;
            } else {
                currRecStreak = 0;
                if(dayDiff > maxGap) maxGap = dayDiff;
            }

            // 감량/증량 스트릭
            if(diff < 0) {
                currLossStreak++; currGainStreak = 0;
                if(currLossStreak > maxLossStreak) maxLossStreak = currLossStreak;
            } else if(diff > 0) {
                currGainStreak++; currLossStreak = 0;
                if(currGainStreak > maxGainStreak) maxGainStreak = currGainStreak;
            } else {
                currLossStreak = 0; currGainStreak = 0;
            }
        }
        let streakHtml = `
            <tr><td>최장 연속 감량</td><td>${maxLossStreak}일</td></tr>
            <tr><td>최장 연속 증량</td><td>${maxGainStreak}일</td></tr>
            <tr><td>최장 연속 기록</td><td>${maxRecStreak}일</td></tr>
            <tr><td>최장 미기록(공백)</td><td>${maxGap}일</td></tr>
        `;
        AppState.el.streakDetailTable.innerHTML = streakHtml;

        // 4. 최고의 달 / 최악의 달
        const monthDiffs = {};
        for(let i=1; i<AppState.records.length; i++) {
            const key = AppState.records[i].date.substring(0, 7);
            const diff = AppState.records[i].weight - AppState.records[i-1].weight;
            if(!monthDiffs[key]) monthDiffs[key] = 0;
            monthDiffs[key] += diff;
        }
        const sortedMonths = Object.keys(monthDiffs).map(k => ({ m: k, v: monthDiffs[k] })).sort((a,b) => a.v - b.v);
        const best3 = sortedMonths.slice(0, 3);
        const worst3 = sortedMonths.slice().reverse().slice(0, 3);
        
        let bwHtml = "";
        for(let i=0; i<3; i++) {
            const best = best3[i];
            const worst = worst3[i];
            bwHtml += `<tr>
                <td>${i+1}위</td>
                <td>${best ? best.m + ' (' + best.v.toFixed(1) + 'kg)' : '-'}</td>
                <td>${worst ? worst.m + ' (+' + worst.v.toFixed(1) + 'kg)' : '-'}</td>
            </tr>`;
        }
        AppState.el.bestWorstMonthTable.innerHTML = bwHtml;
    }
	
    function updateProgressBar(current, lost, percent, remaining) {
        let visualPercent = percent;
        if(visualPercent < 0) visualPercent = 0;
        if(visualPercent > 100) visualPercent = 100;

        AppState.el.labelStart.innerText = `시작: ${AppState.settings.startWeight}kg`;
        AppState.el.labelGoal.innerText = `목표: ${AppState.settings.goal1}kg`;

        AppState.el.progressBarFill.style.width = `${visualPercent}%`;
        AppState.el.progressEmoji.style.right = `${visualPercent}%`;
        AppState.el.progressText.style.right = `${visualPercent}%`;

        const displayLost = Math.abs(lost).toFixed(1);
        const displayPercent = percent.toFixed(1);
        const safeRemain = remaining > 0 ? remaining : 0;
        
        let remainPercentVal = 100 - percent;
        if (safeRemain <= 0) remainPercentVal = 0;
        const displayRemainPercent = remainPercentVal.toFixed(1);

        let statusMsg = "";
        if (remaining <= 0) statusMsg = "🎉 목표 달성!";

        AppState.el.progressText.innerHTML = `
            <strong>${current.toFixed(1)}kg</strong> ${statusMsg}<br>
            감량: ${displayLost}kg (${displayPercent}%)<br>
            남은: ${safeRemain}kg (${displayRemainPercent}%)
        `;
    }

    function updateBmiProgressBar(bmi, label) {
        // BMI 스케일 설정 (10 ~ 35)
        const minScale = 10;
        const maxScale = 35;
        
        let pct = ((bmi - minScale) / (maxScale - minScale)) * 100;
        let visualPercent = MathUtil.clamp(pct, 0, 100);
        let rightPos = 100 - visualPercent;

        if (!AppState.el.bmiProgressBarFill) return;

        AppState.el.bmiLabelLeft.innerText = `BMI ${minScale}`;
        AppState.el.bmiLabelRight.innerText = `BMI ${maxScale}`;

        AppState.el.bmiProgressBarFill.style.width = `${visualPercent}%`;
        AppState.el.bmiProgressEmoji.style.right = `${rightPos}%`;
        AppState.el.bmiProgressText.style.right = `${rightPos}%`;

        AppState.el.bmiProgressText.innerHTML = `
            <strong>BMI ${bmi}</strong><br>
            ${label}
        `;
    }
    
    function renderAnalysisText() {
        if (AppState.records.length < 2) {
            AppState.el.analysisText.innerText = "데이터가 2개 이상 쌓이면 분석을 시작합니다. 화이팅!";
            return;
        }
        const last = AppState.records[AppState.records.length-1];
        const prev = AppState.records[AppState.records.length-2];
        const diff = MathUtil.diff(last.weight, prev.weight);
        
        if (diff < 0) AppState.el.analysisText.innerText = `어제보다 ${Math.abs(diff)}kg 빠졌습니다! 이대로 쭉 가봅시다! 🔥`;
        else if (diff > 0) AppState.el.analysisText.innerText = `약간 증량(${diff}kg)했지만 괜찮습니다. 장기적인 추세가 중요합니다.`;
        else AppState.el.analysisText.innerText = `체중 유지 중입니다. 꾸준함이 답입니다.`;
    }

    function calculateScenarios(currentW) {
        if(currentW <= AppState.settings.goal1) return { avg: "달성 완료! 🎉", range: "" };
        if(AppState.records.length < 5) return { avg: "데이터 수집 중...", range: "" };
        
        const recent = AppState.records.slice(-30);
        if(recent.length < 2) return { avg: "분석 중...", range: "" };

        const first = recent[0];
        const last = recent[recent.length-1];
        const days = DateUtil.daysBetween(new Date(first.date), new Date(last.date));
        const totalDiff = MathUtil.diff(first.weight, last.weight);
        const avgRate = totalDiff / (days || 1); 

        if(avgRate <= 0.001) return { avg: "증량/유지세 🤔", range: "식단 조절 필요" };

        const remain = MathUtil.diff(currentW, AppState.settings.goal1);
        const daysLeftAvg = Math.ceil(remain / avgRate);
        
        const fastRate = avgRate * 1.5; 
        const slowRate = avgRate * 0.7;

        const dAvg = new Date(); dAvg.setDate(dAvg.getDate() + daysLeftAvg);
        const dFast = new Date(); dFast.setDate(dFast.getDate() + Math.ceil(remain / fastRate));
        const dSlow = new Date(); dSlow.setDate(dSlow.getDate() + Math.ceil(remain / slowRate));

        const formatDate = (d) => `${d.getMonth()+1}/${d.getDate()}`;
        
        return {
            avg: `${formatDate(dAvg)} (${daysLeftAvg}일 후)`,
            range: `최적 ${formatDate(dFast)} ~ 보수 ${formatDate(dSlow)}`
        };
    }

    function calculateWeeklyAvg() {
        if(AppState.records.length < 2) return '-';
        const sorted = [...AppState.records];
        const weeks = {};
        sorted.forEach(r => {
            const d = DateUtil.parse(r.date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day == 0 ? -6 : 1);
            const monday = new Date(d.setDate(diff));
            monday.setHours(0,0,0,0);
            const key = monday.getTime();
            if(!weeks[key]) weeks[key] = [];
            weeks[key].push(r.weight);
        });
        
        const weekKeys = Object.keys(weeks).sort();
        if(weekKeys.length < 2) return '-';

        let totalLoss = 0;
        let count = 0;
        
        for(let i=1; i<weekKeys.length; i++) {
            const prevW = weeks[weekKeys[i-1]];
            const currW = weeks[weekKeys[i]];
            const prevAvg = prevW.reduce((a,b)=>a+b,0) / prevW.length;
            const currAvg = currW.reduce((a,b)=>a+b,0) / currW.length;
            totalLoss += (prevAvg - currAvg);
            count++;
        }
        
        if(count === 0) return '-';
        return (totalLoss / count).toFixed(2);
    }

    function calculateMonthlyComparison() {
        if(AppState.records.length === 0) return '-';
        const now = new Date();
        const thisMonthKey = now.toISOString().slice(0, 7);
        const lastMonthDate = new Date(); lastMonthDate.setMonth(now.getMonth()-1);
        const lastMonthKey = lastMonthDate.toISOString().slice(0, 7);

        const thisMonthRecs = AppState.records.filter(r => r.date.startsWith(thisMonthKey));
        const lastMonthRecs = AppState.records.filter(r => r.date.startsWith(lastMonthKey));

        if(thisMonthRecs.length === 0 || lastMonthRecs.length === 0) return '-';

        const avgThis = thisMonthRecs.reduce((a,b)=>a+b.weight,0)/thisMonthRecs.length;
        const avgLast = lastMonthRecs.reduce((a,b)=>a+b.weight,0)/lastMonthRecs.length;
        const diff = MathUtil.diff(avgThis, avgLast);
        
        return `${diff > 0 ? '▲' : '▼'} ${Math.abs(diff).toFixed(1)}kg`;
    }

    function getRate(d) {
        const now = new Date();
        now.setHours(0,0,0,0);
        const startTimestamp = now.getTime() - (d * 24 * 60 * 60 * 1000);
        
        const rel = AppState.records.filter(r => {
            const rd = DateUtil.parse(r.date);
            return rd.getTime() >= startTimestamp;
        });

        if(rel.length < 2) return "-";
        const diff = MathUtil.diff(rel[rel.length-1].weight, rel[0].weight);
        const days = DateUtil.daysBetween(DateUtil.parse(rel[0].date), DateUtil.parse(rel[rel.length-1].date));
        if(days===0) return "-";
        const g = ((diff/days)*1000).toFixed(0);
        return `${g > 0 ? '+' : ''}${g}g / 일`;
    }

    function getWeeklyComparison() {
        const now = new Date(); now.setHours(0,0,0,0);
        const t7 = now.getTime() - (7 * 24 * 60 * 60 * 1000);
        const t14 = now.getTime() - (14 * 24 * 60 * 60 * 1000);
        
        const thisW = AppState.records.filter(r => {
            const d = DateUtil.parse(r.date);
            return d.getTime() >= t7;
        });
        const lastW = AppState.records.filter(r => { 
            const d = DateUtil.parse(r.date);
            return d.getTime() >= t14 && d.getTime() < t7; 
        });
        
        if(thisW.length === 0 || lastW.length === 0) return "데이터 부족";
        
        const avgT = thisW.reduce((a,b)=>a+b.weight,0)/thisW.length;
        const avgL = lastW.reduce((a,b)=>a+b.weight,0)/lastW.length;
        const diff = MathUtil.diff(avgT, avgL);
        
        const icon = diff < 0 ? '🔻' : (diff > 0 ? '🔺' : '➖');
        return `${icon} ${Math.abs(diff)}kg`;
    }

    // --- 7. 차트 그리기 함수들 (렌더링 최적화 및 인스턴스 관리 개선) ---
    function updateFilterButtons() {
        AppState.el['btn-1m'].className = 'filter-btn' + (AppState.chartFilterMode==='1M'?' active':'');
        AppState.el['btn-3m'].className = 'filter-btn' + (AppState.chartFilterMode==='3M'?' active':'');
        AppState.el['btn-6m'].className = 'filter-btn' + (AppState.chartFilterMode==='6M'?' active':'');
        AppState.el['btn-1y'].className = 'filter-btn' + (AppState.chartFilterMode==='1Y'?' active':'');
        AppState.el['btn-all'].className = 'filter-btn' + (AppState.chartFilterMode==='ALL'?' active':'');
    }

    function setChartFilter(mode) {
        AppState.chartFilterMode = mode;
        localStorage.setItem(AppState.FILTER_KEY, mode);
        updateFilterButtons();
        updateUI(); 
    }

    function applyCustomDateRange() {
        const s = AppState.el.chartStartDate.value;
        const e = AppState.el.chartEndDate.value;
        if(s && e) {
            AppState.chartFilterMode = 'CUSTOM';
            AppState.customStart = s; AppState.customEnd = e;
            localStorage.setItem(AppState.FILTER_KEY, 'CUSTOM');
            document.querySelectorAll('.filter-group .filter-btn').forEach(b=>b.classList.remove('active'));
            updateUI();
        }
    }

    function getFilteredData() {
        if(AppState.records.length === 0) return [];
        let start = DateUtil.parse(AppState.records[0].date);
        let end = new Date(); end.setHours(23,59,59,999);
        const now = new Date(); now.setHours(0,0,0,0);

        if(AppState.chartFilterMode === '1M') { 
            start = new Date(now); start.setMonth(start.getMonth()-1); 
        } else if(AppState.chartFilterMode === '3M') { 
            start = new Date(now); start.setMonth(start.getMonth()-3); 
        } else if(AppState.chartFilterMode === '6M') { 
            start = new Date(now); start.setMonth(start.getMonth()-6);
        } else if(AppState.chartFilterMode === '1Y') { 
            start = new Date(now); start.setFullYear(start.getFullYear()-1);
        } else if(AppState.chartFilterMode === 'CUSTOM' && AppState.customStart) { 
            start = DateUtil.parse(AppState.customStart);
            end = DateUtil.parse(AppState.customEnd); end.setHours(23,59,59,999);
        }
        
        return AppState.records.filter(r => {
            const d = DateUtil.parse(r.date);
            return d >= start && d <= end;
        });
    }

    function createChartConfig(type, data, options, colors) {
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: colors.text }, grid: { color: colors.grid } },
                y: { ticks: { color: colors.text }, grid: { color: colors.grid } }
            }
        };
        if(options && options.scales) {
             if(options.scales.x) Object.assign(defaultOptions.scales.x, options.scales.x);
             if(options.scales.y) Object.assign(defaultOptions.scales.y, options.scales.y);
        }
        Object.assign(defaultOptions, options);
        return { type, data, options: defaultOptions };
    }

    // 차트 업데이트 헬퍼 (인스턴스 재사용 및 중복 생성 방지 강화)
    function updateChartHelper(key, ctx, config) {
        let chart = AppState.charts[key];
        const existingChartInstance = Chart.getChart(ctx);

        // 캔버스에 이미 다른 차트 인스턴스가 있거나, 참조가 꼬인 경우 정리
        if (existingChartInstance && existingChartInstance !== chart) {
            existingChartInstance.destroy();
            chart = null;
        }

        if (chart) {
            // 데이터와 옵션만 업데이트 (깜빡임 방지)
            chart.data = config.data;
            if (config.options) {
                // 옵션 깊은 병합 대신 최상위 레벨 교체 (안전성 확보)
                Object.assign(chart.options, config.options);
                // 스케일 옵션 등은 깊은 병합이 필요할 수 있으나 Chart.js update가 처리
            }
            chart.update();
        } else {
            AppState.charts[key] = new Chart(ctx, config);
        }
    }

    function updateMainChart(colors) {
        const ctx = document.getElementById('mainChart').getContext('2d');
        const data = getFilteredData();
        const showTrend = AppState.el.showTrend.checked;
        const points = data.map(r => ({ x: r.date, y: r.weight }));
        
        const h = AppState.settings.height / 100;
        // BMI 기준 상수 사용
        const w185 = CONFIG.BMI.UNDER * h * h;
        const w23 = CONFIG.BMI.NORMAL_END * h * h;
        const w25 = CONFIG.BMI.PRE_OBESE_END * h * h;
        
        const chartStart = points.length ? points[0].x : new Date();
        const chartEnd = points.length ? points[points.length-1].x : new Date();

        const trend = [];
        const upperBand = [];
        const lowerBand = [];

        if(showTrend) {
            for(let i=0; i<data.length; i++) {
                const currentDate = DateUtil.parse(data[i].date);
                const sevenDaysAgo = new Date(currentDate);
                sevenDaysAgo.setDate(currentDate.getDate() - 6);
                
                const windowData = AppState.records.filter(r => {
                    const d = DateUtil.parse(r.date);
                    return d >= sevenDaysAgo && d <= currentDate;
                });
                
                if(windowData.length > 0) {
                     const weights = windowData.map(r => r.weight);
                     const mean = weights.reduce((acc, cur) => acc + cur, 0) / weights.length;
                     trend.push({ x: data[i].date, y: mean });

                     const variance = weights.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / weights.length;
                     const stdDev = Math.sqrt(variance);
                     upperBand.push({ x: data[i].date, y: mean + (2 * stdDev) });
                     lowerBand.push({ x: data[i].date, y: mean - (2 * stdDev) });
                }
            }
        }

        const isDark = document.body.classList.contains('dark-mode');

        const datasets = [
             {
                label: '비만',
                data: [{x: chartStart, y: 150}, {x: chartEnd, y: 150}],
                fill: { target: {value: w25}, above: isDark ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)' },
                borderColor: 'transparent', pointRadius: 0
            },
            {
                label: '비만 전 단계',
                data: [{x: chartStart, y: w25}, {x: chartEnd, y: w25}],
                fill: { target: {value: w23}, above: isDark ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)' },
                borderColor: 'transparent', pointRadius: 0
            },
            {
                label: '정상',
                data: [{x: chartStart, y: w23}, {x: chartEnd, y: w23}],
                fill: { target: {value: w185}, above: isDark ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)' },
                borderColor: 'transparent', pointRadius: 0
            },
            {
                label: '체중',
                data: points,
                borderColor: colors.primary,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: false,
                tension: 0.1,
                pointRadius: 3
            },
            ...(showTrend ? [{
                label: '7일 추세',
                data: trend,
                borderColor: colors.secondary, 
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.4
            }, {
                label: 'Bollinger Upper',
                data: upperBand,
                borderColor: 'transparent',
                pointRadius: 0,
                fill: '+1', 
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            }, {
                label: 'Bollinger Lower',
                data: lowerBand,
                borderColor: 'transparent',
                pointRadius: 0
            }] : []),
            {
                label: '목표',
                data: data.length ? [{x: data[0].date, y: AppState.settings.goal1}, {x: data[data.length-1].date, y: AppState.settings.goal1}] : [],
                borderColor: colors.secondary,
                borderDash: [5,5],
                pointRadius: 0,
                borderWidth: 1
            }
        ];

        // 데이터셋 구조 변경 시 안전하게 재생성
        if (AppState.charts.main && AppState.charts.main.data.datasets.length !== datasets.length) {
            AppState.charts.main.destroy();
            AppState.charts.main = null;
        }

        const config = createChartConfig('line', { datasets }, {
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'day', displayFormats: { day: 'MM/dd' } }
                },
                y: {
                    max: points.length > 0 ? Math.ceil(Math.max(...points.map(p => p.y), AppState.settings.startWeight)) + 1 : AppState.settings.startWeight + 1,
                    suggestedMin: AppState.settings.goal1 - 2
                }
            },
            plugins: {
                tooltip: { mode: 'index', intersect: false },
                legend: {
                    labels: {
                        color: colors.text,
                        filter: function(item) { return !['비만', '비만 전 단계', '정상', 'Bollinger Upper', 'Bollinger Lower'].includes(item.text); }
                    }
                }
            }
        }, colors);

        updateChartHelper('main', ctx, config);
    }

    // 신규 그래프 1: 고스트 러너 (전월 대비 비교) - 날짜 매핑 오류 및 부동소수점 보정 수정
    function updateGhostRunnerChart(colors) {
        if(AppState.records.length === 0) return;
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastMonthYear = lastMonthDate.getFullYear();

        // 날짜 매핑 로직 개선: 존재하지 않는 날짜는 null 처리 (예: 2월 30일)
        const getMonthData = (m, y) => {
            const daysInMonth = DateUtil.getDaysInMonth(y, m);
            const data = new Array(31).fill(null); // X축은 항상 1~31일로 고정
            
            AppState.records.forEach(r => {
                const d = DateUtil.parse(r.date);
                if(d.getMonth() === m && d.getFullYear() === y) {
                    data[d.getDate() - 1] = r.weight;
                }
            });

            // 해당 월의 말일 이후의 데이터 인덱스는 null 유지 (차트 끊김 표현)
            return data.map((val, idx) => (idx < daysInMonth ? val : null));
        };

        const currentData = getMonthData(thisMonth, thisYear);
        const previousData = getMonthData(lastMonth, lastMonthYear);

        const ctx = document.getElementById('ghostRunnerChart').getContext('2d');
        const config = createChartConfig('line', {
            labels: Array.from({length: 31}, (_, i) => `${i+1}일`),
            datasets: [
                {
                    label: '이번 달',
                    data: currentData,
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                    borderWidth: 3,
                    tension: 0.3,
                    spanGaps: true
                },
                {
                    label: '지난달',
                    data: previousData,
                    borderColor: 'rgba(150, 150, 150, 0.3)',
                    backgroundColor: 'rgba(150, 150, 150, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: true,
                    tension: 0.3,
                    spanGaps: true
                }
            ]
        }, {}, colors);

        updateChartHelper('ghostRunner', ctx, config);
    }

    // 신규 그래프 2: 신호등 게이지 (BMI & 체지방) - CONFIG 기반 범위 적용
    function updateGaugeCharts(colors) {
        const lastRec = AppState.records[AppState.records.length - 1];
        if(!lastRec) return;

        const hMeter = AppState.settings.height / 100;
        const bmi = parseFloat((lastRec.weight / (hMeter * hMeter)).toFixed(1));
        const fat = lastRec.fat || 0;

		const createGauge = (id, val, max, ranges, chartKey) => {
			const ctx = document.getElementById(id).getContext('2d');
			const config = {
				type: 'doughnut',
				data: {
					datasets: [{
						data: [...ranges.map(r => r.size), 0],
						backgroundColor: [...ranges.map(r => r.color), 'transparent'],
						borderWidth: 0
					}]
				},
				options: {
					circumference: 180,
					rotation: 270,
					cutout: '75%',
					responsive: true,
					maintainAspectRatio: false,
					layout: { padding: { bottom: 10 } },
					plugins: {
						legend: { display: false },
						tooltip: { enabled: false }
					}
				},
				plugins: [{
					id: 'gaugeNeedle',
					afterDraw: (chart) => {
						const { ctx, chartArea: { width, height } } = chart;
						const meta = chart.getDatasetMeta(0);
						if (!meta.data[0]) return; 

						const outerRadius = meta.data[0].outerRadius;
						const centerX = meta.data[0].x;
						const centerY = meta.data[0].y;

						ctx.save();
						const total = ranges.reduce((a, b) => a + b.size, 0);
                        const ratio = Math.min(val, total) / total;
						const angle = Math.PI + (Math.PI * ratio);

						// 바늘 그리기
						ctx.translate(centerX, centerY);
						ctx.rotate(angle);
						ctx.beginPath();
						ctx.moveTo(0, -(outerRadius * 0.03)); 
						ctx.lineTo(outerRadius * 0.9, 0); 
						ctx.lineTo(0, (outerRadius * 0.03));
						ctx.closePath();
						ctx.fillStyle = colors.text;
						ctx.fill();
						ctx.restore();

						// 숫자 텍스트 표시
						const fontSize = Math.round(outerRadius * 0.22);
						ctx.font = `bold ${fontSize}px sans-serif`;
						ctx.fillStyle = colors.text;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						ctx.fillText(val, centerX, centerY - (outerRadius * 0.2));
					}
				}]
			};
			updateChartHelper(chartKey, ctx, config);
		};
		
        // BMI 게이지: CONFIG 상수를 활용하여 범위 동적 계산
        const bmiRanges = [
            { size: CONFIG.BMI.UNDER, color: '#90caf9' }, // 저체중
            { size: CONFIG.BMI.NORMAL_END - CONFIG.BMI.UNDER, color: '#a5d6a7' }, // 정상
            { size: CONFIG.BMI.PRE_OBESE_END - CONFIG.BMI.NORMAL_END, color: '#fff59d' }, // 비만 전
            { size: CONFIG.BMI.OBESE_1_END - CONFIG.BMI.PRE_OBESE_END, color: '#ffcc80' }, // 1단계
            { size: CONFIG.BMI.OBESE_2_END - CONFIG.BMI.OBESE_1_END, color: '#ef9a9a' }, // 2단계
            // 3단계는 나머지 여분으로 처리됨
        ];
        
        createGauge('gaugeBmiChart', bmi, 45, bmiRanges, 'gaugeBmi');

        // 체지방 게이지 (기존 유지)
        createGauge('gaugeFatChart', fat, 50, [
            { size: 15, color: '#a5d6a7' }, // 운동선수/슬림
            { size: 10, color: '#fff59d' }, // 일반
            { size: 10, color: '#ffcc80' }, // 높음
            { size: 15, color: '#ef9a9a' }  // 매우높음
        ], 'gaugeFat');
    }

    function updateDayOfWeekChart(colors) {
        if(AppState.records.length < 2) return;
        const sums = [0,0,0,0,0,0,0];
        const counts = [0,0,0,0,0,0,0];
        
        for(let i=1; i<AppState.records.length; i++) {
            const diff = MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight);
            const day = DateUtil.parse(AppState.records[i].date).getDay();
            sums[day] = MathUtil.add(sums[day], diff);
            counts[day]++;
        }
        
        const avgs = sums.map((s, i) => counts[i] ? s/counts[i] : 0);
        const ctx = document.getElementById('dayOfWeekChart').getContext('2d');
        const config = createChartConfig('bar', {
            labels: ['일','월','화','수','목','금','토'],
            datasets: [{
                label: '평균 변화(kg)',
                data: avgs,
                backgroundColor: avgs.map(v => v>0 ? CONFIG.COLORS.GAIN : '#c8e6c9'),
                borderColor: avgs.map(v => v>0 ? '#e57373':'#81c784'),
                borderWidth: 1
            }]
        }, { plugins: { legend: { display: false } } }, colors);

        updateChartHelper('dow', ctx, config);
    }

    function updateHistogram(colors) {
        if(AppState.records.length === 0) return;
        const weights = AppState.records.map(r => r.weight);
        const min = Math.floor(Math.min(...weights));
        const max = Math.ceil(Math.max(...weights));
        
        const labels = [];
        const data = [];
        for(let i=min; i<=max; i++) {
            labels.push(i + 'kg대');
            data.push(weights.filter(w => Math.floor(w) === i).length);
        }

        const ctx = document.getElementById('histogramChart').getContext('2d');
        const config = createChartConfig('bar', {
            labels: labels,
            datasets: [{
                label: '일수',
                data: data,
                backgroundColor: colors.secondary,
                borderRadius: 4
            }]
        }, { plugins: { legend: { display: false } } }, colors);

        updateChartHelper('hist', ctx, config);
    }

    function updateCumulativeChart(colors) {
        if(AppState.records.length === 0) return;
        const points = AppState.records.map(r => ({
            x: r.date,
            y: MathUtil.round(AppState.settings.startWeight - r.weight, 2)
        }));

        const ctx = document.getElementById('cumulativeChart').getContext('2d');
        const config = createChartConfig('line', {
            datasets: [{
                label: '누적 감량(kg)',
                data: points,
                borderColor: '#9C27B0',
                backgroundColor: 'rgba(156, 39, 176, 0.2)',
                fill: true,
                tension: 0.2,
                pointRadius: 1
            }]
        }, {
            scales: {
                x: { type: 'time', time: { unit: 'month' } },
                y: { beginAtZero: true }
            },
            plugins: { legend: { display: false } }
        }, colors);

        updateChartHelper('cumul', ctx, config);
    }

    function updateMonthlyChangeChart(colors) {
        if(AppState.records.length === 0) return;
        
        const months = {};
        AppState.records.forEach(r => {
            const key = r.date.substring(0, 7);
            if(!months[key]) months[key] = [];
            months[key].push(r.weight);
        });

        const labels = [];
        const data = [];
        const bgColors = [];

        Object.keys(months).sort().forEach(m => {
            const arr = months[m];
            const change = MathUtil.diff(arr[arr.length-1], arr[0]); 
            labels.push(m);
            data.push(change);
            bgColors.push(change > 0 ? CONFIG.COLORS.GAIN : CONFIG.COLORS.LOSS);
        });

        const ctx = document.getElementById('monthlyChangeChart').getContext('2d');
        const config = createChartConfig('bar', {
            labels: labels,
            datasets: [{
                label: '월별 변화(kg)',
                data: data,
                backgroundColor: bgColors,
                borderWidth: 0
            }]
        }, {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }, colors);

        updateChartHelper('monthly', ctx, config);
    }

    function updateBodyFatChart(colors) {
        const fatData = AppState.records.filter(r => r.fat).map(r => ({ x: r.date, y: r.fat }));
        if(fatData.length === 0) return;

        const ctx = document.getElementById('bodyFatChart').getContext('2d');
        const config = createChartConfig('line', {
            datasets: [{
                label: '체지방률(%)',
                data: fatData,
                borderColor: '#FF5722',
                backgroundColor: 'rgba(255, 87, 34, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 2
            }]
        }, {
            scales: { x: { type: 'time', time: { unit: 'month' } } },
            plugins: { legend: { display: false } }
        }, colors);

        updateChartHelper('fat', ctx, config);
    }

    function updateScatterChart(colors) {
        const data = AppState.records.filter(r => r.fat).map(r => ({ x: r.weight, y: r.fat }));
        if(data.length === 0) return;

        const ctx = document.getElementById('scatterChart').getContext('2d');
        const config = createChartConfig('scatter', {
            datasets: [{
                label: '체중(kg) vs 체지방(%)',
                data: data,
                backgroundColor: colors.secondary
            }]
        }, {
            scales: {
                x: { title: { display: true, text: '체중 (kg)' } },
                y: { title: { display: true, text: '체지방 (%)' } }
            }
        }, colors);

        updateChartHelper('scatter', ctx, config);
    }

    function updateWeekendChart(colors) {
        if(AppState.records.length < 2) return;
        const weekdayDeltas = [], weekendDeltas = [];
        
        for(let i=1; i<AppState.records.length; i++) {
            const d = DateUtil.parse(AppState.records[i].date).getDay();
            const diff = MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight);
            if(d === 0 || d === 6) weekendDeltas.push(diff);
            else weekdayDeltas.push(diff);
        }

        const avgWeekday = weekdayDeltas.length ? weekdayDeltas.reduce((a,b)=>a+b,0)/weekdayDeltas.length : 0;
        const avgWeekend = weekendDeltas.length ? weekendDeltas.reduce((a,b)=>a+b,0)/weekendDeltas.length : 0;

        const chartData = [avgWeekday, avgWeekend];

        const ctx = document.getElementById('weekendChart').getContext('2d');
        const config = createChartConfig('bar', {
            labels: ['평일 (월~금)', '주말 (토~일)'],
            datasets: [{
                label: '평균 변화량 (kg)',
                data: chartData,
                backgroundColor: [colors.primary, colors.danger],
                barThickness: 50
            }]
        }, { plugins: { legend: { display: false } } }, colors);

        updateChartHelper('weekend', ctx, config);
    }

    function updateBodyCompStackedChart(colors) {
        const fatRecs = AppState.records.filter(r => r.fat);
        if(fatRecs.length < 2) return;

        const fatKg = fatRecs.map(r => ({ x: r.date, y: r.weight * (r.fat/100) }));
        const leanKg = fatRecs.map(r => ({ x: r.date, y: r.weight * (1 - r.fat/100) }));

        const ctx = document.getElementById('bodyCompStackedChart').getContext('2d');
        const config = createChartConfig('line', {
            datasets: [
                {
                    label: '제지방량 (kg)',
                    data: leanKg,
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(76, 175, 80, 0.5)',
                    fill: true
                },
                {
                    label: '체지방량 (kg)',
                    data: fatKg,
                    borderColor: colors.danger,
                    backgroundColor: 'rgba(244, 67, 54, 0.5)',
                    fill: true
                }
            ]
        }, {
            scales: {
                x: { type: 'time', time: { unit: 'month' } },
                y: { stacked: true }
            }
        }, colors);

        updateChartHelper('bodyComp', ctx, config);
    }

    // 신규 차트: 주간별 체성분 변화 누적 차트
    function updateWeeklyBodyCompChart(colors) {
        const fatRecs = AppState.records.filter(r => r.fat);
        if(fatRecs.length < 2) return;
        
        const weeks = {};
        fatRecs.forEach(r => {
            const d = DateUtil.parse(r.date);
            const day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1);
            const monday = new Date(d.setDate(diff));
            const key = DateUtil.format(monday);
            // 해당 주차의 마지막 기록을 사용
            weeks[key] = {
                lbm: r.weight * (1 - r.fat/100),
                fat: r.weight * (r.fat/100)
            };
        });
        
        const labels = Object.keys(weeks).sort();
        const lbmData = labels.map(k => weeks[k].lbm);
        const fatData = labels.map(k => weeks[k].fat);
        
        const ctx = document.getElementById('weeklyBodyCompChart').getContext('2d');
        const config = createChartConfig('bar', {
            labels: labels,
            datasets: [
                {
                    label: '제지방량 (kg)',
                    data: lbmData,
                    backgroundColor: colors.primary,
                    stack: 'Stack 0'
                },
                {
                    label: '체지방량 (kg)',
                    data: fatData,
                    backgroundColor: colors.danger,
                    stack: 'Stack 0'
                }
            ]
        }, {
            scales: { x: { display: false }, y: { stacked: true } },
            plugins: { legend: { display: true } }
        }, colors);
        
        updateChartHelper('weeklyBodyComp', ctx, config);
    }
    
    // [NEW] 체중 vs 감량 속도 상관관계 차트
    function updateWeightSpeedScatterChart(colors) {
        if(AppState.records.length < 2) return;
        const data = [];
        for(let i=1; i<AppState.records.length; i++) {
            const diff = AppState.records[i-1].weight - AppState.records[i].weight; // 감량량이 양수
            data.push({ x: AppState.records[i-1].weight, y: diff });
        }
        
        const ctx = document.getElementById('weightSpeedScatterChart').getContext('2d');
        const config = createChartConfig('scatter', {
            datasets: [{
                label: '체중(kg) vs 감량속도(kg/일)',
                data: data,
                backgroundColor: colors.secondary
            }]
        }, {
            scales: {
                x: { title: { display: true, text: '체중 (kg)' } },
                y: { title: { display: true, text: '일일 감량량 (kg)' } }
            }
        }, colors);
        updateChartHelper('weightSpeedScatter', ctx, config);
    }

    function updateMonthlyBoxPlotChart(colors) {
        if(AppState.records.length === 0) return;
        
        const months = {};
        AppState.records.forEach(r => {
            const key = r.date.substring(0, 7);
            if(!months[key]) months[key] = [];
            months[key].push(r.weight);
        });

        const labels = Object.keys(months).sort();
        const barData = []; 
        const scatterData = []; 

        labels.forEach(m => {
            const arr = months[m];
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            arr.sort((a,b)=>a-b);
            const median = arr[Math.floor(arr.length/2)];
            
            barData.push([min, max]);
            scatterData.push(median);
        });

        const ctx = document.getElementById('monthlyBoxPlotChart').getContext('2d');
        const config = createChartConfig('bar', {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: '범위 (Min-Max)',
                    data: barData,
                    backgroundColor: 'rgba(33, 150, 243, 0.3)',
                    borderColor: colors.secondary,
                    borderWidth: 1,
                    barPercentage: 0.5
                },
                {
                    type: 'line',
                    label: '중앙값',
                    data: scatterData,
                    borderColor: colors.text,
                    backgroundColor: colors.text,
                    borderWidth: 0,
                    pointRadius: 4,
                    pointStyle: 'rectRot'
                }
            ]
        }, { scales: { y: { beginAtZero: false } } }, colors);

        updateChartHelper('boxPlot', ctx, config);
    }

    function updateRocChart(colors) {
        if(AppState.records.length < 2) return;
        const data = [];
        for(let i=1; i<AppState.records.length; i++) {
            data.push({
                x: AppState.records[i].date,
                y: MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight)
            });
        }

        const ctx = document.getElementById('rocChart').getContext('2d');
        const config = createChartConfig('line', {
            datasets: [{
                label: '일일 변화량 (kg)',
                data: data,
                borderColor: colors.text,
                borderWidth: 1,
                pointRadius: 1,
                segment: {
                    borderColor: ctx => ctx.p0.parsed.y > 0 ? colors.danger : colors.primary
                }
            }]
        }, {
            scales: { x: { type: 'time', time: { unit: 'day' } } },
            plugins: { legend: { display: false } }
        }, colors);

        updateChartHelper('roc', ctx, config);
    }

    // --- 8. 테이블 & 히트맵 & 캘린더 & 뱃지 렌더링 ---
    function renderHeatmap() {
        const container = AppState.el.heatmapGrid;
        container.innerHTML = '';
        if(AppState.records.length === 0) return;

        const deltaMap = {};
        for(let i=1; i<AppState.records.length; i++) {
            const diff = MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight);
            deltaMap[AppState.records[i].date] = diff;
        }

        const end = new Date();
        const start = new Date(); start.setFullYear(start.getFullYear()-1);
        
        for(let d=start; d<=end; d.setDate(d.getDate()+1)) {
            const dateStr = DateUtil.format(d);
            const div = document.createElement('div');
            
            // CSS 클래스로 스타일 제어
            let levelClass = 'level-0';
            let titleText = dateStr;

            if(deltaMap[dateStr] !== undefined) {
                const val = deltaMap[dateStr];
                titleText += ` (${val>0?'+':''}${val.toFixed(1)}kg)`;
                
                if(val > 0) levelClass = 'level-gain';
                else if(val > -0.1) levelClass = 'level-1';
                else if(val > -0.3) levelClass = 'level-2';
                else if(val > -0.5) levelClass = 'level-3';
                else levelClass = 'level-4';
            }
            
            div.className = `heatmap-cell ${levelClass}`;
            div.title = titleText;
            container.appendChild(div);
        }
    }

    function changeCalendarMonth(offset) {
        const d = AppState.state.calendarViewDate;
        AppState.state.calendarViewDate = new Date(d.getFullYear(), d.getMonth() + offset, 1);
        renderCalendarView();
    }

    function jumpToCalendarDate() {
        const year = parseInt(document.getElementById('calYearSelect').value);
        const month = parseInt(document.getElementById('calMonthSelect').value);
        AppState.state.calendarViewDate = new Date(year, month, 1);
        renderCalendarView();
    }

    function renderCalendarView() {
        const container = AppState.el.calendarContainer;
        if(AppState.records.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-light);">데이터가 없습니다.</p>';
            return;
        }
        
        const viewDate = AppState.state.calendarViewDate;
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const dayMap = {};
        AppState.records.forEach(r => {
            const rd = DateUtil.parse(r.date);
            if(rd.getFullYear() === year && rd.getMonth() === month) {
                dayMap[rd.getDate()] = r.weight;
            }
        });

        let html = `<div class="calendar-header">
            <button onclick="App.changeCalendarMonth(-1)">◀ 이전달</button>
            <div>
                <select id="calYearSelect" onchange="App.jumpToCalendarDate()">`;
        const currentYear = new Date().getFullYear();
        for(let y=currentYear-5; y<=currentYear+1; y++) {
            html += `<option value="${y}" ${y===year?'selected':''}>${y}년</option>`;
        }
        html += `</select>
                <select id="calMonthSelect" onchange="App.jumpToCalendarDate()">`;
        for(let m=0; m<12; m++) {
            html += `<option value="${m}" ${m===month?'selected':''}>${m+1}월</option>`;
        }
        html += `</select>
            </div>
            <button onclick="App.changeCalendarMonth(1)">다음달 ▶</button>
        </div>`;
        
        html += `<div class="calendar-grid">`;
        
        const days = ['일','월','화','수','목','금','토'];
        days.forEach(d => html += `<div class="calendar-cell" style="font-weight:bold;background:var(--heatmap-empty);border:none;">${d}</div>`);
        
        for(let i=0; i<firstDay.getDay(); i++) html += `<div class="calendar-cell" style="background:transparent;border:none;"></div>`;
        
        for(let d=1; d<=lastDay.getDate(); d++) {
            const weight = dayMap[d];
            let cls = 'calendar-cell';
            let diffHtml = '';
            
            const currentDateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const targetIdx = AppState.records.findIndex(r => r.date === currentDateStr);
            
            if(targetIdx > 0 && AppState.records[targetIdx] && AppState.records[targetIdx-1]) {
                const currentW = AppState.records[targetIdx].weight;
                const prevW = AppState.records[targetIdx-1].weight;
                const diff = MathUtil.diff(currentW, prevW);
                if(diff > 0) cls += ' gain';
                if(diff < 0) cls += ' loss';
                diffHtml = `<div class="calendar-val">${diff>0?'+':''}${diff.toFixed(1)}</div>`;
            }

            html += `<div class="${cls}">
                <div class="calendar-date">${d}</div>
                <div class="calendar-val" style="font-weight:bold;">${weight ? weight : '-'}</div>
                ${diffHtml}
            </div>`;
        }
        html += `</div>`;
        container.innerHTML = html;
    }

    function renderAllTables() {
        renderMonthlyTable();
        renderWeeklyTable();
        renderMilestoneTable();
        renderHistoryTable();
    }

    function renderMonthlyTable() {
        const months = {};
        AppState.records.forEach(r => {
            const key = r.date.substring(0, 7);
            if(!months[key]) months[key] = [];
            months[key].push(r.weight);
        });
        
        let html = '';
        Object.keys(months).sort().reverse().forEach(m => {
            const arr = months[m];
            const start = arr[0];
            const end = arr[arr.length-1];
            const diff = MathUtil.diff(end, start);
            const avg = (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1);
            html += `<tr><td>${DomUtil.escapeHtml(m)}</td><td>${start}</td><td>${end}</td><td class="${diff<=0?'neg':'pos'}">${diff}</td><td>${avg}</td></tr>`;
        });
        AppState.el.monthlyTableBody.innerHTML = html;
    }

    function renderWeeklyTable() {
        const weeks = {};
        AppState.records.forEach(r => {
            const d = DateUtil.parse(r.date);
            const day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1); 
            const monday = new Date(d.setDate(diff));
            const key = DateUtil.format(monday);
            
            if(!weeks[key]) weeks[key] = [];
            weeks[key].push(r.weight);
        });

        let html = '';
        Object.keys(weeks).sort().reverse().forEach(w => {
            const arr = weeks[w];
            const avg = (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1);
            const diff = MathUtil.diff(arr[arr.length-1], arr[0]);
            html += `<tr><td>${DomUtil.escapeHtml(w)} 주</td><td>${avg}kg</td><td class="${diff<=0?'neg':'pos'}">${diff}</td></tr>`;
        });
        AppState.el.weeklyTableBody.innerHTML = html;
    }

    function renderMilestoneTable() {
        let html = '';
        if(AppState.records.length > 0) {
            let currentInt = Math.floor(AppState.records[0].weight);
            let startDate = DateUtil.parse(AppState.records[0].date);
            
            for(let i=1; i<AppState.records.length; i++) {
                const w = Math.floor(AppState.records[i].weight);
                if(w < currentInt) {
                    const nowD = DateUtil.parse(AppState.records[i].date);
                    const days = Math.ceil((nowD - startDate)/(1000*3600*24));
                    html += `<tr><td>🎉 ${w}kg대 진입</td><td>${DomUtil.escapeHtml(AppState.records[i].date)}</td><td>${days}일 소요</td></tr>`;
                    currentInt = w;
                    startDate = nowD;
                }
            }
        }
        AppState.el.milestoneTableBody.innerHTML = html || '<tr><td colspan="3">아직 기록된 마일스톤이 없습니다.</td></tr>';
    }

    function renderHistoryTable() {
        let html = '';
        const rev = [...AppState.records].reverse();
        rev.forEach(r => {
            const idx = AppState.records.findIndex(o => o.date === r.date);
            let diffStr = '-';
            let cls = '';
            if(idx > 0) {
                const d = MathUtil.diff(r.weight, AppState.records[idx-1].weight);
                diffStr = (d>0?'+':'') + d.toFixed(1);
                cls = d>0?'pos':(d<0?'neg':'');
            }
            const fatStr = r.fat ? r.fat + '%' : '-';
            html += `<tr>
                        <td>${DomUtil.escapeHtml(r.date)}</td>
                        <td>${r.weight}kg</td>
                        <td>${DomUtil.escapeHtml(fatStr)}</td>
                        <td class="${cls}">${diffStr}</td>
                        <td>
                            <button data-action="edit" data-date="${r.date}" style="border:none;background:none;cursor:pointer;" title="수정">✏️</button>
                            <button data-action="delete" data-date="${r.date}" style="border:none;background:none;cursor:pointer;" title="삭제">🗑️</button>
                        </td>
                     </tr>`;
        });
        AppState.el.historyList.innerHTML = html;
    }

    function renderBadges(s) {
        if(AppState.records.length === 0) return;
        const totalLost = MathUtil.diff(AppState.settings.startWeight, s.current);
        const streak = s.maxStreak || 0;

        const flags = {
            weekendDef: false,
            plateauBreak: false,
            bmiBreak: false,
            yoyoPrev: false,
            ottogi: false,
            recordGod: AppState.records.length >= 365,
            goldenCross: false,
            fatDestroyer: false,
            holidaySurvivor: false,
            returnProdigal: false,
            sniper: false,
            rollerCoaster: false,
            equanimity: false,
            plateauMaster: false,
            recordMaster: false,
            reborn: false,
            slowSteady: false,
            weightExpert: false,
            plateauDestroyer: false,
            iconOfConstancy: false,
            // [NEW]
            bigStep: false,
            phoenix: false,
            weekendRuler: false,
            curiosity: false,
            timeTraveler: false
        };

        if(AppState.records.length > 1) {
            // Sniper
            if(Math.abs(s.current - AppState.settings.goal1) < 0.01) flags.sniper = true;

            // Roller Coaster
            for(let i=1; i<AppState.records.length; i++) {
                const diff = Math.abs(MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight));
                if(diff >= 1.5) {
                    const days = DateUtil.daysBetween(DateUtil.parse(AppState.records[i-1].date), DateUtil.parse(AppState.records[i].date));
                    if(days === 1) { flags.rollerCoaster = true; break; }
                }
            }

            // Equanimity
            if(AppState.records.length >= 7) {
                for(let i=6; i<AppState.records.length; i++) {
                    const slice = AppState.records.slice(i-6, i+1);
                    const diffs = [];
                    for(let j=1; j<slice.length; j++) diffs.push(Math.abs(slice[j].weight - slice[j-1].weight));
                    if(diffs.every(d => d <= 0.1)) { flags.equanimity = true; break; }
                }
            }

            // Zombie
            for(let i=1; i<AppState.records.length; i++) {
                const days = DateUtil.daysBetween(DateUtil.parse(AppState.records[i-1].date), DateUtil.parse(AppState.records[i].date));
                if(days >= 15) { flags.returnProdigal = true; break; }
            }

            // Holiday Survivor
            const holidays = ['12-25', '01-01', '01-29', '10-06']; 
            holidays.forEach(h => {
                const year = new Date().getFullYear();
                const hDate = DateUtil.parse(`${year}-${h}`);
                const around = AppState.records.filter(r => {
                    const rd = DateUtil.parse(r.date);
                    return Math.abs(DateUtil.daysBetween(rd, hDate)) <= 3;
                });
                if(around.length >= 2) {
                    const gain = around[around.length-1].weight - around[0].weight;
                    if(gain < 0.5) flags.holidaySurvivor = true;
                }
            });

            // Weekend Defense
            for(let i=0; i<AppState.records.length-1; i++) {
                const d1 = DateUtil.parse(AppState.records[i].date);
                if(d1.getDay() === 6) { 
                    const next = AppState.records.find(r => r.date > AppState.records[i].date); 
                    if(next && DateUtil.parse(next.date).getDay() === 1 && next.weight <= AppState.records[i].weight) {
                        flags.weekendDef = true; break;
                    }
                }
            }
            
            // Plateau Break
            let stableDays = 0;
            for(let i=1; i<AppState.records.length; i++) {
                if(Math.abs(MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight)) < 0.2) stableDays++;
                else {
                    if(stableDays >= 7 && (AppState.records[i].weight < AppState.records[i-1].weight)) flags.plateauBreak = true;
                    stableDays = 0;
                }
            }

            // BMI Break
            const h = AppState.settings.height / 100;
            const bmiStart = AppState.settings.startWeight / (h*h);
            const bmiCurr = s.current / (h*h);
            const getCat = (b) => {
                if(b < CONFIG.BMI.UNDER) return 'Under';
                if(b < CONFIG.BMI.NORMAL_END) return 'Normal';
                if(b < CONFIG.BMI.PRE_OBESE_END) return 'PreObese';
                if(b < CONFIG.BMI.OBESE_1_END) return 'Obese1';
                if(b < CONFIG.BMI.OBESE_2_END) return 'Obese2';
                return 'Obese3';
            };
            if(getCat(bmiStart) !== getCat(bmiCurr)) flags.bmiBreak = true;

            // Yoyo Prevention
            if(s.current <= AppState.settings.goal1) {
                const recent = AppState.records.slice(-10);
                if(recent.length >= 10 && recent.every(r => Math.abs(r.weight - AppState.settings.goal1) <= 0.5)) flags.yoyoPrev = true;
            }

            // Ottogi
            for(let i=0; i<AppState.records.length-3; i++) {
                if(MathUtil.diff(AppState.records[i+1].weight, AppState.records[i].weight) >= 0.5) {
                    if(AppState.records[i+3].weight <= AppState.records[i].weight) flags.ottogi = true;
                }
            }

            // Golden Cross
            if(AppState.records.length > 30) {
                const last7 = AppState.records.slice(-7).reduce((a,b)=>a+b.weight,0)/7;
                const last30 = AppState.records.slice(-30).reduce((a,b)=>a+b.weight,0)/30;
                if(last7 < last30 - 0.5) flags.goldenCross = true;
            }

            // Fat Destroyer
            if(s.lastRec && s.lastRec.fat && s.lastRec.fat < 25) { 
                flags.fatDestroyer = true;
            }

            // Plateau Master
            stableDays = 0;
            for(let i=1; i<AppState.records.length; i++) {
                if(Math.abs(MathUtil.diff(AppState.records[i].weight, AppState.records[i-1].weight)) < 0.2) stableDays++;
                else {
                    if(stableDays >= 7 && (MathUtil.diff(AppState.records[i-1].weight, AppState.records[i].weight) >= 0.5)) flags.plateauMaster = true;
                    stableDays = 0;
                }
            }

            // Record Master
            if(streak >= 90) flags.recordMaster = true;

            // Reborn
            if(s.max - s.current >= 10) flags.reborn = true;

            // Slow & Steady
            if(AppState.records.length >= 90) {
                const threeMonthsAgo = new Date(); threeMonthsAgo.setMonth(threeMonthsAgo.getMonth()-3);
                const recs = AppState.records.filter(r => DateUtil.parse(r.date) >= threeMonthsAgo);
                if(recs.length > 0) {
                    const loss = MathUtil.diff(recs[0].weight, s.current);
                    const avgLoss = loss / 3;
                    if(avgLoss > 0 && avgLoss <= 2) flags.slowSteady = true;
                }
            }

            // Weight Expert
            if(AppState.records.length >= 30) {
                const oneMonthAgo = new Date(); oneMonthAgo.setMonth(oneMonthAgo.getMonth()-1);
                const rec = AppState.records.find(r => DateUtil.parse(r.date) >= oneMonthAgo);
                if(rec && (rec.weight - s.current >= 4)) flags.weightExpert = true;
            }

            // Plateau Destroyer
            if(s.maxPlateau >= 14 && s.current < s.lastRec.weight) flags.plateauDestroyer = true;

            // Icon of Constancy
            if(streak >= 180) flags.iconOfConstancy = true;

            // [NEW] Big Step (하루 1kg 이상 감량)
            for(let i=1; i<AppState.records.length; i++) {
                const days = DateUtil.daysBetween(DateUtil.parse(AppState.records[i-1].date), DateUtil.parse(AppState.records[i].date));
                if(days === 1 && AppState.records[i-1].weight - AppState.records[i].weight >= 1.0) {
                    flags.bigStep = true; break;
                }
            }

            // [NEW] Phoenix (불사조)
            // 논리: 과거에 최소 체중 기록 -> 이후 목표 체중(Goal) 근처 or 도달 했다가 다시 증량(요요) -> 그 후 다시 내려가서 최저 경신
            // 단순화: 과거에 한번 최저점 찍고 -> 3kg 이상 올랐다가 -> 현재 다시 최저점 경신
            let localMin = 999;
            let rebound = false;
            for(let i=0; i<AppState.records.length-1; i++) {
                if(AppState.records[i].weight < localMin) localMin = AppState.records[i].weight;
                if(localMin < 900 && AppState.records[i].weight > localMin + 3.0) rebound = true;
            }
            if(rebound && s.current < localMin) flags.phoenix = true;

            // [NEW] Weekend Ruler (주말 지배자)
            for(let i=0; i<AppState.records.length; i++) {
                const d = DateUtil.parse(AppState.records[i].date);
                if(d.getDay() === 1) { // Monday
                    const prevFriDate = new Date(d); prevFriDate.setDate(d.getDate()-3);
                    const prevFriStr = DateUtil.format(prevFriDate);
                    const friRec = AppState.records.find(r => r.date === prevFriStr);
                    if(friRec && AppState.records[i].weight <= friRec.weight) {
                        flags.weekendRuler = true; break;
                    }
                }
            }

            // [NEW] Curiosity (궁금증 해결사)
            let noFatStreak = 0;
            for(let i=0; i<AppState.records.length; i++) {
                if(!AppState.records[i].fat) noFatStreak++;
                else {
                    if(noFatStreak >= 10) { // 이전에 10일 이상 안 쟀음
                        // 이후 10일 연속 쟀는지 확인
                        let recordedStreak = 0;
                        for(let j=i; j<Math.min(i+10, AppState.records.length); j++) {
                            if(AppState.records[j].fat) recordedStreak++;
                            else break;
                        }
                        if(recordedStreak >= 10) { flags.curiosity = true; break; }
                    }
                    noFatStreak = 0;
                }
            }

            // [NEW] Time Traveler (시공간 초월)
            // 단순 비교: 최근 14일 속도로 계산한 남은 일수가 전체 평균 속도로 계산한 것보다 10일 이상 적을 때
            const rem = s.current - AppState.settings.goal1;
            if(rem > 0 && AppState.records.length > 30) {
                const totalDays = DateUtil.daysBetween(DateUtil.parse(AppState.records[0].date), DateUtil.parse(s.lastRec.date));
                const totalSpeed = (AppState.records[0].weight - s.current) / totalDays;
                
                const recentRec = AppState.records[AppState.records.length-15]; // 14 days ago approx
                if(recentRec) {
                    const recentDays = DateUtil.daysBetween(DateUtil.parse(recentRec.date), DateUtil.parse(s.lastRec.date));
                    const recentSpeed = (recentRec.weight - s.current) / recentDays;
                    
                    if(totalSpeed > 0 && recentSpeed > 0) {
                        const daysTotal = rem / totalSpeed;
                        const daysRecent = rem / recentSpeed;
                        if(daysTotal - daysRecent >= 10) flags.timeTraveler = true;
                    }
                }
            }
        }

        // 뱃지 상태 매핑
        const badgeConditions = {
            start: AppState.records.length >= 1,
            holiday: flags.holidaySurvivor,
            zombie: flags.returnProdigal,
            sniper: flags.sniper,
            coaster: flags.rollerCoaster,
            zen: flags.equanimity,
            loss3: totalLost >= 3,
            loss5: totalLost >= 5,
            loss10: totalLost >= 10,
            streak3: streak >= 3,
            streak7: streak >= 7,
            digit: Math.floor(s.current/10) < Math.floor(AppState.settings.startWeight/10),
            goal: s.current <= AppState.settings.goal1,
            weekend: flags.weekendDef,
            plateau: flags.plateauBreak,
            bmi: flags.bmiBreak,
            yoyo: flags.yoyoPrev,
            ottogi: flags.ottogi,
            recordGod: flags.recordGod,
            goldenCross: flags.goldenCross,
            fatDestroyer: flags.fatDestroyer,
            plateauMaster: flags.plateauMaster,
            recordMaster: flags.recordMaster,
            reborn: flags.reborn,
            slowSteady: flags.slowSteady,
            weightExpert: flags.weightExpert,
            plateauDestroyer: flags.plateauDestroyer,
            iconOfConstancy: flags.iconOfConstancy,
            // [NEW]
            bigStep: flags.bigStep,
            phoenix: flags.phoenix,
            weekendRuler: flags.weekendRuler,
            curiosity: flags.curiosity,
            timeTraveler: flags.timeTraveler
        };

        let html = '';
        CONFIG.BADGES.forEach(b => {
            const isUnlocked = badgeConditions[b.id];
            const cls = isUnlocked ? 'badge-item unlocked' : 'badge-item';
            html += `<div class="${cls}" title="${b.desc} (${isUnlocked ? '획득 완료' : '미획득'})">
                <span class="badge-icon">${b.icon}</span>
                <span class="badge-name">${b.name}</span>
            </div>`;
        });
        AppState.el.badgeGrid.innerHTML = html;
    }

    function switchTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        AppState.el[tabId].style.display = 'block';
        
        document.querySelectorAll('.filter-group button[id^="tab-btn"]').forEach(b => b.classList.remove('active'));
        if(tabId.includes('monthly')) AppState.el['tab-btn-monthly'].classList.add('active');
        if(tabId.includes('weekly')) AppState.el['tab-btn-weekly'].classList.add('active');
        if(tabId.includes('milestone')) AppState.el['tab-btn-milestone'].classList.add('active');
        if(tabId.includes('history')) AppState.el['tab-btn-history'].classList.add('active');
    }

    function toggleChartExpand(btn) {
        const card = btn.closest('.card');
        const backdrop = document.getElementById('chartBackdrop');
        const isExpanded = card.classList.contains('expanded-card');

        if (!isExpanded) {
            closeAllExpands();
        }

        card.classList.toggle('expanded-card');
        
        if (card.classList.contains('expanded-card')) {
            btn.innerText = '✖'; 
            btn.style.color = 'var(--danger)';
            backdrop.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        } else {
            btn.innerText = '⛶'; 
            btn.style.color = '';
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }

        setTimeout(() => {
            const canvas = card.querySelectorAll('canvas');
            canvas.forEach(cvs => {
                const chartInstance = Chart.getChart(cvs);
                if(chartInstance) chartInstance.resize();
            });
        }, 50);
    }

    function closeAllExpands() {
        const expandedCards = document.querySelectorAll('.expanded-card');
        const backdrop = document.getElementById('chartBackdrop');
        
        expandedCards.forEach(card => {
            card.classList.remove('expanded-card');
            const btn = card.querySelector('.expand-btn');
            if(btn) {
                btn.innerText = '⛶';
                btn.style.color = '';
            }
        });
        
        if(backdrop) backdrop.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            expandedCards.forEach(card => {
                const canvas = card.querySelectorAll('canvas');
                canvas.forEach(cvs => {
                    const chartInstance = Chart.getChart(cvs);
                    if(chartInstance) chartInstance.resize();
                });
            });
        }, 50);
    }

    // 전역 스코프 오염 방지 및 모듈 패턴 유지
    window.App = {
        init,
        toggleDarkMode,
        toggleSettings,
        saveSettings,
        addRecord,
        editRecord, 
        deleteRecord, 
        safeResetData,
        importData,
        exportCSV,
        exportJSON,
        setChartFilter,
        applyCustomDateRange,
        updateMainChart,
        toggleBadges,
        changeCalendarMonth,
        jumpToCalendarDate,
        switchTab,
        toggleChartExpand,
        closeAllExpands
    };

    window.onload = init;

})();