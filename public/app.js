const sourceButton = (id, title, label='Kaydı incele') => `<button class="source-link" data-source="${id}" data-title="${title}">${label} <span>＋</span></button>`;
const career = [
 ['ARA 2019 — MAR 2024','Türkiye Finans Katılım Bankası','Perakende bankacılık alanında ilerleyen kariyer.','Perakende Bankacılık Yetkilisi · Ara 2019 – Mar 2024<br>Perakende Bankacılık Yönetmen Yardımcısı · Nis 2023 – Mar 2024',19],
 ['ŞUB 2017 — ARA 2019','QNB Finansbank','Müşteri ilişkileri ve bankacılık deneyimi · Trabzon.','Müşteri Hizmetleri Temsilcisi · Şub 2017 – Nis 2018<br>Kıdemli Müşteri Hizmetleri Temsilcisi · Nis 2018 – Ara 2019',18],
 ['TEMMUZ 2014','Türkiye Cumhuriyet Merkez Bankası','Bir haftalık sertifikalı staj programı.','',17],
 ['EKİ 2013 — HAZ 2015','Cafe Hill Garden','Yönetici · Görele, Giresun. Üniversite yıllarında bir villanın yurt, garaj ve bahçesinin ise kafeye dönüştürüldüğü girişim.','',17],
 ['HAZ — TEM 2013','Garanti Bankası','40 günlük gönüllü staj eğitimi.','',17],
 ['OCA 2013 — HAZ 2015','Görele Gazetesi','Köşe yazarı. Üniversite etkinliklerini, duygu ve düşüncelerini yerel gazete okurlarıyla paylaşma deneyimi.','',17]
];
document.querySelector('#career-timeline').innerHTML=career.map(([date,title,text,detail,id])=>`<article class="timeline-row"><span class="date">${date}</span><h3>${title}</h3><p>${text}</p>${detail?`<p class="role-detail">${detail}</p>`:''}<details><summary>Deneyim kaydı</summary>${sourceButton(id,title)}</details></article>`).join('');
const volunteers=[
 ['MAYIS 2019’DAN İTİBAREN','FODER','Finansal okuryazarlık için sosyal medya yönetimi, fikir ve içerik üretimi.',8,'Gönüllülük kaydı'],
 ['EKİM 2019’DAN İTİBAREN','Çalışan Mutluluğu','QNB Finansbank bünyesinde çalışan motivasyonunu artırmaya yönelik aktivite ve proje yönetimi.',7,'Gönüllülük kaydı'],
 ['KASIM 2019’DAN İTİBAREN','Habitat Derneği','QNB Finansbank iş birliğiyle Minik Eller Kod Yazıyor projesinde eğitmenlik.',2,'Eğitimden bir kare'],
 ['16 NİSAN 2020','Mezunlar Konuşuyor','Mezunları ve öğrencileri buluşturan platformda kariyer deneyimlerini, çabaları ve öğrenilen dersleri paylaşmak.',23,'Paylaşımı incele'],
 ['OCAK 2021’DEN İTİBAREN','Kodla.co','Community Organizer. Yazılımcıları buluşturan etkinliklere katkı; 21–22 Mayıs 2022 Kodla buluşması.',3,'Etkinlik kaydı'],
 ['HAZİRAN 2021’DEN İTİBAREN','İşbaşı Eğitmenliği','Türkiye Finans Katılım Bankası’na yeni katılan çalışma arkadaşlarına deneyim aktarımı.',8,'Gönüllülük kaydı']
];
document.querySelector('#volunteer-list').innerHTML=volunteers.map(([date,title,text,id,label])=>`<article class="volunteer-card"><span class="date">${date}</span><h3>${title}</h3><p>${text}</p>${sourceButton(id,title,label)}</article>`).join('');
const teaching=[['19 KASIM 2019','Minik Eller Kodluyor','Facebook İstasyon’da eğitmenlik eğitimi; çocuklara kodlama öğretme yolculuğu.',2],['21 EKİM · EĞİTİM KAMPI','Finansal Okuryazarlık Eğitimi','Gelişen Nesil Akademi’de finansal okuryazarlık paylaşımı.',21],['26 ARALIK 2021','Gelişen Nesil Akademi · Jüri üyeliği','Üç aylık eğitim ve proje döneminin finalinde gençlerin projelerini değerlendirme.',20]];
document.querySelector('#teaching-list').innerHTML=teaching.map(([date,title,text,id])=>`<article class="teaching-item"><span class="date">${date}</span><h3>${title}</h3><p>${text}</p>${sourceButton(id,title)}</article>`).join('');
const articles=[['20 AĞUSTOS 2021','Kredi Notu Hakkında Bilmeniz Gerekenler',30],['12 EKİM 2021','Finansal Stresle Başa Çıkmanın Yolları',29],['12 KASIM 2021','FOMO Nedir ve Nasıl Başa Çıkılır?',32]];
document.querySelector('#articles').innerHTML=articles.map(([date,title,id])=>`<article class="article"><span class="date">${date}</span><h3>${title}</h3>${sourceButton(id,title,'Yayın kaydını incele')}</article>`).join('');
const licenses=[
 ['01','Türev Araçlar Piyasalar ve Risk Yönetimi','Capital Markets Board of Türkiye – CMB Türkiye','ARALIK 2024',24,''],
 ['02','Sermaye Piyasası Faaliyetleri Düzey 3 Lisansı','Sermaye Piyasası Lisanslama Sicil ve Eğitim Kuruluşu A.Ş.','ARALIK 2023 · BELGE: 24 OCAK 2024',25,''],
 ['03','Bireysel Emeklilik Aracılığı Belgesi','Emeklilik Gözetim Merkezi (EGM)','EYLÜL 2021',26,''],
 ['04','Sermaye Piyasası Faaliyetleri Düzey 1 Lisansı','Capital Markets Board of Türkiye – CMB Türkiye','ARALIK 2018 — ARALIK 2021',26,'Arşiv kaydı: belirtilen geçerlilik süresi Aralık 2021’de sona ermiştir.'],
 ['05','SEGEM','Sigortacılık alanında mesleki yeterlilik belgesi','MAYIS 2017',26,'']
];
const licenseItem=([num,title,org,date,id,note])=>`<article class="license-item"><span class="license-number">${num}</span><div><h3>${title}</h3><p>${org}</p><span class="date">${date}</span>${note?`<p class="small-note">${note}</p>`:''}${sourceButton(id,title,'Belge kaydı')}</div></article>`;
document.querySelector('#license-list').innerHTML=licenses.map(licenseItem).join('');
document.querySelector('#certificate-list').innerHTML=[['01','İşbaşı Eğitimlerinde Eğitmenlik Sırları','Dale Carnegie Training','HAZİRAN 2021',26,''],['02','Minik Eller Kod Yazıyor Proje Eğitmenliği','Habitat Derneği','KASIM 2019',26,''],['03','Güç Duruşu','Manivela Akademi ve Kampüs Etkinlikleri','ARALIK 2013',26,'']].map(licenseItem).join('');
const menuButton=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
function closeMenu(){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const sections=[...document.querySelectorAll('main section[id]')];
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash===`#${entry.target.id}`))}},{rootMargin:'-15% 0px -55% 0px',threshold:0});sections.forEach(s=>observer.observe(s));
const dialog=document.querySelector('#archive-dialog'),dialogImage=document.querySelector('#dialog-image'),dialogTitle=document.querySelector('#dialog-title'),galleryControls=document.querySelector('.gallery-controls');
const galleries={gdg:[[13,'DevFest 2025 — sahnede topluluk'],[12,'DevFest 2025 — salondan bir kare'],[11,'GDG Summit MENAT 2025'],[14,'Google Dubai ziyareti'],[9,'DevFest — topluluk buluşması'],[10,'DevFest — birlikte gezi']]};
let activeGallery=[],galleryIndex=0,lastTrigger;
function renderImage(){const [id,title]=activeGallery[galleryIndex];dialogImage.src=`assets/archive-${String(id).padStart(2,'0')}.jpg`;dialogImage.alt=title;dialogTitle.textContent=title;galleryControls.hidden=activeGallery.length<2;document.querySelector('#gallery-count').textContent=`${galleryIndex+1} / ${activeGallery.length}`}
function openArchive(items,trigger){lastTrigger=trigger;activeGallery=items;galleryIndex=0;renderImage();dialog.showModal();document.body.classList.add('modal-open')}
document.addEventListener('click',e=>{const source=e.target.closest('[data-source]');const gallery=e.target.closest('[data-gallery]');if(source)openArchive([[Number(source.dataset.source),source.dataset.title]],source);if(gallery)openArchive(galleries[gallery.dataset.gallery],gallery)});
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastTrigger?.focus()});
function navigateGallery(delta){galleryIndex=(galleryIndex+delta+activeGallery.length)%activeGallery.length;renderImage()}
document.querySelector('#gallery-prev').addEventListener('click',()=>navigateGallery(-1));document.querySelector('#gallery-next').addEventListener('click',()=>navigateGallery(1));
dialog.addEventListener('keydown',e=>{if(activeGallery.length>1&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();navigateGallery(e.key==='ArrowRight'?1:-1)}});
