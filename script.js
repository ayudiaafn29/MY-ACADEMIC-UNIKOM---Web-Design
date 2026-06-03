/* ============================================
   MY ACADEMIC UNIKOM — REDESIGN PROTOTYPE
   Interactive JavaScript (Fixed & Complete)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ====== PAGE NAVIGATION (CORE FIX) ======
    // Map of data-page -> element id
    const pages = {
        'dashboard':   'page-dashboard',
        'krs':         'page-krs',
        'jadwal':      'page-jadwal',
        'nilai':       'page-nilai',
        'perwalian':   'page-perwalian',
        'kurikulum':   'page-kurikulum',
        'skripsi':     'page-skripsi',
        'keuangan':    'page-keuangan',
        'surat':       'page-surat',
        'pengaturan':  'page-pengaturan',
    };

    const pageNames = {
        'dashboard':   'Dashboard',
        'krs':         'Pengisian KRS',
        'jadwal':      'Jadwal Kuliah',
        'nilai':       'Nilai & Transkrip',
        'perwalian':   'Perwalian',
        'kurikulum':   'Kurikulum',
        'skripsi':     'Tugas Akhir',
        'keuangan':    'Keuangan',
        'surat':       'Surat Menyurat',
        'pengaturan':  'Pengaturan',
    };

    function navigateTo(targetPage) {
        // Hide all pages
        Object.values(pages).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // Show target page
        const targetId = pages[targetPage] || 'page-dashboard';
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            targetEl.style.display = 'block';
            // Scroll to top
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Update breadcrumb
        const breadcrumb = document.getElementById('breadcrumbCurrent');
        if (breadcrumb) {
            breadcrumb.textContent = pageNames[targetPage] || 'Dashboard';
        }

        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === targetPage) {
                item.classList.add('active');
            }
        });

        // Re-render chart if navigating to dashboard
        if (targetPage === 'dashboard') {
            setTimeout(renderGPAChart, 100);
        }

        // Close mobile sidebar
        if (window.innerWidth <= 992) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.remove('open');
        }
    }

    // ====== SIDEBAR TOGGLE ======
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            e.target !== mobileMenuBtn) {
            sidebar.classList.remove('open');
        }
    });

    // ====== BIND SIDEBAR NAV ITEMS ======
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = item.getAttribute('data-page');
            navigateTo(targetPage);
        });
    });

    // ====== KEYBOARD SHORTCUTS (Alt+1..4) ======
    document.addEventListener('keydown', (e) => {
        if (e.altKey) {
            const map = { '1': 'dashboard', '2': 'krs', '3': 'jadwal', '4': 'nilai' };
            if (map[e.key]) {
                e.preventDefault();
                navigateTo(map[e.key]);
            }
        }
    });

    // ====== KEYBOARD NAVIGATION IN SIDEBAR ======
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
        sidebarNav.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const items = [...sidebarNav.querySelectorAll('.nav-item')];
                const idx = items.indexOf(document.activeElement);
                let next;
                if (e.key === 'ArrowDown') next = items[(idx + 1) % items.length];
                else next = items[(idx - 1 + items.length) % items.length];
                next.focus();
            }
        });
    }

    // ====== DASHBOARD QUICK ACTION BUTTONS ======
    // "Isi KRS Sekarang" -> navigate to KRS page
    const btnIsiKrs = document.getElementById('btnIsiKrs');
    if (btnIsiKrs) {
        btnIsiKrs.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('krs');
        });
    }

    // "Lihat Jadwal Hari Ini" -> show modal (quick view) OR navigate to jadwal
    const btnLihatJadwal = document.getElementById('btnLihatJadwal');
    const modalJadwal = document.getElementById('modalJadwal');
    const closeJadwal = document.getElementById('closeJadwal');
    if (btnLihatJadwal && modalJadwal) {
        btnLihatJadwal.addEventListener('click', (e) => {
            e.preventDefault();
            modalJadwal.classList.add('open');
        });
        const closeJadwalModal = () => modalJadwal.classList.remove('open');
        if (closeJadwal) closeJadwal.addEventListener('click', closeJadwalModal);
        modalJadwal.addEventListener('click', (e) => {
            if (e.target === modalJadwal) closeJadwalModal();
        });
    }

    // ====== KRS SKS COUNTER ======
    window.updateSKS = function() {
        const checkboxes = document.querySelectorAll('#page-krs .krs-table input[type="checkbox"]:checked:not(:disabled)');
        let total = 0;
        checkboxes.forEach(cb => {
            total += parseInt(cb.getAttribute('data-sks') || '0');
        });
        const sksDipilih = document.getElementById('sksDipilih');
        if (sksDipilih) sksDipilih.textContent = total;

        // Highlight rows
        document.querySelectorAll('#page-krs .krs-row').forEach(row => {
            const cb = row.querySelector('input[type="checkbox"]');
            if (cb && cb.checked) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        });
    };

    // ====== AI CHATBOT ======
    const chatbotFab = document.getElementById('chatbotFab');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatbotBody = document.getElementById('chatbotBody');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    if (chatbotFab) {
        chatbotFab.addEventListener('click', () => {
            chatbotPanel.classList.toggle('open');
            chatbotPanel.setAttribute('aria-hidden', !chatbotPanel.classList.contains('open'));
            if (chatbotPanel.classList.contains('open') && chatInput) chatInput.focus();
        });
    }
    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            chatbotPanel.classList.remove('open');
            chatbotPanel.setAttribute('aria-hidden', 'true');
        });
    }

    function sendChatMessage(message) {
        if (!message.trim()) return;
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `<div class="chat-bubble"><p>${escapeHtml(message)}</p></div>`;
        chatbotBody.appendChild(userMsg);
        const suggestionsContainer = chatbotBody.querySelector('.chat-suggestions');
        if (suggestionsContainer) suggestionsContainer.style.display = 'none';
        if (chatInput) chatInput.value = '';
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            botMsg.innerHTML = `<div class="chat-bubble">${getBotResponse(message)}</div>`;
            chatbotBody.appendChild(botMsg);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 800 + Math.random() * 700);
    }

    function getBotResponse(message) {
        const msg = message.toLowerCase();
        if (msg.includes('krs') || msg.includes('kartu rencana')) {
            return `<p>📋 <strong>Cara Mengisi KRS:</strong></p>
                    <p>1. Klik menu <strong>Pengisian KRS</strong> di sidebar kiri</p>
                    <p>2. Pilih mata kuliah yang ingin diambil dengan mencentang kotak</p>
                    <p>3. Pastikan total SKS tidak melebihi 24 SKS</p>
                    <p>4. Klik "Finalisasi KRS"</p>
                    <p style="margin-top:8px;font-size:0.8rem;color:var(--text-tertiary)">⏰ Batas pengisian: 6 Juni 2026</p>`;
        }
        if (msg.includes('ipk') || msg.includes('nilai') || msg.includes('gpa')) {
            return `<p>📊 <strong>IPK Anda saat ini: 3.72</strong></p>
                    <p>IPS semester lalu: 3.85</p>
                    <p>Anda berada di peringkat atas! Pertahankan! 💪</p>
                    <p>Untuk detail lengkap, buka menu <strong>Nilai & Transkrip</strong>.</p>`;
        }
        if (msg.includes('jadwal') || msg.includes('hari ini')) {
            return `<p>📅 <strong>Jadwal Hari Ini (3 Juni 2026):</strong></p>
                    <p>🟢 08:00 - 10:30 → DIPL (Sedang berlangsung)</p>
                    <p>⚪ 13:00 - 15:30 → Pemrograman Mobile</p>
                    <p>⚪ 16:00 - 18:00 → Kecerdasan Buatan</p>
                    <p>Untuk jadwal lengkap, klik menu <strong>Jadwal Kuliah</strong>.</p>`;
        }
        if (msg.includes('perwalian') || msg.includes('dosen wali')) {
            return `<p>👨‍🏫 <strong>Info Perwalian:</strong></p>
                    <p>Dosen Wali Anda: <strong>Dr. Budi Santoso, M.T.</strong></p>
                    <p>Status perwalian Anda sedang menunggu persetujuan. Cek di menu <strong>Perwalian</strong>.</p>`;
        }
        if (msg.includes('surat') || msg.includes('keterangan')) {
            return `<p>✉️ <strong>Pengajuan Surat:</strong></p>
                    <p>Buka menu <strong>Surat Menyurat</strong> untuk mengajukan:</p>
                    <ul>
                        <li>Surat Keterangan Aktif Kuliah</li>
                        <li>Transkrip Sementara</li>
                        <li>Surat Rekomendasi</li>
                    </ul>
                    <p>Proses 1-3 hari kerja.</p>`;
        }
        if (msg.includes('bayar') || msg.includes('spp') || msg.includes('uang kuliah')) {
            return `<p>💳 <strong>Status Keuangan:</strong></p>
                    <p>✅ SPP Semester 6: <strong>Lunas</strong></p>
                    <p>Tidak ada tagihan yang tertunda. Untuk detail, cek menu <strong>Keuangan</strong>.</p>`;
        }
        return `<p>Terima kasih atas pertanyaan Anda! 😊</p>
                <p>Saya bisa membantu tentang:</p>
                <ul>
                    <li>📋 KRS & pengisian mata kuliah</li>
                    <li>📅 Jadwal kuliah</li>
                    <li>📊 Nilai & IPK</li>
                    <li>👨‍🏫 Perwalian</li>
                    <li>✉️ Surat menyurat</li>
                    <li>💳 Keuangan / SPP</li>
                </ul>`;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    if (chatSend) chatSend.addEventListener('click', () => sendChatMessage(chatInput.value));
    if (chatInput) chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChatMessage(chatInput.value); });
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => sendChatMessage(chip.getAttribute('data-msg')));
    });

    // ====== COMMAND PALETTE (Ctrl+K) ======
    const commandPaletteOverlay = document.getElementById('commandPaletteOverlay');
    const cpInput = document.getElementById('cpInput');
    const cpResults = document.getElementById('cpResults');
    const menuSearch = document.getElementById('menuSearch');

    function openCommandPalette() {
        if (commandPaletteOverlay) {
            commandPaletteOverlay.classList.add('open');
            setTimeout(() => { if (cpInput) cpInput.focus(); }, 100);
        }
    }
    function closeCommandPalette() {
        if (commandPaletteOverlay) commandPaletteOverlay.classList.remove('open');
        if (cpInput) { cpInput.value = ''; filterCommandPalette(''); }
    }

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (commandPaletteOverlay && commandPaletteOverlay.classList.contains('open')) {
                closeCommandPalette();
            } else {
                openCommandPalette();
            }
        }
        if (e.key === 'Escape') {
            closeCommandPalette();
            if (chatbotPanel) { chatbotPanel.classList.remove('open'); }
            if (notificationPanel) { notificationPanel.classList.remove('open'); }
        }
    });

    if (commandPaletteOverlay) {
        commandPaletteOverlay.addEventListener('click', (e) => {
            if (e.target === commandPaletteOverlay) closeCommandPalette();
        });
    }
    if (menuSearch) {
        menuSearch.addEventListener('focus', () => { menuSearch.blur(); openCommandPalette(); });
    }
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) globalSearch.addEventListener('click', openCommandPalette);

    // Command palette items trigger navigation
    if (cpResults) {
        cpResults.querySelectorAll('.cp-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = item.getAttribute('data-page');
                closeCommandPalette();
                navigateTo(targetPage);
            });
        });
        cpResults.querySelectorAll('.cp-item[data-action="darkmode"]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                closeCommandPalette();
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                setDarkMode(!isDark);
            });
        });
    }

    function filterCommandPalette(query) {
        if (!cpResults) return;
        const items = cpResults.querySelectorAll('.cp-item');
        const sections = cpResults.querySelectorAll('.cp-section-title');
        const q = query.toLowerCase();
        items.forEach(item => {
            const text = item.querySelector('span') ? item.querySelector('span').textContent.toLowerCase() : '';
            item.style.display = (q === '' || text.includes(q)) ? 'flex' : 'none';
        });
        sections.forEach(section => {
            let nextEl = section.nextElementSibling;
            let hasVisible = false;
            while (nextEl && !nextEl.classList.contains('cp-section-title')) {
                if (nextEl.style.display !== 'none') hasVisible = true;
                nextEl = nextEl.nextElementSibling;
            }
            section.style.display = hasVisible ? 'block' : 'none';
        });
    }
    if (cpInput) cpInput.addEventListener('input', (e) => filterCommandPalette(e.target.value));

    // ====== NOTIFICATION PANEL ======
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationBtn && notificationPanel) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationPanel.classList.toggle('open');
            notificationPanel.setAttribute('aria-hidden', !notificationPanel.classList.contains('open'));
        });
    }
    document.addEventListener('click', (e) => {
        if (notificationPanel &&
            notificationPanel.classList.contains('open') &&
            !notificationPanel.contains(e.target) &&
            e.target !== notificationBtn) {
            notificationPanel.classList.remove('open');
            notificationPanel.setAttribute('aria-hidden', 'true');
        }
    });

    // ====== DARK MODE ======
    const darkModeToggle = document.getElementById('darkModeToggle');

    function setDarkMode(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        if (darkModeToggle) {
            darkModeToggle.classList.toggle('active', isDark);
            const icon = darkModeToggle.querySelector('i');
            if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        try { localStorage.setItem('darkMode', isDark); } catch(e) {}
    }
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            setDarkMode(document.documentElement.getAttribute('data-theme') !== 'dark');
        });
    }
    try {
        if (localStorage.getItem('darkMode') === 'true' ||
            (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
        }
    } catch(e) {}

    // ====== HIGH CONTRAST ======
    const highContrastBtn = document.getElementById('highContrast');
    if (highContrastBtn) {
        highContrastBtn.addEventListener('click', () => {
            const isHigh = document.documentElement.getAttribute('data-contrast') === 'high';
            document.documentElement.setAttribute('data-contrast', isHigh ? 'normal' : 'high');
            highContrastBtn.classList.toggle('active');
            try { localStorage.setItem('highContrast', !isHigh); } catch(e) {}
        });
    }
    try {
        if (localStorage.getItem('highContrast') === 'true') {
            document.documentElement.setAttribute('data-contrast', 'high');
            if (highContrastBtn) highContrastBtn.classList.add('active');
        }
    } catch(e) {}

    // ====== FONT SIZE ======
    const fontIncrease = document.getElementById('fontIncrease');
    const fontDecrease = document.getElementById('fontDecrease');
    let fontScale = 1;
    try { fontScale = parseFloat(localStorage.getItem('fontScale') || '1'); } catch(e) {}

    function updateFontScale(scale) {
        fontScale = Math.max(0.8, Math.min(1.4, scale));
        document.documentElement.style.setProperty('--font-scale', fontScale);
        try { localStorage.setItem('fontScale', fontScale); } catch(e) {}
    }
    updateFontScale(fontScale);
    if (fontIncrease) fontIncrease.addEventListener('click', () => updateFontScale(fontScale + 0.1));
    if (fontDecrease) fontDecrease.addEventListener('click', () => updateFontScale(fontScale - 0.1));

    // ====== ONBOARDING ======
    const onboardingOverlay = document.getElementById('onboardingOverlay');
    const onboardingContent = document.getElementById('onboardingContent');
    const onboardingStepLabel = document.getElementById('onboardingStepLabel');
    const onboardingDots = document.getElementById('onboardingDots');
    const onboardingNext = document.getElementById('onboardingNext');
    const onboardingPrev = document.getElementById('onboardingPrev');
    const onboardingSkip = document.getElementById('onboardingSkip');

    const onboardingSteps = [
        { icon: 'fa-hand-sparkles', title: 'Selamat Datang di My Academic!', desc: 'Ini adalah prototype redesain sistem My Academic UNIKOM dengan navigasi yang lebih intuitif dan fitur AI asisten.' },
        { icon: 'fa-search', title: 'Pencarian Cepat (Ctrl+K)', desc: 'Tekan Ctrl+K kapan saja untuk mencari menu atau fitur. Tidak perlu bingung mencari menu lagi!' },
        { icon: 'fa-robot', title: 'Asisten AI — NIKA', desc: 'Klik tombol robot di pojok kanan bawah untuk bertanya tentang KRS, jadwal, nilai, dan informasi akademik lainnya.' },
        { icon: 'fa-universal-access', title: 'Aksesibilitas Lengkap', desc: 'Mode gelap, kontras tinggi, dan ukuran font dapat disesuaikan di bagian bawah sidebar atau di halaman Pengaturan.' }
    ];
    let currentStep = 0;

    function updateOnboarding() {
        const step = onboardingSteps[currentStep];
        if (onboardingContent) {
            onboardingContent.innerHTML = `
                <div class="onboarding-icon"><i class="fas ${step.icon}"></i></div>
                <h3>${step.title}</h3>
                <p>${step.desc}</p>
            `;
        }
        if (onboardingStepLabel) onboardingStepLabel.textContent = `${currentStep + 1} / ${onboardingSteps.length}`;
        if (onboardingDots) {
            onboardingDots.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === currentStep));
        }
        if (onboardingPrev) onboardingPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
        if (onboardingNext) {
            onboardingNext.innerHTML = currentStep === onboardingSteps.length - 1
                ? 'Mulai <i class="fas fa-check"></i>'
                : 'Selanjutnya <i class="fas fa-arrow-right"></i>';
        }
    }

    function closeOnboarding() {
        if (onboardingOverlay) onboardingOverlay.classList.remove('open');
        try { localStorage.setItem('onboardingDone', 'true'); } catch(e) {}
    }

    if (onboardingNext) {
        onboardingNext.addEventListener('click', () => {
            if (currentStep < onboardingSteps.length - 1) { currentStep++; updateOnboarding(); }
            else closeOnboarding();
        });
    }
    if (onboardingPrev) {
        onboardingPrev.addEventListener('click', () => {
            if (currentStep > 0) { currentStep--; updateOnboarding(); }
        });
    }
    if (onboardingSkip) onboardingSkip.addEventListener('click', closeOnboarding);

    try {
        if (!localStorage.getItem('onboardingDone') && onboardingOverlay) {
            setTimeout(() => onboardingOverlay.classList.add('open'), 600);
        }
    } catch(e) {
        if (onboardingOverlay) setTimeout(() => onboardingOverlay.classList.add('open'), 600);
    }

    // ====== GPA CHART ======
    function renderGPAChart() {
        const container = document.getElementById('gpaChart');
        if (!container || container.clientWidth === 0) return;
        const data = [
            { sem: 'Sem 1', ips: 3.45 },
            { sem: 'Sem 2', ips: 3.52 },
            { sem: 'Sem 3', ips: 3.60 },
            { sem: 'Sem 4', ips: 3.78 },
            { sem: 'Sem 5', ips: 3.85 },
            { sem: 'Sem 6', ips: 3.72 }
        ];
        const width = container.clientWidth;
        const height = 200;
        const padding = { top: 20, right: 20, bottom: 40, left: 40 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;
        const minVal = 2.5, maxVal = 4.0;
        const getX = (i) => padding.left + (i / (data.length - 1)) * chartW;
        const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        let pathD = `M ${getX(0)} ${getY(data[0].ips)}`;
        for (let i = 1; i < data.length; i++) pathD += ` L ${getX(i)} ${getY(data[i].ips)}`;
        let areaD = pathD + ` L ${getX(data.length - 1)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#94a3b8' : '#64748b';
        const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">`;
        for (let v = 2.5; v <= 4.0; v += 0.5) {
            const y = getY(v);
            svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${gridColor}" stroke-dasharray="4 4"/>`;
            svg += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" fill="${textColor}" font-size="11" font-family="Inter, sans-serif">${v.toFixed(1)}</text>`;
        }
        svg += `
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02"/>
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#3b82f6"/>
                    <stop offset="100%" stop-color="#8b5cf6"/>
                </linearGradient>
            </defs>
            <path d="${areaD}" fill="url(#areaGrad)"/>
            <path d="${pathD}" fill="none" stroke="url(#lineGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        `;
        data.forEach((d, i) => {
            const x = getX(i), y = getY(d.ips);
            svg += `
                <circle cx="${x}" cy="${y}" r="5" fill="#3b82f6" stroke="white" stroke-width="2.5"/>
                <text x="${x}" y="${y - 12}" text-anchor="middle" fill="${textColor}" font-size="11" font-weight="600" font-family="Inter, sans-serif">${d.ips.toFixed(2)}</text>
                <text x="${x}" y="${height - 12}" text-anchor="middle" fill="${textColor}" font-size="11" font-family="Inter, sans-serif">${d.sem}</text>
            `;
        });
        svg += '</svg>';
        container.innerHTML = svg;
    }
    renderGPAChart();
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(renderGPAChart, 200);
    });
    const themeObserver = new MutationObserver(() => setTimeout(renderGPAChart, 100));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // ====== GREETING ======
    function updateGreeting() {
        const hour = new Date().getHours();
        let greeting;
        if (hour < 11) greeting = 'Selamat Pagi 👋';
        else if (hour < 15) greeting = 'Selamat Siang 👋';
        else if (hour < 18) greeting = 'Selamat Sore 👋';
        else greeting = 'Selamat Malam 👋';
        const el = document.querySelector('.welcome-greeting');
        if (el) el.textContent = greeting;
    }
    updateGreeting();

    // Initial page state: ensure only dashboard visible
    navigateTo('dashboard');

    console.log('My Academic UNIKOM Prototype loaded ✅ — All navigation fixed!');
});

// ====== GLOBAL STATUS MODAL ======
window.showStatusModal = function(title, value, desc, colorClass, iconClass) {
    const modal = document.getElementById('modalStatus');
    if (!modal) return;
    document.getElementById('modalStatusTitle').textContent = `Detail: ${title}`;
    document.getElementById('modalStatusValue').textContent = value;
    document.getElementById('modalStatusDesc').textContent = desc;
    const iconContainer = document.getElementById('modalStatusIcon');
    const colorMap = {
        blue:   ['var(--primary-100)', 'var(--primary-600)'],
        green:  ['var(--accent-green-light)', 'var(--accent-green)'],
        purple: ['var(--accent-purple-light)', 'var(--accent-purple)'],
        orange: ['var(--accent-orange-light)', 'var(--accent-orange)'],
    };
    const colors = colorMap[colorClass] || colorMap.blue;
    iconContainer.style.background = colors[0];
    iconContainer.style.color = colors[1];
    iconContainer.innerHTML = `<i class="fas ${iconClass}"></i>`;
    modal.classList.add('open');
};
document.addEventListener('click', (e) => {
    const modalStatus = document.getElementById('modalStatus');
    if (modalStatus && e.target === modalStatus) modalStatus.classList.remove('open');
});