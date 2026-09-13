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

    // 1. DATA: Kurum Hedef Fiyatları & Değişim Verileri
    const targetPriceData = [
        { symbol: 'THYAO', name: 'Türk Hava Yolları', market: 'BIST', institution: 'Garanti BBVA Yatırım', rating: 'AL', targetPrice: 420.00, currentPrice: 304.50, changePct: 2.15, date: 'Son Rapor' },
        { symbol: 'GARAN', name: 'Garanti BBVA', market: 'BIST', institution: 'İş Yatırım', rating: 'AL', targetPrice: 165.00, currentPrice: 128.40, changePct: 1.82, date: 'Son Rapor' },
        { symbol: 'EREGL', name: 'Ereğli Demir Çelik', market: 'BIST', institution: 'Ak Yatırım', rating: 'TUT', targetPrice: 62.50, currentPrice: 51.20, changePct: -0.65, date: 'Son Rapor' },
        { symbol: 'ASELS', name: 'Aselsan Elektronik', market: 'BIST', institution: 'Yapı Kredi Yatırım', rating: 'AL', targetPrice: 88.00, currentPrice: 66.80, changePct: 3.40, date: 'Son Rapor' },
        { symbol: 'KCHOL', name: 'Koç Holding', market: 'BIST', institution: 'HSBC', rating: 'AL', targetPrice: 285.00, currentPrice: 215.00, changePct: 0.95, date: 'Son Rapor' },
        { symbol: 'BIMAS', name: 'BİM Mağazacılık', market: 'BIST', institution: 'Oyak Yatırım', rating: 'AL', targetPrice: 680.00, currentPrice: 510.00, changePct: 1.10, date: 'Son Rapor' },
        { symbol: 'TUPRS', name: 'Tüpraş', market: 'BIST', institution: 'Deniz Yatırım', rating: 'AL', targetPrice: 230.00, currentPrice: 172.30, changePct: -1.20, date: 'Son Rapor' },
        { symbol: 'NVDA', name: 'Nvidia Corp.', market: 'GLOBAL', institution: 'Goldman Sachs', rating: 'AL', targetPrice: 165.00, currentPrice: 119.20, changePct: 4.15, date: 'Son Rapor' },
        { symbol: 'AAPL', name: 'Apple Inc.', market: 'GLOBAL', institution: 'Morgan Stanley', rating: 'AL', targetPrice: 260.00, currentPrice: 222.80, changePct: 0.85, date: 'Son Rapor' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', market: 'GLOBAL', institution: 'JPMorgan', rating: 'AL', targetPrice: 510.00, currentPrice: 430.50, changePct: 1.45, date: 'Son Rapor' },
        { symbol: 'TSLA', name: 'Tesla Inc.', market: 'GLOBAL', institution: 'Barclays', rating: 'TUT', targetPrice: 225.00, currentPrice: 210.10, changePct: -2.30, date: 'Son Rapor' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', market: 'GLOBAL', institution: 'Bank of America', rating: 'AL', targetPrice: 240.00, currentPrice: 186.40, changePct: 1.95, date: 'Son Rapor' }
    ];

    // Render Target Price Table
    const targetTableBody = document.getElementById('target-table-body');
    const targetSearchInput = document.getElementById('target-search');
    const targetFilterBtns = document.querySelectorAll('.target-filter-btn');

    let currentTargetMarket = 'ALL';

    function renderTargetPrices() {
        if (!targetTableBody) return;

        const query = (targetSearchInput ? targetSearchInput.value : '').toLowerCase().trim();

        const filtered = targetPriceData.filter(item => {
            const matchesQuery = item.symbol.toLowerCase().includes(query) ||
                                 item.name.toLowerCase().includes(query) ||
                                 item.institution.toLowerCase().includes(query);
            
            if (!matchesQuery) return false;

            if (currentTargetMarket === 'BIST') return item.market === 'BIST';
            if (currentTargetMarket === 'GLOBAL') return item.market === 'GLOBAL';
            if (currentTargetMarket === 'HIGH_POTENTIAL') {
                const potential = ((item.targetPrice - item.currentPrice) / item.currentPrice) * 100;
                return potential >= 30;
            }
            return true;
        });

        if (filtered.length === 0) {
            targetTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">
                        Aramanıza uygun kurum hedef fiyat kaydı bulunamadı.
                    </td>
                </tr>`;
            return;
        }

        targetTableBody.innerHTML = filtered.map(item => {
            const upsidePct = (((item.targetPrice - item.currentPrice) / item.currentPrice) * 100).toFixed(1);
            const changeClass = item.changePct >= 0 ? 'up' : 'down';
            const changeIcon = item.changePct >= 0 ? 'bx-caret-up' : 'bx-caret-down';
            
            let ratingClass = 'rating-buy';
            if (item.rating === 'TUT' || item.rating === 'HOLD') ratingClass = 'rating-hold';
            if (item.rating === 'SAT' || item.rating === 'SELL') ratingClass = 'rating-sell';

            const currencySymbol = item.market === 'BIST' ? '₺' : '$';

            return `
                <tr>
                    <td>
                        <div class="stock-badge">
                            <span class="stock-symbol">${item.symbol}</span>
                            <span class="stock-name">${item.name}</span>
                        </div>
                    </td>
                    <td><span class="institution-name">${item.institution}</span></td>
                    <td><span class="rating-badge ${ratingClass}">${item.rating}</span></td>
                    <td><strong>${currencySymbol}${item.targetPrice.toFixed(2)}</strong></td>
                    <td>${currencySymbol}${item.currentPrice.toFixed(2)}</td>
                    <td><span class="upside-pot">+%${upsidePct}</span></td>
                    <td>
                        <span class="ticker-change ${changeClass}">
                            <i class='bx ${changeIcon}'></i> %${Math.abs(item.changePct).toFixed(2)}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (targetSearchInput) {
        targetSearchInput.addEventListener('input', renderTargetPrices);
    }

    targetFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            targetFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTargetMarket = btn.dataset.filter;
            renderTargetPrices();
        });
    });

    renderTargetPrices();

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

    // Initial TV Chart Load
    setTimeout(() => {
        loadTradingViewChart('BIST:THYAO');
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
