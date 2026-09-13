/* ==========================================================================
   Borsa & Piyasa Trader Terminal - borsa.js
   Dynamic interactions, data rendering, search, filters & calculators
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Header mobile navigation toggle
    const menuIcon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");

    if (menuIcon && navbar) {
        menuIcon.onclick = () => {
            menuIcon.classList.toggle("bx-x");
            navbar.classList.toggle("active");
        };

        window.onscroll = () => {
            menuIcon.classList.remove("bx-x");
            navbar.classList.remove("active");
        };
    }

    document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', event => {
            event.stopPropagation();
            const dropdown = toggle.closest('.nav-dropdown');
            const isOpen = dropdown.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
            dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
    });

    // 0. Market Status Banner (Weekend & Session Check)
    const marketStatusBanner = document.getElementById('market-status-banner');
    if (marketStatusBanner) {
        const now = new Date();
        const day = now.getDay(); // 0 = Sun, 6 = Sat
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMin = hours * 60 + minutes;

        if (day === 0 || day === 6) {
            marketStatusBanner.innerHTML = `
                <div class="market-status-bar closed">
                    <span class="status-badge red">🔴 Piyasalar Kapalı (Hafta Sonu)</span>
                    <span class="status-desc">Hisse ve VIOP seansları kapalıdır. Pazartesi 09:30'da seans açılacaktır.</span>
                </div>
            `;
        } else if (totalMin >= 570 && totalMin <= 1090) { // 09:30 - 18:10
            marketStatusBanner.innerHTML = `
                <div class="market-status-bar open">
                    <span class="status-badge green">🟢 BİST & Piyasalar Açık</span>
                    <span class="status-desc">Seans devam ediyor (09:30 - 18:10).</span>
                </div>
            `;
        } else {
            marketStatusBanner.innerHTML = `
                <div class="market-status-bar closed">
                    <span class="status-badge yellow">🌙 Seans Kapalı</span>
                    <span class="status-desc">Bursa kapanış yaptı. İlk seans yarın 09:30'da başlayacaktır.</span>
                </div>
            `;
        }
    }

    // Latest company disclosures from the server-side KAP feed.
    const kapList = document.getElementById('kap-list');
    const kapRange = document.getElementById('kap-range');
    const escapeKapHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

    async function loadKapNotifications() {
        if (!kapList) return;
        try {
            const response = await fetch('/api/kap-notifications', { headers: { Accept: 'application/json' } });
            const data = await response.json();
            if (!response.ok || !Array.isArray(data.notifications)) throw new Error(data.message || 'KAP akışı alınamadı');
            if (kapRange) {
                const formatDate = value => new Date(`${value}T12:00:00`).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
                kapRange.textContent = `Son 15 Gün · ${formatDate(data.from)}–${formatDate(data.to)}`;
            }
            if (!data.notifications.length) {
                kapList.innerHTML = '<div class="kap-state">Son 15 günde şirket bildirimi bulunamadı.</div>';
                return;
            }
            kapList.innerHTML = data.notifications.map(item => `
                <a class="kap-item" href="${escapeKapHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeKapHtml(item.ticker)}: ${escapeKapHtml(item.subject)}">
                    <div class="kap-date-time"><time>${escapeKapHtml(item.time)}</time><span>${escapeKapHtml(item.date.split('-').reverse().slice(0, 2).join('.'))}</span></div>
                    <div class="kap-content">
                        <div class="kap-company-line"><strong>${escapeKapHtml(item.ticker || 'KAP')}</strong><span title="${escapeKapHtml(item.company)}">${escapeKapHtml(item.company)}</span></div>
                        <div class="kap-type">${escapeKapHtml(item.type)}</div>
                        <div class="kap-subject" title="${escapeKapHtml(item.subject)}">${escapeKapHtml(item.subject)}</div>
                    </div>
                    <i class='bx bx-link-external kap-open-icon' aria-hidden="true"></i>
                </a>`).join('');
        } catch (error) {
            kapList.innerHTML = '<div class="kap-state kap-error">KAP bildirimleri şu anda güncellenemiyor.</div>';
        } finally {
            kapList.setAttribute('aria-busy', 'false');
        }
    }

    loadKapNotifications();

    // 3. TradingView Chart Symbol Switcher
    const symBtns = document.querySelectorAll('.sym-btn');
    const tvContainer = document.getElementById('tv-chart-wrapper');

    function loadTradingViewChart(symbol) {
        if (!tvContainer) return;

        if (symbol.startsWith('BIST:')) {
            const ticker = symbol.split(':')[1];
            const chartUrl = `https://tr.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`;
            tvContainer.innerHTML = `
                <div class="tv-external-chart-state">
                    <i class='bx bx-link-external' aria-hidden="true"></i>
                    <strong>${ticker} tam grafiği TradingView'de açılır</strong>
                    <span>BIST mum verileri TradingView tarafından harici sitelerde yayınlanmıyor.</span>
                    <a href="${chartUrl}" target="_blank" rel="noopener nofollow">TradingView'de Aç <i class='bx bx-right-arrow-alt'></i></a>
                </div>`;
            return;
        }

        tvContainer.innerHTML = `<div id="tradingview_terminal_chart" style="height:100%;width:100%;"></div>`;

        if (typeof TradingView !== 'undefined') {
            new TradingView.widget({
                "width": "100%",
                "height": 440,
                "symbol": symbol,
                "interval": "D",
                "timezone": "Europe/Istanbul",
                "theme": "dark",
                "style": "1",
                "locale": "tr",
                "toolbar_bg": "#020312",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_terminal_chart"
            });
        }
    }

    symBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            symBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const symbol = btn.dataset.symbol;
            loadTradingViewChart(symbol);
        });
    });

    // Initial TV Chart Load (BIST chart embeds are restricted by TradingView.)
    setTimeout(() => {
        loadTradingViewChart('FX_IDC:USDTRY');
    }, 500);

    // 4. Calculator Logic
    const calcBuyPrice = document.getElementById('calc-buy-price');
    const calcTargetPrice = document.getElementById('calc-target-price');
    const calcStopPrice = document.getElementById('calc-stop-price');
    
    const resPotPct = document.getElementById('res-pot-pct');
    const resRiskRatio = document.getElementById('res-risk-ratio');

    function updateCalculator() {
        if (!calcBuyPrice || !calcTargetPrice || !calcStopPrice) return;

        const buy = parseFloat(calcBuyPrice.value) || 0;
        const target = parseFloat(calcTargetPrice.value) || 0;
        const stop = parseFloat(calcStopPrice.value) || 0;

        if (buy > 0 && target > 0) {
            const potPct = (((target - buy) / buy) * 100).toFixed(2);
            resPotPct.textContent = `%${potPct}`;
        } else {
            resPotPct.textContent = '%0.00';
        }

        if (buy > 0 && target > buy && stop > 0 && stop < buy) {
            const reward = target - buy;
            const risk = buy - stop;
            const rr = (reward / risk).toFixed(2);
            resRiskRatio.textContent = `1 : ${rr}`;
        } else {
            resRiskRatio.textContent = '-';
        }
    }

    if (calcBuyPrice && calcTargetPrice && calcStopPrice) {
        [calcBuyPrice, calcTargetPrice, calcStopPrice].forEach(input => {
            input.addEventListener('input', updateCalculator);
        });
        updateCalculator();
    }

    // 5. Disclaimer Modal Popup Logic
    const disclaimerModal = document.getElementById('disclaimer-modal');
    const btnAcceptDisclaimer = document.getElementById('btn-accept-disclaimer');

    if (disclaimerModal && btnAcceptDisclaimer) {
        // Show popup when page loads
        setTimeout(() => {
            disclaimerModal.classList.add('show');
        }, 400);

        btnAcceptDisclaimer.addEventListener('click', () => {
            disclaimerModal.classList.remove('show');
        });
    }
});
