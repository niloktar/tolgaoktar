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

    // 2. DATA: Türkiye & Dünya Ekonomik Takvimi (English)
    const calendarData = [
        { country: '🇹🇷 TR', title: 'CBRT Interest Rate Decision (PPK)', dateStr: 'Sep 17 Thu', time: '14:00', impact: 'high', expected: '50.00%', previous: '50.00%', actual: 'Pending' },
        { country: '🇺🇸 US', title: 'Fed Interest Rate Decision (FOMC)', dateStr: 'Sep 16 Wed', time: '21:00', impact: 'high', expected: '5.25%', previous: '5.50%', actual: 'Pending' },
        { country: '🇺🇸 US', title: 'US Headline Inflation (CPI YoY)', dateStr: 'Sep 15 Tue', time: '15:30', impact: 'high', expected: '2.6%', previous: '2.9%', actual: 'Released: 2.5%' },
        { country: '🇹🇷 TR', title: 'TURKSTAT Industrial Production (YoY)', dateStr: 'Sep 14 Mon', time: '10:00', impact: 'med', expected: '-1.5%', previous: '-3.9%', actual: 'Pending' },
        { country: '🇪🇺 EU', title: 'ECB Deposit Facility Rate', dateStr: 'Sep 17 Thu', time: '15:15', impact: 'high', expected: '3.50%', previous: '3.75%', actual: 'Pending' },
        { country: '🇺🇸 US', title: 'Weekly Initial Jobless Claims', dateStr: 'Sep 17 Thu', time: '15:30', impact: 'med', expected: '230K', previous: '227K', actual: 'Pending' },
        { country: '🇹🇷 TR', title: 'TURKSTAT Housing Sales Statistics', dateStr: 'Sep 14 Mon', time: '10:00', impact: 'low', expected: '4.0%', previous: '16.0%', actual: 'Pending' }
    ];

    const calendarList = document.getElementById('calendar-list');
    const calFilterBtns = document.querySelectorAll('.cal-filter-btn');

    let currentCalFilter = 'ALL';

    function renderCalendar() {
        if (!calendarList) return;

        const filtered = calendarData.filter(item => {
            if (currentCalFilter === 'TR') return item.country.includes('TR');
            if (currentCalFilter === 'GLOBAL') return !item.country.includes('TR');
            if (currentCalFilter === 'HIGH') return item.impact === 'high';
            return true;
        });

        calendarList.innerHTML = filtered.map(item => {
            let impactBadge = '<span class="impact-high">🔴 High Impact</span>';
            if (item.impact === 'med') impactBadge = '<span class="impact-med">🟡 Med Impact</span>';
            if (item.impact === 'low') impactBadge = '<span class="impact-low">🟢 Low Impact</span>';

            return `
                <div class="calendar-item">
                    <div class="cal-top">
                        <span class="cal-flag">${item.country}</span>
                        <span class="cal-time"><i class='bx bx-calendar'></i> ${item.dateStr} - ${item.time}</span>
                    </div>
                    <div class="cal-title">${item.title}</div>
                    <div class="cal-metrics">
                        <div>
                            <div class="metric-label">Forecast</div>
                            <div class="metric-val">${item.expected}</div>
                        </div>
                        <div>
                            <div class="metric-label">Previous</div>
                            <div class="metric-val">${item.previous}</div>
                        </div>
                        <div>
                            <div class="metric-label">Status</div>
                            <div class="metric-val" style="color: var(--main-color);">${item.actual}</div>
                        </div>
                    </div>
                    <div style="font-size: 0.72rem; display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
                        ${impactBadge}
                        <span style="color: var(--text-muted); font-weight: 600;">Upcoming</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    calFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            calFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCalFilter = btn.dataset.filter;
            renderCalendar();
        });
    });

    renderCalendar();

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
