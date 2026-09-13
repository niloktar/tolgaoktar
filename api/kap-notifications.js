const TIMEZONE = 'Europe/Istanbul';
const KAP_ORIGIN = 'https://www.kap.org.tr';
const TYPE_LABELS = {
  ODA: 'Özel Durum Açıklaması',
  FR: 'Finansal Rapor',
  DUY: 'Diğer Bildirimler',
  DG: 'Diğer Bildirimler'
};

function istanbulDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function dateRange(now = new Date()) {
  const to = istanbulDate(now);
  const start = new Date(`${to}T12:00:00Z`);
  start.setUTCDate(start.getUTCDate() - 15);
  return { from: start.toISOString().slice(0, 10), to };
}

function parsePublishDate(value) {
  const match = String(value || '').match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})(?::\d{2})?$/);
  return match ? { date: `${match[3]}-${match[2]}-${match[1]}`, time: `${match[4]}:${match[5]}` } : null;
}

const clean = value => value == null ? '' : String(value).trim();

function normalize(raw) {
  const seen = new Set();
  return raw.flatMap(item => {
    const id = clean(item.disclosureIndex);
    const published = parsePublishDate(item.publishDate);
    const isFund = Boolean(clean(item.fundCode)) || clean(item.disclosureCategory).toUpperCase().includes('FON');
    if (!id || !published || isFund || seen.has(id)) return [];
    seen.add(id);

    const category = clean(item.disclosureCategory || item.disclosureType).toUpperCase();
    const type = TYPE_LABELS[category] || clean(item.subject) || 'Diğer';
    const subject = clean(item.summary) || clean(item.subject) || type;
    return [{
      id,
      ...published,
      ticker: clean(item.stockCodes || item.relatedStocks).split(',')[0].trim(),
      company: clean(item.kapTitle),
      type,
      subject,
      summary: null,
      url: `${KAP_ORIGIN}/tr/Bildirim/${id}`,
      importance: 'normal'
    }];
  }).sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)).slice(0, 20);
}

module.exports = async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ message: 'Method not allowed' });
  }

  const { from, to } = dateRange();
  try {
    const kapResponse = await fetch(`${KAP_ORIGIN}/tr/api/disclosure/members/byCriteria`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Referer: `${KAP_ORIGIN}/tr/bildirim-sorgu`,
        'User-Agent': 'tolgaoktar.com KAP dashboard/1.0'
      },
      body: JSON.stringify({ fromDate: from, toDate: to, mkkMemberOidList: [], subjectList: [] }),
      signal: AbortSignal.timeout(12000)
    });
    if (!kapResponse.ok) throw new Error(`KAP returned ${kapResponse.status}`);
    const raw = await kapResponse.json();
    if (!Array.isArray(raw)) throw new Error('Unexpected KAP response');

    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    return response.status(200).json({
      from,
      to,
      updated_at: new Date().toISOString(),
      timezone: TIMEZONE,
      notifications: normalize(raw)
    });
  } catch (error) {
    console.error('KAP update failed:', error.message);
    response.setHeader('Cache-Control', 'no-store');
    return response.status(502).json({
      from,
      to,
      updated_at: new Date().toISOString(),
      timezone: TIMEZONE,
      notifications: [],
      message: 'KAP bildirimleri şu anda güncellenemiyor.'
    });
  }
};
